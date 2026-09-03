import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome, FiArrowLeft } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';

const ErrorPage = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        {/* Animated Error Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-24 h-24 bg-red-500/10 text-red-500 border border-red-500/20 rounded-3xl flex items-center justify-center text-5xl mx-auto shadow-[0_0_50px_rgba(239,68,68,0.15)]"
        >
          <FiAlertTriangle
            className="animate-bounce"
            style={{ animationDuration: '3s' }}
          />
        </motion.div>

        {/* Error Texts */}
        <div className="space-y-3">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-7xl sm:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500"
          >
            404
          </motion.h1>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl sm:text-2xl font-bold text-slate-200"
          >
            {currentLang === 'bn'
              ? 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি!'
              : 'Page Not Found!'}
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed"
          >
            {currentLang === 'bn'
              ? 'দুঃখিত, আপনি যে লিংকটি খুঁজছেন সেটি হয়তো মুছে ফেলা হয়েছে অথবা লিংকটি ভুল ছিল।'
              : 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.'}
          </motion.p>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          {/* Go Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300"
          >
            <FiArrowLeft className="text-base" />
            {currentLang === 'bn' ? 'পেছনে যান' : 'Go Back'}
          </button>

          {/* Home Button */}
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-amber-500/10"
          >
            <FiHome className="text-base" />
            {currentLang === 'bn' ? 'হোম পেজ' : 'Go Home'}
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorPage;
