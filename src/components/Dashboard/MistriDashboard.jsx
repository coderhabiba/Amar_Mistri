'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  FiGrid,
  FiUser,
  FiBriefcase,
  FiDollarSign,
  FiSettings,
  FiMapPin,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiArrowUpRight,
  FiNavigation,
  FiXCircle,
  FiLoader,
  FiRefreshCw,
  FiMessageSquare,
  FiAward,
} from 'react-icons/fi';

import Overview from './mistri/Overview';
import Profile from './mistri/Profile';
import Jobs from './mistri/Jobs';
import Earnings from './mistri/Earnings';
import Settings from './mistri/Settings';
import CertificatesHub from './mistri/CertificatesHub';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/* ─────────────────────────────────────────────────────────
   Tab definitions
───────────────────────────────────────────────────────── */
const TABS = [
  {
    key: 'overview',
    icon: FiGrid,
    label: { en: 'Overview', bn: 'ওভারভিউ' },
  },
  {
    key: 'profile',
    icon: FiUser,
    label: { en: 'Profile', bn: 'প্রোফাইল' },
  },
  {
    key: 'jobs',
    icon: FiBriefcase,
    label: { en: 'Jobs', bn: 'কাজ' },
  },
  {
    key: 'earnings',
    icon: FiDollarSign,
    label: { en: 'Earnings', bn: 'আয়' },
  },
  {
    key: 'settings',
    icon: FiSettings,
    label: { en: 'Settings', bn: 'সেটিংস' },
  },
  {
    key: 'certificates',
    icon: FiAward,
    label: { en: 'Certificates', bn: 'সার্টিফিকেট' },
  },
  {
    key: 'location',
    icon: FiMapPin,
    label: { en: 'Live Location', bn: 'লাইভ লোকেশন' },
  },
];

/* ─────────────────────────────────────────────────────────
   Live Location Tab
───────────────────────────────────────────────────────── */
const LiveLocationTab = ({ currentLang }) => {
  const [status, setStatus] = useState('idle'); // idle | locating | found | error
  const [coords, setCoords] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [mapUrl, setMapUrl] = useState('');
  const [shared, setShared] = useState(false);

  const stopWatching = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setStatus('idle');
    setCoords(null);
    setMapUrl('');
    setShared(false);
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast.error(
        currentLang === 'bn'
          ? 'এই ব্রাউজারে জিওলোকেশন সমর্থিত নয়।'
          : 'Geolocation is not supported by your browser.'
      );
      return;
    }
    setStatus('locating');
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng, accuracy } = pos.coords;
        setCoords({ lat, lng, accuracy });
        setMapUrl(
          `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`
        );
        setStatus('found');
      },
      (err) => {
        console.error(err);
        toast.error(
          currentLang === 'bn'
            ? 'অবস্থান নির্ধারণ ব্যর্থ হয়েছে।'
            : 'Failed to determine location. Please allow location access.'
        );
        setStatus('error');
      },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
    setWatchId(id);
  };

  const handleShare = () => {
    if (!coords) return;
    const link = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
    if (navigator.share) {
      navigator.share({ title: 'My Live Location', url: link });
    } else {
      navigator.clipboard.writeText(link);
      toast.success(
        currentLang === 'bn'
          ? 'লিংক কপি হয়েছে!'
          : 'Location link copied to clipboard!'
      );
    }
    setShared(true);
  };

  useEffect(() => () => { if (watchId !== null) navigator.geolocation.clearWatch(watchId); }, [watchId]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-xl font-bold text-white">
          {currentLang === 'bn' ? 'লাইভ লোকেশন' : 'Live Location'}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {currentLang === 'bn'
            ? 'আপনার বর্তমান অবস্থান গ্রাহকদের সাথে শেয়ার করুন।'
            : 'Share your real-time location with customers.'}
        </p>
      </div>

      {/* Control card */}
      <div className="bg-slate-900/60 border border-slate-800/70 rounded-2xl p-6 flex flex-col items-center gap-5 text-center">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
            status === 'found'
              ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
              : status === 'locating'
              ? 'bg-amber-500/10 border-amber-500 animate-pulse'
              : status === 'error'
              ? 'bg-red-500/10 border-red-500'
              : 'bg-slate-800 border-slate-700'
          }`}
        >
          {status === 'locating' ? (
            <FiLoader className="text-amber-400 text-4xl animate-spin" />
          ) : (
            <FiNavigation
              className={`text-4xl ${
                status === 'found' ? 'text-emerald-400' : status === 'error' ? 'text-red-400' : 'text-slate-500'
              }`}
            />
          )}
        </div>

        {status === 'idle' && (
          <>
            <p className="text-slate-400 text-sm">
              {currentLang === 'bn'
                ? 'ট্র্যাকিং শুরু করতে নিচের বাটনে ক্লিক করুন।'
                : 'Click the button below to start live tracking.'}
            </p>
            <button
              onClick={startTracking}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-lg shadow-amber-500/20"
            >
              {currentLang === 'bn' ? 'লোকেশন ট্র্যাক শুরু করুন' : 'Start Live Tracking'}
            </button>
          </>
        )}

        {status === 'locating' && (
          <p className="text-amber-400 text-sm font-semibold animate-pulse">
            {currentLang === 'bn' ? 'অবস্থান খোঁজা হচ্ছে…' : 'Acquiring location…'}
          </p>
        )}

        {status === 'found' && coords && (
          <>
            <div className="text-center space-y-1">
              <p className="text-emerald-400 text-sm font-bold">
                {currentLang === 'bn' ? '✅ লাইভ ট্র্যাকিং চলছে' : '✅ Live tracking active'}
              </p>
              <p className="text-white font-mono text-base font-black">
                {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
              </p>
              <p className="text-slate-500 text-xs">
                {currentLang === 'bn' ? 'নির্ভুলতা' : 'Accuracy'}: ±{Math.round(coords.accuracy)}m
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <a
                href={mapUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 rounded-xl text-xs font-bold transition-all"
              >
                <FiMapPin /> {currentLang === 'bn' ? 'ম্যাপে দেখুন' : 'View on Map'}
              </a>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-xs font-bold transition-all"
              >
                {shared ? <FiCheckCircle /> : <FiArrowUpRight />}
                {currentLang === 'bn' ? 'লিংক শেয়ার করুন' : 'Share Link'}
              </button>
              <button
                onClick={stopWatching}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-bold transition-all"
              >
                <FiXCircle /> {currentLang === 'bn' ? 'ট্র্যাকিং বন্ধ করুন' : 'Stop Tracking'}
              </button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="text-red-400 text-sm">
              {currentLang === 'bn'
                ? 'অবস্থান পেতে ব্যর্থ। ব্রাউজার পারমিশন অনুমতি দিন।'
                : 'Could not get location. Please allow browser location permission.'}
            </p>
            <button
              onClick={startTracking}
              className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-all"
            >
              {currentLang === 'bn' ? 'আবার চেষ্টা করুন' : 'Retry'}
            </button>
          </>
        )}
      </div>

      {/* Info card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: FiNavigation,
            color: 'amber',
            title: { en: 'Real-Time GPS', bn: 'রিয়েল-টাইম GPS' },
            desc: { en: 'Updates every few seconds using device GPS.', bn: 'ডিভাইস GPS ব্যবহার করে কয়েক সেকেন্ডে আপডেট।' },
          },
          {
            icon: FiArrowUpRight,
            color: 'blue',
            title: { en: 'Share Instantly', bn: 'তাৎক্ষণিক শেয়ার' },
            desc: { en: 'Send location link to customers via any app.', bn: 'যেকোনো অ্যাপে গ্রাহকদের কাছে লোকেশন লিংক পাঠান।' },
          },
          {
            icon: FiCheckCircle,
            color: 'emerald',
            title: { en: 'Privacy Safe', bn: 'গোপনীয়তা সুরক্ষিত' },
            desc: { en: 'Location is never stored. Sharing is manual only.', bn: 'লোকেশন কখনো সংরক্ষিত হয় না। শুধুমাত্র ম্যানুয়াল শেয়ার।' },
          },
        ].map(({ icon: Icon, color, title, desc }) => (
          <div
            key={title.en}
            className={`bg-slate-900/40 border rounded-2xl p-5 ${
              color === 'amber'
                ? 'border-amber-500/20'
                : color === 'blue'
                ? 'border-blue-500/20'
                : 'border-emerald-500/20'
            }`}
          >
            <Icon
              className={`text-xl mb-3 ${
                color === 'amber'
                  ? 'text-amber-400'
                  : color === 'blue'
                  ? 'text-blue-400'
                  : 'text-emerald-400'
              }`}
            />
            <p className="text-white text-xs font-bold mb-1">{title[currentLang]}</p>
            <p className="text-slate-500 text-xs leading-relaxed">{desc[currentLang]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   Main MistriDashboard
───────────────────────────────────────────────────────── */
const MistriDashboard = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'overview');

  useEffect(() => {
    if (tabParam && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    router.push(`${pathname}?tab=${tab}`);
  };

  const [mistriInfo, setMistriInfo] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [reviewComments, setReviewComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* ── Load user from localStorage then fetch data ── */
  useEffect(() => {
    const storedUser =
      localStorage.getItem('mistri') || localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setMistriInfo(parsedUser);
      fetchDashboardData(
        parsedUser._id || parsedUser.id,
        parsedUser.referCode,
        parsedUser.fullName || parsedUser.name
      );
    } else {
      toast.error(
        currentLang === 'bn' ? 'অনুগ্রহ করে আবার লগইন করুন।' : 'Please login again.'
      );
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async (mistriId, referCode, mistriName) => {
    if (!mistriId) return;
    try {
      setIsLoading(true);
      const [bookingsRes, reviewsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/bookings?fetchAll=true`).then((r) => r.json()),
        fetch(`${API_BASE_URL}/reviews?mistriId=${mistriId}`).then((r) => r.json()),
      ]);
      const allBookings = Array.isArray(bookingsRes)
        ? bookingsRes
        : bookingsRes.bookings || [];
      const myJobs = allBookings.filter(
        (j) =>
          j.mistriId === mistriId ||
          j.referCode === referCode ||
          j.mistriName === mistriName
      );
      setRecentJobs(myJobs);
      setReviewComments(Array.isArray(reviewsRes) ? reviewsRes : reviewsRes.reviews || []);
    } catch (error) {
      console.error('Dashboard sync error:', error);
      toast.error(
        currentLang === 'bn'
          ? 'সার্ভার থেকে তথ্য লোড ব্যর্থ।'
          : 'Failed to load dashboard data.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Quick stats derived from jobs ── */
  const totalEarnings = recentJobs
    .filter((j) => j.status === 'completed')
    .reduce((sum, j) => sum + (Number(j.amount) || 0), 0);

  const pendingCount = recentJobs.filter(
    (j) => j.status === 'pending' || j.status === 'waiting'
  ).length;

  const completedCount = recentJobs.filter((j) => j.status === 'completed').length;

  const avgRating =
    reviewComments.length > 0
      ? (
          reviewComments.reduce((acc, r) => acc + (r.rating || 0), 0) /
          reviewComments.length
        ).toFixed(1)
      : '5.0';

  /* ── Stats cards for header summary ── */
  const headerStats = [
    {
      label: { en: 'Total Earnings', bn: 'মোট আয়' },
      value: `৳ ${totalEarnings.toLocaleString()}`,
      icon: FiDollarSign,
      color: 'text-emerald-400',
    },
    {
      label: { en: 'Pending Jobs', bn: 'অপেক্ষমাণ' },
      value: pendingCount.toString(),
      icon: FiClock,
      color: 'text-amber-400',
    },
    {
      label: { en: 'Completed', bn: 'সম্পন্ন' },
      value: completedCount.toString(),
      icon: FiCheckCircle,
      color: 'text-blue-400',
    },
    {
      label: { en: 'Rating', bn: 'রেটিং' },
      value: avgRating,
      icon: FiStar,
      color: 'text-purple-400',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-slate-400">
        <FiLoader className="animate-spin text-amber-500 text-3xl" />
        <p className="text-xs font-mono tracking-widest uppercase">
          {currentLang === 'bn' ? 'লোড হচ্ছে…' : 'Synchronizing Workspace…'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn mt-6">
      {/* ── Welcome header ── */}
      <div className="bg-gradient-to-br from-slate-900/70 to-slate-900/40 border border-slate-800/60 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: avatar + name */}
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
              {mistriInfo?.photo || mistriInfo?.profilePhoto ? (
                <img
                  src={mistriInfo.photo || mistriInfo.profilePhoto}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiUser className="text-slate-500 text-2xl" />
                </div>
              )}
              <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black text-white">
                {currentLang === 'bn'
                  ? `স্বাগতম, ${mistriInfo?.fullName || mistriInfo?.name || 'মিস্ত্রী ভাই'}!`
                  : `Welcome, ${mistriInfo?.fullName || mistriInfo?.name || 'Provider'}!`}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {mistriInfo?.jobCategory || mistriInfo?.category || '—'} •{' '}
                {mistriInfo?.address || mistriInfo?.location || '—'}
              </p>
            </div>
          </div>

          {/* Right: online badge + refresh */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {currentLang === 'bn' ? 'অনলাইন' : 'Online'}
            </span>
            <button
              onClick={() =>
                fetchDashboardData(
                  mistriInfo?._id || mistriInfo?.id,
                  mistriInfo?.referCode,
                  mistriInfo?.fullName || mistriInfo?.name
                )
              }
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
              title="Refresh"
            >
              <FiRefreshCw className="text-sm" />
            </button>
          </div>
        </div>

        {/* Quick stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-800/50">
          {headerStats.map(({ label, value, icon: Icon, color }) => (
            <div key={label.en} className="flex items-center gap-3">
              <Icon className={`${color} text-xl flex-shrink-0`} />
              <div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  {label[currentLang]}
                </p>
                <p className="text-sm font-black text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-800/50 rounded-2xl p-1.5 overflow-x-auto scrollbar-hide">
        {TABS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => handleTabChange(key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
              activeTab === key
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Icon className="text-sm" />
            {label[currentLang]}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <Overview recentJobs={recentJobs} reviewComments={reviewComments} mistriInfo={mistriInfo} />
        )}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'jobs' && <Jobs />}
        {activeTab === 'earnings' && <Earnings />}
        {activeTab === 'settings' && <Settings />}
        {activeTab === 'certificates' && <CertificatesHub />}
        {activeTab === 'location' && <LiveLocationTab currentLang={currentLang} />}
      </div>
    </div>
  );
};

export default MistriDashboard;
