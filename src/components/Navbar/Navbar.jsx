import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiMenu, HiX, HiTranslate } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router'; 
import { FcPrivacy } from 'react-icons/fc';
import { FiLogOut } from 'react-icons/fi'; 
import {
  FiSmartphone,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiBookOpen,
  FiInfo,
  FiFeather,
  FiTv as FiPress,
  FiBriefcase,
  FiShield,
  FiAward,
  FiMail,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiPhoneCall,
  FiMessageSquare,
  FiMonitor,
} from 'react-icons/fi';

import {
  MdFlashOn,
  MdHomeWork,
  MdAcUnit,
  MdMedicalServices,
  MdSettingsInputAntenna,
  MdOutlinePrecisionManufacturing,
} from 'react-icons/md';

const ICON_MAP = {
  electricalElectronics: <MdFlashOn />,
  mechanicalAutomobile: <FiSettings />,
  itComputerNetwork: <FiMonitor />,
  constructionCivil: <MdHomeWork />,
  hvacHomeAppliances: <MdAcUnit />,
  medicalLaboratory: <MdMedicalServices />,
  telecomMedia: <MdSettingsInputAntenna />,
  industrialAutomation: <MdOutlinePrecisionManufacturing />,
};

const Navbar = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';
  const navigate = useNavigate(); 
  const [token, setToken] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const defaultAvatar = 'https://i.ibb.co.com/vxFHw6M/user-placeholder.png';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
      setUserImage(localStorage.getItem('userImage'));
    }
  }, []);

  const [servicesData, setServicesData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isHelpDropdownOpen, setIsHelpDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');

  // Mobile drawer states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [isMobileHelpOpen, setIsMobileHelpOpen] = useState(false);
  const [isMobileCompanyOpen, setIsMobileCompanyOpen] = useState(false);

  useEffect(() => {
    fetch(`${(process.env.NEXT_PUBLIC_API_URL || "/api")}/services`)
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(data => {
        setServicesData(data);
        const keys = Object.keys(data);
        if (keys.length > 0) {
          setActiveCategory(keys[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load services data:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  };

  // 
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userImage');
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  // Framer motion variants configurations
  const megaMenuVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    exit: { opacity: 0, y: 10, transition: { duration: 0.15, ease: 'easeIn' } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3, ease: 'easeInOut' },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.25, ease: 'easeInOut' },
    },
  };

  const helpLinks = [
    {
      path: '/user-helpline',
      bn: 'ইউজার হেল্প লাইন',
      en: 'User Helpline',
      icon: <FiUser />,
    },
    {
      path: '/mechanic-helpline',
      bn: 'মেকানিক হেল্প লাইন',
      en: 'Mechanic Helpline',
      icon: <FiSettings />,
    },
    {
      path: '/support-center',
      bn: 'সাপোর্ট সেন্টার',
      en: 'Support Center',
      icon: <FiHelpCircle />,
    },
    {
      path: '/work-in-support-center',
      bn: 'ওয়ার্ক ইন সাপোর্ট সেন্টার',
      en: 'Walk-in Support Center',
      icon: <FiHelpCircle />,
    },
    {
      path: '/how-to-join-mechanic',
      bn: 'কিভাবে মেকানিক হিসেবে জয়েন করবো',
      en: 'How to Join as Mechanic',
      icon: <FiBookOpen />,
    },
  ];

  const moreLinks = [
    {
      path: '/download-app',
      bn: 'ডাউনলোড অ্যাপ',
      en: 'Download App',
      icon: <FiSmartphone />,
    },
    {
      path: '/about-us',
      bn: 'আমাদের সম্পর্কে',
      en: 'About Us',
      icon: <FiInfo />,
    },
    {
      path: '/press-release',
      bn: 'প্রেস রিলিজ',
      en: 'Press Release',
      icon: <FiFeather />,
    },
    {
      path: '/press-coverage',
      bn: 'প্রেস কভারেজ',
      en: 'Press Coverage',
      icon: <FiPress />,
    },
    {
      path: '/press-kit',
      bn: 'প্রেস কিট',
      en: 'Press Kit',
      icon: <FiBriefcase />,
    },
    {
      path: '/privacy-policy',
      bn: 'নীতিমালা',
      en: 'Privacy Policy',
      icon: <FiShield />,
    },
    {
      path: '/terms-conditions',
      bn: 'শর্তাদি',
      en: 'Terms & Conditions',
      icon: <FcPrivacy />,
    },
    { path: '/points', bn: 'পয়েন্টস', en: 'Points', icon: <FiAward /> },
    { path: '/contact', bn: 'যোগাযোগ', en: 'Contact', icon: <FiMail /> },
  ];

  const socialMedia = [
    { icon: <FiFacebook />, url: 'https://www.facebook.com/share/1QPjidrVKF' },
    { icon: <FiTwitter />, url: 'https://twitter.com' },
    {
      icon: <FiInstagram />,
      url: 'https://www.instagram.com/amarmistri.com.bd?igsh=dWUxMWZlZmcyNXpx',
    },
    { icon: <FiLinkedin />, url: 'https://linkedin.com' },
    { icon: <FiYoutube />, url: 'https://www.youtube.com/@amarmistribd' },
  ];

  return (
    <nav className="bg-white backdrop-blur-xl sticky top-0 z-50 w-full border-b border-gray-200/60 shadow-[0_1px_0_0_rgba(0,0,0,0.02),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="group flex items-center justify-center transition-transform duration-300 active:scale-95"
            >
              <img
                src="https://i.ibb.co.com/mj5HQWv/logo-Photoroom.png"
                alt="Logo"
                className="w-18 lg:w-28 object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
              />
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-1 lg:space-x-2 items-center h-full">
            {/* Categories Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() =>
                !loading && servicesData && setIsServicesDropdownOpen(true)
              }
              onMouseLeave={() => setIsServicesDropdownOpen(false)}
            >
              <button
                disabled={loading}
                className={`relative text-secondary font-medium text-sm flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 hover:text-primary hover:bg-red-50/60 focus:outline-none disabled:opacity-50 ${
                  isServicesDropdownOpen ? 'text-primary bg-red-50/60' : ''
                }`}
              >
                {loading
                  ? currentLang === 'bn'
                    ? 'লোড হচ্ছে...'
                    : 'Loading...'
                  : currentLang === 'bn'
                    ? 'ক্যাটাগরি'
                    : 'Categories'}
                {!loading && (
                  <motion.span
                    animate={{ rotate: isServicesDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="text-[10px] inline-block opacity-60"
                  >
                    ▼
                  </motion.span>
                )}
              </button>

              <AnimatePresence>
                {isServicesDropdownOpen && !loading && servicesData && (
                  <motion.div
                    variants={megaMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-[78px] left-1/2 right-1/2 -mx-[475px] w-[950px] bg-white backdrop-blur-2xl rounded-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.04)] border border-gray-100 z-[60] origin-top grid grid-cols-12 gap-6 overflow-hidden"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-red-400 to-primary/60" />

                    {/* Categories Left List */}
                    <div className="col-span-5 border-r border-gray-100 pr-4 space-y-1">
                      <div className="px-3 pb-3 text-xs font-black uppercase tracking-[0.12em] text-gray-400">
                        {currentLang === 'bn'
                          ? 'সেবা ক্যাটাগরি'
                          : 'Service Categories'}
                      </div>
                      {Object.keys(servicesData).map(key => {
                        const item = servicesData[key];
                        const active = activeCategory === key;
                        return (
                          <button
                            key={key}
                            onMouseEnter={() => setActiveCategory(key)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 rounded-xl group ${
                              active
                                ? 'bg-gradient-to-r from-red-50 to-transparent text-primary font-bold shadow-sm'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span
                              className={`w-9 h-9 flex items-center justify-center rounded-lg text-base transition-all ${
                                active
                                  ? 'bg-primary text-white shadow-md shadow-red-200'
                                  : 'bg-gray-100 text-primary group-hover:bg-red-50'
                              }`}
                            >
                              {ICON_MAP[key] || <FiSettings />}
                            </span>
                            <span className="text-sm font-semibold tracking-wide uppercase flex-1">
                              {item.category?.[currentLang]}
                            </span>
                            <motion.span
                              animate={{
                                x: active ? 0 : -4,
                                opacity: active ? 1 : 0,
                              }}
                              className="text-primary text-sm"
                            >
                              →
                            </motion.span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Sub-categories */}
                    <div className="col-span-4 py-1">
                      <h4 className="text-xs font-black uppercase tracking-[0.12em] text-gray-400 mb-3 px-2">
                        {currentLang === 'bn'
                          ? 'উপলব্ধ এক্সপার্টস'
                          : 'Available Experts'}
                      </h4>
                      <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex flex-col gap-0.5"
                      >
                        {activeCategory &&
                          servicesData[activeCategory]?.services?.map(
                            (service, index) => (
                              <Link
                                key={index}
                                to={`/mistries?categoryKey=${activeCategory}&specificService=${service.en}`}
                                onClick={() => setIsServicesDropdownOpen(false)}
                                className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary py-2 px-3 hover:bg-red-50/60 transition-all rounded-lg"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-primary group-hover:scale-125 transition-all" />
                                <span>{service[currentLang]}</span>
                                <span className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all text-primary">
                                  →
                                </span>
                              </Link>
                            ),
                          )}
                      </motion.div>
                    </div>

                    {/* App promo */}
                    <div className="col-span-3 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-5 rounded-2xl text-center flex flex-col justify-center items-center space-y-4 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/30 rounded-full blur-2xl" />
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/20 rounded-full blur-2xl" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-red-600 text-white flex items-center justify-center shadow-lg shadow-red-900/40">
                        <FiSmartphone className="text-2xl stroke-[1.8]" />
                      </div>
                      <div className="relative space-y-1">
                        <h4 className="font-extrabold text-sm tracking-tight">
                          {currentLang === 'bn'
                            ? 'আপনার পকেটে আমার মিস্ত্রি'
                            : 'Amar Mistry in Your Pocket'}
                        </h4>
                        <p className="text-xs text-gray-300 font-medium leading-relaxed">
                          {currentLang === 'bn'
                            ? 'দ্রুত ও নিরবচ্ছিন্ন সেবার জন্য আমাদের অফিসিয়াল মোবাইল অ্যাপটি ডাউনলোড করুন।'
                            : 'For faster, seamless service, download our official mobile app.'}
                        </p>
                      </div>
                      <div className="relative flex flex-col gap-2 w-full">
                        <a
                          href="#"
                          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 rounded-xl px-3 py-2 text-left active:scale-[0.98] transition-all"
                        >
                          <img
                            src="https://i.ibb.co.com/KxnqhMMt/download.png"
                            alt="PlayStore"
                            className="w-5 h-5 object-contain"
                          />
                          <div>
                            <span className="text-[9px] uppercase block text-gray-300">
                              Get it on
                            </span>
                            <span className="block text-xs font-extrabold leading-tight">
                              Google Play
                            </span>
                          </div>
                        </a>
                        <a
                          href="#"
                          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 rounded-xl px-3 py-2 text-left active:scale-[0.98] transition-all"
                        >
                          <img
                            src="https://i.ibb.co.com/5xfG6x95/app-store.png"
                            alt="AppStore"
                            className="w-5 h-5 object-contain"
                          />
                          <div>
                            <span className="text-[9px] uppercase block text-gray-300">
                              Download on the
                            </span>
                            <span className="block text-xs font-extrabold leading-tight">
                              App Store
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/join-mistry"
              className="text-secondary font-medium text-sm px-3 py-2 rounded-lg transition-all duration-300 hover:text-primary hover:bg-red-50/60"
            >
              {currentLang === 'bn' ? 'মিস্ত্রি হোন' : 'Join as Mistry'}
            </Link>

            <Link
              to="/services"
              className="text-secondary font-medium text-sm px-3 py-2 rounded-lg transition-all duration-300 hover:text-primary hover:bg-red-50/60"
            >
              {currentLang === 'bn' ? 'সকল সার্ভিস' : 'All Services'}
            </Link>

            {/* Help Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsHelpDropdownOpen(true)}
              onMouseLeave={() => setIsHelpDropdownOpen(false)}
            >
              <button
                className={`text-secondary font-medium text-sm flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 hover:text-primary hover:bg-red-50/60 focus:outline-none ${
                  isHelpDropdownOpen ? 'text-primary bg-red-50/60' : ''
                }`}
              >
                {currentLang === 'bn' ? 'সাহায্য' : 'Help'}
                <motion.span
                  animate={{ rotate: isHelpDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[10px] inline-block opacity-60"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {isHelpDropdownOpen && (
                  <motion.div
                    variants={megaMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-[78px] left-1/2 right-1/2 -mx-[475px] w-[950px] bg-white backdrop-blur-2xl rounded-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.04)] border border-gray-100 z-[60] origin-top grid grid-cols-12 gap-6 overflow-hidden"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-red-400 to-primary/60" />

                    <div className="col-span-7 border-r border-gray-100 pr-4 space-y-1">
                      <div className="px-3 pb-3 text-xs font-black uppercase tracking-[0.12em] text-gray-400">
                        {currentLang === 'bn'
                          ? 'সহায়তা নির্দেশিকা'
                          : 'Support Guides'}
                      </div>
                      {helpLinks.map((help, idx) => (
                        <Link
                          key={idx}
                          to={help.path}
                          onClick={() => setIsHelpDropdownOpen(false)}
                          className="group w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent hover:text-primary"
                        >
                          <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-red-200 transition-all text-base">
                            {help.icon}
                          </span>
                          <span className="text-sm font-semibold tracking-wide uppercase flex-1">
                            {currentLang === 'bn' ? help.bn : help.en}
                          </span>
                          <span className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-primary text-sm">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>

                    <div className="col-span-5 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-5 rounded-2xl text-center flex flex-col justify-center items-center space-y-4 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/30 rounded-full blur-2xl" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
                        <FiPhoneCall className="text-2xl stroke-[1.8]" />
                      </div>
                      <div className="relative space-y-1">
                        <h4 className="font-extrabold text-sm tracking-tight">
                          {currentLang === 'bn'
                            ? 'সরাসরি যোগাযোগ করুন'
                            : 'Instant Connect'}
                        </h4>
                        <p className="text-xs text-gray-300 font-medium leading-relaxed max-w-xs mx-auto">
                          {currentLang === 'bn'
                            ? 'যেকোনো জিজ্ঞাসা বা তাৎক্ষণিক সহায়তার জন্য আমাদের সাথে সরাসরি যুক্ত হোন।'
                            : 'Connect with us instantly for any queries or emergency support.'}
                        </p>
                      </div>
                      <div className="relative flex flex-col gap-2.5 w-full">
                        <div className="bg-white/10 backdrop-blur border border-white/10 rounded-xl px-3 py-2.5 text-left">
                          <span className="block text-[10px] uppercase text-gray-300 tracking-wider">
                            {currentLang === 'bn'
                              ? '২৪/৭ হটলাইন সাপোর্ট'
                              : '24/7 Hotline Support'}
                          </span>
                          <span className="block text-base font-extrabold tracking-wide">
                            01893014004
                          </span>
                        </div>
                        <a
                          href="https://m.me/amarmistrybd"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 bg-white text-secondary p-2.5 rounded-xl shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all group text-left"
                        >
                          <div className="w-9 h-9 bg-blue-500 text-white flex items-center justify-center text-base rounded-lg shadow-md shadow-blue-200">
                            <FiMessageSquare />
                          </div>
                          <div>
                            <span className="block text-xs text-gray-500 font-medium">
                              {currentLang === 'bn'
                                ? 'ইনবক্স করুন আমাদের'
                                : 'Inbox Us Instantly'}
                            </span>
                            <span className="block text-sm font-extrabold tracking-wide">
                              {currentLang === 'bn'
                                ? 'মেসেজ করুন'
                                : 'Message Us'}
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/blog"
              className="text-secondary font-medium text-sm px-3 py-2 rounded-lg transition-all duration-300 hover:text-primary hover:bg-red-50/60"
            >
              {currentLang === 'bn' ? 'ব্লগ' : 'Blog'}
            </Link>

            {/* More Dropdown */}
            <div
              className="relative h-full flex items-center"
              onMouseEnter={() => setIsCompanyDropdownOpen(true)}
              onMouseLeave={() => setIsCompanyDropdownOpen(false)}
            >
              <button
                className={`text-secondary font-medium text-sm flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 hover:text-primary hover:bg-red-50/60 focus:outline-none ${
                  isCompanyDropdownOpen ? 'text-primary bg-red-50/60' : ''
                }`}
              >
                {currentLang === 'bn' ? 'আরও' : 'More'}
                <motion.span
                  animate={{ rotate: isCompanyDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-[10px] inline-block opacity-60"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {isCompanyDropdownOpen && (
                  <motion.div
                    variants={megaMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-[78px] left-1/2 right-1/2 -mx-[475px] w-[950px] bg-white backdrop-blur-2xl rounded-2xl p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.04)] border border-gray-100 z-[60] origin-top grid grid-cols-12 gap-6 overflow-hidden"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-red-400 to-primary/60" />

                    <div className="col-span-4 border-r border-gray-100 pr-4 space-y-1">
                      <div className="px-3 pb-3 text-xs font-black uppercase tracking-[0.12em] text-gray-400">
                        {currentLang === 'bn'
                          ? 'কোম্পানি ও প্রেস'
                          : 'Company & Press'}
                      </div>
                      {moreLinks.slice(0, 5).map((company, idx) => (
                        <Link
                          key={idx}
                          to={company.path}
                          onClick={() => setIsCompanyDropdownOpen(false)}
                          className="group w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent hover:text-primary"
                        >
                          <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-red-200 transition-all text-base">
                            {company.icon}
                          </span>
                          <span className="text-sm font-semibold tracking-wide uppercase">
                            {currentLang === 'bn' ? company.bn : company.en}
                          </span>
                          <span className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all text-primary">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>

                    <div className="col-span-4 border-r border-gray-100 pr-4 space-y-1">
                      <div className="px-3 pb-3 text-xs font-black uppercase tracking-[0.12em] text-gray-400">
                        {currentLang === 'bn' ? 'অন্যান্য তথ্য' : 'Other Info'}
                      </div>
                      {moreLinks.slice(5).map((company, idx) => (
                        <Link
                          key={idx}
                          to={company.path}
                          onClick={() => setIsCompanyDropdownOpen(false)}
                          className="group w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-transparent hover:text-primary"
                        >
                          <span className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 text-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-md group-hover:shadow-red-200 transition-all text-base">
                            {company.icon}
                          </span>
                          <span className="text-sm font-semibold tracking-wide uppercase">
                            {currentLang === 'bn' ? company.bn : company.en}
                          </span>
                          <span className="ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1 transition-all text-primary">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>

                    <div className="col-span-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-5 rounded-2xl text-center flex flex-col justify-center items-center space-y-4 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/30 rounded-full blur-2xl" />
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-red-500/20 rounded-full blur-2xl" />
                      <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
                        <FiInfo className="text-2xl stroke-[1.8]" />
                      </div>
                      <div className="relative space-y-1">
                        <h4 className="font-extrabold text-sm tracking-tight">
                          {currentLang === 'bn'
                            ? 'আমাদের সাথে যুক্ত থাকুন'
                            : 'Stay Connected'}
                        </h4>
                        <p className="text-xs text-gray-300 font-medium leading-relaxed max-w-xs mx-auto">
                          {currentLang === 'bn'
                            ? 'নতুন অফার, আপডেট এবং সেবামূলক খবরের জন্য সোশ্যাল মিডিয়ায় আমাদের ফলো করুন।'
                            : 'Follow us for new offers, updates and helpful tech news.'}
                        </p>
                      </div>
                      <div className="relative w-full pt-3 border-t border-white/10">
                        <span className="block text-xs font-black uppercase tracking-[0.12em] text-gray-400 mb-3">
                          {currentLang === 'bn'
                            ? 'সোশ্যাল মিডিয়া'
                            : 'Follow Us'}
                        </span>
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                          {socialMedia.map((social, idx) => (
                            <a
                              key={idx}
                              href={social.url}
                              target="_blank"
                              rel="noreferrer"
                              className="w-10 h-10 bg-white/10 backdrop-blur border border-white/10 text-white text-lg flex items-center justify-center rounded-xl transition-all hover:bg-primary hover:border-primary hover:scale-110 hover:shadow-lg hover:shadow-red-900/40"
                            >
                              {social.icon}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Language + Auth/CTA Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Dropdown */}
            <div
              className="relative py-1"
              onMouseEnter={() => setIsLangDropdownOpen(true)}
              onMouseLeave={() => setIsLangDropdownOpen(false)}
            >
              <button className="flex items-center gap-1 font-medium text-xs text-secondary border border-gray-200 hover:border-primary/30 hover:bg-red-50/30 px-2.5 py-1.5 rounded-full transition-all duration-300">
                <HiTranslate className="w-3.5 h-3.5 text-primary" />
                {currentLang === 'bn' ? 'বাংলা' : 'English'}
                <motion.span
                  animate={{ rotate: isLangDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block text-[8px] opacity-60"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {isLangDropdownOpen && (
                  <motion.div
                    className="absolute right-0 pt-1.5 z-[60] origin-top-right"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ul className="bg-white rounded-xl w-36 p-1 shadow-xl border border-gray-100 overflow-hidden">
                      {['en', 'bn'].map(lng => (
                        <li key={lng}>
                          <button
                            className={`text-xs font-medium py-2 px-3 w-full text-left rounded-lg transition-all flex items-center gap-1.5 ${
                              i18n.language === lng
                                ? 'bg-gradient-to-r from-red-50 to-transparent text-primary font-bold'
                                : 'text-secondary hover:bg-gray-50'
                            }`}
                            onClick={() => changeLanguage(lng)}
                          >
                            {i18n.language === lng && (
                              <span className="w-1 h-1 rounded-full bg-primary" />
                            )}
                            {lng === 'en' ? 'English' : 'বাংলা'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 🔒 🛠️ Auth Condition (Desktop) */}
            {token ? (
              <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                {/* */}
                <Link
                  to="/dashboard"
                  className="relative group block active:scale-95 transition-transform"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-red-500 rounded-full blur-[2px] opacity-0 group-hover:opacity-70 transition-opacity" />
                  <img
                    src={userImage || defaultAvatar}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary transition-colors bg-gray-100"
                  />
                </Link>
                {/* logout btn */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:text-primary hover:border-primary/40 hover:bg-red-50/40 font-bold text-xs px-3.5 py-1.5 rounded-full transition-all duration-300 active:scale-95 shadow-sm cursor-pointer"
                >
                  <FiLogOut className="text-sm" />
                  {currentLang === 'bn' ? 'লগআউট' : 'Logout'}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="border border-primary text-primary hover:bg-primary hover:text-white font-bold text-xs px-4 pt-1.5 pb-1 rounded-full transition-all duration-300 transform active:scale-95 shadow-sm text-center"
              >
                {currentLang === 'bn' ? 'লগইন' : 'Login'}
              </Link>
            )}

            {/* Book Now */}
            <Link
              to="/book-now"
              className="relative bg-gradient-to-r from-primary to-red-600 hover:from-red-600 hover:to-primary text-white font-bold text-xs px-4.5 py-2 rounded-full transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-md shadow-red-300/30 hover:shadow-lg hover:shadow-red-400/40 overflow-hidden group text-center"
            >
              <span className="relative z-10">
                {currentLang === 'bn' ? 'বুক করুন' : 'Book Now'}
              </span>
              <span className="absolute inset-0 bg-white/15 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() =>
                changeLanguage(i18n.language === 'bn' ? 'en' : 'bn')
              }
              className="text-xs font-extrabold bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-full text-secondary active:scale-95 transition-all"
            >
              {i18n.language === 'bn' ? 'EN' : 'বাং'}
            </button>

            <Link
              to="/book-now"
              className="bg-gradient-to-r from-primary to-red-600 text-white font-bold text-[10px] px-3 py-2 rounded-full shadow-md shadow-red-200 active:scale-95 transition-all"
            >
              {currentLang === 'bn' ? 'বুক করুন' : 'Book Now'}
            </Link>

            {/* Auth Check */}
            {token ? (
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="active:scale-95 transition-transform"
              >
                <img
                  src={userImage || defaultAvatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-primary bg-gray-100"
                />
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-primary to-red-600 text-white font-bold text-[10px] px-3 py-2 rounded-full shadow-md shadow-red-200 active:scale-95 transition-all"
              >
                {currentLang === 'bn' ? 'লগইন' : 'Login'}
              </Link>
            )}

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-secondary hover:text-primary focus:outline-none p-2 rounded-lg hover:bg-red-50/60 transition-colors"
            >
              <motion.div
                animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <HiX className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden shadow-inner"
          >
            <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
              {/* 🔒 Mobile Drawer-এর শীর্ষে প্রোফাইল কার্ড এবং লগআউট বাটন */}
              {token && (
                <div className="flex items-center justify-between p-3 bg-gray-50/80 rounded-xl mb-3 border border-gray-100">
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5"
                  >
                    <img
                      src={userImage || defaultAvatar}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover border border-primary bg-gray-100"
                    />
                    <span className="text-sm font-bold text-secondary hover:text-primary transition-colors">
                      {currentLang === 'bn'
                        ? 'আমার ড্যাশবোর্ড'
                        : 'My Dashboard'}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-xs bg-red-50 text-primary border border-red-100 px-3 py-1.5 rounded-lg font-bold"
                  >
                    <FiLogOut />
                    {currentLang === 'bn' ? 'আউট' : 'Logout'}
                  </button>
                </div>
              )}

              {/* Mobile Categories Dynamic Menu */}
              <div>
                <button
                  disabled={loading}
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="w-full flex justify-between items-center px-4 py-3 rounded-xl text-base font-medium text-secondary hover:bg-red-50 hover:text-primary transition-all disabled:opacity-50"
                >
                  <span>
                    {loading
                      ? currentLang === 'bn'
                        ? 'লোড হচ্ছে...'
                        : 'Loading...'
                      : currentLang === 'bn'
                        ? 'ক্যাটাগরি'
                        : 'Categories'}
                  </span>
                  {!loading && (
                    <motion.span
                      animate={{ rotate: isMobileServicesOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-xs opacity-60"
                    >
                      ▼
                    </motion.span>
                  )}
                </button>
                {isMobileServicesOpen && !loading && servicesData && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="pl-4 mt-1 py-2 space-y-2 max-h-[350px] overflow-y-auto"
                  >
                    {Object.keys(servicesData).map(key => {
                      const item = servicesData[key];
                      return (
                        <div
                          key={key}
                          className="space-y-1 py-1 bg-gray-50/60 rounded-xl p-2"
                        >
                          <div className="flex items-center gap-2 px-2 py-1 text-xs font-black uppercase tracking-wider text-gray-500">
                            <span className="w-7 h-7 rounded-lg bg-primary text-white flex items-center justify-center text-sm shadow-sm shadow-red-200">
                              {ICON_MAP[key] || <FiSettings />}
                            </span>
                            <span>{item.category?.[currentLang]}</span>
                          </div>
                          <div className="pl-2 flex flex-col gap-0.5">
                            {item.services?.map((service, index) => (
                              <Link
                                key={index}
                                to={`/mistries?categoryKey=${encodeURIComponent(key)}&specificService=${encodeURIComponent(service.en)}`}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-primary rounded-lg hover:bg-white transition-colors"
                              >
                                • {service[currentLang]}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </div>

              <Link
                to="/join-mistry"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-medium text-secondary hover:bg-red-50 hover:text-primary transition-all"
              >
                {currentLang === 'bn' ? 'মিস্ত্রি হোন' : 'Join as Mistry'}
              </Link>

              <Link
                to="/services"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-medium text-secondary hover:bg-red-50 hover:text-primary transition-all"
              >
                {currentLang === 'bn' ? 'সকল সার্ভিস' : 'All Services'}
              </Link>

              {/* Mobile Help Menu */}
              <div>
                <button
                  onClick={() => setIsMobileHelpOpen(!isMobileHelpOpen)}
                  className="w-full flex justify-between items-center px-4 py-3 rounded-xl text-base font-medium text-secondary hover:bg-red-50 hover:text-primary transition-all"
                >
                  <span>{currentLang === 'bn' ? 'সাহায্য' : 'Help'}</span>
                  <motion.span
                    animate={{ rotate: isMobileHelpOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs opacity-60"
                  >
                    ▼
                  </motion.span>
                </button>
                {isMobileHelpOpen && (
                  <div className="pl-4 mt-1 py-1 space-y-0.5 bg-gray-50/60 rounded-xl">
                    {helpLinks.map((help, idx) => (
                      <Link
                        key={idx}
                        to={help.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-white font-medium rounded-lg transition-colors"
                      >
                        <span className="text-primary text-base">
                          {help.icon}
                        </span>
                        {currentLang === 'bn' ? help.bn : help.en}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-base font-medium text-secondary hover:bg-red-50 hover:text-primary transition-all"
              >
                {currentLang === 'bn' ? 'ব্লগ' : 'Blog'}
              </Link>

              {/* Mobile More Links Menu */}
              <div>
                <button
                  onClick={() => setIsMobileCompanyOpen(!isMobileCompanyOpen)}
                  className="w-full flex justify-between items-center px-4 py-3 rounded-xl text-base font-medium text-secondary hover:bg-red-50 hover:text-primary transition-all"
                >
                  <span>{currentLang === 'bn' ? 'আরও' : 'More'}</span>
                  <motion.span
                    animate={{ rotate: isMobileCompanyOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs opacity-60"
                  >
                    ▼
                  </motion.span>
                </button>
                {isMobileCompanyOpen && (
                  <div className="pl-4 mt-1 py-1 space-y-0.5 bg-gray-50/60 rounded-xl">
                    {moreLinks.map((company, idx) => (
                      <Link
                        key={idx}
                        to={company.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-secondary hover:text-primary hover:bg-white font-medium rounded-lg transition-colors"
                      >
                        <span className="text-primary text-base">
                          {company.icon}
                        </span>
                        {currentLang === 'bn' ? company.bn : company.en}
                      </Link>
                    ))}
                    <div className="flex items-center gap-3 py-3 px-4 justify-center border-t border-gray-200 mt-2">
                      {socialMedia.map((social, idx) => (
                        <a
                          key={idx}
                          href={social.url}
                          target="_blank"
                          rel="noreferrer"
                          className="w-10 h-10 bg-white border border-gray-200 text-secondary text-lg flex items-center justify-center rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all"
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
