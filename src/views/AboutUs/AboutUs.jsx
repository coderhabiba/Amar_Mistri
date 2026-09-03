import { useTranslation } from 'react-i18next';
import {
  FiInfo,
  FiTarget,
  FiAward,
  FiShield,
  FiTrendingUp,
  FiHeart,
} from 'react-icons/fi';

const AboutUs = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const stats = [
    {
      id: 1,
      value: { en: '100%', bn: '১০০%' },
      label: { en: 'Verified Profiles', bn: 'যাচাইকৃত প্রোফাইল' },
    },
    {
      id: 2,
      value: { en: '5-10 minutes', bn: '৫-১০ মি.' },
      label: { en: 'Auto Payout', bn: 'অটোমেটিক পেমেন্ট' },
    },
    {
      id: 3,
      value: { en: '24/7', bn: '২৪/৭' },
      label: { en: 'Helpline Support', bn: 'হেল্পলাইন সাপোর্ট' },
    },
  ];

  const coreValues = [
    {
      id: 1,
      icon: <FiShield className="text-amber-400" />,
      title: { en: 'Uncompromising Safety', bn: 'সর্বোচ্চ নিরাপত্তা' },
      desc: {
        en: 'With mandatory NID checks, live face scanning, and real-time location tracking, your safety is always our baseline.',
        bn: 'বাধ্যতামূলক এনআইডি ভেরিফিকেশন, লাইভ ফেস স্ক্যান এবং রিয়েল-টাইম লোকেশন ট্র্যাকিংয়ের মাধ্যমে আমরা উভয় পক্ষের সর্বোচ্চ নিরাপত্তা নিশ্চিত করি।',
      },
    },
    {
      id: 2,
      icon: <FiAward className="text-blue-400" />,
      title: { en: 'Skilled Professionals', bn: 'দক্ষ ও পেশাদার মিস্ত্রি' },
      desc: {
        en: 'We bring verified, experienced, and well-behaved local experts straight to your doorstep for any technical issue.',
        bn: 'যেকোনো কারিগরি সমস্যার সমাধানের জন্য আমরা অভিজ্ঞ, যাচাইকৃত এবং পেশাদার স্থানীয় টেকনিশিয়ানদের আপনার দরজায় পৌঁছে দিই।',
      },
    },
    {
      id: 3,
      icon: <FiTrendingUp className="text-emerald-400" />,
      title: { en: 'Transparent Transactions', bn: 'স্বচ্ছ আর্থিক লেনদেন' },
      desc: {
        en: 'No hidden costs. Customers pay official service charges, and technicians receive their hard-earned money within 10 minutes via automated systems.',
        bn: 'কোনো লুকানো খরচ নেই। গ্রাহকরা অফিসিয়াল সার্ভিস চার্জ প্রদান করেন এবং আমাদের অটোমেটিক সফটওয়্যারের মাধ্যমে মিস্ত্রিরা ১০ মিনিটে পারিশ্রমিক পেয়ে যান।',
      },
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-16 px-4 relative overflow-hidden flex items-center justify-center">
      {/* Background Neon Blur Effects */}
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <FiInfo className="text-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-amber-400">
            {currentLang === 'bn' ? 'আমাদের সম্পর্কে' : 'About Amar Mistri'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'bn'
              ? 'নিরাপত্তা ও দক্ষতার সাথে বাংলাদেশের প্রতিটি ঘরে বিশ্বস্ত স্থানীয় টেকনিশিয়ান ও মিস্ত্রিদের পৌঁছে দেওয়াই আমাদের লক্ষ্য।'
              : 'Connecting trusted local technicians with households across Bangladesh safely and efficiently.'}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Mission & Vision*/}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            {/* Mission */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
                <FiTarget />
              </div>
              <h2 className="text-lg font-bold text-slate-200">
                {currentLang === 'bn'
                  ? 'আমাদের লক্ষ্য (Mission)'
                  : 'Our Mission'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {currentLang === 'bn'
                  ? 'একটি আধুনিক ও নিরাপদ টেকনোলজি প্ল্যাটফর্ম তৈরির মাধ্যমে গ্রাহকদের ঝামেলাহীন হোম-সার্ভিস দেওয়া এবং স্থানীয় দক্ষ টেকনিশিয়ানদের জন্য সম্মানজনক ও তাৎক্ষণিক আয়ের কর্মসংস্থান সৃষ্টি করা।'
                  : 'To provide hassle-free home services to customers through a secure tech platform while creating honorable and instant-earning opportunities for skilled local technicians.'}
              </p>
            </div>

            {/* Vision */}
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-lg">
                <FiHeart />
              </div>
              <h2 className="text-lg font-bold text-slate-200">
                {currentLang === 'bn'
                  ? 'আমাদের দূরদৃষ্টি (Vision)'
                  : 'Our Vision'}
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                {currentLang === 'bn'
                  ? 'বাংলাদেশের অন-ডিমান্ড সার্ভিস সেক্টরে সবচেয়ে নির্ভরযোগ্য, নিরাপদ এবং স্বয়ংক্রিয় "মিস্ত্রি ও টেকনিশিয়ান নেটওয়ার্ক" হিসেবে নিজেদের প্রতিষ্ঠিত করা, যেখানে প্রতিটি লেনদেন হবে স্বচ্ছ ও দ্রুত।'
                  : 'To become the most trusted, secure, and automated on-demand service platform in Bangladesh, ensuring complete transparency and safety for both service seekers and providers.'}
              </p>
            </div>
          </div>

          {/* Platform Showcasing Image */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="relative group rounded-2xl overflow-hidden border border-slate-800 p-2 bg-slate-900/20 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40 z-10 pointer-events-none" />
              <img
                src="https://i.ibb.co.com/vxwXfqmD/Gemini-Generated-Image-xnq89wxnq89wxnq8.png"
                alt="Amar Mistri Services"
                className="w-full h-[320px] sm:h-[400px] lg:h-[380px] object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Outer soft shadow/glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 to-primary/10 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500 -z-10" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-4 py-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl p-6 text-center backdrop-blur-sm">
          {stats.map(stat => (
            <div key={stat.id} className="space-y-1">
              <h3 className="text-xl sm:text-3xl font-black text-amber-400 tracking-tight">
                {stat.value[currentLang]}
              </h3>
              <p className="text-slate-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">
                {stat.label[currentLang]}
              </p>
            </div>
          ))}
        </div>

        {/* Core Values Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-extrabold tracking-wide text-slate-200">
              {currentLang === 'bn' ? 'আমরা কেন সেরা?' : 'Why Choose Us?'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {coreValues.map(value => (
              <div
                key={value.id}
                className="p-5 rounded-xl bg-slate-900/20 border border-slate-800/50 hover:border-slate-700/60 transition-all duration-300 flex flex-col gap-3 items-center text-center group"
              >
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xl group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-sm font-bold text-slate-200 tracking-wide">
                    {value.title[currentLang]}
                  </h4>
                  <p className="text-slate-400 text-[11px] sm:text-xs leading-relaxed">
                    {value.desc[currentLang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
