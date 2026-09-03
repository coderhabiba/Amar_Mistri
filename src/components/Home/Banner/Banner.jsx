import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FiCreditCard,
  FiArrowRight,
  FiShield,
  FiTool,
  FiStar,
} from 'react-icons/fi';
import { MdPhoneAndroid } from 'react-icons/md';

const banners = [
  {
    id: 1,
    subTitle: { bn: 'চলুন কাজে নেমে পড়া যাক', en: "Let's Get To Work" },
    titleMain: {
      bn: 'দক্ষতার সঠিক মূল্যে ভরসা রাখুন',
      en: 'Honest, Trustworthy, And',
    },
    titleGradient: { bn: "'আমার মিস্ত্রি'তে", en: 'Does Good Work.' },
    description: {
      bn: 'আমাদের সাথে যুক্ত হয়ে সরাসরি গ্রাহকদের সাথে কানেক্ট হোন বা ঘরে বসেই অ্যাপের মাধ্যমে সব নিরাপদ হোম সার্ভিস উপভোগ করুন।',
      en: 'Connect directly with trusted local service professionals or book expert handymen instantly from the comfort of your home.',
    },
    btn1Text: { bn: 'আয় করুন', en: 'Earn Now' },
    btn2Text: { bn: 'ডাউনলোড অ্যাপ', en: 'Download App' },
    img: 'https://i.ibb.co.com/Ngff7tJb/banner.jpg',
    actionType: 'join',
  },
  {
    id: 2,
    subTitle: { bn: 'সেরা সেবা নিশ্চিত', en: 'Best Service Guaranteed' },
    titleMain: {
      bn: 'আপনার ঘরের প্রতিটি সমস্যার',
      en: 'Professional Handyman For',
    },
    titleGradient: { bn: 'সহজ সমাধান', en: 'Every Home Repair.' },
    description: {
      bn: 'অভিজ্ঞ ইলেকট্রিশিয়ান, প্লাম্বার কিংবা টেকনিশিয়ান খুঁজছেন? আমাদের এক ক্লিকেই পেয়ে যান আপনার এলাকাতেই।',
      en: 'Looking for an experienced electrician, plumber, or technician? Find them instantly in your local area with just a single click.',
    },
    btn1Text: { bn: 'সেবা নিন', en: 'Get Service' },
    btn2Text: { bn: 'ডাউনলোড অ্যাপ', en: 'Download App' },
    img: 'https://i.ibb.co.com/qvdvJNQ/banner-2.avif',
    actionType: 'services',
  },
  {
    id: 3,
    subTitle: { bn: 'নির্ভরযোগ্য হোম কেয়ার', en: 'Reliable Home Care' },
    titleMain: {
      bn: 'অভিজ্ঞ হাত দিয়ে হোক আপনার',
      en: 'Expert Solutions For Your',
    },
    titleGradient: { bn: 'বাড়ি মেরামত', en: 'Home Maintenance.' },
    description: {
      bn: 'টাইলস ফিটিং, ওয়্যারিং বা যেকোনো হোম রেনোভেশন সার্ভিসের জন্য বুক করুন আমাদের ভেরিফাইড এক্সপার্ট মিস্ত্রিদের।',
      en: 'From minor fixes to major renovations, book our verified and background-checked technicians to upgrade your living space.',
    },
    btn1Text: { bn: 'মিস্ত্রি খুঁজুন', en: 'Find Mistry' },
    btn2Text: { bn: 'ডাউনলোড অ্যাপ', en: 'Download App' },
    img: 'https://i.ibb.co.com/pvTTkBRy/banner-3.avif',
    actionType: 'mechanics',
  },
  {
    id: 4,
    subTitle: { bn: 'সুরক্ষা ও সততা', en: 'Safety & Trust First' },
    titleMain: {
      bn: 'নিরাপদ সেবার শতভাগ নিশ্চিন্ত',
      en: 'Verified Professionals For A',
    },
    titleGradient: { bn: 'সুরক্ষিত হোম সার্ভিস', en: 'Secure Experience.' },
    description: {
      bn: 'আমাদের প্রতিটি মিস্ত্রি সম্পূর্ণ ভেরিফাইড এবং ব্যাকগ্রাউন্ড চেকড। আপনার নিরাপত্তা এবং সন্তুষ্টিই আমাদের মূল লক্ষ্য।',
      en: 'Every handyman on our platform is strictly background-checked and verified. Your peace of mind and home safety is our topmost priority.',
    },
    btn1Text: { bn: 'সুরক্ষা নীতি', en: 'Safety Rules' },
    btn2Text: { bn: 'ডাউনলোড অ্যাপ', en: 'Download App' },
    img: 'https://i.ibb.co.com/Lht2dZvf/banner-4.avif',
    actionType: 'safety',
  },
];

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'bn';

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const activeBanner = banners[current];

  if (!activeBanner) return null;

  const handlePrimaryClick = type => {
    if (type === 'join') {
      navigate('/join-mistry');
    } else if (type === 'services') {
      navigate('/services');
    } else if (type === 'mechanics') {
      navigate('/book-now');
    } else if (type === 'safety') {
      navigate('/terms-conditions');
    } else {
      navigate('/services');
    }
  };

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[780px] w-full overflow-hidden bg-[#0c111d] flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${current}`}
          className="absolute inset-0 z-0 w-full h-full bg-center lg:bg-right bg-cover lg:bg-contain bg-no-repeat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            backgroundImage: `url(${activeBanner.img})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c111d] via-[#0c111d]/85 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-[#0c111d]/75 block lg:hidden" />{' '}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c111d] via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* main content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl space-y-6 text-left"
          >
            <p className="text-yellow-500 text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
              {activeBanner.subTitle[currentLang]}
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.2]">
              {activeBanner.titleMain[currentLang]}{' '}
              <span className="block lg:inline text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                {activeBanner.titleGradient[currentLang]}
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-normal">
              {activeBanner.description[currentLang]}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 max-w-md sm:max-w-xl">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handlePrimaryClick(activeBanner.actionType)}
                className="flex items-center justify-between bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white text-base font-bold px-7 py-4 transition-all duration-300 group rounded-2xl w-full sm:w-60"
              >
                <div className="flex items-center gap-3">
                  {activeBanner.actionType === 'join' ? (
                    <FiCreditCard className="w-5 h-5 stroke-[2.5]" />
                  ) : activeBanner.actionType === 'safety' ? (
                    <FiShield className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <FiTool className="w-5 h-5 stroke-[2.5]" />
                  )}
                  <span className="tracking-wide">
                    {activeBanner.btn1Text[currentLang]}
                  </span>
                </div>
                <FiArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1.5 stroke-[2.5]" />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="#download-section"
                className="flex items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white text-base font-bold px-7 py-4 transition-all duration-300 group rounded-2xl w-full sm:w-60"
              >
                <div className="flex items-center gap-3">
                  <MdPhoneAndroid className="w-5 h-5 text-yellow-400" />
                  <span className="tracking-wide">
                    {activeBanner.btn2Text[currentLang]}
                  </span>
                </div>
                <FiArrowRight className="w-5 h-5 text-yellow-400 transition-transform duration-200 group-hover:translate-x-1.5 stroke-[2.5]" />
              </motion.a>
            </div>

            {/* Review  */}
            <div className="flex items-center gap-4 pt-6 border-t border-slate-900/40">
              <div className="flex items-center -space-x-3">
                <img
                  className="inline-block h-10 w-10 rounded-full ring-4 ring-[#0c111d] object-cover"
                  src="https://i.ibb.co.com/TMgKG4Dp/avatar-1.avif"
                  alt="User 1"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-4 ring-[#0c111d] object-cover"
                  src="https://i.ibb.co.com/CK6wKS08/avatar-2.avif"
                  alt="User 2"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-4 ring-[#0c111d] object-cover"
                  src="https://i.ibb.co.com/v6sSxBGv/avater-4.avif"
                  alt="User 3"
                />
                <img
                  className="inline-block h-10 w-10 rounded-full ring-4 ring-[#0c111d] object-cover"
                  src="https://i.ibb.co.com/FkWNs7fv/avatar-3.webp"
                  alt="User 4"
                />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-0.5 text-primary text-sm">
                  <FiStar className="fill-primary" />
                  <FiStar className="fill-primary" />
                  <FiStar className="fill-primary" />
                  <FiStar className="fill-primary" />
                  <FiStar className="fill-primary" />
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-bold tracking-wide">
                  4.5K{' '}
                  <span className="text-slate-500 font-normal">
                    {currentLang === 'bn' ? 'রিভিউস' : 'Reviews'}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* MULTI-SLIDE DOTS INDICATOR */}
      {banners.length > 1 && (
        <div className="absolute bottom-10 left-6 lg:left-8 flex space-x-3 z-20">
          {banners.map((_, i) => (
            <button
              key={`dot-${i}`}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-500 rounded-full h-3 ${
                current === i
                  ? 'w-10 bg-yellow-500'
                  : 'w-3 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Banner;
