import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FiShield,
  FiDollarSign,
  FiClock,
  FiActivity,
  FiArrowUpRight,
  FiZap,
} from 'react-icons/fi';

const WhyChooseUs = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  // Value Proposition List Data - Meticulously preserved without any omissions
  const features = [
    {
      icon: <FiShield />,
      titleBn: 'ভেরিফাইড ও দক্ষ মিস্ত্রি',
      titleEn: 'Verified Experts',
      descBn:
        'আমাদের প্রতিটি মিস্ত্রি এনআইডি (NID) এবং ব্যাকগ্রাউন্ড ভেরিফাইড ও কাজের ক্ষেত্রে অত্যন্ত দক্ষ।',
      descEn:
        'Every mechanic is NID background-verified and highly skilled in their respective trades.',
      gradientFrom: 'from-blue-500',
      gradientTo: 'to-cyan-400',
      glowColor: 'rgba(59,130,246,0.25)',
      badgeBn: 'নিরাপত্তা',
      badgeEn: 'Safety First',
      number: '01',
    },
    {
      icon: <FiDollarSign />,
      titleBn: 'কোনো হিডেন চার্জ নেই',
      titleEn: 'Transparent Pricing',
      descBn:
        'কাজের আগেই ফিক্সড রেট জেনে নিন। কোনো রকম অতিরিক্ত বা লুকানো চার্জের ঝামেলা নেই।',
      descEn:
        'Know the exact cost before the job begins. Absolute transparency with zero hidden fees.',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-400',
      glowColor: 'rgba(52,211,153,0.25)',
      badgeBn: 'সাশ্রয়ী',
      badgeEn: 'Best Rates',
      number: '02',
    },
    {
      icon: <FiClock />,
      titleBn: '১ ঘণ্টার মধ্যে সার্ভিস',
      titleEn: 'Quick Response',
      descBn:
        'জরুরি প্রয়োজনে বুকিং করার মাত্র ১ ঘণ্টার মধ্যে আমাদের দক্ষ মিস্ত্রি আপনার দরজায়।',
      descEn:
        'In emergencies, our professionals arrive at your doorstep within just 60 minutes.',
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-400',
      glowColor: 'rgba(251,191,36,0.25)',
      badgeBn: 'দ্রুত সেবা',
      badgeEn: '60 Mins Response',
      number: '03',
    },
  ];

  return (
    <div
      className="w-full py-20 md:py-32 overflow-hidden relative"
      style={{
        background:
          'linear-gradient(135deg, #0a0f1e 0%, #0d1527 40%, #0f1a2e 70%, #0a0e1a 100%)',
      }}
    >
      {/* Background mesh grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,179,237,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,179,237,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Ambient glow blobs */}
      <div
        className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(241,142,50,0.09) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-[-60px] right-[-60px] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Fluid Grid Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* ── LEFT BLOCK ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full lg:col-span-5 flex flex-col justify-between relative overflow-hidden"
            style={{
              background:
                'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '2.5rem',
            }}
          >
            {/* Top-right corner accent line */}
            <div
              className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
              style={{
                background:
                  'linear-gradient(225deg, rgba(99,179,237,0.18) 0%, transparent 60%)',
              }}
            />
            {/* Bottom-left accent */}
            <div
              className="absolute bottom-0 left-0 w-28 h-1 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, #F18E32, transparent)',
              }}
            />

            {/* Decorative huge background icon */}
            <div className="absolute -right-8 -bottom-8 text-white/[0.025] text-[220px] pointer-events-none select-none">
              <FiActivity />
            </div>

            <div className="space-y-5 relative z-10">
              {/* Badge pill */}
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: 'rgba(241,142,50,0.12)',
                  border: '1px solid rgba(241,142,50,0.25)',
                }}
              >
                <FiZap className="text-[#F18E32] text-[10px]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F18E32]">
                  {currentLang === 'bn' ? 'আমাদের বৈশিষ্ট্য' : 'WHY CHOOSE US'}
                </span>
              </div>

              {/* Main heading */}
              <h2
                className="text-2xl md:text-[2.1rem] font-black leading-[1.2] tracking-tight"
                style={{ color: '#f1f5f9' }}
              >
                {currentLang === 'bn' ? (
                  'দেশের প্রথম ও সর্ববৃহৎ টেকনিক্যাল সার্ভিস বুকিং প্ল্যাটফর্ম'
                ) : (
                  <>
                    The Nation's First &amp; Largest Technical Service Booking
                    Platform
                  </>
                )}
              </h2>
            </div>

            {/* Bottom section */}
            <div className="pt-14 lg:pt-0 relative z-10">
              {/* Gradient divider */}
              <div
                className="w-14 h-[3px] mb-5"
                style={{
                  background: 'linear-gradient(90deg, #F18E32, #fca5a5)',
                }}
              />
              <p
                className="text-sm font-medium leading-relaxed"
                style={{ color: 'rgba(203,213,225,0.65)' }}
              >
                {currentLang === 'bn'
                  ? 'গ্রাহকদের শতভাগ সন্তুষ্টি এবং সর্বোচ্চ নিরাপত্তা নিশ্চিত করতে আমরা সবসময় বদ্ধপরিকর।'
                  : 'We are fiercely committed to ensuring absolute safety, premium quality, and 100% customer satisfaction.'}
              </p>

              {/* Stats row */}
              <div className="mt-8 grid grid-cols-3 gap-3">
                {[
                  {
                    numBn: '১০,০০০+',
                    numEn: '10K+',
                    labelBn: 'বুকিং',
                    labelEn: 'Bookings',
                  },
                  {
                    numBn: '৫০০+',
                    numEn: '500+',
                    labelBn: 'মিস্ত্রি',
                    labelEn: 'Mistri',
                  },
                  {
                    numBn: '৯৮%',
                    numEn: '98%',
                    labelBn: 'সন্তুষ্ট',
                    labelEn: 'Satisfied',
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="text-center py-3 px-2"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <div
                      className="text-lg font-black"
                      style={{ color: '#93c5fd' }}
                    >
                      {currentLang === 'bn' ? stat.numBn : stat.numEn}
                    </div>
                    <div
                      className="text-[10px] font-semibold uppercase tracking-widest mt-0.5"
                      style={{ color: 'rgba(148,163,184,0.6)' }}
                    >
                      {currentLang === 'bn' ? stat.labelBn : stat.labelEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Feature Cards ── */}
          <div className="w-full lg:col-span-7 flex flex-col justify-between gap-4 md:gap-5">
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                whileTap={{ scale: 0.985 }}
                transition={{
                  duration: 0.45,
                  ease: 'easeOut',
                  delay: idx * 0.1,
                }}
                className="group relative flex flex-col sm:flex-row sm:items-center gap-5 cursor-pointer overflow-hidden"
                style={{
                  padding: '1.75rem 2rem',
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = `1px solid rgba(255,255,255,0.16)`;
                  e.currentTarget.style.background =
                    'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.035) 100%)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 20px 60px ${item.glowColor}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border =
                    '1px solid rgba(255,255,255,0.08)';
                  e.currentTarget.style.background =
                    'linear-gradient(145deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.02) 100%)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Left gradient ribbon */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b ${item.gradientFrom} ${item.gradientTo} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Subtle bg glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at left center, ${item.glowColor} 0%, transparent 65%)`,
                  }}
                />

                {/* Step number — decorative */}
                <div
                  className="absolute top-3 right-4 font-black text-[2.5rem] leading-none pointer-events-none select-none"
                  style={{ color: 'rgba(255,255,255,0.04)' }}
                >
                  {item.number}
                </div>

                {/* Icon box */}
                <div
                  className={`relative z-10 text-2xl flex-shrink-0 flex items-center justify-center w-14 h-14 bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} text-white shadow-lg`}
                  style={{ borderRadius: '0' }}
                >
                  {item.icon}
                </div>

                {/* Content */}
                <div className="relative z-10 space-y-1.5 flex-1">
                  {/* Badge + Arrow row */}
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className="text-[9px] font-black uppercase tracking-[0.18em] px-2.5 py-0.5"
                      style={{
                        color: 'rgba(148,163,184,0.7)',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {currentLang === 'bn' ? item.badgeBn : item.badgeEn}
                    </span>
                    <FiArrowUpRight
                      className="text-lg hidden sm:block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      style={{ color: 'rgba(148,163,184,0.35)' }}
                    />
                  </div>

                  {/* Title */}
                  <h3
                    className={`text-base md:text-lg font-black tracking-tight transition-all duration-200`}
                    style={{ color: '#e2e8f0' }}
                  >
                    {currentLang === 'bn' ? item.titleBn : item.titleEn}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-xs md:text-sm font-medium leading-relaxed max-w-xl"
                    style={{ color: 'rgba(148,163,184,0.65)' }}
                  >
                    {currentLang === 'bn' ? item.descBn : item.descEn}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;
