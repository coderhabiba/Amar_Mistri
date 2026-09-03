import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiShield,
  FiUserCheck,
  FiEye,
  FiAlertTriangle,
  FiMoon,
  FiLock,
  FiTool,
  FiDollarSign,
  FiCheckCircle,
  FiInfo,
  FiActivity,
  FiFileText,
} from 'react-icons/fi';
import { Link } from 'react-router';

const TermsAndConditions = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';
  const [isChecked, setIsChecked] = useState(false);

  // Expanded and updated structured rules matrix matching your brand guidelines
  const termsData = [
    {
      id: 1,
      icon: <FiInfo className="text-blue-400" />,
      title: {
        en: 'Role of the Platform',
        bn: '১. প্ল্যাটফর্মের ভূমিকা (Role of the Platform)',
      },
      desc: {
        en: '"Amar Mistri" is an online third-party platform/marketplace. We do not provide direct technician services; we act as an intermediary hub connecting customers and independent providers.',
        bn: '"আমার মিস্ত্রি" একটি অনলাইন থার্ড-পার্টি প্ল্যাটফর্ম বা মধ্যস্থতাকারী (Marketplace/Intermediary)। আমরা সরাসরি কোনো টেকনিশিয়ান বা মিস্ত্রি সেবা প্রদান করি না। আমাদের কাজ হলো সেবাগ্রহীতা এবং স্বাধীন সেবাদাতাদের মধ্যে একটি যোগাযোগের মাধ্যম তৈরি করে দেওয়া।',
      },
    },
    {
      id: 2,
      icon: <FiUserCheck className="text-amber-400" />,
      title: {
        en: 'NID & Face Verification',
        bn: '২. ইউজার রেজিস্ট্রেশন ও লাইভ স্ক্যান',
      },
      desc: {
        en: 'Users and technicians must register using authentic information including their own National Identity Card (NID) and complete registration via a live face scan.',
        bn: 'সেবা গ্রহণকারী, প্রদানকারী, মিস্ত্রী বা টেকনিশিয়ান: প্রত্যেককে নিজের জাতীয় পরিচয়পত্র (NID) দ্বারা ওয়েবসাইট বা অ্যাপে সঠিক তথ্য দিয়ে রেজিস্ট্রেশন করতে হবে এবং লাইভ ফেস স্ক্যান দ্বারা ভেরিফিকেশন সম্পন্ন করতে হবে।',
      },
    },
    {
      id: 3,
      icon: <FiShield className="text-purple-400" />,
      title: {
        en: 'Limitation of Liability & Safety',
        bn: '৩. দায়মুক্তি এবং ব্যক্তিগত নিরাপত্তা',
      },
      desc: {
        en: 'Since parties do not know each other beforehand, customers must ensure their own workplace safety. Amar Mistri is not liable for any accident, theft, damage, or unwanted incident during service.',
        bn: 'ব্যক্তিগত নিরাপত্তা: যেহেতু টেকনিশিয়ান এবং গ্রাহক কেউ কাউকে পূর্ব থেকে চেনেন না, তাই টেকনিশিয়ানকে বাসায় বা কর্মক্ষেত্রে ডাকার আগে গ্রাহককে নিজ দায়িত্বে নিরাপত্তা নিশ্চিত করতে হবে। কাজের সময় কোনো ধরনের দুর্ঘটনা, চুরি, ক্ষয়ক্ষতি বা অনাকাঙ্ক্ষিত ঘটনার জন্য "আমার মিস্ত্রি" কর্তৃপক্ষ কোনোভাবেই দায়ী থাকবে না।',
      },
    },
    {
      id: 4,
      icon: <FiActivity className="text-teal-400" />,
      title: {
        en: 'Work Quality Disclaimer',
        bn: '৪. কাজের গুণগত মান ও ওয়ারেন্টি',
      },
      desc: {
        en: 'The quality of work, behavior, or omissions lies solely on the respective provider. Amar Mistri platform does not provide any implicit work guarantee or warranty covers.',
        bn: 'টেকনিশিয়ানের কাজের মান, আচরণ বা কোনো ত্রুটির দায় সম্পূর্ণ ওই টেকনিশিয়ানের। "আমার মিস্ত্রি" কোনো কাজের গ্যারান্টি বা ওয়ারেন্টি প্রদান করে না।',
      },
    },
    {
      id: 5,
      icon: <FiFileText className="text-indigo-400" />,
      title: {
        en: 'General Code of Conduct',
        bn: '৫. সাধারণ আচরণবিধি (Code of Conduct)',
      },
      desc: {
        en: 'Neither party shall engage in misbehavior, fraudulent activities, or illegal actions. Strict administrative or legal actions will be initiated upon violation verified.',
        bn: 'কোনো পক্ষই (গ্রাহক বা টেকনিশিয়ান) একে অপরের সাথে অশালীন আচরণ, জালিয়াতি বা আইনবহির্ভূত কোনো কাজ করতে পারবেন না। এমন প্রমাণিত হলে আইনি ব্যবস্থা নেওয়া হতে পারে।',
      },
    },
    {
      id: 6,
      icon: <FiEye className="text-cyan-400" />,
      title: {
        en: 'Profile Verification Rule',
        bn: '৬. প্রোফাইল ভালো করে যাচাইকরণ',
      },
      desc: {
        en: 'As this is an intermediary platform, both the service seeker and the provider must thoroughly inspect and verify each others profiles before confirming a deal.',
        bn: 'প্রোফাইল চেক: যেহেতু এটি একটি মধ্যবর্তী প্রতিষ্ঠান তাই সেবা গ্রহণকারী এবং প্রদানকারী উভয় পক্ষই ডিল ফাইনাল করার আগে একে অপরের প্রোফাইল ভালো করে চেক করে নিবেন।',
      },
    },
    {
      id: 7,
      icon: <FiAlertTriangle className="text-red-400" />,
      title: {
        en: 'Safety & Consumption Restrictions',
        bn: '৭. নিরাপত্তা ও সামাজিক সচেতনতা',
      },
      desc: {
        en: 'Technicians must not consume or smell anything from the client. Likewise, providers must not consume water, snacks, or tea at the clients house, nor smell or use towels/handkerchiefs.',
        bn: 'সেবা দিতে গেলে সেবা গ্রহণকারী সেবা প্রদানকারীর নিকট হতে কোন কিছু খাবেন না অথবা শুকবেন না, তদ্রূপ সেবা প্রদানকারীও সেবা গ্রহণকারীর বাসায় পানি, নাস্তা, চা জাতীয় কোন খাবার খাবেন না এবং তোয়ালে, রুমাল, গামছা জাতীয় কোন কিছু শুকবেন না।',
      },
    },
    {
      id: 8,
      icon: <FiMoon className="text-pink-400" />,
      title: {
        en: 'Late Night Services (After 7 PM)',
        bn: '৮. রাতের সময়সীমা ও লাইভ লোকেশন',
      },
      desc: {
        en: 'After 7:00 PM, both parties must notify our helpline, lock the deal over our software group video call, and keep Live Location ON. At least one party must remain on an audio call. Authority is not responsible otherwise.',
        bn: 'রাতের সময়সীমা: সন্ধ্যা ০৭ টার পরে সেবা গ্রহণকারী এবং প্রদানকারীর ক্ষেত্রে অবশ্যই আমাদের হেল্প লাইনে নোটিশ প্রদান করে রাখবেন এবং উভয় আমাদের সফটওয়্যারের গ্রুপ কলে কথা বলে ডিল ফাইনাল করবেন। এবং উভয়ের ক্ষেত্রে লাইভ লোকেশন অন রাখতে হবে। অন্যথায় কোন প্রকার অকারেন্স বা দুর্ঘটনা ঘটলে এতে কর্তৃপক্ষ দায়ী থাকবে না।',
      },
    },
    {
      id: 9,
      icon: <FiLock className="text-rose-400" />,
      title: {
        en: 'Legal Action Against Fraud',
        bn: '৯. তথ্য গোপন ও আইনি ব্যবস্থা',
      },
      desc: {
        en: 'Concealing accurate transaction data or creating deliberate obstacles in financial operations will attract strict legal action from the Amar Mistri App authorities.',
        bn: 'তথ্য গোপন করলে: তথ্য গোপন ও আর্থিক লেনদেনে বিঘ্ন ঘটলে "আমার মিস্ত্রি" অ্যাপ কর্তৃপক্ষ উভয়ের বিরুদ্ধে কঠোর আইনি ব্যবস্থা গ্রহণ করবে।',
      },
    },
    {
      id: 10,
      icon: <FiTool className="text-orange-400" />,
      title: {
        en: 'Service Charge & Materials Procurement',
        bn: '১০. সার্ভিস চার্জ ও যন্ত্রাংশ ক্রয়',
      },
      desc: {
        en: 'The authority only claims the designated service fee. If any spare parts or raw materials are required during the operational service, the customer must procure them independently.',
        bn: 'সার্ভিস চার্জ সম্পর্কিত তথ্য: আমার মিস্ত্রি কর্তৃপক্ষ শুধুমাত্র সার্ভিস চার্জ গ্রহণ করে থাকে। সার্ভিস প্রদানকালে কোন প্রকার পার্টস প্রয়োজন হলে বা যেকোনো সামগ্রী প্রয়োজন হলে সার্ভিস গ্রহণকারী নিজ দায়িত্বে এনে দিবে।',
      },
    },
    {
      id: 11,
      icon: <FiDollarSign className="text-emerald-400" />,
      title: {
        en: 'Customer Financial Transaction Policy',
        bn: '১১. সেবা গ্রহণকারীর ক্ষেত্রে আর্থিক লেনদেন',
      },
      desc: {
        en: 'Pay service bills directly to the official Amar Mistri bKash Merchant account. If online payment fails, hand over cash to the technician and mandatorily click "Cash on Service" status in the app.',
        bn: 'সেবা গ্রহণকারীর ক্ষেত্রে আর্থিক লেনদেন: আমার মিস্ত্রি অ্যাপ হতে কোন মিস্ত্রি বা টেকনিশিয়ান দিয়ে কাজ করালে কাজের সার্ভিস চার্জ আমার মিস্ত্রির বিকাশ পেমেন্ট নাম্বারে প্রদান করবেন অথবা যদি পেমেন্ট অথবা সেন্ড মানি করতে সক্ষম না হন সেক্ষেত্রে টেকনিশিয়ান এর কাছে টাকা জমা দিবেন এবং অ্যাপসে ক্যাশ অন সার্ভিস স্ট্যাটাস ক্লিক করবেন।',
      },
    },
    {
      id: 12,
      icon: <FiCheckCircle className="text-green-400" />,
      title: {
        en: 'Technician Earnings & Automatic Payouts',
        bn: '১২. টেকনিশিয়ান বা মিস্ত্রির আর্থিক লেনদেন',
      },
      desc: {
        en: 'Verify payment before leaving the site. If the user fails online, accept cash, forward our share to the payment number, and our automated software will dispatch your payout to your mobile banking within 5-10 minutes.',
        bn: 'টেকনিশিয়ান বা মিস্ত্রি বা সেবা প্রদানকারীর সাথে আমার মিস্ত্রির আর্থিক লেনদেন: আপনি সেবা প্রদানের পর গ্রাহকের কর্মস্থলে থাকা অবস্থায় পেমেন্ট নিশ্চিত করবেন গ্রাহক যদি অনলাইনে পেমেন্ট দিতে ব্যর্থ হয় তাহলে আপনি গ্রাহক থেকে ক্যাশ অন সার্ভিস গ্রহণ করবেন এবং উক্ত সার্ভিস চার্জ আপনি আমাদের পেমেন্ট নাম্বারে প্রদান করবেন আমাদের অটো মেশিন সফটওয়্যার এর মাধ্যমে ৫ থেকে ১০ মিনিটের মধ্যে আপনার পারিশ্রমিক বা আপনার কমিশন আপনার মোবাইল ব্যাংকিংয়ে পৌঁছে যাবে।',
      },
    },
  ];

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-16 px-4 relative overflow-hidden flex items-center justify-center">
      {/* Background Neon Blur Ambient Spheres */}
      <div className="absolute top-10 right-10 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary border border-primary/20 mb-2">
            <FiShield className="text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-primary pt-2">
            {currentLang === 'bn'
              ? 'শর্তাবলী এবং নিয়মসমূহ'
              : 'Terms & Conditions'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-3xl mx-auto leading-relaxed">
            {currentLang === 'bn'
              ? '"আমার মিস্ত্রি" (Amar Mistri) প্ল্যাটফর্মে আপনাকে স্বাগতম। অ্যাপ বা ওয়েবসাইট ব্যবহার করার পূর্বে সেবা গ্রহণকারী এবং প্রদানকারী উভয় পক্ষই অনুগ্রহ করে আমাদের টার্মস অ্যান্ড কন্ডিশনগুলো ভালো করে পড়ে ও বুঝে নিন।'
              : 'Welcome to "Amar Mistri" platform. Please read and understand our comprehensive terms and conditions carefully before registering as a customer or technical service provider.'}
          </p>
        </div>

        {/* Dynamic Rules Grid Layout */}
        <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-4 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {termsData.map(item => (
              <div
                key={item.id}
                className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/50 hover:border-slate-700/80 transition-all duration-300 flex gap-4 items-start group shadow-inner"
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
        </div>

        {/* Acceptance Checkbox & Registration Core Handler Row */}
        <div className="mt-8 bg-slate-900/20 border border-slate-800/40 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5 backdrop-blur-sm">
          <label className="flex items-start gap-3 cursor-pointer select-none group max-w-2xl">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={e => setIsChecked(e.target.checked)}
              className="mt-1 checkbox checkbox-primary checkbox-sm border-slate-700 rounded-md bg-slate-950 checked:bg-primary"
            />
            <span className="text-xs sm:text-sm text-slate-300 font-medium group-hover:text-slate-200 transition-colors leading-relaxed">
              {currentLang === 'bn'
                ? 'আমি সমস্ত শর্তাবলী, দায়মুক্তি এবং পেমেন্ট সংক্রান্ত নিয়মসমূহ মনোযোগ সহকারে পড়েছি, সম্পূর্ণ বুঝেছি এবং তা সর্বদা মেনে চলতে বাধ্য থাকব।'
                : 'I have explicitly read, understood, and agree to strictly follow all the operational codes, liability clauses, and financial terms.'}
            </span>
          </label>

          {/* Conditional Registration Action Trigger using primary color theme */}
          {isChecked ? (
            <Link
              to="/join-mistry"
              className="w-full sm:w-auto text-center px-8 py-3.5 bg-primary hover:bg-primary/95 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all duration-300 shadow-lg shadow-primary/10 shrink-0"
            >
              {currentLang === 'bn'
                ? 'রেজিস্ট্রেশন করুন'
                : 'Proceed to Register'}
            </Link>
          ) : (
            <button
              disabled
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 text-slate-500 font-black rounded-xl text-xs uppercase tracking-widest cursor-not-allowed shrink-0"
            >
              {currentLang === 'bn'
                ? 'রেজিস্ট্রেশন করুন'
                : 'Proceed to Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
