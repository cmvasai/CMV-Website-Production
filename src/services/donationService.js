/**
 * Donation Service
 * 
 * Handles all donation-related API calls to the backend.
 * 
 * IMPORTANT: This frontend service ONLY communicates with the backend.
 * - Frontend NEVER calls Mswipe APIs directly
 * - Frontend NEVER determines payment success/failure
 * - Backend is the SINGLE SOURCE OF TRUTH for payment status
 * 
 * Payment Flow:
 * 1. Frontend collects donor details via form
 * 2. Frontend calls initiateDonation() → Backend creates payment session
 * 3. Backend returns { paymentUrl, donationRef } → Frontend redirects user to Mswipe
 * 4. After payment, user is redirected back to /payment-result?status=...&ref=<donationRef>&amount=...
 * 5. Frontend calls getDonationStatus() → Backend returns actual payment status
 * 6. Frontend displays result based ONLY on backend response
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Initiate a new donation payment via Mswipe
 * 
 * @param {Object} donorData - Donor information
 * @param {string} donorData.fullName - Donor's full name (required)
 * @param {string} donorData.email - Donor's email address (required)
 * @param {string} donorData.phoneNumber - Donor's 10-digit mobile number (required)
 * @param {number|string} donorData.amount - Donation amount in INR (required)
 * @param {string} donorData.state - State (required)
 * @param {string} donorData.city - City (required)
 * @param {string} donorData.pinCode - 6-digit PIN code (required)
 * @param {string} donorData.address - Full address (required)
 * @param {string} donorData.seek80G - Whether donor wants 80G certificate ('yes'/'no') (required)
 * @param {string} donorData.reasonForDonation - Selected donation reason (required)
 * @param {string} [donorData.purpose] - Optional additional notes
 * @param {string} [donorData.panCardNumber] - PAN card (optional, recommended for 80G)
 * 
 * @returns {Promise<{success: boolean, paymentUrl: string, donationRef: string, orderId: string}>}
 * @throws {Error} - Network or API errors
 */
export const initiateDonation = async (donorData) => {
  const response = await axios.post(`${API_BASE_URL}/api/mswipe/initiate`, {
    fullName: donorData.fullName,
    email: donorData.email,
    phoneNumber: donorData.phoneNumber,
    amount: Number(donorData.amount),
    state: donorData.state,
    city: donorData.city,
    pinCode: donorData.pinCode,
    address: donorData.address,
    seek80G: donorData.seek80G || 'no',
    reasonForDonation: donorData.reasonForDonation,
    purpose: donorData.purpose || '',
    // PAN card - optional but recommended for 80G
    ...(donorData.panCardNumber && {
      panCardNumber: donorData.panCardNumber.toUpperCase()
    })
  });
  
  return response.data;
};

/**
 * Get donation status from backend
 * 
 * CRITICAL: This is the ONLY way to determine payment status.
 * - NEVER trust URL parameters for payment status
 * - ALWAYS verify with backend even if URL says "success"
 * - ALWAYS fetch fresh status from backend
 * 
 * @param {string} donationRef - Donation reference ID (e.g., CMV17688247321751938)
 * 
 * @returns {Promise<Object>} - Donation details including status
 * @returns {string} return.donationRef - Donation reference
 * @returns {string} return.status - 'SUCCESS' | 'FAILED' | 'PENDING'
 * @returns {number} return.amount - Donation amount
 * @returns {string} [return.transactionRef] - Bank RRN (if successful)
 * @returns {string} [return.ipgId] - Mswipe transaction ID
 * @returns {string} return.createdAt - Donation timestamp
 * @returns {string} return.updatedAt - Last update timestamp
 * 
 * @throws {Error} - Network or API errors (e.g., donation not found)
 */
export const getDonationStatus = async (donationRef) => {
  const response = await axios.get(`${API_BASE_URL}/api/mswipe/status/${donationRef}`);
  return response.data;
};

/**
 * Force verify donation status with Mswipe API
 * 
 * Use this when status is PENDING and you want to force a check with Mswipe.
 * This will update the database with the latest status from Mswipe.
 * 
 * @param {string} donationRef - Donation reference ID
 * 
 * @returns {Promise<Object>} - Updated donation details including Mswipe response
 * @throws {Error} - Network or API errors
 */
export const verifyDonationStatus = async (donationRef) => {
  const response = await axios.post(`${API_BASE_URL}/api/mswipe/verify/${donationRef}`);
  return response.data;
};

export default {
  initiateDonation,
  getDonationStatus,
  verifyDonationStatus
};
