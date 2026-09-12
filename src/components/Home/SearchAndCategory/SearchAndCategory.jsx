import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiCpu,
  FiTool,
  FiLayers,
  FiWind,
  FiTv,
  FiX,
  FiCornerDownRight,
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SearchAndCategory = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const currentLang = i18n.language === 'en' ? 'en' : 'bn';

  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  //
  const quickCategories = [
    {
      id: 'Electrician',
      categoryKey: 'electricalElectronics',
      bn: 'ইলেকট্রিশিয়ান',
      en: 'Electrician',
      icon: <FiCpu />,
    },
    {
      id: 'Plumber',
      categoryKey: 'constructionCivil',
      bn: 'প্লাম্বার',
      en: 'Plumber',
      icon: <FiTool />,
    },
    {
      id: 'Carpenter',
      categoryKey: 'constructionCivil',
      bn: 'কাঠমিস্ত্রি',
      en: 'Carpenter',
      icon: <FiLayers />,
    },
    {
      id: 'AC Technician',
      categoryKey: 'hvacHomeAppliances',
      bn: 'এসি মেকানিক',
      en: 'AC Mechanic',
      icon: <FiWind />,
    },
    {
      id: 'Refrigerator Technician',
      categoryKey: 'hvacHomeAppliances',
      bn: 'হোম অ্যাপ্লায়েন্স',
      en: 'Home Appliance',
      icon: <FiTv />,
    },
  ];

  //
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredServices([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${(process.env.NEXT_PUBLIC_API_URL || "/api")}/services/search?q=${encodeURIComponent(searchQuery)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setFilteredServices(data);
        }
      } catch (error) {
        console.error('Search query operation failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  //
  const handleSearchSubmit = e => {
    e.preventDefault();
    if (!searchQuery.trim() || filteredServices.length === 0) return;

    const bestMatch = filteredServices[0];
    const targetService = bestMatch.nameEn || bestMatch.en || bestMatch.id;
    const targetCategory = bestMatch.categoryKey || '';

    navigate(
      `/mistries?categoryKey=${encodeURIComponent(targetCategory)}&specificService=${encodeURIComponent(targetService)}`,
    );
    setIsOpen(false);
    setSearchQuery('');
  };

  //
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24 px-4 border-b border-slate-900">
      <div className="max-w-4xl mx-auto flex flex-col items-center space-y-8">
        {/* টাইটেল হেডার */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            {currentLang === 'bn'
              ? 'আপনার প্রয়োজনীয় সার্ভিসটি বেছে নিন'
              : 'Find the Professional Service You Need'}
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            {currentLang === 'bn'
              ? '৭৩+ এরও বেশি ক্যাটাগরি থেকে যেকোনো সমস্যা সার্চ করুন বাংলা বা ইংলিশে'
              : 'Search across 73+ specializations in Bangla, English or Banglish'}
          </p>
        </div>

        {/*  */}
        <div ref={dropdownRef} className="w-full relative max-w-2xl z-40">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl shadow-2xl transition-all p-1 overflow-hidden group"
          >
            <div className="flex-1 flex items-center bg-transparent px-4">
              <FiSearch className="text-slate-500 text-xl flex-shrink-0 group-hover:text-amber-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={
                  currentLang === 'bn'
                    ? 'খুঁজুন ফ্যান, লাইট, এসি মেকানিক, পাইপ লাইন...'
                    : 'Search Fan, Light, AC Mechanic, Plumber...'
                }
                className="w-full py-4 px-3 text-white placeholder-slate-500 font-medium bg-transparent focus:outline-none text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setFilteredServices([]);
                  }}
                  className="text-slate-500 hover:text-white transition-colors p-1 bg-slate-800/50 hover:bg-slate-800 rounded-2xl"
                >
                  <FiX className="text-base" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 font-black text-xs uppercase tracking-widest px-8 py-4 transition-all rounded-full border-none shadow-lg shadow-orange-500/10 text-white"
            >
              {currentLang === 'bn' ? 'খুঁজুন' : 'Search'}
            </button>
          </form>

          {/*  */}
          <AnimatePresence>
            {isOpen && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[108%] left-0 w-full bg-slate-900/95 border border-slate-800/80 shadow-2xl max-h-72 overflow-y-auto rounded-3xl backdrop-blur-xl p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center py-8 gap-3 text-slate-400 text-sm font-semibold">
                    <span className="loading loading-spinner loading-sm text-amber-500"></span>
                    <span>
                      {currentLang === 'bn'
                        ? 'খোঁজা হচ্ছে...'
                        : 'Searching master catalog...'}
                    </span>
                  </div>
                ) : filteredServices.length > 0 ? (
                  filteredServices.map((service, idx) => {
                    const sName = service.nameEn || service.en || service.id;
                    const cKey = service.categoryKey || '';
                    return (
                      <Link
                        key={idx}
                        to={`/mistries?categoryKey=${encodeURIComponent(cKey)}&specificService=${encodeURIComponent(sName)}`}
                        onClick={() => {
                          setSearchQuery('');
                          setIsOpen(false);
                        }}
                        className="flex items-center justify-between px-4 py-3 hover:bg-slate-800/60 rounded-3xl text-slate-300 hover:text-white transition-all group border border-transparent hover:border-slate-800"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="text-slate-500 group-hover:text-amber-500 text-sm transition-colors">
                            <FiCornerDownRight />
                          </span>
                          <span className="text-sm font-semibold tracking-wide">
                            {currentLang === 'bn'
                              ? service.nameBn || service.bn
                              : service.nameEn || service.en}
                          </span>
                        </div>
                        {service.categoryName && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-xl text-slate-400">
                            {service.categoryName}
                          </span>
                        )}
                      </Link>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-sm font-semibold text-slate-500 flex flex-col items-center justify-center gap-1">
                    <p>
                      {currentLang === 'bn'
                        ? 'কোনো ক্যাটাগরি পাওয়া যায়নি'
                        : 'No matching specializations found'}
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/*  */}
        <div className="mt-4 w-full max-w-3xl space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">
            {currentLang === 'bn'
              ? 'জরুরি ক্যাটাগরি সমূহ'
              : 'Quick Category Access'}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {quickCategories.map((category, idx) => (
              <Link
                key={category.id || idx}
                to={`/mistries?categoryKey=${encodeURIComponent(category.categoryKey)}&specificService=${encodeURIComponent(category.id)}`}
                className="flex flex-col items-center justify-center p-5 bg-slate-900/40 border border-slate-900 hover:border-amber-500/50 hover:bg-slate-900 rounded-3xl transition-all duration-300 text-center group active:scale-95 shadow-xl hover:shadow-amber-500/5"
              >
                <div className="text-2xl text-slate-500 group-hover:text-amber-500 group-hover:scale-110 transition-all mb-3">
                  {category.icon}
                </div>
                <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors tracking-wide">
                  {currentLang === 'bn' ? category.bn : category.en}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAndCategory;
