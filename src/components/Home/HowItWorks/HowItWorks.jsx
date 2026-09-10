import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiCalendar,
  FiUserCheck,
  FiShield,
  FiChevronRight,
} from 'react-icons/fi';

// ─── Accent palette per step ───────────────────────────────────────────────
const ACCENTS = [
  {
    hex: '#60a5fa',
    glow: 'rgba(96,165,250,0.22)',
    gradStart: '#3b82f6',
    gradEnd: '#06b6d4',
    iconBg: 'rgba(59,130,246,0.15)',
    iconBorder: 'rgba(96,165,250,0.35)',
  },
  {
    hex: '#34d399',
    glow: 'rgba(52,211,153,0.22)',
    gradStart: '#10b981',
    gradEnd: '#06b6d4',
    iconBg: 'rgba(16,185,129,0.15)',
    iconBorder: 'rgba(52,211,153,0.35)',
  },
  {
    hex: '#fbbf24',
    glow: 'rgba(251,191,36,0.22)',
    gradStart: '#f59e0b',
    gradEnd: '#f97316',
    iconBg: 'rgba(245,158,11,0.15)',
    iconBorder: 'rgba(251,191,36,0.35)',
  },
];

const HowItWorks = () => {
  const { i18n } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: <FiCalendar />,
      stepNum: '01',
      titleBn: 'সার্ভিস ও সময় বেছে নিন',
      titleEn: 'Select Service & Slot',
      descBn:
        'আপনার প্রয়োজনীয় ক্যাটাগরি সিলেক্ট করুন এবং আপনার সুবিধাজনক দিন ও সময় নির্ধারণ করুন।',
      descEn:
        'Choose your desired service category and pick a convenient date and time slot.',
      image: 'https://i.ibb.co.com/N6sSBtFv/img-1.avif',
    },
    {
      icon: <FiUserCheck />,
      stepNum: '02',
      titleBn: 'মিস্ত্রি আপনার দরজায়',
      titleEn: 'Expert Arrives at Your Door',
      descBn:
        'নির্ধারিত সময়ে আমাদের ভেরিফাইড এবং দক্ষ মেকানিক আপনার ঠিকানায় প্রয়োজনীয় টুলসসহ পৌঁছে যাবে।',
      descEn:
        'Our verified expert mechanic arrives at your location on time equipped with all necessary tools.',
      image: 'https://i.ibb.co.com/1fmx623Q/img-2.avif',
    },
    {
      icon: <FiShield />,
      stepNum: '03',
      titleBn: 'কাজ শেষে নিরাপদ পেমেন্ট করুন',
      titleEn: 'Job Done & Pay Securely',
      descBn:
        'কাজ নিখুঁতভাবে সম্পন্ন হওয়ার পর আমাদের অ্যাপের মাধ্যমে ক্যাশ বা ডিজিটালি নিরাপদ পেমেন্ট করুন।',
      descEn:
        'Once the work is perfectly completed, make a hassle-free payment via cash or secure digital gateways.',
      image: 'https://i.ibb.co.com/VY59NJ0B/img-3.avif',
    },
  ];

  const accent = ACCENTS[activeStep];
  const step = steps[activeStep];
  const isBn = i18n.language === 'bn';

  return (
    <section
      className="w-full relative overflow-hidden py-24 md:py-36"
      style={{
        background:
          'linear-gradient(140deg, #080d1a 0%, #0c1322 45%, #0e1628 70%, #080c18 100%)',
      }}
    >
      {/* ── Mesh grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148,163,184,0.028) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.028) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      />

      {/* ── Dynamic ambient glow follows active step color ── */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute pointer-events-none"
        style={{
          top: '-120px',
          right: '-120px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent.glow} 0%, transparent 65%)`,
        }}
      />
      <div
        className="absolute pointer-events-none bottom-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(16,185,129,0.055) 0%, transparent 68%)',
        }}
      />

      {/* ── Outer container ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-16 md:mb-24"
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-5"
            style={{
              background: `rgba(241,142,50,0.15)`,
              border: `1px solid rgba(241,142,50,0.35)`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: '#F18E32' }}
            />
            <span
              className="text-[10px] font-black uppercase tracking-[0.22em]"
              style={{ color: '#F18E32' }}
            >
              {isBn ? 'সহজ প্রক্রিয়া' : 'EASY STEPS'}
            </span>
          </div>

          {/* Heading + sub */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2
              className="text-3xl md:text-5xl font-black tracking-tight leading-tight"
              style={{ color: '#f1f5f9' }}
            >
              {isBn ? (
                <>
                  ৩টি সহজ ধাপে
                  <br />
                  <span style={{ color: '#F18E32' }}>সেবা নিন</span>
                </>
              ) : (
                <>
                  How It
                  <br />
                  <span style={{ color: '#F18E32' }}>Works</span>
                </>
              )}
            </h2>

            <p
              className="text-sm font-medium max-w-xs leading-relaxed md:text-right"
              style={{ color: 'rgba(148,163,184,0.55)' }}
            >
              {isBn
                ? 'মাত্র কয়েকটি ধাপে পেশাদার মিস্ত্রি সেবা বুক করুন।'
                : 'Book professional services in just a few simple steps.'}
            </p>
          </div>
        </motion.div>

        {/* ── Main two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ════ LEFT: Floating image card ════ */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="relative"
          >
            {/* Outer glow ring */}
            <motion.div
              key={`ring-${activeStep}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute -inset-[1px] pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${accent.gradStart}28, ${accent.gradEnd}14, transparent 60%)`,
              }}
            />

            {/* Image wrapper */}
            <div
              className="relative overflow-hidden"
              style={{
                border: `1px solid ${accent.hex}28`,
                minHeight: '400px',
                maxHeight: '500px',
              }}
            >
              {/* Animated image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStep}
                  src={step.image}
                  alt={step.titleEn}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.38, ease: 'easeInOut' }}
                  className="w-full object-cover"
                  style={{
                    minHeight: '400px',
                    maxHeight: '500px',
                    display: 'block',
                  }}
                  onError={e => {
                    e.target.style.display = 'none';
                  }}
                />
              </AnimatePresence>

              {/* Bottom overlay gradient */}
              <div
                className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(8,13,26,0.92) 0%, rgba(8,13,26,0.4) 55%, transparent 100%)',
                }}
              />

              {/* Step label — bottom left */}
              <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between">
                <div>
                  <div
                    className="text-[9px] font-black uppercase tracking-[0.25em] mb-1"
                    style={{ color: accent.hex }}
                  >
                    {isBn ? `ধাপ ${step.stepNum}` : `STEP ${step.stepNum}`}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={activeStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.28 }}
                      className="text-base md:text-xl font-black tracking-tight"
                      style={{ color: '#f8fafc' }}
                    >
                      {isBn ? step.titleBn : step.titleEn}
                    </motion.h3>
                  </AnimatePresence>
                </div>

                {/* Step dot nav */}
                <div className="flex items-center gap-1.5 pb-0.5">
                  {steps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className="transition-all duration-300 outline-none"
                      style={{
                        width: activeStep === i ? '22px' : '6px',
                        height: '6px',
                        background:
                          activeStep === i
                            ? accent.hex
                            : 'rgba(255,255,255,0.2)',
                        border: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Corner accent — top right */}
              <div
                className="absolute top-0 right-0 w-16 h-16 pointer-events-none"
                style={{
                  background: `linear-gradient(225deg, ${accent.hex}22 0%, transparent 55%)`,
                }}
              />

              {/* Active glow inset */}
              <motion.div
                key={`imgGlow-${activeStep}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: `inset 0 0 48px ${accent.glow}` }}
              />
            </div>
          </motion.div>

          {/* ════ RIGHT: Timeline step cards ════ */}
          <div className="flex flex-col gap-0 relative">
            {/* Vertical connector line */}
            <div
              className="absolute left-[27px] top-8 bottom-8 w-[1px] pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            />

            {steps.map((s, idx) => {
              const a = ACCENTS[idx];
              const isSelected = activeStep === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 28 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    ease: 'easeOut',
                    delay: idx * 0.1,
                  }}
                  onMouseEnter={() => setActiveStep(idx)}
                  className="relative flex items-start gap-5 cursor-pointer"
                  style={{
                    padding: '1.2rem 1.2rem 1.2rem 0',
                    marginBottom: idx < 2 ? '4px' : '0',
                  }}
                >
                  {/* ── Timeline node ── */}
                  <div
                    className="flex-shrink-0 relative z-10"
                    style={{
                      width: '56px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <motion.div
                      animate={{
                        background: isSelected
                          ? `linear-gradient(135deg, ${a.gradStart}, ${a.gradEnd})`
                          : 'rgba(255,255,255,0.06)',
                        borderColor: isSelected
                          ? `${a.hex}80`
                          : 'rgba(255,255,255,0.1)',
                        boxShadow: isSelected ? `0 0 24px ${a.glow}` : 'none',
                      }}
                      transition={{ duration: 0.35 }}
                      className="w-14 h-14 flex items-center justify-center text-xl font-black"
                      style={{
                        border: '1px solid',
                        color: isSelected ? '#fff' : 'rgba(148,163,184,0.35)',
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {isSelected ? (
                          <motion.span
                            key="icon"
                            initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.6 }}
                            transition={{ duration: 0.2 }}
                          >
                            {s.icon}
                          </motion.span>
                        ) : (
                          <motion.span
                            key="num"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm"
                          >
                            {s.stepNum}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>

                  {/* ── Card body ── */}
                  <motion.div
                    animate={{
                      background: isSelected
                        ? 'rgba(255,255,255,0.07)'
                        : 'rgba(255,255,255,0.025)',
                      borderColor: isSelected
                        ? `${a.hex}38`
                        : 'rgba(255,255,255,0.07)',
                      x: isSelected ? 4 : 0,
                      boxShadow: isSelected ? `0 12px 40px ${a.glow}` : 'none',
                    }}
                    transition={{ duration: 0.35 }}
                    className="flex-1 relative overflow-hidden"
                    style={{ padding: '1rem 1.3rem', border: '1px solid' }}
                  >
                    {/* Active left ribbon */}
                    <motion.div
                      animate={{
                        scaleY: isSelected ? 1 : 0,
                        opacity: isSelected ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-0 top-0 bottom-0 w-[3px] origin-top"
                      style={{
                        background: `linear-gradient(to bottom, ${a.gradStart}, ${a.gradEnd})`,
                      }}
                    />

                    {/* Subtle inner glow */}
                    {isSelected && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at 0% 50%, ${a.glow} 0%, transparent 60%)`,
                        }}
                      />
                    )}

                    {/* Badge + arrow row */}
                    <div className="flex items-center justify-between mb-1.5 relative z-10">
                      <span
                        className="text-[9px] font-black uppercase tracking-[0.18em] px-2 py-0.5"
                        style={{
                          color: isSelected ? a.hex : 'rgba(148,163,184,0.4)',
                          background: isSelected
                            ? a.iconBg
                            : 'rgba(255,255,255,0.04)',
                          border: `1px solid ${isSelected ? a.iconBorder : 'rgba(255,255,255,0.07)'}`,
                        }}
                      >
                        {s.stepNum}
                      </span>
                      <motion.div
                        animate={{
                          color: isSelected ? a.hex : 'rgba(148,163,184,0.18)',
                          x: isSelected ? 2 : 0,
                          y: isSelected ? -2 : 0,
                        }}
                        transition={{ duration: 0.25 }}
                      >
                        <FiChevronRight className="text-sm" />
                      </motion.div>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-sm md:text-base font-black tracking-tight mb-1.5 relative z-10"
                      style={{
                        color: isSelected ? '#f1f5f9' : 'rgba(203,213,225,0.5)',
                        transition: 'color 0.3s',
                      }}
                    >
                      {isBn ? s.titleBn : s.titleEn}
                    </h3>

                    {/* Description */}
                    <motion.p
                      animate={{ opacity: isSelected ? 1 : 0.4 }}
                      transition={{ duration: 0.3 }}
                      className="text-xs font-medium leading-relaxed relative z-10"
                      style={{ color: 'rgba(148,163,184,0.65)' }}
                    >
                      {isBn ? s.descBn : s.descEn}
                    </motion.p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
