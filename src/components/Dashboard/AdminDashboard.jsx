import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiUsers, FiCheckCircle, FiClock, FiXCircle, FiDollarSign,
  FiBriefcase, FiLoader, FiRefreshCw, FiSearch, FiCheck,
  FiX, FiEye, FiChevronDown, FiShield, FiBarChart2, FiPhone,
  FiMapPin, FiMail,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || '/api';

const STATUS_STYLES = {
  approved: { badge: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400', label: { en: 'Approved', bn: 'অনুমোদিত' } },
  pending:  { badge: 'bg-amber-500/15 border-amber-500/30 text-amber-400',   label: { en: 'Pending',  bn: 'অপেক্ষমাণ' } },
  rejected: { badge: 'bg-red-500/15 border-red-500/30 text-red-400',         label: { en: 'Rejected', bn: 'প্রত্যাখ্যাত' } },
};

const AdminDashboard = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'bn' ? 'bn' : 'en';

  const [stats, setStats] = useState(null);
  const [mechanics, setMechanics] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingMechanics, setIsLoadingMechanics] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedId, setExpandedId] = useState(null);

  const getAdminToken = () => localStorage.getItem('token');

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch(`${API}/admin/stats`, {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch (e) {
      console.error('Stats fetch error:', e);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchMechanics = useCallback(async () => {
    setIsLoadingMechanics(true);
    try {
      const res = await fetch(`${API}/mechanics?status=all`);
      const data = await res.json();
      // The main GET returns only approved - need to fetch all
      const resAll = await fetch(`${API}/mechanics/route-all`, {}).catch(() => null);
      // Fallback: use regular endpoint which now returns all for admin
      const allRes = await fetch(`${API}/mechanics`, {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      const allData = await allRes.json();
      // Also try to get pending ones specifically
      setMechanics(Array.isArray(allData) ? allData : (allData.mechanics || []));
    } catch (e) {
      console.error('Mechanics fetch error:', e);
    } finally {
      setIsLoadingMechanics(false);
    }
  }, []);

  const fetchAllMechanics = useCallback(async () => {
    setIsLoadingMechanics(true);
    try {
      // Fetch all mechanics including pending/rejected for admin
      const db_res = await fetch(`${API}/admin/mechanics`, {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      if (db_res.ok) {
        const data = await db_res.json();
        if (data.success) { setMechanics(data.mechanics); setIsLoadingMechanics(false); return; }
      }
      // Fallback to regular mechanics endpoint
      const res = await fetch(`${API}/mechanics`);
      const data = await res.json();
      setMechanics(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setIsLoadingMechanics(false); }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchAllMechanicsAdmin();
    fetchBookings();
  }, []);

  const fetchAllMechanicsAdmin = async () => {
    setIsLoadingMechanics(true);
    try {
      const res = await fetch(`${API}/admin/mechanics`, {
        headers: { Authorization: `Bearer ${getAdminToken()}` },
      });
      const data = await res.json();
      if (data.success) {
        setMechanics(data.mechanics);
      } else {
        // Fallback to general mechanics endpoint
        const res2 = await fetch(`${API}/mechanics`);
        const data2 = await res2.json();
        setMechanics(Array.isArray(data2) ? data2 : []);
      }
    } catch (e) {
      const res2 = await fetch(`${API}/mechanics`).catch(() => ({ json: () => [] }));
      const data2 = await res2.json();
      setMechanics(Array.isArray(data2) ? data2 : []);
    } finally {
      setIsLoadingMechanics(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API}/bookings?fetchAll=true`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : (data.bookings || []));
    } catch (e) { console.error(e); }
  };

  const handleStatusChange = async (mechanicId, newStatus) => {
    setUpdatingId(mechanicId);
    try {
      const res = await fetch(`${API}/mechanics/${mechanicId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setMechanics(prev => prev.map(m =>
          (m._id?.toString() === mechanicId || m.mistriId === mechanicId)
            ? { ...m, status: newStatus }
            : m
        ));
        await fetchStats();
        toast.success(
          lang === 'bn'
            ? `স্ট্যাটাস "${newStatus}" করা হয়েছে।`
            : `Status updated to "${newStatus}".`
        );
      } else {
        toast.error(data.message || 'Update failed.');
      }
    } catch (e) {
      toast.error('Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredMechanics = mechanics.filter(m => {
    const matchesStatus = filterStatus === 'all' || (m.status || 'pending').toLowerCase().includes(filterStatus);
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (m.fullName || m.name || '').toLowerCase().includes(q) || (m.mistriId || '').toLowerCase().includes(q) || (m.phone || '').includes(q);
    return matchesStatus && matchesSearch;
  });

  const STAT_CARDS = stats ? [
    { icon: <FiUsers />, color: 'blue', label: { en: 'Total Mistri', bn: 'মোট মিস্ত্রি' }, value: stats.totalMistri },
    { icon: <FiCheckCircle />, color: 'emerald', label: { en: 'Approved', bn: 'অনুমোদিত' }, value: stats.approvedMistri },
    { icon: <FiClock />, color: 'amber', label: { en: 'Pending', bn: 'অপেক্ষমাণ' }, value: stats.pendingMistri },
    { icon: <FiXCircle />, color: 'red', label: { en: 'Rejected', bn: 'প্রত্যাখ্যাত' }, value: stats.rejectedMistri },
    { icon: <FiBriefcase />, color: 'purple', label: { en: 'Total Bookings', bn: 'মোট বুকিং' }, value: stats.totalBookings },
    { icon: <FiDollarSign />, color: 'teal', label: { en: 'Total Revenue', bn: 'মোট রাজস্ব' }, value: `৳${(stats.totalRevenue || 0).toLocaleString()}` },
  ] : [];

  const COLOR_MAP = {
    blue: 'from-blue-500/10 border-blue-500/20 text-blue-400',
    emerald: 'from-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'from-amber-500/10 border-amber-500/20 text-amber-400',
    red: 'from-red-500/10 border-red-500/20 text-red-400',
    purple: 'from-purple-500/10 border-purple-500/20 text-purple-400',
    teal: 'from-teal-500/10 border-teal-500/20 text-teal-400',
  };

  const TABS = [
    { key: 'overview', label: { en: 'Overview', bn: 'ওভারভিউ' }, icon: <FiBarChart2 /> },
    { key: 'mistri', label: { en: 'Mistri Management', bn: 'মিস্ত্রি ম্যানেজমেন্ট' }, icon: <FiUsers /> },
    { key: 'bookings', label: { en: 'Bookings', bn: 'বুকিং' }, icon: <FiBriefcase /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FiShield />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              {lang === 'bn' ? 'এডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}
            </h1>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'সিস্টেম পরিচালনা ও নিরীক্ষণ' : 'System Management & Monitoring'}
            </p>
          </div>
        </div>
        <button
          onClick={() => { fetchStats(); fetchAllMechanicsAdmin(); fetchBookings(); }}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
        >
          <FiRefreshCw className={isLoadingStats ? 'animate-spin' : ''} />
          {lang === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-amber-500/20 border border-amber-500/30 text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:block">{tab.label[lang]}</span>
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <>
          {isLoadingStats ? (
            <div className="flex justify-center h-32 items-center">
              <FiLoader className="animate-spin text-amber-400 text-3xl" />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {STAT_CARDS.map((card, i) => (
                <div key={i} className={`bg-gradient-to-br ${COLOR_MAP[card.color]} border rounded-2xl p-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xl">{card.icon}</span>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{card.label[lang]}</p>
                  <p className="text-3xl font-black text-white mt-1">{card.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Recent Bookings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center gap-2">
              <FiBriefcase className="text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                {lang === 'bn' ? 'সাম্প্রতিক বুকিং' : 'Recent Bookings'}
              </h3>
              <span className="text-xs text-slate-500 ml-auto">{bookings.length} total</span>
            </div>
            <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto">
              {bookings.slice(0, 10).map(b => (
                <div key={b._id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-800/20">
                  <div>
                    <p className="text-xs font-bold text-white">{b.specificService || b.categoryName}</p>
                    <p className="text-[10px] text-slate-500">{b.clientName || b.name} • {new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-amber-400">৳{b.amount || 0}</p>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${STATUS_STYLES[b.status]?.badge || STATUS_STYLES.pending.badge}`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* MISTRI MANAGEMENT TAB */}
      {activeTab === 'mistri' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
              <input
                type="text"
                placeholder={lang === 'bn' ? 'নাম, আইডি বা ফোন দিয়ে খুঁজুন...' : 'Search by name, ID or phone...'}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'approved', 'pending', 'rejected'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                    filterStatus === s
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {s === 'all' ? (lang === 'bn' ? 'সব' : 'All')
                   : s === 'approved' ? (lang === 'bn' ? 'অনুমোদিত' : 'Approved')
                   : s === 'pending' ? (lang === 'bn' ? 'অপেক্ষমাণ' : 'Pending')
                   : (lang === 'bn' ? 'প্রত্যাখ্যাত' : 'Rejected')}
                </button>
              ))}
            </div>
          </div>

          {/* Mechanics Table */}
          {isLoadingMechanics ? (
            <div className="flex justify-center h-40 items-center">
              <FiLoader className="animate-spin text-amber-400 text-3xl" />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMechanics.length === 0 ? (
                <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-10 text-center">
                  <p className="text-slate-500 text-sm">
                    {lang === 'bn' ? 'কোনো মিস্ত্রি পাওয়া যায়নি।' : 'No mechanics found.'}
                  </p>
                </div>
              ) : (
                filteredMechanics.map(m => {
                  const id = m._id?.toString() || m.mistriId;
                  const status = (m.status || 'pending').toLowerCase().trim();
                  const isExpanded = expandedId === id;
                  return (
                    <div key={id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all">
                      {/* Row */}
                      <div className="p-4 flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden shrink-0">
                          <img
                            src={m.faceImageUrl || m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName || m.name || 'M')}&background=334155&color=f59e0b&size=100`}
                            alt={m.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white truncate">{m.fullName || m.name}</p>
                            <span className={`text-[9px] font-bold uppercase border px-1.5 py-0.5 rounded ${STATUS_STYLES[status]?.badge || STATUS_STYLES.pending.badge}`}>
                              {STATUS_STYLES[status]?.label[lang] || status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{m.mistriId} • {m.phone}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(m.categories || m.categoryKeys || []).slice(0, 3).map(c => (
                              <span key={c} className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{c}</span>
                            ))}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {status !== 'approved' && (
                            <button
                              onClick={() => handleStatusChange(id, 'approved')}
                              disabled={updatingId === id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold transition-all"
                            >
                              {updatingId === id ? <FiLoader className="animate-spin" /> : <FiCheck />}
                              {lang === 'bn' ? 'অনুমোদন' : 'Approve'}
                            </button>
                          )}
                          {status !== 'rejected' && (
                            <button
                              onClick={() => handleStatusChange(id, 'rejected')}
                              disabled={updatingId === id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition-all"
                            >
                              <FiX />
                              {lang === 'bn' ? 'বাতিল' : 'Reject'}
                            </button>
                          )}
                          {status !== 'pending' && (
                            <button
                              onClick={() => handleStatusChange(id, 'pending')}
                              disabled={updatingId === id}
                              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg text-xs font-bold transition-all"
                            >
                              <FiClock />
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : id)}
                            className="flex items-center gap-1 px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-bold transition-all"
                          >
                            <FiEye />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-slate-800 px-4 py-4 grid grid-cols-2 gap-3 bg-slate-950/50">
                          <DetailItem icon={<FiMail />} label={lang === 'bn' ? 'ইমেইল' : 'Email'} value={m.email} />
                          <DetailItem icon={<FiPhone />} label={lang === 'bn' ? 'ফোন' : 'Phone'} value={m.phone} />
                          <DetailItem icon={<FiMapPin />} label={lang === 'bn' ? 'এলাকা' : 'Area'} value={`${m.district || ''} ${m.thana || ''}`.trim() || m.address} />
                          <DetailItem icon={<FiDollarSign />} label={lang === 'bn' ? 'চার্জ' : 'Charge'} value={`৳${m.charge || 500}`} />
                          <DetailItem icon={<FiBriefcase />} label={lang === 'bn' ? 'অভিজ্ঞতা' : 'Experience'} value={`${m.experience || 0} ${lang === 'bn' ? 'বছর' : 'years'}`} />
                          <DetailItem icon={<FiUsers />} label={lang === 'bn' ? 'সার্ভিস' : 'Services'} value={(m.services || m.specificServices || []).join(', ') || '—'} />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      )}

      {/* BOOKINGS TAB */}
      {activeTab === 'bookings' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-white">
              {lang === 'bn' ? 'সকল বুকিং' : 'All Bookings'} ({bookings.length})
            </p>
          </div>
          <div className="space-y-3">
            {bookings.slice(0, 50).map(b => (
              <div key={b._id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-white">{b.specificService || b.categoryName}</p>
                    <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded ${STATUS_STYLES[b.status]?.badge || STATUS_STYLES.pending.badge}`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {b.clientName || b.name} • {b.clientPhone || b.phone} • {new Date(b.createdAt).toLocaleDateString()}
                  </p>
                  {(b.deliveryAddress || b.address) && (
                    <p className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                      <FiMapPin className="shrink-0" /> {(b.deliveryAddress || b.address).substring(0, 60)}
                    </p>
                  )}
                </div>
                <p className="text-sm font-black text-amber-400 shrink-0">৳{b.amount || 0}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    <span className="text-slate-500 text-xs mt-0.5 shrink-0">{icon}</span>
    <div>
      <p className="text-[9px] text-slate-600 font-bold uppercase">{label}</p>
      <p className="text-[11px] text-slate-300 font-medium">{value || '—'}</p>
    </div>
  </div>
);

export default AdminDashboard;