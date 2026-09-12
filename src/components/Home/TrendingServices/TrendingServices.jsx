import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  FiStar,
  FiCpu,
  FiTool,
  FiLayers,
  FiWind,
  FiTrendingUp,
} from 'react-icons/fi';

const TrendingServices = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const popularServices = [
    {
      id: 1,
      bn: 'এসি মেকানিক সার্ভিস',
      en: 'AC Repair & Maintenance',
      rating: '4.9',
      reviews: '1,240',
      orders: { en: '1.5k Bookings Completed', bn: '১.৫টি কাজ সম্পন্ন' },
      icon: <FiWind className="text-3xl text-amber-500" />,
      gridClass:
        'lg:col-span-2 lg:row-span-2 bg-slate-900 text-white border-slate-800/80',
    },
    {
      id: 2,
      bn: 'ইলেক্ট্রিক্যাল সলিউশন',
      en: 'Electrical Solution',
      rating: '4.8',
      reviews: '2,510',
      orders: { en: '2.5k Completed', bn: '২.৫টি সম্পন্ন' },
      icon: <FiCpu className="text-2xl text-blue-400" />,
      gridClass: 'bg-slate-950 text-slate-100 border-slate-900',
    },
    {
      id: 3,
      bn: 'প্লাম্বিং ও ফিটিং',
      en: 'Plumbing & Fitting',
      rating: '4.7',
      reviews: '980',
      orders: { en: '980+ Completed', bn: '৯৮০+ সম্পন্ন' },
      icon: <FiTool className="text-2xl text-emerald-400" />,
      gridClass: 'bg-slate-950 text-slate-100 border-slate-900',
    },
    {
      id: 4,
      bn: 'কাঠমিস্ত্রি ও ফার্নিচার মেরামত',
      en: 'Woodworking & Carpentry',
      rating: '4.8',
      reviews: '850',
      orders: { en: '1.2k Completed', bn: '১.২টি সম্পন্ন' },
      icon: <FiLayers className="text-2xl text-purple-400" />,
      gridClass: 'lg:col-span-2 bg-slate-900 text-white border-slate-800/80',
    },
  ];

  // Framer Motion variant configuration for parent container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12, // Automatically controls staggered timing for children nodes
      },
    },
  };

  // Framer Motion variant configuration for child static nodes
  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 18,
      },
    },
  };

  return (
    <div className="w-full bg-[#060a13] py-20 md:py-28 border-b border-slate-950 relative overflow-hidden">
      {/* Subtle layout architectural mesh grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Section Static Header (Scrolls into view seamlessly) ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-16 space-y-3 max-w-xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-950 border border-slate-900 rounded-full">
            <FiTrendingUp className="text-amber-500 text-xs" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              {currentLang === 'bn' ? 'সবচেয়ে বেশি বুকড' : 'REALTIME STATS'}
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            {currentLang === 'bn'
              ? 'চলতি সপ্তাহের সেরা সেবাসমূহ'
              : 'Trending Services'}
          </h2>
        </motion.div>

        {/* ── Premium Frameless Bento Mesh Layout (Triggered on Scroll Viewport) ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }} // Triggers animation once when 60px visible inside viewport
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[160px] md:auto-rows-[180px] lg:auto-rows-[200px]"
        >
          {popularServices.map(service => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className={`p-6 md:p-8 border rounded-3xl shadow-2xl/10 flex flex-col justify-between relative overflow-hidden select-none cursor-default ${service.gridClass}`}
            >
              {/* Upper Section: Vector Node Display */}
              <div className="flex items-start justify-between relative z-10">
                <div className="p-2 bg-slate-950/40 rounded-3xl border border-slate-800/40">
                  {service.icon}
                </div>
                <span className="font-mono text-[10px] text-slate-600 font-bold tracking-widest">
                  // STAT_0{service.id}
                </span>
              </div>

              {/* Lower Section: Core Content and Metrics */}
              <div className="space-y-2 relative z-10">
                <div className="space-y-1">
                  {/* Rating Info row */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-500">
                    <FiStar className="fill-amber-500 stroke-amber-500 text-[10px]" />
                    <span className="text-slate-300">{service.rating}</span>
                    <span className="text-slate-500 font-medium">
                      ({service.reviews})
                    </span>
                  </div>

                  {/* Plain Text Title */}
                  <h3 className="text-base md:text-lg font-black tracking-tight text-white leading-tight">
                    {currentLang === 'bn' ? service.bn : service.en}
                  </h3>
                </div>

                {/* Counter Metric Metadata Block */}
                <div className="pt-2 border-t border-slate-800/50">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    {service.orders[currentLang]}
                  </span>
                </div>
              </div>

              {/* Faded Architectural Geometric Number node */}
              <div className="absolute right-0 bottom-0 text-[100px] lg:text-[130px] font-black translate-x-4 translate-y-6 select-none pointer-events-none opacity-[0.03] text-white">
                {service.id}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TrendingServices;
