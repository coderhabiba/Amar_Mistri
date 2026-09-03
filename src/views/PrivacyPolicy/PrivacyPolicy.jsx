import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import {
  FiLock,
  FiDatabase,
  FiLayers,
  FiShare2,
  FiAlertOctagon,
  FiRefreshCw,
  FiCheckCircle, // Added check circle icon for the action button
} from 'react-icons/fi';

const PrivacyPolicy = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  // URL parsing configuration to intercept routing triggers from the master form
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isFromJoinForm = searchParams.get('redirect') === 'submit';

  const policyData = [
    {
      id: 1,
      icon: <FiDatabase className="text-blue-400" />,
      title: {
        en: 'Information We Collect',
        bn: '১. সংগৃহীত তথ্য (Information We Collect)',
      },
      desc: {
        en: 'We collect personal details (name, email, phone number, profile photo), real-time GPS location data to map nearby providers, transaction records via secure gateways, and verification documents (NID/Trade License for technicians).',
        bn: 'আমরা নিম্নলিখিত তথ্যগুলো সংগ্রহ করতে পারি: নাম, ইমেইল অ্যাড্রেস, ফোন নম্বর, প্রোফাইল ছবি; এলাকাভিত্তিক সেবার জন্য ডিভাইসের জিপিএস লোকেশন (GPS Location); সুরক্ষিত গেটওয়ের মাধ্যমে লেনদেনের পেমেন্ট তথ্য এবং টেকনিশিয়ানদের প্রমাণীকরণের জন্য জাতীয় পরিচয়পত্র (NID) বা ট্রেড লাইসেন্স।',
      },
    },
    {
      id: 2,
      icon: <FiLayers className="text-amber-400" />,
      title: {
        en: 'How We Use Your Information',
        bn: '২. তথ্যের ব্যবহার (How We Use Your Information)',
      },
      desc: {
        en: 'Your data is utilized to establish successful connections between customers and technicians, enhance overall service quality, deliver prompt customer support, and maintain robust infrastructure security against potential fraud.',
        bn: 'সংগৃহীত তথ্য গ্রাহক এবং টেকনিশিয়ানের মধ্যে সফলভাবে যোগাযোগ স্থাপন করতে, সেবার মান উন্নয়ন ও কাস্টমার সাপোর্ট প্রদান করতে এবং প্ল্যাটফর্মের সর্বোচ্চ নিরাপত্তা বজায় রাখাসহ যেকোনো প্রতারণা বা জালিয়াতি রোধ করতে ব্যবহার করা হয়।',
      },
    },
    {
      id: 3,
      icon: <FiShare2 className="text-teal-400" />,
      title: {
        en: 'Data Sharing Protocol',
        bn: '৩. তথ্য শেয়ারিং (Data Sharing)',
      },
      desc: {
        en: 'Necessary coordination data (name, contact, location) is mutually shared between the customer and provider for jobs. We do not sell data to third-party advertisers, but will comply with official requests from legal authorities under Bangladesh law.',
        bn: 'গ্রাহক ও টেকনিশিয়ানের মধ্যে কাজ সম্পন্ন করার সুবিধার্থে পারস্পরিক নাম, ফোন নম্বর ও লোকেশন শেয়ার করা হবে। কোনো থার্ড-পার্টি বা বিজ্ঞাপনী সংস্থার কাছে তথ্য বিক্রি বা লিক করা হয় না, তবে বাংলাদেশের প্রচলিত আইন অনুযায়ী আইন-শৃঙ্খলা রক্ষাকারী বাহিনীর অফিশিয়াল অনুরোধে তথ্য শেয়ার করা হতে পারে।',
      },
    },
    {
      id: 4,
      icon: <FiAlertOctagon className="text-rose-400" />,
      title: {
        en: 'Data Security Standards',
        bn: '৪. ডেটা সিকিউরিটি (Data Security)',
      },
      desc: {
        en: 'We implement advanced encryption models and modern security layers to protect your profile. Since no internet data transfer is absolute, users are expected to remain vigilant regarding their custom account access security.',
        bn: 'আপনার তথ্য সুরক্ষার জন্য আমরা এনক্রিপশন (Encryption) এবং আধুনিক সিকিউরিটি প্রোটোকল ব্যবহার করি। তবে ইন্টারনেটে ১০০% নিরাপত্তা দেওয়া অসম্ভব, তাই ব্যবহারকারীকেও নিজের অ্যাকাউন্ট সুরক্ষায় এবং পাসওয়ার্ড বা ওটিপি শেয়ারিংয়ের ক্ষেত্রে সচেতন থাকতে হবে।',
      },
    },
    {
      id: 5,
      icon: <FiRefreshCw className="text-purple-400" />,
      title: {
        en: 'Changes to Privacy Policy',
        bn: '৫. পলিসি পরিবর্তন ও কার্যকারিতা',
      },
      desc: {
        en: 'Amar Mistri authorities reserve the right to modify or restructure this Privacy Policy at any designated timeline. Updated parameters become directly functional as soon as they are published across our application channels.',
        bn: 'আমরা যেকোনো সময় এই Privacy Policy পরিবর্তন করার অধিকার সংরক্ষণ করি। পরিবর্তিত নতুন নীতিমালা অ্যাপ বা ওয়েবসাইটে প্রকাশিত হওয়ার সাথে সাথেই তা সরাসরি কার্যকর বলে গণ্য হবে।',
      },
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-16 px-4 relative overflow-hidden flex items-center justify-center">
      {/* Background Glowing Ambient Spheres */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-2">
            <FiLock className="text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-primary pt-2">
            {currentLang === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'bn'
              ? '"আমার মিস্ত্রি" আপনার তথ্যের সুরক্ষাকে সর্বোচ্চ অগ্রাধিকার দেয়। আমরা কীভাবে আপনার গোপনীয় তথ্য সংগ্রহ, ব্যবহার এবং সংরক্ষণ করি তা অনুগ্রহ করে নিচে মনোযোগ সহকারে দেখে নিন।'
              : '"Amar Mistri" priorities your data safety with premium standards. Explore below to understand exactly how we manage, protect, and safely process your operational details.'}
          </p>
        </div>

        {/* Structured Grid Component Box */}
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-8 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {policyData.map(item => (
              <div
                key={item.id}
                className={`p-5 rounded-xl bg-slate-950/50 border border-slate-800/60 hover:border-slate-700/80 transition-all duration-300 flex gap-4 items-start group shadow-inner ${
                  item.id === 5
                    ? 'md:col-span-2 md:max-w-md md:mx-auto w-full'
                    : ''
                }`}
              >
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-lg shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-slate-200 tracking-wide leading-snug">
                    {item.title[currentLang]}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-normal">
                    {item.desc[currentLang]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ========================================================================= */}
          {/* DYNAMIC ACTION BUTTON INSERTED INSIDE THE MAIN DESIGN GRID BOX CONTAINER  */}
          {/* ========================================================================= */}
          {isFromJoinForm && (
            <div className="pt-4 border-t border-slate-800/60 max-w-md mx-auto text-center space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentLang === 'bn'
                  ? 'পলিসি পড়া সম্পন্ন হলে নিচের বাটনে ক্লিক করে আপনার আবেদনটি সরাসরি সাবমিট করে দিন।'
                  : 'Once you have read the policy guidelines, click below to complete and instantly submit your application.'}
              </p>
              <button
                type="button"
                onClick={() => {
                  // Set a clean submission flag in localStorage for the main tab to detect
                  localStorage.setItem(
                    'SUBMIT_FROM_POLICY',
                    Date.now().toString(),
                  );

                  // Close the policy tab safely
                  window.close();
                }}
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <FiCheckCircle className="text-base" />
                {currentLang === 'bn'
                  ? 'আমি সম্মত, আবেদন জমা দিন'
                  : 'I Agree, Submit Application'}
              </button>
            </div>
          )}
          {/* ========================================================================= */}
        </div>

        {/* Footer Bottom Stamp */}
        <div className="text-center mt-10">
          <p className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide">
            {currentLang === 'bn'
              ? '© ২০২৬ আমার মিস্ত্রি কর্তৃপক্ষ। সর্বস্বত্ব সংরক্ষিত।'
              : '© 2026 Amar Mistri Authority. All Rights Reserved.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
