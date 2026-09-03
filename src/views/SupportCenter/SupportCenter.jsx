import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiHelpCircle,
  FiSearch,
  FiMessageCircle,
  FiBookOpen,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';

const SupportCenter = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      id: 1,
      question: {
        en: 'How do I check if a mechanic is verified?',
        bn: 'মিস্ত্রি যাচাইকৃত (Verified) কিনা কীভাবে বুঝব?',
      },
      answer: {
        en: 'Every technician on our platform carries a digital profile with a NID Verified badge. You can view their full face-scan status in the app before booking.',
        bn: 'আমাদের প্ল্যাটফর্মের প্রতিটি টেকনিশিয়ানের প্রোফাইলে একটি এনআইডি ভেরিফাইড ব্যাজ থাকে। বুকিং করার আগে অ্যাপে তাদের লাইভ ফেস-স্ক্যান স্ট্যাটাস দেখে নিতে পারেন।',
      },
    },
    {
      id: 2,
      question: {
        en: 'What should I do during a late-night emergency?',
        bn: 'রাত-বিরাতে কাজের সময় কোনো জরুরি সমস্যা হলে কী করব?',
      },
      answer: {
        en: 'Immediately open our User Helpline page or call our emergency hotline. Ensure your live location is ON and use the group video call feature.',
        bn: 'সাথে সাথে আমাদের ইউজার হেল্পলাইন পেজে যান অথবা জরুরি হটলাইনে কল দিন। আপনার ফোনের লাইভ লোকেশন অন রাখুন এবং আমাদের সফটওয়্যারের গ্রুপ ভিডিও কল ফিচারটি ব্যবহার করুন।',
      },
    },
    {
      id: 3,
      question: {
        en: 'How long does automated technician payout take?',
        bn: 'মিস্ত্রিদের অটোমেটিক পেমেন্ট পেতে কত সময় লাগে?',
      },
      answer: {
        en: 'Once the customer marks the job as completed, the funds are automatically dispatched to the technician’s mobile wallet within 5 to 10 minutes.',
        bn: 'গ্রাহক কাজ সম্পন্ন হয়েছে বলে কনফার্ম করার পর আমাদের অটোমেটিক সফটওয়্যারের মাধ্যমে মাত্র ৫ থেকে ১০ মিনিটের মধ্যে মিস্ত্রিরা তাদের পারিশ্রমিক পেয়ে যান।',
      },
    },
    {
      id: 4,
      question: {
        en: 'Will I get a refund if I am unsatisfied with the work?',
        bn: 'কাজ পছন্দ না হলে কি আমি রিফান্ড পাবো?'
      },
        answer: {
          en: 'Yes, absolutely. Any quality mismatch falls under our 7-day service warranty where we fix it for free. If the issue remains unresolved, a refund is issued post investigation.',
          bn: 'জ্বী, অবশ্যই। কাজের কোয়ালিটি নিয়ে কোনো সমস্যা হলে আমাদের ৭ দিনের সার্ভিস ওয়ারেন্টির আওতায় ফ্রিতে আবার কাজ করিয়ে দেওয়া হবে। সমস্যা সমাধান না হলে যথাযথ तदन्त सापेक्षे रिफान्ड पलिसि प्रयोज्य हबे।',
        }
      },
    
    {
      id: 5,
      question: {
        en: 'What should I do if the expert demands additional money?',
        bn: 'মিস্ত্রি আসার পর অতিরিক্ত টাকা দাবি করলে কি করবো?'
      },
      answer: {
        en: 'Never pay any cash outside the final invoice shown on the app. For additional repairs, ask the expert to update the cost via the app or contact our support line immediately.',
        bn: 'অ্যাপে বুকিং করার সময় যে বিল দেখানো হয়েছে, তার বাইরে কোনো অতিরিক্ত টাকা সরাসরি মিস্ত্রিকে দেবেন না। যেকোনো এক্সট্রা কাজের জন্য অবশ্যই অ্যাপের মাধ্যমে প্রাইস আপডেট করিয়ে নেবেন অথবা আমাদের হটলাইনে তাৎক্ষণিক কল করবেন।',
      }
    },
    {
      id: 6,
      question: {
        en: 'How safe and verified are your service providers?',
        bn: 'আপনাদের সার্ভিস প্রোভাইডাররা কতটুকু নিরাপদ ও বিশ্বস্ত?'
      },
      answer: {
        en: 'Every professional undergoes NID screening, permanent address tracing, and rigorous technical trade tests. Our rapid response team remains on standby for any emergencies.',
        bn: 'আমাদের প্রতিটি মিস্ত্রির জাতীয় পরিচয়পত্র (NID), স্থায়ী ঠিকানা এবং পূর্ব কাজের অভিজ্ঞতা কঠোরভাবে ভেরিফাই করা হয়। এছাড়াও কাজের সময় যেকোনো জরুরি পরিস্থিতির জন্য আমাদের বিশেষ ব্যাকগ্রাউন্ড রেপিড রেসপন্স টিম প্রস্তুত থাকে।',
      }
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question[currentLang].toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-16 px-4 relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-1/4 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <FiHelpCircle className="text-2xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 pt-2 to-amber-400">
            {currentLang === 'bn' ? 'সাপোর্ট সেন্টার' : 'Support Center'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            {currentLang === 'bn'
              ? 'আপনার যেকোনো প্রশ্ন বা সমস্যার সমাধান এখানে পাবেন।'
              : 'Find answers to your questions or get instant resolution from our knowledge base.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-lg mx-auto">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              currentLang === 'bn'
                ? 'আপনার সমস্যা বা প্রশ্নটি লিখে সার্চ করুন...'
                : 'Search for topics, features or issues...'
            }
            className="w-full bg-slate-900/50 border border-slate-800 focus:border-amber-500/40 rounded-xl pl-12 pr-4 py-3.5 text-xs text-slate-200 outline-none transition-colors backdrop-blur-sm"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 pl-1 flex items-center gap-2">
            <FiBookOpen />{' '}
            {currentLang === 'bn'
              ? 'সচরাচর জিজ্ঞাসিত প্রশ্নাবলী'
              : 'Frequently Asked Questions'}
          </h2>
          {filteredFaqs.map(faq => (
            <div
              key={faq.id}
              className="border border-slate-800/80 rounded-xl bg-slate-900/20 backdrop-blur-md overflow-hidden transition-colors duration-300"
            >
              <button
                onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-900/40 transition-colors"
              >
                <span className="text-xs sm:text-sm font-bold text-slate-200">
                  {faq.question[currentLang]}
                </span>
                {openFaq === faq.id ? (
                  <FiChevronUp className="text-amber-400 text-sm" />
                ) : (
                  <FiChevronDown className="text-slate-400 text-sm" />
                )}
              </button>
              {openFaq === faq.id && (
                <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-900/60 bg-slate-950/20">
                  {faq.answer[currentLang]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Live Support CTA */}
        <div className="max-w-xl mx-auto p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900/40 to-slate-900/40 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-3 items-center text-center sm:text-left">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xl hidden sm:block">
              <FiMessageCircle />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-200">
                {currentLang === 'bn'
                  ? 'এখনো কোনো প্রশ্ন আছে?'
                  : 'Still need custom support?'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {currentLang === 'bn'
                  ? 'আমাদের কাস্টমার কেয়ার এক্সপার্টরা লাইভ আছেন।'
                  : 'Talk to our dynamic support agents right away.'}
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold rounded-xl uppercase tracking-wider shadow-lg">
            {currentLang === 'bn' ? 'লাইভ চ্যাট' : 'Live Chat'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
