import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiArrowLeft, FiUser } from 'react-icons/fi';
import axios from 'axios';

const ServiceDetails = () => {
  const { categoryKey } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'bn';

  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${(process.env.NEXT_PUBLIC_API_URL || "/api")}/services`)
      .then(res => {
        const data = res.data;
        const rootObject = Array.isArray(data) ? data[0] : data;

        if (rootObject && rootObject[categoryKey]) {
          setCategoryData(rootObject[categoryKey]);
        }
      })
      .catch(err => {
        console.error('Error fetching service details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoryKey]);

  if (loading) {
    return (
      <div className="bg-[#0c111d] min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-yellow-500"></span>
      </div>
    );
  }

  if (!categoryData) {
    return (
      <div className="bg-[#0c111d] min-h-screen text-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">
          {currentLang === 'en'
            ? 'Service Not Found'
            : 'সেবাটি খুঁজে পাওয়া যায়নি'}
        </h2>
        <button
          onClick={() => navigate('/services')}
          className="btn btn-warning"
        >
          {currentLang === 'en' ? 'Back to Services' : 'সেবাসমূহতে ফিরে যান'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0c111d] min-h-screen text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2 text-slate-400 hover:text-yellow-500 transition-colors mb-8 group"
        >
          <FiArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>{currentLang === 'en' ? 'Back to Services' : 'পেছনে যান'}</span>
        </button>

        {/* Header */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 mb-8">
          <span className="text-yellow-500 text-xs font-bold uppercase tracking-widest block mb-2">
            {currentLang === 'en' ? 'Category Details' : 'ক্যাটাগরি বিবরণ'}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {categoryData.category?.[currentLang]}
          </h1>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            {currentLang === 'en'
              ? `Find the best professional mechanics for ${categoryData.category?.en} services.`
              : `${categoryData.category?.bn} সার্ভিসের জন্য সেরা পেশাদার মিস্ত্রি খুঁজুন।`}
          </p>
        </div>

        {/*  Sub-categories List */}
        <h2 className="text-xl font-bold mb-6 text-slate-300">
          {currentLang === 'en'
            ? 'Available Specialists'
            : 'উপলব্ধ বিশেষজ্ঞ মিস্ত্রিরা'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryData.services?.map((service, idx) => (
            <div
              key={idx}
              className="bg-slate-900/40 border border-slate-800/50 hover:border-slate-700/80 rounded-2xl p-5 flex items-center justify-between group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-slate-800/80 text-yellow-500 rounded-xl">
                  <FiUser className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-yellow-500 transition-colors">
                    {service[currentLang]}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentLang === 'en'
                      ? 'Verified Mechanic'
                      : 'ভেরিফাইড মিস্ত্রি'}
                  </p>
                </div>
              </div>

              {/* btn */}
              <button
                onClick={() => navigate(`/services/sub/${service.en}`)}
                className="btn btn-sm bg-slate-800 hover:bg-yellow-500 text-slate-300 hover:text-slate-950 border-none rounded-xl"
              >
                {currentLang === 'en' ? 'View All' : 'সব দেখুন'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
