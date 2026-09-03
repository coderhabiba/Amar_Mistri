import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiDroplet, FiHome, FiArrowRight, FiSettings } from 'react-icons/fi';
import { FaBolt, FaHammer } from 'react-icons/fa6';
import axios from 'axios';

const getIcon = categoryKey => {
  const key = categoryKey?.toLowerCase();
  if (key?.includes('electrical'))
    return <FaBolt className="w-8 h-8 text-yellow-500" />;
  if (key?.includes('plumbing') || key?.includes('construction'))
    return <FiDroplet className="w-8 h-8 text-blue-500" />;
  if (key?.includes('renovation') || key?.includes('mechanical'))
    return <FaHammer className="w-8 h-8 text-orange-500" />;
  if (key?.includes('appliances') || key?.includes('hvac'))
    return <FiHome className="w-8 h-8 text-emerald-500" />;
  return <FiSettings className="w-8 h-8 text-slate-400" />;
};

const Services = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'bn';

  useEffect(() => {
    axios
      .get(`${(process.env.NEXT_PUBLIC_API_URL || "/api")}/services`)
      .then(res => {
        const data = res.data;

        // মঙ্গোডিবি থেকে যদি অ্যারে আকারে পুরো অবজেক্টটি আসে (যেমন: [ { _id, electricalElectronics, ... } ])
        const rootObject = Array.isArray(data) ? data[0] : data;

        if (rootObject && typeof rootObject === 'object') {
          // অবজেক্টের কী-গুলো (যেমন: electricalElectronics) থেকে লুপ চালিয়ে অ্যারে তৈরি করা
          const formattedCategories = Object.keys(rootObject)
            .filter(key => key !== '_id') // _id বাদ দিয়ে শুধু ক্যাটাগরিগুলো নেওয়া
            .map(key => ({
              categoryKey: key,
              title: rootObject[key].category, // { en: "...", bn: "..." }
              subCategories: rootObject[key].services, // [ { en: "...", bn: "..." }, ... ]
            }));

          setCategories(formattedCategories);
        } else {
          setCategories([]);
        }
      })
      .catch(err => {
        console.error('Error fetching categories:', err);
        setCategories([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0c111d] min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-yellow-500"></span>
      </div>
    );
  }

  return (
    <div className="bg-[#0c111d] min-h-screen text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <p className="text-yellow-500 text-xs sm:text-sm font-bold uppercase tracking-[0.2em]">
            {currentLang === 'en' ? 'Our Expertise' : 'আমাদের সেবাসমূহ'}
          </p>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
            {currentLang === 'en'
              ? 'All Handyman Services'
              : 'সব ধরনের মিস্ত্রি ও সেবা'}
          </h1>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map(category => (
            <motion.div
              key={category.categoryKey}
              whileHover={{ y: -5 }}
              className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition-all duration-300"
            >
              <div>
                {/* Header Row */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700/30">
                    {getIcon(category.categoryKey)}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {category.title?.[currentLang] || category.categoryKey}
                    </h2>
                  </div>
                </div>

                <hr className="border-slate-800/80 my-5" />

                {/* Sub Categories */}
                <div className="mb-6">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
                    {currentLang === 'en'
                      ? 'Sub Categories'
                      : 'উপ-ক্যাটাগরিসমূহ'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {category.subCategories?.map((sub, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-slate-300 text-sm bg-slate-800/30 px-3 py-2 rounded-xl border border-slate-800/50"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" />
                        <span className="truncate">{sub[currentLang]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/services/${category.categoryKey}`)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 group"
              >
                <span>
                  {currentLang === 'en' ? 'Find Mechanics' : 'মিস্ত্রি খুঁজুন'}
                </span>
                <FiArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
