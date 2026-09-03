import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  FiPhoneCall,
  FiAlertTriangle,
  FiCheckCircle,
  FiShield,
  FiTool,
  FiDollarSign,
} from 'react-icons/fi';

const MechanicHelpline = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const [formData, setFormData] = useState({
    mechanicName: '',
    mechanicPhone: '',
    issueType: 'payment_issue',
    orderId: '',
    description: '',
  });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${(process.env.NEXT_PUBLIC_API_URL || "/api")}/mechanic-helpline/report`,
        formData,
      );

      if (response.data.success) {
        alert(
          currentLang === 'bn'
            ? 'আপনার অভিযোগটি সফলভাবে রেজিস্টার করা হয়েছে। অ্যাডমিন টিম ১০-১৫ মিনিটের মধ্যে আপনার সাথে যোগাযোগ করবে।'
            : 'Your report has been successfully registered. Admin team will contact you within 10-15 minutes.',
        );
        setFormData({
          mechanicName: '',
          mechanicPhone: '',
          issueType: 'payment_issue',
          orderId: '',
          description: '',
        });
      }
    } catch (error) {
      console.error(error);
      alert(
        currentLang === 'bn'
          ? 'কিছু একটা সমস্যা হয়েছে! আবার চেষ্টা করুন।'
          : 'Something went wrong! Please try again.',
      );
    }
  };

  const mechanicRules = [
    {
      id: 1,
      icon: <FiDollarSign className="text-emerald-400" />,
      title: { en: 'Payment Disputes', bn: 'পেমেন্ট বা বিল সংক্রান্ত জটিলতা' },
      desc: {
        en: 'If the customer refuses to pay or fails to pay online, accept Cash-on-Service and immediately notify us via app.',
        bn: 'গ্রাহক অনলাইনে পেমেন্ট দিতে ব্যর্থ হলে ক্যাশ গ্রহণ করুন এবং তা আমাদের পেমেন্ট নাম্বারে পাঠিয়ে অ্যাপে Cash-on-Service স্ট্যাটাস দিন।',
      },
    },
    {
      id: 2,
      icon: <FiTool className="text-blue-400" />,
      title: { en: 'Spare Parts Policy', bn: 'পার্টস বা সামগ্রী ক্রয় নিয়ম' },
      desc: {
        en: 'Never buy spare parts with your own money. The customer must provide needed materials under their own responsibility.',
        bn: 'সার্ভিস প্রদানকালে কোনো প্রকার পার্টস প্রয়োজন হলে তা গ্রাহক নিজ দায়িত্বে এনে দিবে। নিজের টাকা দিয়ে কখনো পার্টস কিনবেন না।',
      },
    },
    {
      id: 3,
      icon: <FiShield className="text-amber-400" />,
      title: { en: 'Code of Conduct', bn: 'খাবার ও তোয়ালে ব্যবহার নিষেধ' },
      desc: {
        en: "Strictly avoid eating, drinking, or using towels/handkerchiefs at the customer's house for your own professional safety.",
        bn: 'গ্রাহকের বাসায় পানি, নাস্তা বা চা খাবেন না এবং তোয়ালে, রুমাল বা গামছা জাতীয় কোনো কিছু শুকবেন বা ব্যবহার করবেন না।',
      },
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-16 px-4 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <FiTool className="text-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-amber-400 pt-2">
            {currentLang === 'bn'
              ? 'মিস্ত্রি ও টেকনিশিয়ান হেল্পলাইন'
              : 'Mechanic Helpline'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'bn'
              ? 'কর্মস্থলে কোনো সমস্যায় পড়েছেন? বিল বা নিরাপত্তা সংক্রান্ত যেকোনো জরুরি রিপোর্টে "আমার মিস্ত্রি" টিম সবসময় আপনার পাশে।'
              : 'Facing issues at the workplace? Report payment disputes or security concerns instantly to the Amar Mistri support team.'}
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-900/40 border border-amber-500/20 backdrop-blur-md relative overflow-hidden group">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  {currentLang === 'bn'
                    ? 'মিস্ত্রি জরুরি সাপোর্ট লাইন'
                    : 'Mechanic Emergency Hotline'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-wide">
                  01893014004
                </h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {currentLang === 'bn'
                    ? 'গ্রাহকের কর্মস্থলে থাকা অবস্থায় টাকা-পয়সা নিয়ে বাগবিতণ্ডা বা নিরাপত্তার অভাব বোধ করলে সাথে সাথে এই নম্বরে সরাসরি কল দিন।'
                    : "If you face verbal abuse or financial issues while at the customer's workplace, call this number immediately."}
                </p>
                <a
                  href="tel:01893014004"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg"
                >
                  <FiPhoneCall className="text-sm" />
                  {currentLang === 'bn'
                    ? 'সাপোর্ট সেন্টারে কল দিন'
                    : 'Call Support'}
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-400 tracking-wider uppercase pl-1">
                {currentLang === 'bn'
                  ? 'জরুরি কাজের নিয়মাবলী'
                  : 'Important Work Protocols'}
              </h3>
              <div className="space-y-3">
                {mechanicRules.map(rule => (
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
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                <FiAlertTriangle />
                {currentLang === 'bn'
                  ? 'অভিযোগ বা ইনসিডেন্ট রিপোর্ট ফর্ম'
                  : 'Incident Report Form'}
              </div>
              <p className="text-slate-400 text-xs">
                {currentLang === 'bn'
                  ? 'গ্রাহক টাকা না দিলে, তথ্য গোপন করলে বা অন্য কোনো সমস্যা হলে নিচের ফর্মটি পূরণ করে সাবমিট করুন।'
                  : 'Submit a formal report if a customer misbehaves, conceals information, or causes payment delays.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {currentLang === 'bn' ? 'আপনার নাম' : 'Your Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mechanicName}
                    onChange={e =>
                      setFormData({ ...formData, mechanicName: e.target.value })
                    }
                    placeholder={
                      currentLang === 'bn' ? 'নাম লিখুন' : 'Enter name'
                    }
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {currentLang === 'bn'
                      ? 'আপনার রেজিস্টার্ড মোবাইল নম্বর'
                      : 'Registered Mobile Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mechanicPhone}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        mechanicPhone: e.target.value,
                      })
                    }
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {currentLang === 'bn' ? 'সমস্যার ধরন' : 'Issue Type'}
                  </label>
                  <select
                    value={formData.issueType}
                    onChange={e =>
                      setFormData({ ...formData, issueType: e.target.value })
                    }
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-amber-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none transition-colors cursor-pointer"
                  >
                    <option value="payment_issue">
                      {currentLang === 'bn'
                        ? 'গ্রাহক বিল দিচ্ছে না (Payment Issue)'
                        : 'Customer Refused Payment'}
                    </option>
                    <option value="misbehavior">
                      {currentLang === 'bn'
                        ? 'গ্রাহকের দুর্ব্যবহার (Misbehavior)'
                        : 'Customer Misbehavior'}
                    </option>
                    <option value="extra_work">
                      {currentLang === 'bn'
                        ? 'জোরপূর্বক অতিরিক্ত কাজ করানো'
                        : 'Forced Extra Work'}
                    </option>
                    <option value="safety_concern">
                      {currentLang === 'bn'
                        ? 'নিরাপত্তা শঙ্কা (Safety Concern)'
                        : 'Safety/Security Threat'}
                    </option>
                  </select>
                </div>

                {/* Order ID */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {currentLang === 'bn'
                      ? 'সার্ভিস/অর্ডার আইডি'
                      : 'Service / Order ID'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.orderId}
                    onChange={e =>
                      setFormData({ ...formData, orderId: e.target.value })
                    }
                    placeholder={
                      currentLang === 'bn' ? 'উদা: #MS-৪৫১০' : 'e.g. #MS-4510'
                    }
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Problem Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? 'ঘটনার বিস্তারিত বিবরণ'
                    : 'Detailed Description of the Incident'}
                </label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={
                    currentLang === 'bn'
                      ? 'গ্রাহকের নাম বা ঠিকানা এবং ঠিক কী ঘটেছে পরিষ্কার করে লিখুন...'
                      : 'Describe exactly what happened...'
                  }
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-amber-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <FiCheckCircle className="text-sm" />
                <span>
                  {currentLang === 'bn'
                    ? 'অভিযোগ সাবমিট করুন'
                    : 'Submit Report'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MechanicHelpline;
