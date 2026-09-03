import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState, useEffect, useRef, useCallback } from 'react';

const getInitials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('');

const StarRating = ({ rating }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(star => (
      <svg
        key={star}
        width="13"
        height="13"
        viewBox="0 0 14 14"
        fill={star <= rating ? '#F97316' : 'none'}
        stroke={star <= rating ? '#F97316' : 'rgba(255,255,255,0.15)'}
        strokeWidth="1.2"
      >
        <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.44L7 8.885l-3.09 1.624.59-3.44L2 4.632l3.455-.502z" />
      </svg>
    ))}
  </div>
);

/* Avatar — shows photo if available, else monogram tile */
const ReviewerAvatar = ({ photo, initials, idx }) => {
  const schemes = [
    { bg: '#F97316', fg: '#0B1120' },
    { bg: '#0B1120', fg: '#F97316', border: '#F97316' },
    { bg: '#1e2d45', fg: '#ffffff' },
  ];
  const s = schemes[idx % schemes.length];

  if (photo) {
    return (
      <div
        className="relative flex-shrink-0 w-14 h-14 overflow-hidden"
        style={{
          clipPath:
            'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
        }}
      >
        <img
          src={photo}
          alt={initials}
          className="w-full h-full object-cover"
        />
        <span
          className="absolute bottom-0 right-0 w-2 h-2"
          style={{
            background: '#F97316',
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex-shrink-0 w-14 h-14 flex items-center justify-center font-black text-sm tracking-widest"
      style={{
        background: s.bg,
        color: s.fg,
        border: s.border
          ? `1.5px solid ${s.border}`
          : '1.5px solid transparent',
        clipPath:
          'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
    >
      {initials || '??'}
      <span
        className="absolute bottom-0 right-0 w-2 h-2"
        style={{
          background: '#F97316',
          clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
        }}
      />
    </div>
  );
};

const cardVariants = {
  enter: dir => ({ x: dir > 0 ? 120 : -120, opacity: 0, scale: 0.93 }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: dir => ({
    x: dir > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.93,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Testimonials = () => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const autoRef = useRef(null);
  const dragStart = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || "/api")}/reviews/all`);
        if (!res.ok) throw new Error('Failed to fetch reviews');
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const goTo = useCallback(
    (idx, dir) => {
      setDirection(dir);
      setCurrent((idx + reviews.length) % reviews.length);
    },
    [reviews.length],
  );

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    if (reviews.length < 2 || isPaused) return;
    autoRef.current = setInterval(next, 5500);
    return () => clearInterval(autoRef.current);
  }, [next, isPaused, reviews.length]);

  const onDragStart = e => {
    dragStart.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const onDragEnd = e => {
    const end = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStart.current - end;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
  };

  if (loading) {
    return (
      <div
        className="w-full py-28 flex items-center justify-center"
        style={{ background: '#080E1C' }}
      >
        <div className="flex gap-[6px]">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-[5px] h-[5px] rounded-full animate-bounce"
              style={{ background: '#F97316', animationDelay: `${i * 0.14}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error || reviews.length === 0) {
    return (
      <div
        className="w-full py-28 flex items-center justify-center"
        style={{ background: '#080E1C' }}
      >
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {error
            ? 'Could not load reviews.'
            : isBn
              ? 'কোনো রিভিউ নেই।'
              : 'No reviews yet.'}
        </p>
      </div>
    );
  }

  const review = reviews[current];

  // ── Field mapping — backend stores reviewerName, comment, rating, reviewerPhoto ──
  const name = review.reviewerName || '';
  const comment = review.comment || '';
  const rating = review.rating || 5;
  const photo = review.reviewerPhoto || null;
  const email = review.reviewerEmail || null;
  const initials = getInitials(name);

  return (
    <section
      className="relative w-full overflow-hidden py-20 md:py-32"
      style={{ background: '#080E1C' }}
    >
      {/* Background grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(249,115,22,0.07) 0%, transparent 65%)',
        }}
      />
      {/* Left rule */}
      <div
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{
          background:
            'linear-gradient(to bottom, transparent, #F97316 40%, transparent)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-6" style={{ background: '#F97316' }} />
              <span
                className="text-[10px] font-bold tracking-[0.22em] uppercase"
                style={{ color: '#F97316' }}
              >
                {isBn ? 'গ্রাহকদের অভিজ্ঞতা' : 'Testimonials'}
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.05] tracking-tight text-white">
              {isBn ? (
                <>
                  <span>আমাদের গ্রাহকরা</span>
                  <br />
                  <span style={{ color: '#F97316' }}>যা বলছেন</span>
                </>
              ) : (
                <>
                  <span>Trusted by</span>
                  <br />
                  <span style={{ color: '#F97316' }}>thousands.</span>
                </>
              )}
            </h2>
          </div>

          {/* Desktop arrows */}
          <div className="hidden md:flex items-center gap-2 self-end pb-1">
            {[
              { fn: prev, Icon: FiChevronLeft },
              { fn: next, Icon: FiChevronRight },
            ].map(({ fn, Icon }, i) => (
              <button
                key={i}
                onClick={fn}
                className="w-11 h-11 flex items-center justify-center border transition-all duration-200"
                style={{
                  borderColor: 'rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                  color: 'rgba(255,255,255,0.5)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#F97316';
                  e.currentTarget.style.borderColor = '#F97316';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                }}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onDragStart}
          onTouchEnd={onDragEnd}
          onMouseDown={onDragStart}
          onMouseUp={onDragEnd}
        >
          {/* Decorative quotation mark */}
          <div
            aria-hidden
            className="absolute select-none pointer-events-none font-black"
            style={{
              fontSize: 'clamp(120px,20vw,200px)',
              color: 'rgba(249,115,22,0.07)',
              top: '-0.55em',
              left: '-0.05em',
              fontFamily: 'Georgia,serif',
              lineHeight: 1,
            }}
          >
            &ldquo;
          </div>

          <div className="relative min-h-[300px] flex items-stretch">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={review._id || current}
                custom={direction}
                variants={cardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full"
              >
                <div
                  className="relative flex flex-col h-full p-8 md:p-12 overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(135deg, #111B2E 0%, #0D1625 100%)',
                    border: '0.5px solid rgba(255,255,255,0.07)',
                    clipPath:
                      'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)',
                  }}
                >
                  {/* Corner accent */}
                  <div
                    aria-hidden
                    className="absolute top-0 right-0 w-7 h-7"
                    style={{
                      background: '#F97316',
                      clipPath: 'polygon(100% 0, 100% 100%, 0 0)',
                    }}
                  />

                  {/* Stars + counter */}
                  <div className="flex items-center justify-between mb-7">
                    <StarRating rating={rating} />
                    <span
                      className="tabular-nums text-xs font-bold"
                      style={{ color: 'rgba(255,255,255,0.18)' }}
                    >
                      {String(current + 1).padStart(2, '0')}&nbsp;/&nbsp;
                      {String(reviews.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Comment */}
                  <p
                    className="flex-1 text-base md:text-xl font-light leading-relaxed mb-10 !text-white/80"
                    style={{
                      color: 'rgba(255,255,255,0.82)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {comment}
                  </p>

                  {/* Separator */}
                  <div className="flex items-center gap-3 mb-7">
                    <div
                      className="flex-1 h-px"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    />
                    <div
                      className="w-1 h-1 rotate-45"
                      style={{ background: '#F97316', opacity: 0.5 }}
                    />
                    <div
                      className="flex-1 h-px"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    />
                  </div>

                  {/* Author row */}
                  <div className="flex items-center gap-4">
                    <ReviewerAvatar
                      photo={photo}
                      initials={initials}
                      idx={current}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-white truncate">
                        {name || '—'}
                      </p>
                      {/* Show email as subtitle if available, else show rating as text */}
                      {email ? (
                        <p
                          className="text-[11px] font-medium mt-0.5 truncate"
                          style={{ color: 'rgba(249,115,22,0.65)' }}
                        >
                          {email}
                        </p>
                      ) : (
                        <p
                          className="text-[11px] font-medium mt-0.5"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                          {isBn ? 'যাচাইকৃত গ্রাহক' : 'Verified Customer'}
                        </p>
                      )}
                    </div>

                    {/* Verified badge */}
                    <div
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5"
                      style={{
                        background: 'rgba(249,115,22,0.08)',
                        border: '0.5px solid rgba(249,115,22,0.2)',
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="#F97316"
                      >
                        <path d="M5 0L6.12 3.37H9.51L6.76 5.45 7.87 8.82 5 6.73 2.13 8.82 3.24 5.45.49 3.37H3.88z" />
                      </svg>
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: '#F97316' }}
                      >
                        {isBn ? 'যাচাইকৃত' : 'Verified'}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom controls */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-[6px]">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? 1 : -1)}
                aria-label={`Review ${i + 1}`}
                className="h-[2px] rounded-none transition-all duration-500 focus:outline-none"
                style={{
                  width: i === current ? 32 : 10,
                  background:
                    i === current ? '#F97316' : 'rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>

          {/* Mobile arrows */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={prev}
              className="w-10 h-10 flex items-center justify-center border"
              style={{
                borderColor: 'rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.03)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              <FiChevronLeft size={17} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 flex items-center justify-center"
              style={{ background: '#F97316', color: '#fff' }}
            >
              <FiChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
