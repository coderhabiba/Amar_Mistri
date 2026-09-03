import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FiDollarSign, FiTrendingUp, FiCalendar, FiLoader,
  FiCheckCircle, FiBarChart2, FiRefreshCw,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || '/api';

const MONTHS_BN = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
const MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Earnings = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEarnings = async () => {
    setIsLoading(true);
    try {
      const stored = localStorage.getItem('mistri') || localStorage.getItem('user');
      if (!stored) { setIsLoading(false); return; }
      const mistriData = JSON.parse(stored);
      const mistriId = mistriData._id || mistriData.id || mistriData.mistriId;

      const res = await fetch(`${API}/bookings?fetchAll=true`);
      const data = await res.json();
      const allBookings = Array.isArray(data) ? data : (data.bookings || []);
      const myCompleted = allBookings.filter(
        j => (j.mistriId === mistriId || j.mistriName === mistriData.fullName || j.mistriName === mistriData.name)
          && j.status === 'completed'
      );
      setJobs(myCompleted);
    } catch (e) {
      toast.error('Failed to load earnings data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchEarnings(); }, []);

  // Aggregate earnings by month/year
  const monthlyData = {};
  jobs.forEach(job => {
    const date = new Date(job.createdAt || job.date || Date.now());
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthlyData[key]) {
      monthlyData[key] = { year: date.getFullYear(), month: date.getMonth(), total: 0, count: 0 };
    }
    monthlyData[key].total += Number(job.amount) || 0;
    monthlyData[key].count += 1;
  });

  const sortedMonths = Object.values(monthlyData).sort((a, b) =>
    b.year !== a.year ? b.year - a.year : b.month - a.month
  );

  const totalEarnings = jobs.reduce((sum, j) => sum + (Number(j.amount) || 0), 0);
  const thisMonth = new Date();
  const thisMonthKey = `${thisMonth.getFullYear()}-${thisMonth.getMonth()}`;
  const thisMonthTotal = monthlyData[thisMonthKey]?.total || 0;
  const thisMonthJobs = monthlyData[thisMonthKey]?.count || 0;

  const maxMonthly = Math.max(...sortedMonths.map(m => m.total), 1);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">
          {currentLang === 'bn' ? 'আয়ের বিশ্লেষণ' : 'Earnings Analysis'}
        </h1>
        <button
          onClick={fetchEarnings}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
        >
          <FiRefreshCw className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <FiLoader className="animate-spin text-amber-400 text-3xl" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={<FiDollarSign />}
              color="emerald"
              label={currentLang === 'bn' ? 'মোট আয়' : 'Total Earnings'}
              value={`৳ ${totalEarnings.toLocaleString()}`}
              sub={`${jobs.length} ${currentLang === 'bn' ? 'টি কাজ' : 'jobs'}`}
            />
            <StatCard
              icon={<FiCalendar />}
              color="amber"
              label={currentLang === 'bn' ? 'এই মাসের আয়' : 'This Month'}
              value={`৳ ${thisMonthTotal.toLocaleString()}`}
              sub={`${thisMonthJobs} ${currentLang === 'bn' ? 'টি কাজ' : 'jobs'}`}
            />
            <StatCard
              icon={<FiCheckCircle />}
              color="blue"
              label={currentLang === 'bn' ? 'গড় প্রতি কাজ' : 'Avg per Job'}
              value={jobs.length > 0 ? `৳ ${Math.round(totalEarnings / jobs.length).toLocaleString()}` : '৳ 0'}
              sub={currentLang === 'bn' ? 'সম্পন্ন কাজ' : 'completed jobs'}
            />
          </div>

          {/* Monthly Breakdown */}
          {sortedMonths.length === 0 ? (
            <div className="bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl p-10 text-center">
              <FiBarChart2 className="text-slate-600 text-4xl mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                {currentLang === 'bn' ? 'এখনো কোনো সম্পন্ন কাজ নেই।' : 'No completed jobs yet.'}
              </p>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FiBarChart2 className="text-amber-400" />
                  {currentLang === 'bn' ? 'মাসিক আয়ের বিস্তারিত' : 'Monthly Earnings Breakdown'}
                </h3>
              </div>
              <div className="divide-y divide-slate-800/60">
                {sortedMonths.map(({ year, month, total, count }) => {
                  const monthName = currentLang === 'bn' ? MONTHS_BN[month] : MONTHS_EN[month];
                  const barWidth = Math.round((total / maxMonthly) * 100);
                  const isThisMonth = year === thisMonth.getFullYear() && month === thisMonth.getMonth();
                  return (
                    <div key={`${year}-${month}`} className="p-4 hover:bg-slate-800/20 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">
                            {monthName} {year}
                          </span>
                          {isThisMonth && (
                            <span className="text-[9px] bg-amber-500/20 border border-amber-500/30 text-amber-400 px-1.5 py-0.5 rounded font-bold uppercase">
                              {currentLang === 'bn' ? 'চলতি' : 'Current'}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-black text-emerald-400">৳{total.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-500">{count} {currentLang === 'bn' ? 'টি কাজ' : 'jobs'}</p>
                        </div>
                      </div>
                      {/* Bar */}
                      <div className="w-full bg-slate-800 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const StatCard = ({ icon, color, label, value, sub }) => {
  const colors = {
    emerald: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
    amber:   'from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-400',
    blue:    'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5`}>
      <div className={`text-xl mb-2`}>{icon}</div>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-2xl font-black text-white mt-1">{value}</p>
      <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
    </div>
  );
};

export default Earnings;
