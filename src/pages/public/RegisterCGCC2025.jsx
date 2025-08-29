import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { FaUser, FaSchool, FaCalendarAlt, FaPhone, FaEnvelope, FaSpinner } from 'react-icons/fa';
import ContactButtons from '../../components/ContactButtons';

const RegisterCGCC2025 = () => {
  const [formData, setFormData] = useState({
    registrationVia: '',
    otherSpecify: '',
    firstName: '',
    middleName: '',
    lastName: '',
    schoolName: '',
    standard: '',
    parentName: '',
    mobileNo: '',
    emailAddress: '',
    dateOfBirth: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const registrationOptions = [
    'Balavihar Centre',
    'School',
    'Other'
  ];

  const standards = [
    '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear otherSpecify if registrationVia is not 'Other'
    if (name === 'registrationVia' && value !== 'Other') {
      setFormData(prev => ({
        ...prev,
        otherSpecify: ''
      }));
    }
  };

  const validateForm = () => {
    const required = ['registrationVia', 'firstName', 'lastName', 'schoolName', 'standard', 'parentName', 'mobileNo', 'emailAddress', 'dateOfBirth'];
    
    for (let field of required) {
      if (!formData[field]) {
        setError(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Validate otherSpecify if registrationVia is 'Other'
    if (formData.registrationVia === 'Other' && !formData.otherSpecify) {
      setError('Please specify the registration source');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.emailAddress)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate mobile number (Indian format)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(formData.mobileNo)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }

    // Validate date of birth (should not be in future)
    const today = new Date();
    const dob = new Date(formData.dateOfBirth);
    if (dob >= today) {
      setError('Date of birth cannot be in the future');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/cgcc2025/register`, formData);
      
      if (response.data.success) {
        setSuccess(true);
        setFormData({
          registrationVia: '',
          otherSpecify: '',
          firstName: '',
          middleName: '',
          lastName: '',
          schoolName: '',
          standard: '',
          parentName: '',
          mobileNo: '',
          emailAddress: '',
          dateOfBirth: ''
        });
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to submit registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Helmet>
          <title>Registration Successful - CGCC 2025 | Chinmaya Mission Vasai</title>
          <meta name="description" content="Successfully registered for CGCC 2025 competition" />
        </Helmet>
        
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Registration Successful!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Thank you for registering for CGCC 2025. We will contact you with further details.
          </p>
          <button
            onClick={() => {
              setSuccess(false);
              setError('');
            }}
            className="w-full bg-[#BC3612] hover:bg-[#A52D0F] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Register Another Participant
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <Helmet>
        <title>CGCC 2025 Registration | Chinmaya Mission Vasai</title>
        <meta name="description" content="Register for Chinmaya Gita Chanting Competition 2025" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {/* Mobile and Tablet Layout */}
          <div className="block md:hidden">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Chinmaya
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Gita Chanting Competition 2025
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4">
              (Only for regions between Naigaon to Saphale)
            </p>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              CGCC 2025 Registration
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Chinmaya Gita Chanting Competition 2025
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              (Only for regions between Naigaon to Saphale)
            </p>
          </div>
          
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Fill in all the required details to complete your registration
          </p>

          {/* Important Notice for Gita Competitions */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/20 border-l-4 border-orange-500 dark:border-orange-400 rounded-lg p-4 mb-6 shadow-md">
            <div className="flex flex-col space-y-3">
              <p className="text-orange-800 dark:text-orange-200 font-medium text-sm sm:text-base text-center">
                <span className="font-semibold">Important:</span> For Gita Painting & Gita Elocution competition contact:
              </p>
              <div className="flex justify-center w-full">
                {/* Mobile optimized buttons */}
                <div className="flex flex-row gap-1 sm:gap-3 justify-center items-center sm:hidden">
                  {/* Mobile Call Button */}
                  <a
                    href="tel:+917303717177"
                    className="inline-flex items-center gap-1 px-2 py-1.5 text-xs bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-md font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                    Call
                  </a>
                  
                  {/* Mobile WhatsApp Button */}
                  <a
                    href="https://wa.me/917303717177"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1.5 text-xs bg-[#25D366] hover:bg-[#20b358] text-white rounded-md font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488" />
                    </svg>
                    WhatsApp
                  </a>
                  
                  {/* Mobile Email Button */}
                  <a
                    href="mailto:info@chinmayamissionvasai.com"
                    className="inline-flex items-center gap-1 px-2 py-1.5 text-xs bg-[#4285f4] hover:bg-[#3367d6] text-white rounded-md font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    Email
                  </a>
                </div>
                
                {/* Desktop buttons */}
                <div className="hidden sm:flex">
                  <ContactButtons
                    labelText=""
                    showLabel={false}
                    size="small"
                    layout="horizontal"
                    variant="filled"
                    className="gap-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Registration Via */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Registration via <span className="text-red-500">*</span>
                </label>
                <select
                  name="registrationVia"
                  value={formData.registrationVia}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select registration source</option>
                  {registrationOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Other Specify */}
              {formData.registrationVia === 'Other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Specify <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="otherSpecify"
                    value={formData.otherSpecify}
                    onChange={handleInputChange}
                    placeholder="Please specify"
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2" />
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  placeholder="Enter middle name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* School and Standard */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaSchool className="inline mr-2" />
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  placeholder="Enter school name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Standard <span className="text-red-500">*</span>
                </label>
                <select
                  name="standard"
                  value={formData.standard}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">Select standard</option>
                  {standards.map(std => (
                    <option key={std} value={std}>{std}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Parent Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaUser className="inline mr-2" />
                  Parent Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={formData.parentName}
                  onChange={handleInputChange}
                  placeholder="Enter parent's name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaPhone className="inline mr-2" />
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit mobile number"
                  pattern="[6-9][0-9]{9}"
                  maxLength="10"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Email and DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FaCalendarAlt className="inline mr-2" />
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#BC3612] hover:bg-[#A52D0F] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting Registration...
                  </>
                ) : (
                  'Submit Registration'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All fields marked with <span className="text-red-500">*</span> are mandatory
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterCGCC2025;
