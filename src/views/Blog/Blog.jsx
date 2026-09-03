import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiUser,
  FiArrowRight,
  FiSearch,
} from 'react-icons/fi';

const Blog = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy blog data array with realistic Unsplash images related to mechanics and home services
  const blogs = [
    {
      id: 1,
      image:
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop', // AC repair mechanic
      date: 'May 24, 2026',
      readTime: '5 min read',
      author: 'Admin Desk',
      title: {
        en: '5 Essential AC Maintenance Tips Before Peak Summer Hits',
        bn: 'তীব্র গরম শুরুর আগে এসি (AC) ভালো রাখার ৫টি জরুরি উপায়',
      },
      excerpt: {
        en: 'Avoid emergency breakdowns during sizzling days by verifying your current gas pressure, cleaning outer filters, and checking automated stabilizer thresholds early.',
        bn: 'গরমের মাঝে হুট করে এসি নষ্ট হওয়া থেকে বাঁচতে এখনই গ্যাস প্রেশার চেক করুন, ফিল্টার পরিষ্কার রাখুন এবং স্টেবিলাইজারের রিডিং দেখে নিন।',
      },
    },
    {
      id: 2,
      image:
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=600&auto=format&fit=crop', // Electrical technician working
      date: 'May 18, 2026',
      readTime: '4 min read',
      author: 'Technical Team',
      title: {
        en: 'Understanding Automated Mobile Payouts for Technicians',
        bn: 'মিস্ত্রিদের অটোমেটিক মোবাইল পেমেন্ট সিস্টেমের খুঁটিনাটি',
      },
      excerpt: {
        en: "Learn how Amar Mistri's underlying microservices route completed work funds into digital wallets instantly within 10 minutes without any internal human interactions.",
        bn: 'জানুন কীভাবে আমার মিস্ত্রি প্ল্যাটফর্ম কোনো মানুষের হস্তক্ষেপ ছাড়াই কাজ শেষের মাত্র ১০ মিনিটের মধ্যে টাকা সরাসরি মিস্ত্রিদের ডিজিটাল ওয়ালেটে পৌঁছে দেয়।',
      },
    },
    {
      id: 3,
      image:
        'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=600&auto=format&fit=crop', // Tools and safety equipments
      date: 'May 12, 2026',
      readTime: '6 min read',
      author: 'Safety Desk',
      title: {
        en: 'Why Live NID and Face Verification Protects Your Home',
        bn: 'লাইভ এনআইডি এবং ফেস ভেরিফিকেশন কীভাবে আপনার বাড়ি নিরাপদ রাখে',
      },
      excerpt: {
        en: 'Security is our paramount baseline. Discover the background checking framework that every mechanic passes through before acquiring their digital badge.',
        bn: 'নিরাপত্তাই আমাদের মূল লক্ষ্য। জেনে নিন আমাদের প্ল্যাটফর্মের প্রতিটি মিস্ত্রি অ্যাপে সচল হওয়ার আগে কী ধরনের কড়া সিকিউরিটি স্ক্রিনিংয়ের মধ্য দিয়ে যান।',
      },
    },
  ];

  // Filtering blogs based on user search query input
  const filteredBlogs = blogs.filter(
    blog =>
      blog.title[currentLang]
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      blog.excerpt[currentLang]
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 py-20 px-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-5 w-96 h-96 bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/3 left-5 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto relative z-10 space-y-12">
        {/* Main Section Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <FiBookOpen className="text-3xl" />
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-amber-400 leading-tight pt-2">
            {currentLang === 'bn'
              ? 'আমার মিস্ত্রি ব্লগ হাব'
              : 'Amar Mistri Blog Hub'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {currentLang === 'bn'
              ? 'হোম সার্ভিস কেয়ার, গ্যাজেট মেইনটেইনেন্স এবং প্ল্যাটফর্মের সর্বশেষ প্রযুক্তিগত আপডেট সম্পর্কে বিস্তারিত জানুন।'
              : 'Stay educated with professional household repair tips, safety standards, and real-time product updates.'}
          </p>
        </div>

        {/* Dynamic Search Box */}
        <div className="relative max-w-md mx-auto">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              currentLang === 'bn'
                ? 'ব্লগ বা আর্টিকেল সার্চ করুন...'
                : 'Search articles...'
            }
            className="w-full bg-slate-900/40 border border-slate-800/80 focus:border-amber-500/40 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 outline-none transition-colors backdrop-blur-md shadow-inner"
          />
        </div>

        {/* Responsive Grid Structure for Blog Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {filteredBlogs.map(blog => (
            <article
              key={blog.id}
              className="group rounded-2xl border border-slate-800/80 bg-slate-900/30 backdrop-blur-md overflow-hidden flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300 shadow-xl"
            >
              {/* Image Box Wrapper */}
              <div className="relative aspect-video w-full overflow-hidden bg-slate-950 border-b border-slate-900">
                <img
                  src={blog.image}
                  alt={blog.title[currentLang]}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  loading="lazy"
                />
              </div>

              {/* Text Description Box */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <FiCalendar className="text-amber-500" /> {blog.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiClock className="text-blue-400" /> {blog.readTime}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <FiUser className="text-purple-400" /> {blog.author}
                    </span>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-slate-100 tracking-wide group-hover:text-amber-400 transition-colors duration-300 line-clamp-2">
                    {blog.title[currentLang]}
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal line-clamp-3">
                    {blog.excerpt[currentLang]}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-500 cursor-pointer group/link">
                  <span>
                    {currentLang === 'bn' ? 'বিস্তারিত পড়ুন' : 'Read Article'}
                  </span>
                  <FiArrowRight className="text-base group-hover/link:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty Search Handler */}
        {filteredBlogs.length === 0 && (
          <div className="text-center py-12 bg-slate-900/10 border border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-400 text-sm">
              {currentLang === 'bn'
                ? 'কোনো আর্টিকেল পাওয়া যায়নি।'
                : 'No blog articles matched your search query.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
