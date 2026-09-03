import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiUsers,
  FiTrendingUp,
  FiHeart,
  FiSend,
} from 'react-icons/fi';

const WorkInSupport = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const [applicant, setApplicant] = useState({
    name: '',
    email: '',
    portfolio: '',
    experience: 'fresher',
  });

  const handleApply = e => {
    e.preventDefault();
    console.log('Applicant Data Submitted:', applicant);
    alert(
      currentLang === 'bn'
        ? 'আপনার আবেদনটি আমাদের এইচআর (HR) টিমে জমা হয়েছে!'
        : 'Your application has been forwarded to our HR department!',
    );
    setApplicant({ name: '', email: '', portfolio: '', experience: 'fresher' });
  };

  const benefits = [
    {
      id: 1,
      icon: <FiClock className="text-amber-400" />,
      title: { en: 'Flexible Shifts', bn: 'নমনীয় কাজের শিফট' },
      desc: {
        en: '24/7 coverage with morning, evening, and night slots.',
        bn: '২৪/৭ সচল টিমে সকাল, বিকাল বা রাতে কাজ করার সুবিধা।',
      },
    },
    {
      id: 2,
      icon: <FiTrendingUp className="text-blue-400" />,
      title: { en: 'Growth Pathway', bn: 'ক্যারিয়ার গ্রোথ' },
      desc: {
        en: 'Promotions to Support Lead and QA roles within 1 year.',
        bn: '১ বছরের মধ্যেই টিম লিড বা কিউএ রোলে প্রমোশনের সুযোগ।',
      },
    },
    {
      id: 3,
      icon: <FiHeart className="text-emerald-400" />,
      title: { en: 'Friendly Culture', bn: 'স্মার্ট ও ফ্রেন্ডলি টিম' },
      desc: {
        en: 'Collaborative workspace built with modern technology.',
        bn: 'একটি লাক্সারি ও আধুনিক টেক এনভায়রনমেন্টে কাজ করার অভিজ্ঞতা।',
      },
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-16 px-4 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-2">
            <FiBriefcase className="text-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-blue-400 pt-2">
            {currentLang === 'bn'
              ? 'সাপোর্ট সেন্টারে ক্যারিয়ার'
              : 'Work In Our Support Center'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'bn'
              ? 'আমাদের কাস্টমার কেয়ার ও টেকনিক্যাল ট্র্যাকিং টিমে যোগ দিয়ে বাংলাদেশে রিয়েল-টাইম হোম সার্ভিস বিপ্লবের অংশ হোন।'
              : 'Join our tracking & client-relations desk to handle incident logs and shape the on-demand industry.'}
          </p>
        </div>

        {/* Job Details Card & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Active Role (5 Columns) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-4">
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider rounded-full">
                {currentLang === 'bn' ? 'জরুরি নিয়োগ' : 'Hiring Urgently'}
              </span>
              <h2 className="text-lg font-black text-slate-100 pt-2">
                {currentLang === 'bn'
                  ? 'টেকনিক্যাল সাপোর্ট এক্সিকিউটিভ'
                  : 'Technical Support Executive'}
              </h2>

              <div className="space-y-2 text-xs text-slate-400">
                <p className="flex items-center gap-2">
                  <FiMapPin className="text-amber-400" />{' '}
                  {currentLang === 'bn'
                    ? 'ঢাকা (রিমোট/অনসাইট মিক্স)'
                    : 'Dhaka (Hybrid / Remote Option)'}
                </p>
                <p className="flex items-center gap-2">
                  <FiClock className="text-blue-400" />{' '}
                  {currentLang === 'bn'
                    ? 'ফুল-টাইম (শিফটিং ডিউটি)'
                    : 'Full-Time (Rotational Shifts)'}
                </p>
                <p className="flex items-center gap-2">
                  <FiUsers className="text-purple-400" />{' '}
                  {currentLang === 'bn'
                    ? 'খালি পদ: ০৩ জন'
                    : 'Vacancy: 03 Openings'}
                </p>
              </div>
              <div className="border-t border-slate-800/60 pt-3">
                <h3 className="text-sm font-bold text-slate-300 mb-1">
                  {currentLang === 'bn'
                    ? 'মূল দায়িত্বসমূহ:'
                    : 'Key Requirements:'}
                </h3>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1">
                  <li>
                    {currentLang === 'bn'
                      ? 'মিস্ত্রিদের লাইভ ভেরিফিকেশন ও ট্র্যাকিং মনিটর করা।'
                      : 'Monitor real-time face verification and GPS logs.'}
                  </li>
                  <li>
                    {currentLang === 'bn'
                      ? 'পেমেন্ট জটিলতা এবং কাস্টমার ইনসিডেন্ট রেকর্ড সমাধান।'
                      : 'Resolve payment disputes and user grievances.'}
                  </li>
                </ul>
              </div>
            </div>

            {/* Benefits Grid */}
            <div className="space-y-3">
              {benefits.map(b => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/50 flex gap-4 items-start"
                >
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-base shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">
                      {b.title[currentLang]}
                    </h4>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      {b.desc[currentLang]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Application Form (7 Columns) */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl">
            <form onSubmit={handleApply} className="space-y-4">
              <div className="space-y-1 mb-2">
                <h3 className="font-bold text-slate-200">
                  {currentLang === 'bn' ? 'আবেদন ফরম' : 'Apply Now'}
                </h3>
                <p className="text-slate-400 text-xs">
                  {currentLang === 'bn'
                    ? 'আপনার সঠিক তথ্য দিয়ে টিম রিক্রুটারদের সাথে যুক্ত হোন।'
                    : 'Submit your credentials directly to our HR dashboard.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {currentLang === 'bn' ? 'পূর্ণ নাম' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={applicant.name}
                    onChange={e =>
                      setApplicant({ ...applicant, name: e.target.value })
                    }
                    placeholder={
                      currentLang === 'bn' ? 'নাম লিখুন' : 'Enter name'
                    }
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    {currentLang === 'bn' ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    value={applicant.email}
                    onChange={e =>
                      setApplicant({ ...applicant, email: e.target.value })
                    }
                    placeholder="example@gmail.com"
                    className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn' ? 'অভিজ্ঞতা লেভেল' : 'Experience Level'}
                </label>
                <select
                  value={applicant.experience}
                  onChange={e =>
                    setApplicant({ ...applicant, experience: e.target.value })
                  }
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-blue-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-300 outline-none transition-colors cursor-pointer"
                >
                  <option value="fresher">
                    {currentLang === 'bn'
                      ? 'আমি একদম নতুন / ফ্রেশার (Fresher)'
                      : 'I am a Fresher'}
                  </option>
                  <option value="1_year">
                    {currentLang === 'bn'
                      ? '১ বছর বা তার বেশি অভিজ্ঞতা'
                      : '1+ Years Experience'}
                  </option>
                  <option value="2_year">
                    {currentLang === 'bn'
                      ? '২+ বছরের প্রফেশনাল অভিজ্ঞতা'
                      : '2+ Years Tech Support Experience'}
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {currentLang === 'bn'
                    ? 'লিঙ্কডইন বা পোর্টফোলিও লিঙ্ক'
                    : 'Resume / LinkedIn / Portfolio URL'}
                </label>
                <input
                  type="url"
                  required
                  value={applicant.portfolio}
                  onChange={e =>
                    setApplicant({ ...applicant, portfolio: e.target.value })
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="w-full bg-slate-950/60 border border-slate-800 focus:border-blue-500/40 rounded-xl px-4 py-2.5 text-xs text-slate-100 outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <FiSend className="text-sm" />
                <span>
                  {currentLang === 'bn'
                    ? 'আবেদন সাবমিট করুন'
                    : 'Submit Application'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkInSupport;
