import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FiLock,
  FiUser,
  FiShield,
  FiArrowRight,
  FiMail,
  FiPhone,
  FiX,
  FiRefreshCw,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "/api") || 'http://localhost:5000';

const Login = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';
  const navigate = useNavigate();
  const [loginRole, setLoginRole] = useState('mistri');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showMainPassword, setShowMainPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // ── Helper RegEx for Validation ──
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const bdPhoneRegex = /^(?:\+88)?01[3-9]\d{8}$/;

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Login Submit with Validation ──
  const handleLoginSubmit = async e => {
    e.preventDefault();
    const identifierTrimmed = formData.identifier.trim();

    if (!identifierTrimmed || !formData.password) {
      toast.error(
        currentLang === 'bn'
          ? 'সবগুলো ফিল্ড পূরণ করুন!'
          : 'All fields are required!',
      );
      return;
    }

    if (formData.password.length < 6) {
      toast.error(
        currentLang === 'bn'
          ? 'পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টারের হতে হবে!'
          : 'Password must be at least 6 characters long!',
      );
      return;
    }

    // ── MISTRI ROLE VALIDATION ──
    if (loginRole === 'mistri') {
      const isEmail = identifierTrimmed.includes('@');
      const isMistriId = /^AM-\d+$/i.test(identifierTrimmed);
      if (isEmail && !emailRegex.test(identifierTrimmed)) {
        toast.error(
          currentLang === 'bn'
            ? 'ইমেইল ফরম্যাটটি সঠিক নয়!'
            : 'Invalid email format!',
        );
        return;
      }
      if (!isEmail && !isMistriId && !bdPhoneRegex.test(identifierTrimmed)) {
        toast.error(
          currentLang === 'bn'
            ? 'সঠিক মোবাইল নম্বর বা মিস্ত্রি আইডি (যেমন: AM-001) দিন!'
            : 'Enter a valid mobile number or Mistry ID (e.g. AM-001)!',
        );
        return;
      }
    }

    // ── ADMIN ROLE VALIDATION ──
    if (loginRole === 'admin') {
      if (!emailRegex.test(identifierTrimmed)) {
        toast.error(
          currentLang === 'bn'
            ? 'অনুগ্রহ করে একটি সঠিক অ্যাডমিন ইমেইল দিন!'
            : 'Please enter a valid admin email!',
        );
        return;
      }
    }

    setIsLoading(true);
    toast.loading(currentLang === 'bn' ? 'লগইন হচ্ছে...' : 'Logging in...', {
      id: 'login-toast',
    });

    try {
      const payload = {
        identifier: identifierTrimmed,
        password: formData.password,
        role: loginRole, 
      };

      // API Call
      const response = await axios.post(`${API_BASE_URL}/login`, payload);

      if (response.data && response.data.success) {
        toast.success(
          currentLang === 'bn' ? 'লগইন সফল হয়েছে!' : 'Login successful!',
          { id: 'login-toast' },
        );

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', loginRole);
        localStorage.setItem('mistri', JSON.stringify(response.data.mistri));
        localStorage.setItem('user', JSON.stringify(response.data.mistri));

        if (loginRole === 'admin') {
          navigate('/dashboard/admin');
        } else {
          navigate('/dashboard/mistri');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error.response?.data?.message ||
          (currentLang === 'bn' ? 'লগইন ব্যর্থ হয়েছে!' : 'Login failed!'),
        { id: 'login-toast' },
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ── Request OTP Code with Validation ──
  const handleForgotPasswordSubmit = async e => {
    e.preventDefault();
    const emailTrimmed = forgotEmail.trim();

    if (!emailRegex.test(emailTrimmed)) {
      toast.error(
        currentLang === 'bn'
          ? 'অনুগ্রহ করে একটি সঠিক ইমেইল অ্যাড্রেস দিন!'
          : 'Please enter a valid email address!',
      );
      return;
    }

    setIsSendingReset(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email: emailTrimmed,
        role: loginRole,
      });

      if (response.data && response.data.success) {
        toast.success(response.data.message || 'OTP Sent Successfully!');
        setResetStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSendingReset(false);
    }
  };

  // ── Verify OTP Code with Validation ──
  const handleVerifyOtpSubmit = async e => {
    e.preventDefault();
    const otpTrimmed = otpCode.trim();

    if (otpTrimmed.length !== 6 || isNaN(otpTrimmed)) {
      toast.error(
        currentLang === 'bn'
          ? 'ওটিপি কোডটি অবশ্যই ৬ ডিজিটের সংখ্যা হতে হবে!'
          : 'OTP code must be a 6-digit number!',
      );
      return;
    }

    setIsSendingReset(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/forgot-password/verify-otp`,
        {
          email: forgotEmail.trim(),
          otp: otpTrimmed,
          role: loginRole,
        },
      );

      if (response.data && response.data.success) {
        toast.success(response.data.message || 'OTP Verified!');
        setResetStep(3);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP code');
    } finally {
      setIsSendingReset(false);
    }
  };

  // ── Reset to New Password with Validation ──
  const handleResetPasswordSubmit = async e => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error(
        currentLang === 'bn'
          ? 'নতুন পাসওয়ার্ডটি কমপক্ষে ৬ ক্যারেক্টারের হতে হবে!'
          : 'New password must be at least 6 characters long!',
      );
      return;
    }

    setIsSendingReset(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/forgot-password/reset-password`,
        {
          email: forgotEmail.trim(),
          otp: otpCode.trim(),
          newPassword: newPassword,
          role: loginRole,
        },
      );

      if (response.data && response.data.success) {
        toast.success(
          response.data.message || 'Password updated successfully!',
        );
        setResetStep(4);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Reset was not successful');
    } finally {
      setIsSendingReset(false);
    }
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setForgotEmail('');
    setOtpCode('');
    setNewPassword('');
    setResetStep(1);
    setShowMainPassword(false);
    setShowNewPassword(false);
  };

  const inputClass =
    'w-full bg-slate-950/80 border border-slate-700/80 hover:border-slate-600 focus:border-primary/70 focus:ring-1 focus:ring-primary/20 rounded-xl pl-11 pr-12 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition-all duration-200';

  return (
    <div className="w-full min-h-screen bg-[#080c14] text-slate-100 flex justify-center py-40 px-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        {/* Top badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
            <FiShield className="text-xs" />
            {currentLang === 'bn' ? 'নিরাপদ লগইন' : 'Secure Login'}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/60 border border-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
          <div className="px-6 sm:px-8 pt-7 pb-5 border-b border-slate-800/60 text-center">
            <h1 className="text-2xl font-black bg-gradient-to-r from-white via-slate-200 to-amber-400 bg-clip-text text-transparent tracking-tight mb-1">
              {currentLang === 'bn'
                ? 'আপনার অ্যাকাউন্টে প্রবেশ করুন'
                : 'Welcome Back'}
            </h1>
            <p className="text-xs text-slate-400">
              {currentLang === 'bn'
                ? 'লগইন করে ড্যাশবোর্ড অ্যাক্সেস করুন'
                : 'Login to access your dashboard'}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {/* Role Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800/60">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('mistri');
                  setFormData({ identifier: '', password: '' });
                  setShowMainPassword(false);
                }}
                className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                  loginRole === 'mistri'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FiUser className="text-sm" />
                {currentLang === 'bn' ? 'মিস্ত্রি' : 'Mistri'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('admin');
                  setFormData({ identifier: '', password: '' });
                  setShowMainPassword(false);
                }}
                className={`py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                  loginRole === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FiShield className="text-sm" />
                {currentLang === 'bn' ? 'অ্যাডমিন' : 'Admin'}
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Identifier Input */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                  {loginRole === 'admin'
                    ? currentLang === 'bn'
                      ? 'অ্যাডমিন ইমেইল'
                      : 'Admin Email'
                    : currentLang === 'bn'
                      ? 'মোবাইল নম্বর / ইমেইল'
                      : 'Phone / Email'}
                </label>
                <div className="relative">
                  {loginRole === 'admin' ||
                  formData.identifier.includes('@') ? (
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  ) : (
                    <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  )}
                  <input
                    type={loginRole === 'admin' ? 'email' : 'text'}
                    required
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    placeholder={
                      loginRole === 'admin'
                        ? 'admin@mistryapp.com'
                        : currentLang === 'bn'
                          ? '017XXXXXXXX বা email@gmail.com'
                          : '017XXXXXXXX or email@gmail.com'
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                    {currentLang === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-[11px] text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-2"
                  >
                    {currentLang === 'bn'
                      ? 'পাসওয়ার্ড ভুলে গেছেন?'
                      : 'Forgot Password?'}
                  </button>
                </div>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                  <input
                    type={showMainPassword ? 'text' : 'password'}
                    required
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`${inputClass} font-mono`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowMainPassword(!showMainPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none p-1"
                  >
                    {showMainPassword ? (
                      <FiEyeOff className="text-base" />
                    ) : (
                      <FiEye className="text-base" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 font-black text-xs uppercase tracking-[0.15em] rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none mt-2 ${
                  loginRole === 'admin'
                    ? 'bg-amber-500 hover:brightness-110 text-slate-950 shadow-amber-500/15'
                    : 'bg-primary hover:brightness-110 text-white shadow-primary/15'
                }`}
              >
                {isLoading ? (
                  <>
                    <FiRefreshCw className="animate-spin text-sm" />
                    {currentLang === 'bn' ? 'ভেরিফাই হচ্ছে...' : 'Verifying...'}
                  </>
                ) : (
                  <>
                    {currentLang === 'bn' ? 'লগইন করুন' : 'Secure Login'}
                    <FiArrowRight className="text-sm" />
                  </>
                )}
              </button>
            </form>

            {/* Registration Link */}
            {loginRole === 'mistri' && (
              <div className="text-center pt-4 border-t border-slate-800/50">
                <p className="text-xs text-slate-400">
                  {currentLang === 'bn'
                    ? 'নতুন মিস্ত্রি অ্যাকাউন্ট খুলতে চান? '
                    : "Don't have a Mistry account? "}
                  <Link
                    to="/join-mistry"
                    className="text-primary font-bold hover:underline underline-offset-2 transition-colors"
                  >
                    {currentLang === 'bn'
                      ? 'এখানে আবেদন করুন →'
                      : 'Apply Here →'}
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════ Forgot Password Modal ════ */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={closeForgotModal}
          />

          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-10">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/15 border border-primary/30 rounded-xl flex items-center justify-center">
                  <FiLock className="text-primary text-sm" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    {currentLang === 'bn'
                      ? 'পাসওয়ার্ড রিসেট'
                      : 'Reset Password'}
                  </h3>
                  <span className="text-primary font-bold capitalize">
                    ({loginRole})
                  </span>
                </div>
              </div>
              <button
                onClick={closeForgotModal}
                className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full flex items-center justify-center transition-all"
              >
                <FiX className="text-sm" />
              </button>
            </div>

            <div className="p-6">
              {/* Email Input */}
              {resetStep === 1 && (
                <form
                  onSubmit={handleForgotPasswordSubmit}
                  className="space-y-4"
                >
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentLang === 'bn'
                      ? 'আপনার রেজিস্টার্ড ইমেইল অ্যাড্রেস দিন। আমরা পাসওয়ার্ড রিসেটের জন্য একটি ৬ ডিজিটের ওটিপি কোড পাঠাব।'
                      : 'Enter your registered email address. We will send you a 6-digit OTP code to reset your password.'}
                  </p>
                  <div className="space-y-2">
                    <div className="relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={e => setForgotEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSendingReset}
                      className="w-full py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isSendingReset ? (
                        <FiRefreshCw className="animate-spin text-xs" />
                      ) : currentLang === 'bn' ? (
                        'ওটিপি পাঠান'
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* OTP Entry */}
              {resetStep === 2 && (
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentLang === 'bn'
                      ? `${forgotEmail} ঠিকানায় ওটিপি পাঠানো হয়েছে।`
                      : `An OTP has been sent to ${forgotEmail}.`}
                  </p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full bg-slate-950/80 border border-slate-700/80 text-center rounded-xl py-3 text-sm text-white tracking-[0.3em] font-mono outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="w-full py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isSendingReset ? (
                      <FiRefreshCw className="animate-spin text-xs" />
                    ) : currentLang === 'bn' ? (
                      'কোড মেলান'
                    ) : (
                      'Verify Code'
                    )}
                  </button>
                </form>
              )}

              {/* New Password Entry */}
              {resetStep === 3 && (
                <form
                  onSubmit={handleResetPasswordSubmit}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-11 pr-12 py-3 text-sm text-white font-mono outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showNewPassword ? (
                          <FiEyeOff className="text-base" />
                        ) : (
                          <FiEye className="text-base" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSendingReset}
                    className="w-full py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isSendingReset ? (
                      <FiRefreshCw className="animate-spin text-xs" />
                    ) : currentLang === 'bn' ? (
                      'পাসওয়ার্ড পরিবর্তন করুন'
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>
              )}

              {/* Success State */}
              {resetStep === 4 && (
                <div className="text-center space-y-4 py-2">
                  <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto">
                    <FiCheckCircle className="text-emerald-400 text-2xl" />
                  </div>
                  <p className="text-xs text-slate-400">
                    {currentLang === 'bn'
                      ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে।'
                      : 'Password updated successfully.'}
                  </p>
                  <button
                    onClick={closeForgotModal}
                    className="w-full py-2.5 bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl"
                  >
                    {currentLang === 'bn' ? 'লগইন ফর্মে যান' : 'Go to Login'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};;;

export default Login;
