import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  FiUserPlus,
  FiFileText,
  FiCheckCircle,
  FiShield,
  FiArrowRight,
  FiSmartphone,
  FiBriefcase,
  FiDollarSign,
} from 'react-icons/fi';

const HowToJoinMechanic = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const steps = [
    {
      id: '01',
      icon: <FiFileText className="text-amber-400 text-xl" />,
      title: { en: 'Fill the Application', bn: '১. আবেদন ফরম পূরণ করুন' },
      desc: {
        en: 'Click on the Join as Mistry button and provide your valid name, phone, experience, and service category.',
        bn: '"মিস্ত্রি হোন" বাটনে ক্লিক করে আপনার সঠিক নাম, মোবাইল নম্বর, কাজের অভিজ্ঞতা এবং সার্ভিস ক্যাটাগরি সিলেক্ট করুন।',
      },
    },
    {
      id: '02',
      icon: <FiShield className="text-blue-400 text-xl" />,
      title: {
        en: 'NID & Face Verification',
        bn: '২. এনআইডি ও ফেস ভেরিফিকেশন',
      },
      desc: {
        en: 'Upload a clear picture of your National ID card (Front & Back) along with a clean face image for security check.',
        bn: 'নিরাপত্তা নিশ্চিত করতে আপনার জাতীয় পরিচয়পত্রের (NID) এপিঠ-ওপিঠ এবং নিজের একটি পরিষ্কার ছবি আপলোডের মাধ্যমে ভেরিফাই করুন।',
      },
    },
    {
      id: '03',
      icon: <FiSmartphone className="text-purple-400 text-xl" />,
      title: { en: 'Admin Review & Call', bn: '৩. অ্যাডমিন রিভিউ ও কল' },
      desc: {
        en: 'Our support desk will verify your submitted papers and call you within 24 hours for a quick phone onboarding.',
        bn: 'আমাদের ব্যাক-অফিস টিম আপনার কাগজপত্র ২৪ ঘণ্টার মধ্যে যাচাই করে ওরিয়েন্টেশনের জন্য সরাসরি ফোনে কল দেবে।',
      },
    },
    {
      id: '04',
      icon: <FiCheckCircle className="text-emerald-400 text-xl" />,
      title: { en: 'Go Live & Earn', bn: '৪. অ্যাক্টিভ হোন ও আয় করুন' },
      desc: {
        en: 'Once approved, your account badge shifts to Verified. Start receiving real-time automated client booking orders.',
        bn: 'অ্যাকাউন্ট ভেরিফাইড হওয়ামাত্রই অ্যাপে আইডি সচল হবে। সরাসরি রিয়েল-টাইম কাস্টমারদের বুকিং পেয়ে আয় করা শুরু করুন!',
      },
    },
  ];

  const perks = [
    {
      icon: <FiDollarSign className="text-emerald-400 text-xl" />,
      title: { en: 'Automated 10-Min Payout', bn: '১০ মিনিটে অটো পেমেন্ট' },
      desc: {
        en: 'No middleman. Customer payment reaches your wallet instantly.',
        bn: 'কোনো ঝামেলা ছাড়াই কাজ শেষ হওয়ার ১০ মিনিটের মধ্যে আপনার টাকা আপনার পার্সোনাল ওয়ালেটে চলে যাবে।',
      },
    },
    {
      icon: <FiBriefcase className="text-blue-400 text-xl" />,
      title: { en: 'Regular Work Volume', bn: 'প্রচুর কাজের সুযোগ' },
      desc: {
        en: 'Get daily multiple booking requests from your nearby local areas.',
        bn: 'আপনার নিজের এলাকার আশেপাশে প্রতিদিন একাধিক কাস্টমারের সরাসরি বুকিং রিকোয়েস্ট পাবেন।',
      },
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-20 px-4 relative overflow-hidden flex items-center justify-center">
      {/* Background Neon Effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10 space-y-16">
        {/* Top Header Section */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <FiUserPlus className="text-3xl" />
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-amber-400 leading-tight pt-2">
            {currentLang === 'bn'
              ? 'কীভাবে "আমার মিস্ত্রি" তে যোগ দেবেন?'
              : 'How to Join as a Mechanic'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            {currentLang === 'bn'
              ? 'খুব সহজ ৪টি ধাপে আমাদের ভেরিফাইড টেকনিশিয়ান নেটওয়ার্কে যুক্ত হয়ে স্বাধীনভাবে প্রতিদিন সম্মানজনক আয় করুন। নিচে পুরো প্রক্রিয়াটি সহজভাবে তুলে ধরা হলো।'
              : 'Become a part of Bangladesh’s premium on-demand infrastructure. Follow our 4-step streamlined onboarding process.'}
          </p>
        </div>

        {/* 4 Steps Timeline Visual Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(step => (
            <div
              key={step.id}
              className="p-6 sm:p-8 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md relative group hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-5">
                {/* Step Number & Icon */}
                <div className="flex justify-between items-center">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xl shrink-0 shadow-inner">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-black text-slate-800/60 select-none group-hover:text-amber-500/30 transition-colors duration-300">
                    {step.id}
                  </span>
                </div>
                {/* Step Text Content */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-wide">
                    {step.title[currentLang]}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                    {step.desc[currentLang]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Why Choose Us Perks Section */}
        <div className="max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900/20 border border-slate-800/60 backdrop-blur-sm space-y-8 shadow-xl">
          <h3 className="text-center text-sm font-extrabold uppercase tracking-widest text-slate-400">
            {currentLang === 'bn'
              ? 'আমাদের সাথে কাজ করার বিশেষ সুবিধা'
              : 'Platform Benefits For Technicians'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {perks.map((perk, i) => (
              <div
                key={i}
                className="flex gap-4 items-start bg-slate-950/40 p-4 rounded-xl border border-slate-900"
              >
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
                  {perk.icon}
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-200">
                    {perk.title[currentLang]}
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {perk.desc[currentLang]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Call To Action Button Section */}
        <div className="text-center pt-4 space-y-4">
          <Link
            to="/join-mistry"
            className="inline-flex items-center gap-3 px-10 py-4.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-widest rounded-xl transition-all duration-300 shadow-2xl shadow-amber-500/20 group hover:scale-[1.02]"
          >
            <span>
              {currentLang === 'bn' ? 'মিস্ত্রি হোন' : 'Join as Mistry Now'}
            </span>
            <FiArrowRight className="text-base group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
          <p className="text-xs text-slate-500">
            {currentLang === 'bn'
              ? '* অনলাইন আবেদন ফরমটি সাবমিট করতে আপনার স্মার্টফোন এবং সচল এনআইডি কার্ড সাথে রাখুন।'
              : '* Keep your smartphone and valid NID ready before applying.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowToJoinMechanic;
