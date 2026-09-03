import { useTranslation } from 'react-i18next';
import { FiCheckCircle } from 'react-icons/fi';

const AppPromotion = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'en' ? 'en' : 'bn';

  const features = [
    {
      bn: 'এক ক্লিকেই ভেরিফাইড মিস্ত্রি বুকিং',
      en: 'Verified Mistry booking in one click',
    },
    {
      bn: 'লাইভ লোকেশন ট্র্যাকিং',
      en: 'Real-time live location',
    },
    {
      bn: 'নিরাপদ ডিজিটাল পেমেন্ট',
      en: 'Secure digital payment',
    },
  ];

  return (
    <div
      id="download-section"
      className="bg-[#0c111d] py-20 md:py-28 border-b border-slate-900 relative overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      {/* Background Neon Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] bg-gradient-to-tr from-yellow-500/10 to-orange-600/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
        <div className="space-y-6 relative z-10">
          {/* Badge */}
          <div className="">
            <span className="text-[11px] text-left uppercase font-black bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-950 px-4 py-1.5 tracking-widest rounded-full shadow-lg shadow-yellow-500/10">
              {currentLang === 'bn'
                ? 'স্মার্ট মোবাইল অ্যাপ'
                : 'DOWNLOAD OUR APP'}
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl text-left md:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
            {currentLang === 'bn' ? (
              <>
                আপনার হাতের মুঠোয় সব <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  হোম সার্ভিস
                </span>{' '}
                সমাধান
              </>
            ) : (
              <>
                Get All{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Home Solutions
                </span>{' '}
                Right at Your Fingertips
              </>
            )}
          </h2>

          {/* Features Chips */}
          <div className="gap-3 sm:gap-4 pt-3 max-w-4xl mx-auto">
            {features.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-slate-30 px-4 py-2 rounded-2xl shadow-sm transition-all duration-300"
              >
                <FiCheckCircle className="text-yellow-500 w-4 h-4 flex-shrink-0" />
                <span>{currentLang === 'bn' ? f.bn : f.en}</span>
              </div>
            ))}
          </div>

          {/* App Stores Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <a
              href="#playstore"
              className="transform transition-all duration-300 hover:scale-105 active:scale-98 hover:shadow-xl hover:shadow-yellow-500/5 rounded-xl overflow-hidden"
            >
              <img
                src="https://i.ibb.co.com/RGdQqkb8/play-store-badge.jpg"
                alt="Google Play"
                className="h-12 w-auto object-contain rounded-xl border border-slate-800"
              />
            </a>
            <a
              href="#appstore"
              className="transform transition-all duration-300 hover:scale-105 active:scale-98 hover:shadow-xl hover:shadow-orange-500/5 rounded-xl overflow-hidden"
            >
              <img
                src="https://i.ibb.co.com/QvsbhNdL/app-store-badge.jpg"
                alt="App Store"
                className="h-12 w-auto object-contain rounded-xl border border-slate-800"
              />
            </a>
          </div>
        </div>

        {/* App Phone Mockup Presentation Image */}
        <div className="max-w-lg mx-auto mt-14 relative z-10 flex justify-center group">
          <div className="relative">
            {/* Subtle glow behind the image on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

            <img
              src="https://i.ibb.co.com/z149VD3/app.png"
              alt="App Dashboard Presentation"
              className="relative z-10 w-auto object-contain transform transition-transform duration-700 ease-out group-hover:translate-y-[-8px]"
              onError={e => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<div class="w-full h-[140px] border-t border-dashed border-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 uppercase tracking-widest">[ PHONE MOCKUP ILLUSTRATION IMAGE ]</div>`;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPromotion;
