import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaUser, FaPhone, FaSpinner, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaArrowRight, FaRedo, FaGlobe } from 'react-icons/fa';
import { showToast } from '../../components/Toast';
import { getQuestions, initiateQuiz, verifyOTP, resendOTP, submitQuiz } from '../../services/triviaService';

// Screen states
const SCREENS = {
  REGISTER: 'register',
  OTP: 'otp',
  QUIZ: 'quiz',
  RESULTS: 'results'
};

// Translations
const translations = {
  en: {
    // Registration Screen
    title: 'Chinmaya Amrit Mahotsav Trivia',
    subtitle: 'Test your knowledge about Chinmaya Mission!',
    yourName: 'Your Name',
    enterName: 'Enter your name',
    phoneNumber: 'Phone Number',
    phonePlaceholder: '9876543210',
    otpNote: 'You will receive an OTP on this number',
    getOtp: 'Get OTP & Start Quiz',
    sendingOtp: 'Sending OTP...',
    
    // OTP Screen
    verifyPhone: 'Verify Phone Number',
    enterOtpSent: 'Enter the OTP sent to',
    enterOtp: 'Enter OTP',
    otpPlaceholder: 'Enter 6-digit OTP',
    verifyOtp: 'Verify OTP',
    verifying: 'Verifying...',
    resendOtpIn: 'Resend OTP in',
    resendOtp: 'Resend OTP',
    changePhone: 'Change Phone Number',
    
    // Quiz Screen
    question: 'Question',
    of: 'of',
    answered: 'answered',
    previous: 'Previous',
    next: 'Next',
    submitQuiz: 'Submit Quiz',
    submitting: 'Submitting...',
    loadingQuestions: 'Loading questions...',
    
    // Results Screen
    excellent: 'Excellent!',
    goodJob: 'Good Job!',
    niceTry: 'Nice Try!',
    youScored: 'you scored',
    reviewAnswers: 'Review Your Answers',
    yourAnswer: 'Your Answer',
    correctAnswer: 'Correct Answer',
    thankYou: 'Thank you for participating in the',
    quizName: 'Chinmaya Amrit Mahotsav Trivia Quiz!',
    startNew: 'Start New Quiz (Different User)',
    
    // Validation
    validName: 'Please enter a valid name (at least 2 characters)',
    validPhone: 'Please enter a valid 10-digit Indian mobile number',
    validOtp: 'Please enter a valid OTP',
    
    // Toasts
    otpSent: 'OTP sent to your phone!',
    alreadyVerified: 'Phone already verified. Starting quiz!',
    phoneVerified: 'Phone verified successfully!',
    otpResent: 'OTP resent successfully!',
    quizSubmitted: 'Quiz submitted successfully!',
    networkError: 'Network error. Please try again.',
    loadFailed: 'Failed to load questions. Please try again.',
  },
  hi: {
    // Registration Screen
    title: 'चिन्मय अमृत महोत्सव प्रश्नोत्तरी',
    subtitle: 'चिन्मय मिशन के बारे में अपना ज्ञान परखें!',
    yourName: 'आपका नाम',
    enterName: 'अपना नाम दर्ज करें',
    phoneNumber: 'फोन नंबर',
    phonePlaceholder: '9876543210',
    otpNote: 'आपको इस नंबर पर OTP प्राप्त होगा',
    getOtp: 'OTP प्राप्त करें और प्रश्नोत्तरी शुरू करें',
    sendingOtp: 'OTP भेज रहे हैं...',
    
    // OTP Screen
    verifyPhone: 'फोन नंबर सत्यापित करें',
    enterOtpSent: 'भेजे गए OTP को दर्ज करें',
    enterOtp: 'OTP दर्ज करें',
    otpPlaceholder: '6 अंकों का OTP दर्ज करें',
    verifyOtp: 'OTP सत्यापित करें',
    verifying: 'सत्यापित कर रहे हैं...',
    resendOtpIn: 'OTP पुनः भेजें',
    resendOtp: 'OTP पुनः भेजें',
    changePhone: 'फोन नंबर बदलें',
    
    // Quiz Screen
    question: 'प्रश्न',
    of: 'का',
    answered: 'उत्तर दिए',
    previous: 'पिछला',
    next: 'अगला',
    submitQuiz: 'प्रश्नोत्तरी जमा करें',
    submitting: 'जमा कर रहे हैं...',
    loadingQuestions: 'प्रश्न लोड हो रहे हैं...',
    
    // Results Screen
    excellent: 'उत्कृष्ट!',
    goodJob: 'बहुत बढ़िया!',
    niceTry: 'अच्छा प्रयास!',
    youScored: 'आपने स्कोर किया',
    reviewAnswers: 'अपने उत्तरों की समीक्षा करें',
    yourAnswer: 'आपका उत्तर',
    correctAnswer: 'सही उत्तर',
    thankYou: 'भाग लेने के लिए धन्यवाद',
    quizName: 'चिन्मय अमृत महोत्सव प्रश्नोत्तरी!',
    startNew: 'नई प्रश्नोत्तरी शुरू करें (अलग उपयोगकर्ता)',
    
    // Validation
    validName: 'कृपया एक वैध नाम दर्ज करें (कम से कम 2 अक्षर)',
    validPhone: 'कृपया एक वैध 10 अंकों का भारतीय मोबाइल नंबर दर्ज करें',
    validOtp: 'कृपया एक वैध OTP दर्ज करें',
    
    // Toasts
    otpSent: 'आपके फोन पर OTP भेजा गया!',
    alreadyVerified: 'फोन पहले से सत्यापित है। प्रश्नोत्तरी शुरू हो रही है!',
    phoneVerified: 'फोन सफलतापूर्वक सत्यापित!',
    otpResent: 'OTP सफलतापूर्वक पुनः भेजा गया!',
    quizSubmitted: 'प्रश्नोत्तरी सफलतापूर्वक जमा हो गई!',
    networkError: 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।',
    loadFailed: 'प्रश्न लोड करने में विफल। कृपया पुनः प्रयास करें।',
  }
};

const TriviaQuiz = () => {
  // Language state
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  // Screen state
  const [currentScreen, setCurrentScreen] = useState(SCREENS.REGISTER);

  // User data
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [attemptId, setAttemptId] = useState('');

  // OTP state
  const [otp, setOtp] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Results state
  const [results, setResults] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => setCooldownSeconds(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  // Fetch questions when entering quiz screen
  useEffect(() => {
    if (currentScreen === SCREENS.QUIZ && questions.length === 0) {
      fetchQuestions();
    }
  }, [currentScreen, questions.length]);

  const fetchQuestions = async () => {
    try {
      const data = await getQuestions();
      if (data.success) {
        setQuestions(data.data.questions);
      }
    } catch (err) {
      setError(t.loadFailed);
      showToast(t.loadFailed, 'error');
    }
  };

  // Phone number validation
  const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  // STEP 1: Register and send OTP
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim() || name.trim().length < 2) {
      setError(t.validName);
      return;
    }
    if (!validatePhone(phoneNumber)) {
      setError(t.validPhone);
      return;
    }

    setLoading(true);

    try {
      const data = await initiateQuiz(name.trim(), phoneNumber);

      if (data.success) {
        if (data.data?.attemptId) {
          setAttemptId(data.data.attemptId);
        }

        // FIXED: Explicitly check if already verified (isVerified must be strictly true)
        // Only skip OTP if backend explicitly says isVerified === true AND canAttemptQuiz === true
        if (data.data?.isVerified === true && data.data?.canAttemptQuiz === true) {
          showToast(t.alreadyVerified, 'success');
          setCurrentScreen(SCREENS.QUIZ);
        } else {
          // Default: Go to OTP screen (OTP was sent or needs to be verified)
          setCooldownSeconds(data.data?.cooldownSeconds || 60);
          showToast(t.otpSent, 'success');
          setCurrentScreen(SCREENS.OTP);
        }
      } else {
        setError(data.message);
        // If already completed, show their score
        if (data.data?.score !== undefined) {
          setResults(data.data);
          setCurrentScreen(SCREENS.RESULTS);
        }
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.errors?.length > 0) {
        setError(errorData.errors.join(', '));
      } else if (errorData?.message) {
        setError(errorData.message);
        // Handle already completed case
        if (errorData.data?.score !== undefined) {
          setResults(errorData.data);
          setCurrentScreen(SCREENS.RESULTS);
        }
      } else {
        setError(t.networkError);
      }
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length < 4) {
      setError(t.validOtp);
      return;
    }

    setLoading(true);

    try {
      const data = await verifyOTP(phoneNumber, otp);

      if (data.success) {
        showToast(t.phoneVerified, 'success');
        setCurrentScreen(SCREENS.QUIZ);
      } else {
        setError(data.message);
      }
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData?.message || t.networkError);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (cooldownSeconds > 0) return;

    setError('');
    setLoading(true);

    try {
      const data = await resendOTP(phoneNumber);

      if (data.success) {
        setCooldownSeconds(60);
        showToast(t.otpResent, 'success');
      } else {
        if (data.remainingSeconds) {
          setCooldownSeconds(data.remainingSeconds);
        }
        setError(data.message);
      }
    } catch (err) {
      const errorData = err.response?.data;
      if (errorData?.remainingSeconds) {
        setCooldownSeconds(errorData.remainingSeconds);
      }
      setError(errorData?.message || t.networkError);
    } finally {
      setLoading(false);
    }
  };

  // Select answer
  const handleSelectAnswer = useCallback((questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  }, []);

  // STEP 3: Submit Quiz
  const handleSubmitQuiz = async () => {
    setError('');
    setLoading(true);

    // Format answers for API
    const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId,
      selectedAnswer
    }));

    try {
      const data = await submitQuiz(phoneNumber, formattedAnswers);

      if (data.success) {
        setResults(data.data);
        showToast(t.quizSubmitted, 'success');
        setCurrentScreen(SCREENS.RESULTS);
      } else {
        setError(data.message);
      }
    } catch (err) {
      const errorData = err.response?.data;
      setError(errorData?.message || t.networkError);
      
      // Handle already submitted case
      if (errorData?.data?.score !== undefined) {
        setResults(errorData.data);
        setCurrentScreen(SCREENS.RESULTS);
      }
    } finally {
      setLoading(false);
    }
  };

  // Reset quiz to start over
  const handleStartOver = () => {
    setCurrentScreen(SCREENS.REGISTER);
    setName('');
    setPhoneNumber('');
    setOtp('');
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResults(null);
    setError('');
    setQuestions([]);
  };

  // Language Toggle Button
  const LanguageToggle = () => (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
      title={language === 'en' ? 'हिंदी में देखें' : 'View in English'}
    >
      <FaGlobe className="text-[#BC3612]" />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {language === 'en' ? 'हिंदी' : 'English'}
      </span>
    </button>
  );

  // Registration Screen
  const renderRegisterScreen = () => (
    <form onSubmit={handleRegister} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t.subtitle}
        </p>
      </div>

      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.yourName}
          </label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.enterName}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#BC3612] focus:border-transparent transition-all"
              required
              minLength={2}
            />
          </div>
        </div>

        {/* Phone Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t.phoneNumber}
          </label>
          <div className="relative">
            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">+91</span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder={t.phonePlaceholder}
              className="w-full pl-20 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#BC3612] focus:border-transparent transition-all"
              required
              pattern="[6-9][0-9]{9}"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t.otpNote}
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-[#BC3612] to-orange-500 hover:from-orange-500 hover:to-[#BC3612] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            {t.sendingOtp}
          </>
        ) : (
          t.getOtp
        )}
      </button>
    </form>
  );

  // OTP Verification Screen
  const renderOTPScreen = () => (
    <form onSubmit={handleVerifyOTP} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t.verifyPhone}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t.enterOtpSent} +91 {phoneNumber.slice(0, 4)}****{phoneNumber.slice(8)}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t.enterOtp}
        </label>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder={t.otpPlaceholder}
          className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-mono border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#BC3612] focus:border-transparent transition-all"
          required
          maxLength={6}
          autoFocus
        />
      </div>

      <button
        type="submit"
        disabled={loading || otp.length < 4}
        className="w-full bg-gradient-to-r from-[#BC3612] to-orange-500 hover:from-orange-500 hover:to-[#BC3612] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <FaSpinner className="animate-spin" />
            {t.verifying}
          </>
        ) : (
          t.verifyOtp
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={cooldownSeconds > 0 || loading}
          className="text-[#BC3612] hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-medium disabled:text-gray-400 dark:disabled:text-gray-600 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <FaRedo className={cooldownSeconds > 0 ? '' : 'hover:rotate-180 transition-transform duration-300'} />
          {cooldownSeconds > 0 ? `${t.resendOtpIn} ${cooldownSeconds}s` : t.resendOtp}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setCurrentScreen(SCREENS.REGISTER)}
        className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium py-2 transition-colors flex items-center justify-center gap-2"
      >
        <FaArrowLeft />
        {t.changePhone}
      </button>
    </form>
  );

  // Quiz Screen
  const renderQuizScreen = () => {
    if (questions.length === 0) {
      return (
        <div className="text-center py-12">
          <FaSpinner className="animate-spin text-4xl text-[#BC3612] mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{t.loadingQuestions}</p>
        </div>
      );
    }

    const question = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const allAnswered = Object.keys(answers).length === questions.length;

    return (
      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>{t.question} {currentQuestionIndex + 1} {t.of} {questions.length}</span>
            <span>{Object.keys(answers).length} {t.answered}</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-[#BC3612] to-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
          {/* Question text - show both languages if available */}
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {question.question}
          </h3>
          {question.questionHi && language === 'hi' && (
            <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
              {question.questionHi}
            </p>
          )}
          {question.questionHi && language === 'en' && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">
              {question.questionHi}
            </p>
          )}

          {/* Options */}
          <div className="space-y-3 mt-4">
            {question.options.map((option, idx) => {
              const isSelected = answers[question.id] === option;
              // Get Hindi option if available
              const optionHi = question.optionsHi?.[idx];
              
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(question.id, option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-[#BC3612] bg-orange-50 dark:bg-orange-900/20 text-[#BC3612] dark:text-orange-400'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5 ${
                      isSelected
                        ? 'border-[#BC3612] bg-[#BC3612] text-white'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <div className="flex-1">
                      <span className="block">{option}</span>
                      {optionHi && (
                        <span className={`block text-sm mt-1 ${isSelected ? 'text-orange-600 dark:text-orange-300' : 'text-gray-500 dark:text-gray-400'}`}>
                          {optionHi}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            disabled={currentQuestionIndex === 0}
            className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            <FaArrowLeft />
            {t.previous}
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={loading || !allAnswered}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {t.submitting}
                </>
              ) : (
                <>
                  {t.submitQuiz}
                  <FaCheckCircle />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              disabled={!answers[question.id]}
              className="flex-1 bg-gradient-to-r from-[#BC3612] to-orange-500 hover:from-orange-500 hover:to-[#BC3612] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {t.next}
              <FaArrowRight />
            </button>
          )}
        </div>

        {/* Question Navigation Dots */}
        <div className="flex justify-center gap-2 pt-4">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentQuestionIndex
                  ? 'bg-[#BC3612] scale-125'
                  : answers[q.id]
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
              }`}
              title={`${t.question} ${idx + 1}${answers[q.id] ? ` (${t.answered})` : ''}`}
            />
          ))}
        </div>
      </div>
    );
  };

  // Results Screen
  const renderResultsScreen = () => {
    if (!results) return null;

    const scorePercentage = (results.score / results.totalQuestions) * 100;
    const isGreatScore = scorePercentage >= 80;
    const isGoodScore = scorePercentage >= 50;

    return (
      <div className="space-y-6">
        {/* Score Card */}
        <div className={`text-center p-8 rounded-2xl ${
          isGreatScore
            ? 'bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20'
            : isGoodScore
              ? 'bg-gradient-to-br from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20'
              : 'bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20'
        }`}>
          <div className="text-6xl mb-4">
            {isGreatScore ? '🎉' : isGoodScore ? '👏' : '💪'}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isGreatScore ? t.excellent : isGoodScore ? t.goodJob : t.niceTry}
          </h2>
          <div className="text-4xl sm:text-5xl font-bold text-[#BC3612] dark:text-orange-400 mb-2">
            {results.score}/{results.totalQuestions}
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {results.name && `${results.name}, `}{t.youScored} {Math.round(scorePercentage)}%
          </p>
        </div>

        {/* Answers Review */}
        {results.answers && results.answers.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t.reviewAnswers}
            </h3>

            {results.answers.map((answer, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border-2 ${
                  answer.isCorrect === true
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                    : answer.isCorrect === false
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                      : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-1 flex-shrink-0 ${
                    answer.isCorrect === true
                      ? 'text-green-500'
                      : answer.isCorrect === false
                        ? 'text-red-500'
                        : 'text-gray-400'
                  }`}>
                    {answer.isCorrect === true ? (
                      <FaCheckCircle className="text-xl" />
                    ) : answer.isCorrect === false ? (
                      <FaTimesCircle className="text-xl" />
                    ) : (
                      <span className="text-xl">📝</span>
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white mb-2">
                      {answer.question}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{t.yourAnswer}:</span> {answer.yourAnswer}
                    </p>
                    {answer.correctAnswer !== 'N/A' && (
                      <p className={`text-sm ${
                        answer.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        <span className="font-medium">{t.correctAnswer}:</span> {answer.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Thank You Message */}
        <div className="text-center p-6 bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {t.thankYou}
          </p>
          <p className="font-semibold text-[#BC3612] dark:text-orange-400">
            {t.quizName}
          </p>
        </div>

        {/* Try Again (for different user) */}
        <button
          onClick={handleStartOver}
          className="w-full py-3 px-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
        >
          <FaRedo />
          {t.startNew}
        </button>
      </div>
    );
  };

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.REGISTER:
        return renderRegisterScreen();
      case SCREENS.OTP:
        return renderOTPScreen();
      case SCREENS.QUIZ:
        return renderQuizScreen();
      case SCREENS.RESULTS:
        return renderResultsScreen();
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>{language === 'en' ? 'Trivia Quiz' : 'प्रश्नोत्तरी'} | Chinmaya Mission Vasai</title>
        <meta name="description" content="Test your knowledge about Chinmaya Mission with our Amrit Mahotsav Trivia Quiz!" />
      </Helmet>

      {/* Language Toggle */}
      <LanguageToggle />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <img
              src="/images/cmv-logo.png"
              alt="Chinmaya Mission"
              className="h-16 mx-auto mb-4"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Current Screen */}
            {renderScreen()}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Chinmaya Mission Vasai © 2026
          </p>
        </div>
      </div>
    </>
  );
};

export default TriviaQuiz;
