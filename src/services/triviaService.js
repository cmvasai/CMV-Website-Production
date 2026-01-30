import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Get quiz questions (without correct answers)
 */
export const getQuestions = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/trivia/questions`);
  return response.data;
};

/**
 * Initiate quiz - register user and send OTP
 * @param {string} name - User's name
 * @param {string} phoneNumber - 10-digit Indian mobile number
 */
export const initiateQuiz = async (name, phoneNumber) => {
  const response = await axios.post(`${API_BASE_URL}/api/trivia/initiate`, {
    name,
    phoneNumber
  });
  return response.data;
};

/**
 * Verify OTP
 * @param {string} phoneNumber - 10-digit phone number
 * @param {string} otp - 6-digit OTP
 */
export const verifyOTP = async (phoneNumber, otp) => {
  const response = await axios.post(`${API_BASE_URL}/api/trivia/verify-otp`, {
    phoneNumber,
    otp
  });
  return response.data;
};

/**
 * Resend OTP (after 60-second cooldown)
 * @param {string} phoneNumber - 10-digit phone number
 */
export const resendOTP = async (phoneNumber) => {
  const response = await axios.post(`${API_BASE_URL}/api/trivia/resend-otp`, {
    phoneNumber
  });
  return response.data;
};

/**
 * Submit quiz answers
 * @param {string} phoneNumber - 10-digit phone number
 * @param {Array} answers - Array of { questionId, selectedAnswer }
 */
export const submitQuiz = async (phoneNumber, answers) => {
  const response = await axios.post(`${API_BASE_URL}/api/trivia/submit`, {
    phoneNumber,
    answers
  });
  return response.data;
};

/**
 * Check user's quiz status (optional)
 * @param {string} phoneNumber - 10-digit phone number
 */
export const checkStatus = async (phoneNumber) => {
  const response = await axios.get(`${API_BASE_URL}/api/trivia/status/${phoneNumber}`);
  return response.data;
};

export default {
  getQuestions,
  initiateQuiz,
  verifyOTP,
  resendOTP,
  submitQuiz,
  checkStatus
};
