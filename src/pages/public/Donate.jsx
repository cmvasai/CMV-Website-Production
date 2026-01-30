/**
 * Donate Page - Mswipe Payment Gateway Integration
 * 
 * PRODUCTION MODE (isProduction = true): Shows the Mswipe payment gateway form
 * NON-PRODUCTION MODE (isProduction = false): Shows "Contact Us for Donations" page
 * 
 * PAYMENT FLOW (Mswipe - Production only):
 * 1. User fills donation form (name, email, phone, amount, etc.)
 * 2. On submit, frontend calls POST /api/mswipe/initiate with donor details
 * 3. Backend creates payment session and returns { paymentUrl: "..." }
 * 4. Frontend redirects user to paymentUrl (Mswipe handles payment UI)
 * 5. After payment, Mswipe redirects to backend, which redirects to /donation/result?ref=<id>
 * 6. DonationResult page fetches status from backend and displays result
 * 
 * SECURITY RULES:
 * - Frontend NEVER calls Mswipe APIs directly
 * - Frontend NEVER collects or sends transaction IDs
 * - Frontend NEVER determines payment success/failure
 * - Backend is the SINGLE SOURCE OF TRUTH for payment status
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaUser, FaEnvelope, FaPhone, FaIdCard, FaMapMarkerAlt, FaRupeeSign, FaFileAlt, FaCheckSquare } from 'react-icons/fa';
import { initiateDonation } from '../../services/donationService';

// ============================================================
// PRODUCTION FLAG - Set to true to enable Mswipe donation form
// When false: Shows "Contact Us for Donations" page
// When true: Shows the Mswipe payment gateway form
// ============================================================
const isProduction = false;

const DonateMswipe = () => {
  // Form state - simplified for Mswipe flow (no transactionId)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    amount: '',
    reasonForDonation: '',
    purpose: '',
    // Address fields - always required for payment
    state: 'Maharashtra',
    city: '',
    pinCode: '',
    address: '',
    // 80G fields - PAN required if seek80G is 'yes'
    seek80G: 'no',
    panCardNumber: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Note: success state removed - payment result is shown on DonationResult page

  // Indian states for 80G address dropdown
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
    "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Madhya Pradesh",
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
    "Tamil Nadu", "Telangana", "Tripura", "Uttarakhand", "Uttar Pradesh", "West Bengal",
    "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
  ];

  // Donation purpose options (must match backend validation)
  const donationReasons = [
    "General Donation",
    "Gurudakshina",
    "Event Sponsorship",
    "Building Fund",
    "Educational Support",
    "Community Service",
    "Special Occasion",
    "Other"
  ];

  // Check if user wants 80G certificate (shows additional fields)
  const wants80G = formData.seek80G === 'yes';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  /**
   * Handle form submission - Initiate Mswipe payment
   * 
   * FLOW:
   * 1. Validate form fields
   * 2. Call backend /api/mswipe/initiate
   * 3. Redirect to paymentUrl from backend response
   * 
   * NOTE: We do NOT show success/failure here.
   * Payment result is shown after user returns from Mswipe.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic required fields (always required including address)
    const requiredFields = ['fullName', 'email', 'phoneNumber', 'amount', 'reasonForDonation', 'state', 'city', 'pinCode', 'address'];
    
    // Add PAN card if user opted in for 80G
    if (wants80G) {
      requiredFields.push('panCardNumber');
    }
    
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Validate email format
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(formData.phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      setIsLoading(false);
      return;
    }

    // Validate pin code (6 digits) - always required now
    if (!/^\d{6}$/.test(formData.pinCode)) {
      setError('Please enter a valid 6-digit pin code');
      setIsLoading(false);
      return;
    }

    // Validate PAN card format if provided or required for 80G
    if (formData.panCardNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(formData.panCardNumber)) {
      setError('Please enter a valid PAN card number (e.g., ABCDE1234F)');
      setIsLoading(false);
      return;
    }

    // Validate amount (must be positive number)
    const amount = Number(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid donation amount');
      setIsLoading(false);
      return;
    }

    try {
      /**
       * CRITICAL: Call backend to initiate Mswipe payment
       * Frontend NEVER calls Mswipe directly - backend handles all payment gateway communication
       */
      const response = await initiateDonation(formData);
      
      if (response.success && response.paymentUrl) {
        /**
         * Store donation info in localStorage for result page
         * This helps if URL params are lost during redirect
         */
        localStorage.setItem('pendingDonationRef', response.donationRef);
        localStorage.setItem('pendingDonationAmount', formData.amount);
        localStorage.setItem('pendingDonationName', formData.fullName);
        
        /**
         * Redirect to Mswipe payment page
         * After payment, user will be redirected to /payment-result?status=...&ref=<donationRef>&amount=...
         * DO NOT show success/failure here - that happens after redirect
         */
        window.location.href = response.paymentUrl;
      } else {
        throw new Error(response.error || 'No payment URL received from server');
      }
    } catch (err) {
      console.error('Donation initiation error:', err);
      
      // Display user-friendly error message
      if (err.response?.data?.errors?.length > 0) {
        setError(err.response.data.errors.join(', '));
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to initiate payment. Please try again.');
      }
      setIsLoading(false);
    }
    // Note: We don't setIsLoading(false) on success because page will redirect
  };

  // Note: Success state is now handled by DonationResult page after payment redirect

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <FaHeart className="text-5xl text-[#BC3612] dark:text-[#F47930] mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Support Our Mission
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your generous contribution helps us continue our spiritual and community service activities. Thank you for supporting Chinmaya Mission Vasai.
          </p>
        </div>

        {/* Single Column Form (QR code section removed) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Donation Details
          </h2>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {/* Payment Info Banner */}
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Secure Payment:</strong> After filling this form, you will be redirected to our secure payment gateway where you can pay via UPI, Credit/Debit Card, or Net Banking.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your full name"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="your@email.com"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount (₹) *
                </label>
                <div className="relative">
                  <FaRupeeSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    min="1"
                    placeholder="Enter donation amount"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Donation Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Donation *
              </label>
              <select
                name="reasonForDonation"
                value={formData.reasonForDonation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={isLoading}
              >
                <option value="">Select Reason</option>
                {donationReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            {/* Optional Purpose/Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Notes (Optional)
              </label>
              <div className="relative">
                <FaFileAlt className="absolute left-3 top-3 text-gray-400" />
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  rows="2"
                  placeholder="Any additional information about your donation"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Address Section - Always Required */}
            <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                <FaMapMarkerAlt className="mr-2 text-[#BC3612]" />
                Address Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    State *
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  >
                    <option value="">Select State</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter your city"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pin Code *
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleInputChange}
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your complete address"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* 80G Certificate Option */}
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="seek80G"
                    name="seek80G"
                    type="checkbox"
                    checked={wants80G}
                    onChange={(e) => handleInputChange({
                      target: {
                        name: 'seek80G',
                        value: e.target.checked ? 'yes' : 'no'
                      }
                    })}
                    className="w-4 h-4 text-[#BC3612] border-gray-300 rounded focus:ring-[#BC3612]"
                    disabled={isLoading}
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="seek80G" className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <FaCheckSquare className="mr-2 text-[#BC3612]" />
                    I want an 80G Tax Exemption Certificate
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    PAN card required for tax exemption
                  </p>
                </div>
              </div>
            </div>

            {/* 80G Fields - Only shown if user opts in */}
            {wants80G && (
              <div className="space-y-4 p-4 border border-orange-200 dark:border-orange-800 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                  <FaIdCard className="mr-2 text-[#BC3612]" />
                  80G Certificate Details
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PAN Card Number *
                  </label>
                  <div className="relative">
                    <FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="panCardNumber"
                      value={formData.panCardNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., ABCDE1234F"
                      maxLength={10}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white uppercase"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#BC3612] to-orange-500 hover:from-orange-500 hover:to-[#BC3612] text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Redirecting to Payment...
                </div>
              ) : (
                <>
                  <FaHeart className="inline mr-2" />
                  Proceed to Pay ₹{formData.amount || '0'}
                </>
              )}
            </button>

            {/* Security Note */}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              🔒 Your payment is secured by Mswipe payment gateway. We do not store any card or banking details.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

/**
 * Contact Us For Donations Component
 * Shown when isProduction is false
 * Displays a friendly message directing users to contact the organization
 */
const ContactForDonations = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-6 shadow-xl">
            <FaHeart className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Support Our Mission
          </h1>
        </div>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Decorative Header */}
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 py-6 px-8">
            <h2 className="text-2xl font-bold text-white text-center">
              Contact Us for Donations
            </h2>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 text-center">
            {/* Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full">
                <FaEnvelope className="text-orange-500 text-4xl" />
              </div>
            </div>

            {/* Message */}
            <div className="mb-8 space-y-4">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                We're currently setting up our online donation portal. In the meantime, please reach out to us directly for donation inquiries.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Our team will be happy to assist you and provide donation details.
              </p>
            </div>

            {/* Features */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-gray-800 dark:text-white mb-4">Your Donations Help Us:</h3>
              <ul className="text-left space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">✓</span>
                  <span>Organize spiritual programs and events</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">✓</span>
                  <span>Support community welfare activities</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-500 mt-1">✓</span>
                  <span>Maintain and develop our facilities</span>
                </li>
              </ul>
            </div>

            {/* 80G Info */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mb-8 border border-green-200 dark:border-green-800">
              <p className="text-green-700 dark:text-green-300 text-sm">
                <strong>Tax Benefits:</strong> All donations are eligible for 80G tax exemption under the Income Tax Act.
              </p>
            </div>

            {/* CTA Button */}
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 text-lg"
            >
              <FaEnvelope className="text-xl" />
              Contact Us
            </Link>

            {/* Additional Info */}
            <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
              We typically respond within 24 hours
            </p>
          </div>
        </div>


      </div>
    </div>
  );
};

/**
 * Donate Component - Routes to appropriate donation page based on production flag
 * 
 * isProduction = true:  Shows Mswipe Payment Gateway page
 * isProduction = false: Shows Contact Us for Donations page
 */
const Donate = () => {
  // In production mode, show the Mswipe payment form
  if (isProduction) {
    return <DonateMswipe />;
  }
  
  // When not in production, show contact us for donations page
  return <ContactForDonations />;
};

export default Donate;
