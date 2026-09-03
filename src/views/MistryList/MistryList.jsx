import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';
import MistriCard from './../../components/MistriCard/MistriCard';
import { useTranslation } from 'react-i18next';

const TRANSLATIONS = {
  noExpert: {
    en: 'No approved expert found for this service at this moment.',
    bn: 'এই মুহূর্তে এই সার্ভিসের জন্য কোনো ভেরিভাইড মিস্ট্রি পাওয়া যায়নি।',
  },
  loadingText: {
    en: 'Searching for the best experts near you...',
    bn: 'আপনার নিকটস্থ সেরা মিস্ট্রি খোঁজা হচ্ছে...',
  },
};

const MistryList = () => {
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const [mistries, setMistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const rawCategoryKey = searchParams.get('categoryKey');
  const rawSpecificService = searchParams.get('specificService');

  const categoryKey = rawCategoryKey ? decodeURIComponent(rawCategoryKey) : '';
  const specificService = rawSpecificService
    ? decodeURIComponent(rawSpecificService)
    : '';

  const bookingInfo = {
    categoryKey: categoryKey,
    categoryName: searchParams.get('categoryName'),
    specificService: specificService,
    date: searchParams.get('date'),
    timeSlot: searchParams.get('timeSlot'),
    name: searchParams.get('name'),
    phone: searchParams.get('phone'),
    address: searchParams.get('address'),
    notes: searchParams.get('notes'),
  };

  const currentLang = i18n.language === 'en' ? 'en' : 'bn';

  useEffect(() => {
    const fetchMistries = async () => {
      try {
        setLoading(true);
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "/api") || 'http://localhost:5000';

        const params = new URLSearchParams({
          categoryKey: categoryKey,
          specificService: specificService,
        });

        const response = await fetch(
          `${baseUrl}/mechanics?${params.toString()}`,
        );

        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setMistries(data);
      } catch (error) {
        console.error('Error fetching mistries:', error);
        setMistries([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryKey || specificService) {
      fetchMistries();
    } else {
      setLoading(false);
    }
  }, [categoryKey, specificService]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-6xl space-y-8 animate-pulse">
          <div className="h-8 bg-slate-900 rounded-lg w-1/3 mx-auto"></div>
          <div className="h-4 bg-slate-900 rounded-lg w-1/4 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {[1, 2].map(n => (
              <div
                key={n}
                className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-6 h-48"
              ></div>
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-6 font-medium">
          {TRANSLATIONS.loadingText[currentLang]}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-12 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-primary/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center md:text-left border-b border-slate-900 pb-6 mb-10">
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-100">
            {currentLang === 'en'
              ? 'Available Expert Category'
              : 'বিশেষজ্ঞ মিস্ত্রি ক্যাটাগরি'}{' '}
            :{' '}
            <span className="text-primary font-black">
              {specificService ||
                (currentLang === 'en' ? 'All Experts' : 'সকল টেকনিশিয়ান')}
            </span>
          </h1>
        </div>

        {mistries.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 bg-slate-900/20 border border-slate-900 rounded-3xl p-8 backdrop-blur-md">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center text-2xl mb-4 border border-amber-500/20">
              <FiAlertCircle />
            </div>
            <p className="text-slate-400 max-w-md text-sm md:text-base font-medium leading-relaxed">
              {TRANSLATIONS.noExpert[currentLang]}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 justify-items-center">
            {mistries.map(mistri => (
              <MistriCard
                key={mistri._id}
                mistri={mistri}
                currentLang={currentLang}
                bookingInfo={bookingInfo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MistryList;
