import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { FiUsers, FiSliders, FiStar, FiCheckSquare } from 'react-icons/fi';
import axios from 'axios';

/* ── Animated Number ── */
const AnimatedNumber = ({ value, isDecimal = false }) => {
  const springValue = useSpring(value, {
    stiffness: 40,
    damping: 15,
    mass: 0.5,
  });
  const ref = useRef(null);
  useEffect(
    () =>
      springValue.on('change', latest => {
        if (ref.current)
          ref.current.textContent = isDecimal
            ? latest.toFixed(1)
            : Math.floor(latest).toLocaleString();
      }),
    [springValue, isDecimal],
  );
  return <span ref={ref} />;
};

/* ── Card ── */
const StatCard = ({ stat, lang }) => (
  <div
    className="relative overflow-hidden group flex flex-col justify-between min-h-[200px] p-7 transition-all duration-300"
    style={{
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(249,115,22,0.35)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
    }}
  >
    {/* Watermark */}
    <div
      className="absolute right-4 bottom-2 font-black text-7xl md:text-8xl pointer-events-none select-none tracking-tighter transition-all duration-500 group-hover:scale-110"
      style={{
        color: 'rgba(255,255,255,0.03)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {stat.watermark}
    </div>

    {/* Top row: icon + metric label */}
    <div className="flex items-center justify-between relative z-10">
      <div
        className="w-10 h-10 flex items-center justify-center transition-all duration-300"
        style={{
          background: 'rgba(249,115,22,0.08)',
          border: '1px solid rgba(249,115,22,0.15)',
        }}
      >
        <span style={{ color: stat.color }}>{stat.icon}</span>
      </div>
      <span
        className="text-[9px] font-bold uppercase tracking-[0.2em]"
        style={{ color: 'rgba(255,255,255,0.2)' }}
      >
        {lang === 'bn' ? `মাইলস্টোন ০${stat.id}` : `METRIC 0${stat.id}`}
      </span>
    </div>

    {/* Value + label */}
    <div className="relative z-10 mt-6 space-y-1.5">
      <div className="flex items-baseline gap-0.5">
        <span
          className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {stat.val}
        </span>
        {stat.suffix && (
          <span
            className="text-2xl font-black ml-0.5"
            style={{ color: stat.color }}
          >
            {stat.suffix}
          </span>
        )}
      </div>
      <p
        className="text-[11px] font-bold uppercase tracking-[0.15em]"
        style={{ color: 'rgba(255,255,255,0.35)' }}
      >
        {lang === 'bn' ? stat.titleBn : stat.titleEn}
      </p>
    </div>

    {/* Bottom laser line */}
    <div
      className="absolute bottom-0 left-0 right-0 h-[1.5px]"
      style={{ background: 'rgba(255,255,255,0.04)' }}
    />
    <div className="absolute bottom-0 left-0 right-0 h-[1.5px] overflow-hidden">
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
        className="w-full h-full"
        style={{
          background: `linear-gradient(to right, transparent, ${stat.color}, transparent)`,
        }}
      />
    </div>

    {/* Hover corner glow */}
    <div
      className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{
        background: `radial-gradient(circle at top right, ${stat.color}18, transparent 70%)`,
      }}
    />
  </div>
);

/* ── Main Component ── */
const AchievementCounter = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const containerRef = useRef(null);

  const [maxCustomers, setMaxCustomers] = useState(0);
  const [maxExperts, setMaxExperts] = useState(0);
  const [maxCategories, setMaxCategories] = useState(0);
  const [maxRating, setMaxRating] = useState(0.0);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "/api") || 'http://localhost:5000';

        const mechanicsRes = await axios.get(`${apiUrl}/mechanics`);
        if (Array.isArray(mechanicsRes.data))
          setMaxExperts(mechanicsRes.data.length);

        const servicesRes = await axios.get(`${apiUrl}/services`);
        if (servicesRes.data && typeof servicesRes.data === 'object') {
          const keys = Object.keys(servicesRes.data).filter(k => k !== '_id');
          setMaxCategories(keys.length);
        }

        const reviewsRes = await axios.get(`${apiUrl}/reviews/all`);
        if (Array.isArray(reviewsRes.data) && reviewsRes.data.length > 0) {
          const avg =
            reviewsRes.data.reduce((s, r) => s + (r.rating || 0), 0) /
            reviewsRes.data.length;
          setMaxRating(Number(avg.toFixed(1)));
        } else {
          setMaxRating(5.0);
        }

        const bookingsRes = await axios.get(`${apiUrl}/bookings`);
        if (bookingsRes.data) {
          const len = Array.isArray(bookingsRes.data)
            ? bookingsRes.data.length
            : (bookingsRes.data.length ?? 0);
          setMaxCustomers(len);
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics metrics:', err);
      }
    };
    fetchMetrics();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  const customersValue = useTransform(
    scrollYProgress,
    [0, 1],
    [0, maxCustomers],
  );
  const expertsValue = useTransform(scrollYProgress, [0, 1], [0, maxExperts]);
  const categoriesValue = useTransform(
    scrollYProgress,
    [0, 1],
    [0, maxCategories],
  );
  const ratingValue = useTransform(scrollYProgress, [0, 1], [0, maxRating]);

  const stats = [
    {
      id: 1,
      icon: <FiUsers className="w-4 h-4" />,
      val: <AnimatedNumber value={customersValue} />,
      suffix: '+',
      titleBn: 'হ্যাপি কাস্টমার',
      titleEn: 'Happy Customers',
      watermark:
        maxCustomers > 999
          ? `${(maxCustomers / 1000).toFixed(1)}K`
          : String(maxCustomers),
      color: '#38bdf8',
    },
    {
      id: 2,
      icon: <FiCheckSquare className="w-4 h-4" />,
      val: <AnimatedNumber value={expertsValue} />,
      suffix: '+',
      titleBn: 'ভেরিফাইড মিস্ত্রি',
      titleEn: 'Verified Experts',
      watermark: String(maxExperts),
      color: '#34d399',
    },
    {
      id: 3,
      icon: <FiSliders className="w-4 h-4" />,
      val: <AnimatedNumber value={categoriesValue} />,
      suffix: '+',
      titleBn: 'সার্ভিস ক্যাটাগরি',
      titleEn: 'Service Categories',
      watermark: String(maxCategories),
      color: '#F97316',
    },
    {
      id: 4,
      icon: <FiStar className="w-4 h-4" />,
      val: <AnimatedNumber value={ratingValue} isDecimal />,
      suffix: '',
      titleBn: 'অ্যাভারেজ রেটিং',
      titleEn: 'Average Rating',
      watermark: maxRating.toFixed(1),
      color: '#fbbf24',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="w-full relative overflow-hidden border-b"
      style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      {/* Ambient orange glow — top center */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[100px]"
        style={{
          background:
            'radial-gradient(ellipse, rgba(249,115,22,0.1) 0%, transparent 70%)',
        }}
      />

      {/* Top border accent */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(249,115,22,0.5) 30%, rgba(249,115,22,0.5) 70%, transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-12">
          <div
            className="h-px flex-1"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: 'rgba(249,115,22,0.7)' }}
          >
            {lang === 'bn' ? 'আমাদের অর্জন' : 'Our Achievements'}
          </span>
          <div
            className="h-px flex-1"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
        </div>

        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
            {lang === 'bn' ? (
              <>
                সংখ্যায় আমাদের <span style={{ color: '#F97316' }}>সাফল্য</span>
              </>
            ) : (
              <>
                Our Platform{' '}
                <span style={{ color: '#F97316' }}>in Numbers</span>
              </>
            )}
          </h2>
          <p
            className="mt-3 text-sm"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            {lang === 'bn'
              ? 'রিয়েল-টাইম ডেটা থেকে আপডেট হওয়া তথ্য'
              : 'Live data updated in real time from our platform'}
          </p>
        </div>

        {/* Stats grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          {stats.map(stat => (
            <StatCard key={stat.id} stat={stat} lang={lang} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementCounter;

// import { useRef, useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
// import { FiUsers, FiSliders, FiStar, FiCheckSquare } from 'react-icons/fi';
// import axios from 'axios';

// /* ── Animated Number ── */
// const AnimatedNumber = ({ value, isDecimal = false }) => {
//   const springValue = useSpring(value, {
//     stiffness: 40,
//     damping: 15,
//     mass: 0.5,
//   });
//   const ref = useRef(null);
//   useEffect(
//     () =>
//       springValue.on('change', latest => {
//         if (ref.current)
//           ref.current.textContent = isDecimal
//             ? latest.toFixed(1)
//             : Math.floor(latest).toLocaleString();
//       }),
//     [springValue, isDecimal],
//   );
//   return <span ref={ref} />;
// };

// /* ── Card ── */
// const StatCard = ({ stat, lang }) => (
//   <div
//     className="relative overflow-hidden group flex flex-col justify-between min-h-[200px] p-7 transition-all duration-300"
//     style={{
//       background: '#111111',
//       border: '1px solid rgba(255,255,255,0.06)',
//     }}
//     onMouseEnter={e => {
//       e.currentTarget.style.borderColor = 'rgba(249,115,22,0.35)';
//     }}
//     onMouseLeave={e => {
//       e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
//     }}
//   >
//     {/* Watermark */}
//     <div
//       className="absolute right-4 bottom-2 font-black text-7xl md:text-8xl pointer-events-none select-none tracking-tighter transition-all duration-500 group-hover:scale-110"
//       style={{
//         color: 'rgba(255,255,255,0.03)',
//         fontVariantNumeric: 'tabular-nums',
//       }}
//     >
//       {stat.watermark}
//     </div>

//     {/* Top row: icon + metric label */}
//     <div className="flex items-center justify-between relative z-10">
//       <div
//         className="w-10 h-10 flex items-center justify-center transition-all duration-300"
//         style={{
//           background: 'rgba(249,115,22,0.08)',
//           border: '1px solid rgba(249,115,22,0.15)',
//         }}
//       >
//         <span style={{ color: stat.color }}>{stat.icon}</span>
//       </div>
//       <span
//         className="text-[9px] font-bold uppercase tracking-[0.2em]"
//         style={{ color: 'rgba(255,255,255,0.2)' }}
//       >
//         {lang === 'bn' ? `মাইলস্টোন ০${stat.id}` : `METRIC 0${stat.id}`}
//       </span>
//     </div>

//     {/* Value + label */}
//     <div className="relative z-10 mt-6 space-y-1.5">
//       <div className="flex items-baseline gap-0.5">
//         <span
//           className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none"
//           style={{ fontVariantNumeric: 'tabular-nums' }}
//         >
//           {stat.val}
//         </span>
//         {stat.suffix && (
//           <span
//             className="text-2xl font-black ml-0.5"
//             style={{ color: stat.color }}
//           >
//             {stat.suffix}
//           </span>
//         )}
//       </div>
//       <p
//         className="text-[11px] font-bold uppercase tracking-[0.15em]"
//         style={{ color: 'rgba(255,255,255,0.35)' }}
//       >
//         {lang === 'bn' ? stat.titleBn : stat.titleEn}
//       </p>
//     </div>

//     {/* Bottom laser line */}
//     <div
//       className="absolute bottom-0 left-0 right-0 h-[1.5px]"
//       style={{ background: 'rgba(255,255,255,0.04)' }}
//     />
//     <div className="absolute bottom-0 left-0 right-0 h-[1.5px] overflow-hidden">
//       <motion.div
//         initial={{ x: '-100%' }}
//         animate={{ x: '100%' }}
//         transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
//         className="w-full h-full"
//         style={{
//           background: `linear-gradient(to right, transparent, ${stat.color}, transparent)`,
//         }}
//       />
//     </div>

//     {/* Hover corner glow */}
//     <div
//       className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
//       style={{
//         background: `radial-gradient(circle at top right, ${stat.color}18, transparent 70%)`,
//       }}
//     />
//   </div>
// );

// /* ── Main Component ── */
// const AchievementCounter = () => {
//   const { i18n } = useTranslation();
//   const lang = i18n.language === 'bn' ? 'bn' : 'en';
//   const containerRef = useRef(null);

//   const [maxCustomers, setMaxCustomers] = useState(0);
//   const [maxExperts, setMaxExperts] = useState(0);
//   const [maxCategories, setMaxCategories] = useState(0);
//   const [maxRating, setMaxRating] = useState(0.0);

//   useEffect(() => {
//     const fetchMetrics = async () => {
//       try {
//         const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "/api") || 'http://localhost:5000';

//         const mechanicsRes = await axios.get(`${apiUrl}/mechanics`);
//         if (Array.isArray(mechanicsRes.data))
//           setMaxExperts(mechanicsRes.data.length);

//         const servicesRes = await axios.get(`${apiUrl}/services`);
//         if (servicesRes.data && typeof servicesRes.data === 'object') {
//           const keys = Object.keys(servicesRes.data).filter(k => k !== '_id');
//           setMaxCategories(keys.length);
//         }

//         const reviewsRes = await axios.get(`${apiUrl}/reviews/all`);
//         if (Array.isArray(reviewsRes.data) && reviewsRes.data.length > 0) {
//           const avg =
//             reviewsRes.data.reduce((s, r) => s + (r.rating || 0), 0) /
//             reviewsRes.data.length;
//           setMaxRating(Number(avg.toFixed(1)));
//         } else {
//           setMaxRating(5.0);
//         }

//         const bookingsRes = await axios.get(`${apiUrl}/bookings`);
//         if (bookingsRes.data) {
//           const len = Array.isArray(bookingsRes.data)
//             ? bookingsRes.data.length
//             : (bookingsRes.data.length ?? 0);
//           setMaxCustomers(len);
//         }
//       } catch (err) {
//         console.error('Error fetching dashboard statistics metrics:', err);
//       }
//     };
//     fetchMetrics();
//   }, []);

//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ['start end', 'center center'],
//   });

//   const customersValue = useTransform(
//     scrollYProgress,
//     [0, 1],
//     [0, maxCustomers],
//   );
//   const expertsValue = useTransform(scrollYProgress, [0, 1], [0, maxExperts]);
//   const categoriesValue = useTransform(
//     scrollYProgress,
//     [0, 1],
//     [0, maxCategories],
//   );
//   const ratingValue = useTransform(scrollYProgress, [0, 1], [0, maxRating]);

//   const stats = [
//     {
//       id: 1,
//       icon: <FiUsers className="w-4 h-4" />,
//       val: <AnimatedNumber value={customersValue} />,
//       suffix: '+',
//       titleBn: 'হ্যাপি কাস্টমার',
//       titleEn: 'Happy Customers',
//       watermark:
//         maxCustomers > 999
//           ? `${(maxCustomers / 1000).toFixed(1)}K`
//           : String(maxCustomers),
//       color: '#38bdf8',
//     },
//     {
//       id: 2,
//       icon: <FiCheckSquare className="w-4 h-4" />,
//       val: <AnimatedNumber value={expertsValue} />,
//       suffix: '+',
//       titleBn: 'ভেরিফাইড মিস্ত্রি',
//       titleEn: 'Verified Experts',
//       watermark: String(maxExperts),
//       color: '#34d399',
//     },
//     {
//       id: 3,
//       icon: <FiSliders className="w-4 h-4" />,
//       val: <AnimatedNumber value={categoriesValue} />,
//       suffix: '+',
//       titleBn: 'সার্ভিস ক্যাটাগরি',
//       titleEn: 'Service Categories',
//       watermark: String(maxCategories),
//       color: '#F97316',
//     },
//     {
//       id: 4,
//       icon: <FiStar className="w-4 h-4" />,
//       val: <AnimatedNumber value={ratingValue} isDecimal />,
//       suffix: '',
//       titleBn: 'অ্যাভারেজ রেটিং',
//       titleEn: 'Average Rating',
//       watermark: maxRating.toFixed(1),
//       color: '#fbbf24',
//     },
//   ];

//   return (
//     <div
//       ref={containerRef}
//       className="w-full relative overflow-hidden border-b"
//       style={{ background: '#0a0a0a', borderColor: 'rgba(255,255,255,0.06)' }}
//     >
//       {/* Ambient orange glow — top center */}
//       <div
//         aria-hidden
//         className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full blur-[100px]"
//         style={{
//           background:
//             'radial-gradient(ellipse, rgba(249,115,22,0.1) 0%, transparent 70%)',
//         }}
//       />

//       {/* Top border accent */}
//       <div
//         aria-hidden
//         className="absolute top-0 left-0 right-0 h-px"
//         style={{
//           background:
//             'linear-gradient(to right, transparent, rgba(249,115,22,0.5) 30%, rgba(249,115,22,0.5) 70%, transparent)',
//         }}
//       />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
//         {/* Section label */}
//         <div className="flex items-center gap-3 mb-12">
//           <div
//             className="h-px flex-1"
//             style={{ background: 'rgba(255,255,255,0.06)' }}
//           />
//           <span
//             className="text-[10px] font-bold uppercase tracking-[0.22em]"
//             style={{ color: 'rgba(249,115,22,0.7)' }}
//           >
//             {lang === 'bn' ? 'আমাদের অর্জন' : 'Our Achievements'}
//           </span>
//           <div
//             className="h-px flex-1"
//             style={{ background: 'rgba(255,255,255,0.06)' }}
//           />
//         </div>

//         {/* Heading */}
//         <div className="text-center mb-14">
//           <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
//             {lang === 'bn' ? (
//               <>
//                 সংখ্যায় আমাদের <span style={{ color: '#F97316' }}>সাফল্য</span>
//               </>
//             ) : (
//               <>
//                 Our Platform{' '}
//                 <span style={{ color: '#F97316' }}>in Numbers</span>
//               </>
//             )}
//           </h2>
//           <p
//             className="mt-3 text-sm"
//             style={{ color: 'rgba(255,255,255,0.35)' }}
//           >
//             {lang === 'bn'
//               ? 'রিয়েল-টাইম ডেটা থেকে আপডেট হওয়া তথ্য'
//               : 'Live data updated in real time from our platform'}
//           </p>
//         </div>

//         {/* Stats grid */}
//         <div
//           className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px"
//           style={{ background: 'rgba(255,255,255,0.05)' }}
//         >
//           {stats.map(stat => (
//             <StatCard key={stat.id} stat={stat} lang={lang} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AchievementCounter;
