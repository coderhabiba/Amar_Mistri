import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useState } from 'react';
import LiveTrackingInfo from './../SafetyAndGallery/LiveTrackingInfo';
import SafetyDetails from './../SafetyAndGallery/SafetyDetails';
import {
  FiArrowRight,
  FiShield,
  FiMapPin,
  FiPhoneCall,
  FiUsers,
  FiClock,
  FiCheckSquare,
  FiX,
} from 'react-icons/fi';

const SafetyAndGallery = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [activeModal, setActiveModal] = useState(null); 

  const gridItems = [
    {
      id: 1,
      icon: <FiUsers />,
      titleBn: 'ভেরিফাইড কাস্টমার',
      titleEn: 'Verified Customers',
      descBn: '১০k+ একটিভ ইউজার',
      descEn: '10k+ Active Users',
      image:
        'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 2,
      icon: <FiClock />,
      titleBn: 'দ্রুত রেসপন্স টিম',
      titleEn: 'Rapid Response',
      descBn: '২৪/৭ অন-ডিমান্ড অ্যাক্টিভ',
      descEn: '24/7 On-Demand Active',
      image:
        'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 3,
      icon: <FiShield />,
      titleBn: 'শতভাগ নিরাপত্তা',
      titleEn: '100% Secure Sessions',
      descBn: 'সুরক্ষিত ও বীমাকৃত সেবা',
      descEn: 'Protected & Covered Sessions',
      image:
        'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 4,
      icon: <FiCheckSquare />,
      titleBn: 'কোয়ালিটি গ্যারান্টি',
      titleEn: 'Quality Guaranteed',
      descBn: 'সার্টিফাইড শীর্ষ মিস্ত্রি',
      descEn: 'Certified Top Rated Handymen',
      image:
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 5,
      icon: <FiMapPin />,
      titleBn: 'লাইভ ট্র্যাকিং',
      titleEn: 'Live Tracking',
      descBn: 'রিয়েল-টাইম লোকেশন নোড',
      descEn: 'Real-time Location Nodes',
      image:
        'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 6,
      icon: <FiPhoneCall />,
      titleBn: 'ডেডিকেটেড সাপোর্ট',
      titleEn: 'Dedicated Support',
      descBn: 'সার্বক্ষণিক কল সেন্টার সুবিধা',
      descEn: 'Instant Call Center Facility',
      image:
        'https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80&w=600',
    },
  ];

  return (
    <div className="w-full bg-[#0b0f19] py-20 md:py-28 border-b border-slate-950 relative overflow-hidden select-none cursor-default">
      {/* Structural system dot matrix backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Section Header Node ── */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/60 border border-slate-800 rounded-full">
            <FiShield className="text-orange-500 text-xs animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              {isBn ? 'সুরক্ষা ও গ্যালারি' : 'TRUST & ASSURANCE'}
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
            {isBn ? (
              <>
                আপনার দৈনন্দিন প্রয়োজনে পাশে আছি{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  #আমারমিস্ত্রি
                </span>
              </>
            ) : (
              <>
                Always At Your Service Whenever You Need{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  #AmarMistry
                </span>
              </>
            )}
          </h2>
        </div>

        {/* ── Architectural Premium Bento Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[180px] md:auto-rows-[200px] mb-24">
          {gridItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="group relative border border-slate-900 rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col justify-between shadow-2xl/10"
            >
              {/* Dynamic Image Canvas Layer with Gradient Overlays */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.titleEn}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-30 group-hover:opacity-40"
                  onError={e => {
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = `<div class="w-full h-full bg-slate-950"></div>`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/80 to-transparent transition-colors duration-300" />
              </div>

              {/* Top Vector Indicators */}
              <div className="flex items-start justify-between relative z-10">
                <div className="p-2.5 bg-slate-950/90 border border-slate-800 text-xl text-orange-500 group-hover:text-white group-hover:border-orange-500/30 transition-all duration-300 shadow-lg">
                  {item.icon}
                </div>
              </div>

              {/* Content Block Area */}
              <div className="space-y-1 relative z-10 pt-4">
                <h3 className="text-base md:text-lg font-black text-slate-200 tracking-tight leading-tight group-hover:text-amber-500 transition-colors">
                  {isBn ? item.titleBn : item.titleEn}
                </h3>
                <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                  {isBn ? item.descBn : item.descEn}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Two-Column Information Mesh ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 pt-14 border-t border-slate-900 relative">
          {/* Decorative Divider Mesh Node Badge */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 hidden md:block z-20">
            <div className="flex items-center gap-2 bg-slate-950 text-orange-500 font-mono text-[10px] px-5 py-2.5 border border-slate-800 uppercase tracking-[0.2em] rounded-full shadow-2xl">
              <FiShield className="text-xs animate-pulse text-orange-500" />
              <span>SECURED SYSTEM MATRIX</span>
            </div>
          </div>

          {/* Left Wing Segment - Safety Framework */}
          <div className="space-y-4 relative group">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug group-hover:text-orange-500 transition-colors">
              {isBn
                ? 'আপনার নিরাপত্তা আমাদের কাছে সবচেয়ে গুরুত্বপূর্ণ'
                : 'Your Safety is Our Utmost Priority'}
            </h3>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              {isBn
                ? 'আমার মিস্ত্রি মানেই সর্বোচ্চ সুরক্ষা! বুকিং করা থেকে শুরু করে কাজ শেষ হওয়া পর্যন্ত আপনার নিরাপত্তার জন্য রয়েছে আমাদের রেপিড রেসপন্স টিম, সার্বক্ষণিক কল সেন্টার এবং লাইভ কাস্টমার সাপোর্ট অপশন।'
                : 'With Amar Mistry, safety comes first. From booking confirmations to task execution, we provide a rapid response team, round-the-clock call centers, and customer support channels.'}
            </p>
            <button
              onClick={() => setActiveModal('safety')}
              className="flex items-center gap-2 text-xs font-mono font-bold text-orange-500 uppercase tracking-widest hover:text-white transition-colors pt-2 group/btn"
            >
              <span>{isBn ? '// আরও জানুন' : '// Read More'}</span>
              <FiArrowRight className="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>

          {/* Right Wing Segment - Tracking Metrics */}
          <div className="space-y-4 relative group md:pl-6">
            <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug group-hover:text-orange-500 transition-colors">
              {isBn
                ? 'রিয়েল-টাইম লাইভ ট্র্যাকিং সার্ভিস'
                : 'Real-Time Live Tracking Service'}
            </h3>
            <p className="text-sm font-medium text-slate-400 leading-relaxed">
              {isBn
                ? 'আমাদের এডভান্সড লোকেশন ট্র্যাকিং ফিচারের মাধ্যমে আপনি যেকোনো সময় দেখতে পারবেন আপনার মিস্ত্রি এখন ঠিক কোথায় আছেন। আপনার বর্তমান কাজের অগ্রগতি বন্ধু এবং পরিবারের সাথে শেয়ার করার সুবিধা।'
                : 'Monitor your hired professional location at any second using our built-in live status tracker. Share your ongoing work updates with your close friends and family members easily.'}
            </p>
            <button
              onClick={() => setActiveModal('tracking')}
              className="flex items-center gap-2 text-xs font-mono font-bold text-orange-500 uppercase tracking-widest hover:text-white transition-colors pt-2 group/btn"
            >
              <span>{isBn ? '// আরও জানুন' : '// Read More'}</span>
              <FiArrowRight className="transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Modals Layer Framework ── */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
          <div className="bg-[#0c111d] border border-slate-900 w-full max-w-2xl rounded-3xl p-6 md:p-10 relative shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* System close control trigger */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full transition-colors border border-slate-800"
            >
              <FiX className="w-4 h-4" />
            </button>

            {/* Dynamic Content Component Stream */}
            {activeModal === 'safety' && <SafetyDetails isBn={isBn} />}
            {activeModal === 'tracking' && <LiveTrackingInfo isBn={isBn} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default SafetyAndGallery;
