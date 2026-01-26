/**
 * DonationResult Page
 * 
 * Displays donation payment result after user returns from Mswipe payment gateway.
 * 
 * CRITICAL SECURITY RULES:
 * 1. URL params may contain status, ref, amount - but ALWAYS verify with backend
 * 2. Payment status is ALWAYS fetched from backend API - URL status is just a hint
 * 3. Frontend NEVER determines success/failure - backend is source of truth
 * 4. On retry, a NEW payment session is created via /api/mswipe/initiate
 * 
 * Flow:
 * 1. User returns from Mswipe to /payment-result?status=success&ref=<donationRef>&amount=100
 * 2. Page reads 'ref' param (or from localStorage) and calls GET /api/mswipe/status/:donationRef
 * 3. Backend returns actual payment status (SUCCESS/PENDING/FAILED)
 * 4. Page renders appropriate UI based on verified status
 */

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaClock, FaHeart, FaRedo, FaHome, FaReceipt, FaSync } from 'react-icons/fa';
import { getDonationStatus, verifyDonationStatus } from '../../services/donationService';

const DonationResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State for donation data and UI
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [verifying, setVerifying] = useState(false);

  // Get params from URL (set by Mswipe callback redirect)
  // Note: We read these but ALWAYS verify with backend
  const urlStatus = searchParams.get('status'); // 'success' or 'failed' - just a hint
  const urlRef = searchParams.get('ref');        // donation reference
  const urlAmount = searchParams.get('amount');  // amount paid

  // Get donation reference - prefer URL, fallback to localStorage
  const getDonationRef = useCallback(() => {
    if (urlRef) return urlRef;
    return localStorage.getItem('pendingDonationRef');
  }, [urlRef]);

  const donationRef = getDonationRef();

  /**
   * Fetch donation status from backend
   * This is the ONLY way to determine payment status - never trust URL params alone
   */
  const fetchDonationStatus = useCallback(async (showLoadingIndicator = true) => {
    const ref = getDonationRef();
    
    if (!ref) {
      setError('No donation reference found. Please try making a new donation.');
      setLoading(false);
      return;
    }

    if (showLoadingIndicator) {
      setCheckingStatus(true);
    }

    try {
      // CRITICAL: Backend is the SINGLE SOURCE OF TRUTH for payment status
      const data = await getDonationStatus(ref);
      setDonation(data);
      setError('');
      
      // Clear localStorage on success/failure (not pending)
      if (data.status === 'SUCCESS' || data.status === 'FAILED') {
        localStorage.removeItem('pendingDonationRef');
        localStorage.removeItem('pendingDonationAmount');
        localStorage.removeItem('pendingDonationName');
      }
    } catch (err) {
      console.error('Error fetching donation status:', err);
      if (err.response?.status === 404) {
        setError('Donation not found. The reference may be invalid or expired.');
      } else {
        setError('Unable to fetch donation status. Please try again.');
      }
    } finally {
      setLoading(false);
      setCheckingStatus(false);
    }
  }, [getDonationRef]);

  // Fetch status on mount
  useEffect(() => {
    fetchDonationStatus(false);
  }, [fetchDonationStatus]);

  /**
   * Force verify status with Mswipe API
   * Use this when status is PENDING and callback might have been missed
   */
  const handleForceVerify = async () => {
    const ref = getDonationRef();
    if (!ref) return;
    
    setVerifying(true);
    try {
      const data = await verifyDonationStatus(ref);
      setDonation(data);
      setError('');
      
      // Clear localStorage on success/failure
      if (data.status === 'SUCCESS' || data.status === 'FAILED') {
        localStorage.removeItem('pendingDonationRef');
        localStorage.removeItem('pendingDonationAmount');
        localStorage.removeItem('pendingDonationName');
      }
    } catch (err) {
      console.error('Error verifying donation status:', err);
      setError('Unable to verify payment status. Please try again or contact support.');
    } finally {
      setVerifying(false);
    }
  };

  /**
   * Handle retry for failed payments
   * IMPORTANT: This navigates to donate page for a fresh payment attempt
   * We do NOT reuse the old donationRef or attempt to resume old session
   */
  const handleRetry = () => {
    // Clear any stored donation data
    localStorage.removeItem('pendingDonationRef');
    localStorage.removeItem('pendingDonationAmount');
    localStorage.removeItem('pendingDonationName');
    // Navigate to donation page for a completely new payment attempt
    navigate('/donate');
  };

  /**
   * Manual status check for pending payments
   * No auto-polling - user explicitly requests status update
   */
  const handleCheckStatus = () => {
    fetchDonationStatus(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#BC3612] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Verifying payment status...
          </p>
        </div>
      </div>
    );
  }

  // Error state (no donation ref or fetch failed)
  if (error && !donation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
          <FaTimesCircle className="text-5xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <Link
              to="/donate"
              className="w-full inline-block px-6 py-3 bg-gradient-to-r from-[#BC3612] to-orange-500 hover:from-orange-500 hover:to-[#BC3612] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Make a New Donation
            </Link>
            <Link
              to="/"
              className="w-full inline-block px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Normalize status to uppercase for comparison
  const status = donation?.status?.toUpperCase();

  // SUCCESS state
  if (status === 'SUCCESS' || status === 'COMPLETED') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
            {/* Success Icon */}
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <FaCheckCircle className="text-5xl text-green-500" />
              </div>
              <FaHeart className="absolute -bottom-1 -right-1 text-2xl text-[#BC3612] animate-pulse" style={{ left: '55%' }} />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Thank You!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Your donation has been received successfully.
            </p>

            {/* Donation Details Card */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6 text-left">
              <div className="flex items-center mb-4">
                <FaReceipt className="text-[#BC3612] mr-2" />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Donation Receipt
                </h3>
              </div>
              
              <div className="space-y-3 text-sm">
                {donation.donationRef && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Reference:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{donation.donationRef}</span>
                  </div>
                )}
                {donation.amount && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{donation.amount}</span>
                  </div>
                )}
                {donation.transactionRef && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Transaction ID:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-xs">{donation.transactionRef}</span>
                  </div>
                )}
                {donation.ipgId && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Payment ID:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-xs">{donation.ipgId}</span>
                  </div>
                )}
                {donation.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Date:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(donation.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              📧 A confirmation email has been sent to your registered email address.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/donate"
                className="w-full inline-block px-6 py-3 bg-gradient-to-r from-[#BC3612] to-orange-500 hover:from-orange-500 hover:to-[#BC3612] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <FaHeart className="inline mr-2" />
                Make Another Donation
              </Link>
              <Link
                to="/"
                className="w-full inline-block px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-300 text-center"
              >
                <FaHome className="inline mr-2" />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FAILED state
  if (status === 'FAILED' || status === 'FAILURE') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
            {/* Failed Icon */}
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimesCircle className="text-5xl text-red-500" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Failed
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              We couldn't process your donation. Please try again.
            </p>

            {/* Error Details */}
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-red-700 dark:text-red-300">
                The payment could not be completed. This may be due to insufficient funds, network issues, or the transaction was cancelled.
              </p>
            </div>

            {/* Reference */}
            {donation?.donationRef && (
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Reference: <span className="font-semibold">{donation.donationRef}</span>
              </p>
            )}

            {/* Attempted Amount */}
            {donation?.amount && (
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Attempted amount: <span className="font-semibold">₹{donation.amount}</span>
              </p>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* IMPORTANT: Retry creates a NEW payment session, not resume old one */}
              <button
                onClick={handleRetry}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#BC3612] to-orange-500 hover:from-orange-500 hover:to-[#BC3612] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FaRedo className="inline mr-2" />
                Try Again
              </button>
              <Link
                to="/"
                className="w-full inline-block px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-300 text-center"
              >
                <FaHome className="inline mr-2" />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PENDING state (default for any other status)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl">
          {/* Pending Icon */}
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaClock className="text-5xl text-yellow-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Processing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Your payment is being processed. This may take a few moments.
          </p>

          {/* Info Box */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Please do not close this page or make another payment. If the status doesn't update within a few minutes, use the buttons below to check again.
            </p>
          </div>

          {/* Reference */}
          {donation?.donationRef && (
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Reference: <span className="font-semibold">{donation.donationRef}</span>
            </p>
          )}

          {/* Donation Amount */}
          {donation?.amount && (
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Amount: <span className="font-semibold">₹{donation.amount}</span>
            </p>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Manual status check */}
            <button
              onClick={handleCheckStatus}
              disabled={checkingStatus}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#BC3612] to-orange-500 hover:from-orange-500 hover:to-[#BC3612] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {checkingStatus ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Checking...
                </span>
              ) : (
                <>
                  <FaRedo className="inline mr-2" />
                  Check Status
                </>
              )}
            </button>
            
            {/* Force verify with Mswipe API */}
            <button
              onClick={handleForceVerify}
              disabled={verifying}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {verifying ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Verifying with Payment Gateway...
                </span>
              ) : (
                <>
                  <FaSync className="inline mr-2" />
                  Verify with Payment Gateway
                </>
              )}
            </button>
            
            <Link
              to="/"
              className="w-full inline-block px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-300 text-center"
            >
              <FaHome className="inline mr-2" />
              Return to Home
            </Link>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-6">
            If you completed the payment but the status remains pending, please contact support with your reference number.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationResult;
