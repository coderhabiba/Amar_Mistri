import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiUser, FiPhone, FiCheckCircle, FiClock,
  FiXCircle, FiMapPin, FiCalendar, FiLoader,
  FiBriefcase, FiDollarSign, FiRefreshCw,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || '/api';

const STATUS_STYLES = {
  pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  waiting:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const Jobs = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [completingId, setCompletingId] = useState(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('mistri') || localStorage.getItem('user');
      if (!stored) { setIsLoading(false); return; }
      const mistriData = JSON.parse(stored);
      const mistriId = mistriData._id || mistriData.id || mistriData.mistriId;

      const res = await fetch(`${API}/bookings?fetchAll=true`);
      const data = await res.json();
      const allBookings = Array.isArray(data) ? data : (data.bookings || []);
      const myJobs = allBookings.filter(
        j => j.mistriId === mistriId || j.mistriName === mistriData.fullName || j.mistriName === mistriData.name
      );
      setJobs(myJobs);
    } catch (e) {
      toast.error(currentLang === 'bn' ? 'জব লোড করতে ব্যর্থ।' : 'Failed to load jobs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleComplete = async (jobId, amount) => {
    setCompletingId(jobId);
    try {
      await fetch(`${API}/bookings/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed', amount: Number(amount) }),
      });
      toast.success(currentLang === 'bn' ? 'কাজ সম্পন্ন করা হয়েছে!' : 'Job marked as completed!');
      fetchJobs();
    } catch (e) {
      toast.error('Failed to update job.');
    } finally {
      setCompletingId(null);
    }
  };

  const handleCancel = async (jobId) => {
    if (!window.confirm(currentLang === 'bn' ? 'কাজটি বাতিল করবেন?' : 'Cancel this job?')) return;
    try {
      await fetch(`${API}/bookings/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });
      toast.success(currentLang === 'bn' ? 'কাজ বাতিল হয়েছে।' : 'Job cancelled.');
      fetchJobs();
    } catch (e) {
      toast.error('Failed to cancel job.');
    }
  };

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  const counts = {
    all: jobs.length,
    pending: jobs.filter(j => j.status === 'pending' || j.status === 'waiting').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    cancelled: jobs.filter(j => j.status === 'cancelled').length,
  };

  const FILTERS = [
    { key: 'all', label: { en: 'All', bn: 'সব' } },
    { key: 'pending', label: { en: 'Pending', bn: 'অপেক্ষমাণ' } },
    { key: 'completed', label: { en: 'Completed', bn: 'সম্পন্ন' } },
    { key: 'cancelled', label: { en: 'Cancelled', bn: 'বাতিল' } },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          {currentLang === 'bn' ? 'জব হিস্টোরি' : 'Job History'}
        </h1>
        <button
          onClick={fetchJobs}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
          {currentLang === 'bn' ? 'রিফ্রেশ' : 'Refresh'}
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filter === f.key
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            {f.label[currentLang]} <span className="opacity-60">({counts[f.key] || 0})</span>
          </button>
        ))}
      </div>

      {/* Jobs List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <FiLoader className="animate-spin text-amber-400 text-3xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-10 text-center">
          <FiBriefcase className="text-slate-600 text-4xl mx-auto mb-3" />
          <p className="text-slate-500 text-sm">
            {currentLang === 'bn' ? 'কোনো জব পাওয়া যায়নি।' : 'No jobs found.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(job => (
            <div
              key={job._id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Job Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-white">
                      {job.specificService || job.categoryName || 'General Service'}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${STATUS_STYLES[job.status] || STATUS_STYLES.pending}`}>
                      {job.status === 'pending' ? (currentLang === 'bn' ? 'অপেক্ষমাণ' : 'Pending')
                       : job.status === 'completed' ? (currentLang === 'bn' ? 'সম্পন্ন' : 'Completed')
                       : job.status === 'cancelled' ? (currentLang === 'bn' ? 'বাতিল' : 'Cancelled')
                       : job.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-400">
                    {job.clientName && (
                      <span className="flex items-center gap-1">
                        <FiUser /> {job.clientName || job.name}
                      </span>
                    )}
                    {(job.clientPhone || job.phone) && (
                      <span className="flex items-center gap-1">
                        <FiPhone /> {job.clientPhone || job.phone}
                      </span>
                    )}
                    {(job.deliveryAddress || job.address) && (
                      <span className="flex items-center gap-1">
                        <FiMapPin /> {(job.deliveryAddress || job.address || '').substring(0, 40)}
                      </span>
                    )}
                    {job.createdAt && (
                      <span className="flex items-center gap-1">
                        <FiCalendar /> {new Date(job.createdAt).toLocaleDateString('en-BD')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Amount + Actions */}
                <div className="flex items-center gap-4 border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                      {currentLang === 'bn' ? 'আয়' : 'Amount'}
                    </p>
                    <p className="text-sm font-black text-amber-400">৳{job.amount || 0}</p>
                  </div>

                  {job.status !== 'completed' && job.status !== 'cancelled' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleComplete(job._id, job.amount || 500)}
                        disabled={completingId === job._id}
                        className="flex items-center gap-1 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold transition-all"
                      >
                        {completingId === job._id ? <FiLoader className="animate-spin" /> : <FiCheckCircle />}
                        {currentLang === 'bn' ? 'সম্পন্ন' : 'Done'}
                      </button>
                      <button
                        onClick={() => handleCancel(job._id)}
                        className="flex items-center gap-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs font-bold transition-all"
                      >
                        <FiXCircle />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
