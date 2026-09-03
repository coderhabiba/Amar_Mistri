import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiPhoneCall,
  FiAlertOctagon,
  FiClock,
  FiCheckCircle,
  FiMapPin,
  FiVideo,
  FiFileText,
} from 'react-icons/fi';
import { LuShieldAlert } from 'react-icons/lu';

const UserHelpline = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const [noticeData, setNoticeData] = useState({
    name: '',
    phone: '',
    orderId: '',
    details: '',
  });

  const handleNoticeSubmit = e => {
    e.preventDefault();
    console.log('Late Night Service Notice:', noticeData);
    alert(
      currentLang === 'bn'
        ? 'আপনার রাত্রিকালীন সার্ভিসের নোটিশটি হেল্পলাইন ডাটাবেজে রেকর্ড করা হয়েছে। ধন্যবাদ।'
        : 'Your late-night service notice has been successfully recorded. Thank you.',
    );
    setNoticeData({ name: '', phone: '', orderId: '', details: '' });
  };

  const protocols = [
    {
      id: 1,
      icon: <FiVideo className="text-amber-400" />,
      title: { en: 'Group Video Call', bn: 'গ্রুপ ভিডিও কল' },
      desc: {
        en: 'Deals must be finalized using our software group video call feature. Never settle rates outside the app.',
        bn: 'উভয় পক্ষ অবশ্যই আমাদের সফটওয়্যারের গ্রুপ ভিডিও কলে কথা বলে ডিল ফাইনাল করবেন।',
      },
    },
    {
      id: 2,
      icon: <FiMapPin className="text-blue-400" />,
      title: { en: 'Live Location Always ON', bn: 'লাইভ লোকেশন অন রাখা' },
      desc: {
        en: 'Both customer and technician must keep their mobile live location enabled during the entire service period.',
        bn: 'সার্ভিস গ্রহণকালে এবং প্রদানকালে উভয় পক্ষের ক্ষেত্রে লাইভ লোকেশন অবশ্যই অন রাখতে হবে।',
      },
    },
    {
      id: 3,
      icon: <FiPhoneCall className="text-emerald-400" />,
      title: { en: 'Active Audio Call', bn: 'চলমান অডিও কল' },
      desc: {
        en: 'At least one party must remain on an active audio call with our tracking system or support during late hours.',
        bn: 'সার্ভিস চলাকালীন যেকোনো একজনকে বাধ্যতামূলকভাবে অডিও কলে থাকতে হবে।',
      },
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-16 px-4 relative overflow-hidden flex items-center justify-center">
      {/* Background Neon Blur Effects */}
      <div
        className="absolute top-1/4 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse"
        style={{ animationDuration: '4s' }}
      />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-amber-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 mb-2 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-bounce"
            style={{ animationDuration: '3s' }}
          >
            <LuShieldAlert className="text-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-red-400">
            {currentLang === 'bn'
              ? 'জরুরি হেল্পলাইন ও সাপোর্ট'
              : 'Emergency Helpline'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'bn'
              ? 'আপনার নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার। রাত-বিরাতের সার্ভিসের নোটিশ দিন অথবা যেকোনো সমস্যায় তাৎক্ষণিক সহায়তা পান।'
              : 'Your safety is our priority. Report late-night services or get instant support during any incident.'}
          </p>
        </div>

        {/* Core Layout: Emergency Contacts & Notice Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Instant Hotline & Protocols (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Immediate Call Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-950/40 to-slate-900/40 border border-red-500/30 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-5 text-7xl text-red-500 pointer-events-none">
                <FiAlertOctagon />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  {currentLang === 'bn'
                    ? 'তাৎক্ষণিক হটলাইন'
                    : 'Instant Emergency Call'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-100 select-all tracking-wide">
                  01893014004
                </h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {currentLang === 'bn'
                    ? 'সার্ভিস গ্রহণ বা প্রদানকালে কোনো প্রকার অপ্রীতিকর ঘটনা, আর্থিক জালিয়াতি বা নিরাপত্তা শঙ্কা দেখা দিলে সরাসরি কল করুন।'
                    : 'Call directly if you face any misconduct, financial fraud, or security threats during service.'}
                </p>
                <a
                  href="tel:01893014004"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors duration-300 shadow-lg shadow-red-500/20"
                >
                  <FiPhoneCall className="text-sm" />
                  {currentLang === 'bn' ? 'সরাসরি কল দিন' : 'Call Now'}
                </a>
              </div>
            </div>

            {/* Mandatory Safety Guidelines */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase pl-1">
                {currentLang === 'bn'
                  ? 'নিরাপত্তা বিধিমালা (উভয়ের জন্য প্রযোজ্য)'
                  : 'Mandatory Security Rules'}
              </h3>

              <div className="space-y-3">
                {protocols.map(rule => (
                  <div
                    key={rule.id}
                    className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/80 backdrop-blur-sm flex gap-4 items-start"
                  >
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-base shrink-0">
                      {rule.icon}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-200">
                        {rule.title[currentLang]}
                      </h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        {rule.desc[currentLang]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warning/Liability Note */}
              <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-400/90 leading-relaxed flex gap-2.5 items-start">
                <FiClock className="shrink-0 mt-0.5 text-xs" />
                <p>
                  {currentLang === 'bn'
                    ? 'উল্লেখ থাকে যে নিয়ম অমান্য করলে এবং কোনো প্রকার অকারেন্স ঘটলে কর্তৃপক্ষ দায়ী থাকবে না।'
                    : 'Please note that the authority will not be held responsible for any incident if these rules are violated.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Late Night Notice Submission Form (7 Columns) */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <FiFileText />
                {currentLang === 'bn'
                  ? 'রাত্রিকালীন সার্ভিস নোটিশ বুকিং'
                  : 'Late-Night Service Notification'}
              </div>
              <p className="text-slate-400 text-xs">
                {currentLang === 'bn'
                  ? 'রাত-বিরাতে কোনো কাজের ডিল ফাইনাল হলে এখানে অবশ্যই আগে থেকে নোটিশ প্রদান করে রাখুন।'
                  : 'If a service deal is locked late at night, submit a prior notice to keep our system alerted.'}
              </p>
            </div>

            <form onSubmit={handleNoticeSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* User Name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {currentLang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={noticeData.name}
                    onChange={e =>
                      setNoticeData({ ...noticeData, name: e.target.value })
                    }
                    placeholder={
                      currentLang === 'bn' ? 'নাম লিখুন' : 'Enter name'
                    }
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-red-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {currentLang === 'bn' ? 'মোবাইল নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={noticeData.phone}
                    onChange={e =>
                      setNoticeData({ ...noticeData, phone: e.target.value })
                    }
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-red-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Order / Work ID */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? 'সার্ভিস/অর্ডার আইডি (যদি থাকে)'
                    : 'Service / Order ID (Optional)'}
                </label>
                <input
                  type="text"
                  value={noticeData.orderId}
                  onChange={e =>
                    setNoticeData({ ...noticeData, orderId: e.target.value })
                  }
                  placeholder={
                    currentLang === 'bn' ? 'উদা: #MS-৮৯২০' : 'e.g. #MS-8920'
                  }
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-red-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                />
              </div>

              {/* Location & Work Details */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? 'বর্তমান কাজের লোকেশন ও সংক্ষিপ্ত বিবরণ'
                    : 'Current Work Location & Short Details'}
                </label>
                <textarea
                  rows="3"
                  required
                  value={noticeData.details}
                  onChange={e =>
                    setNoticeData({ ...noticeData, details: e.target.value })
                  }
                  placeholder={
                    currentLang === 'bn'
                      ? 'কাজের ঠিকানা এবং অপর পক্ষের নাম/আইডি উল্লেখ করুন...'
                      : 'Provide the work address and other party details...'
                  }
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-red-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-red-500/10 flex items-center justify-center gap-2"
              >
                <FiCheckCircle className="text-sm" />
                <span>
                  {currentLang === 'bn'
                    ? 'হেল্পলাইনে নোটিশ দিন'
                    : 'Submit Safety Notice'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHelpline;
