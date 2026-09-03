import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const EarnCTA = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const isBn = i18n.language === 'bn';

  // Active mistri count state
  const [activeMistriCount, setActiveMistriCount] = useState(null);

  // Fetch active mechanics/mistri count from environment-configured API route
  useEffect(() => {
    const fetchMistriCount = async () => {
      try {
        // Fallback to localhost if VITE_API_URL is missing in environment variables
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "/api") || 'http://localhost:5000';
        const response = await axios.get(`${apiUrl}/mechanics`);

        if (Array.isArray(response.data)) {
          setActiveMistriCount(response.data.length);
        } else if (response.data && typeof response.data.count === 'number') {
          setActiveMistriCount(response.data.count);
        }
      } catch (error) {
        console.error('Error fetching mechanics count:', error);
      }
    };

    fetchMistriCount();
  }, []);

  // Helper function to convert numbers to Bengali if language is 'bn'
  const formatCount = count => {
    if (!count) return isBn ? '৫০০০+' : '5000+'; // Fallback value

    const countWithPlus = `${count}+`;
    if (!isBn) return countWithPlus;

    const bngDigits = {
      0: '০',
      1: '১',
      2: '২',
      3: '৩',
      4: '৪',
      5: '৫',
      6: '৬',
      7: '৭',
      8: '৮',
      9: '৯',
    };
    return countWithPlus.replace(/[0-9]/g, w => bngDigits[w]);
  };

  const perks = isBn
    ? [
        'নিজের সময়মতো কাজ করুন',
        'প্রতি কাজে সরাসরি পেমেন্ট',
        'ভেরিফাইড ব্যাজ ও বিশ্বাসযোগ্যতা',
      ]
    : [
        'Work on your own schedule',
        'Get paid directly per job',
        'Earn a Verified Pro badge',
      ];

  return (
    <div
      className="w-full relative overflow-hidden border-b border-white/5"
      style={{ background: '#0a0a0a' }}
    >
      {/* ── Single warm orange glow — top left only ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
        }}
      />

      {/* ── Subtle right edge glow ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          background:
            'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)',
        }}
      />

      {/* ── Very faint grid ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: '72px 72px',
        }}
      />

      {/* ── Horizontal top accent line ── */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent 0%, rgba(249,115,22,0.6) 30%, rgba(249,115,22,0.6) 70%, transparent 100%)',
        }}
      />

      {/* ── Two-column layout ── */}
      <div
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28
        flex flex-col lg:flex-row items-center gap-14 lg:gap-20"
      >
        {/* ── LEFT: Text block ── */}
        <div className="flex-1 min-w-0 flex flex-col items-start">
          {/* Badge indicator node */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-8 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{
              background: 'rgba(249,115,22,0.08)',
              border: '1px solid rgba(249,115,22,0.25)',
              color: '#fb923c',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse flex-shrink-0" />
            {isBn ? 'মিস্ত্রি পার্টনার প্রোগ্রাম' : 'Mistri Partner Program'}
          </div>

          {/* Core Headline block */}
          <h2 className="text-3xl sm:text-4xl md:text-[2.8rem] font-black leading-[1.07] tracking-tight mb-5">
            <span className="text-white">
              {isBn ? 'আপনার দক্ষতা দিয়ে' : 'Turn Your Skills'}
            </span>
            <br />
            <span style={{ color: '#F97316' }}>
              {isBn ? 'আজই আয় করুন' : 'Into Real Income'}
            </span>
          </h2>

          {/* Subtitle mesh wrapper */}
          <p
            className="text-sm md:text-[15px] leading-relaxed mb-9 max-w-[420px]"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            {isBn
              ? 'দেশের সর্বোচ্চ আয়ের বিশ্বস্ত প্ল্যাটফর্মে যোগ দিন। নিজের শর্তে কাজ করুন, সরাসরি পেমেন্ট পান।'
              : "Join the country's most trusted earning platform. Work on your terms, get paid directly for every job."}
          </p>

          {/* Feature perks listing stream */}
          <ul className="space-y-3.5 mb-10">
            {perks.map((perk, i) => (
              <li key={i} className="flex items-center gap-3">
                <FiCheckCircle
                  className="flex-shrink-0 w-4 h-4"
                  style={{ color: '#F97316' }}
                />
                <span
                  className="text-sm"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  {perk}
                </span>
              </li>
            ))}
          </ul>

          {/* Action trigger button */}
          <button
            onClick={() => navigate('/join-mistry')}
            className="group relative inline-flex items-center gap-3 text-white text-sm font-bold px-8 py-4 transition-all duration-200 active:scale-[0.97] overflow-hidden"
            style={{ background: '#F97316' }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#ea6c0a';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#F97316';
            }}
          >
            {/* Reflective light glow shine effect */}
            <span
              aria-hidden
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.15) 50%, transparent 65%)',
              }}
            />
            <span className="relative">
              {isBn ? 'আজই যোগ দিন' : 'Start Earning Now'}
            </span>
            <FiArrowRight className="relative w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          <p
            className="mt-4 text-[11px]"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            {isBn
              ? '✓ বিনামূল্যে রেজিস্ট্রেশন · কোনো লুকানো চার্জ নেই'
              : '✓ Free to join · No hidden charges'}
          </p>
        </div>

        {/* ── RIGHT: Premium UI Graphics illustration matrix ── */}
        <div className="flex-shrink-0 w-full lg:w-[42%] flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[400px]">
            {/* Exterior borders grid wrapper */}
            <div
              className="relative p-px"
              style={{
                background:
                  'linear-gradient(135deg, rgba(249,115,22,0.5) 0%, rgba(255,255,255,0.05) 50%, rgba(249,115,22,0.15) 100%)',
              }}
            >
              {/* Inner container canvas surface */}
              <div
                className="relative flex flex-col overflow-hidden"
                style={{ background: '#111111', minHeight: '340px' }}
              >
                {/* Live stream indicator tag */}
                <div
                  className="absolute top-0 left-0 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest z-20"
                  style={{ background: '#F97316', color: '#0a0a0a' }}
                >
                  {isBn ? 'লাইভ' : 'Live'}
                </div>

                {/* Analytical stats node columns */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                  {[
                    {
                      label: isBn ? 'মাসিক আয়' : 'Avg. Earnings',
                      val: isBn ? '৳৩০,০০০+' : '৳30,000+',
                    },
                    {
                      label: isBn ? 'সক্রিয় মিস্ত্রি' : 'Active Mistri',
                      val: formatCount(activeMistriCount), // Dynamic data field connected to API
                    },
                  ].map(({ label, val }) => (
                    <div
                      key={label}
                      className="px-3 py-2 text-right"
                      style={{
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(249,115,22,0.2)',
                      }}
                    >
                      <p
                        className="text-[9px] font-semibold uppercase tracking-wider"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-sm font-black mt-0.5"
                        style={{ color: '#F97316' }}
                      >
                        {val}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Main system vector asset wrapper */}
                <div className="flex-1 flex items-end justify-center px-6 pt-10">
                  <img
                    src="https://i.ibb.co.com/9kMnFJK8/1-Photoroom.png"
                    alt="Mistri illustration"
                    className="w-full object-contain select-none"
                    style={{ maxHeight: '270px' }}
                    draggable={false}
                  />
                </div>

                {/* Brand architectural meta layout footer */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    background: 'rgba(249,115,22,0.08)',
                    borderTop: '1px solid rgba(249,115,22,0.15)',
                  }}
                >
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    {isBn
                      ? 'আমার মিস্ত্রি প্ল্যাটফর্ম'
                      : 'Amar Mistri Platform'}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            i === 0 ? '#F97316' : 'rgba(255,255,255,0.15)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ambient backdrop glow shadow filter */}
            <div
              aria-hidden
              className="absolute -bottom-3 left-4 right-4 h-8 blur-xl"
              style={{ background: 'rgba(249,115,22,0.2)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnCTA;
