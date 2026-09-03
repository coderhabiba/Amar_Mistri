import { FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const Overview = ({ mistriInfo, recentJobs }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  // --- Dynamic Mathematical Aggregations ---
  const totalOrdersCount = recentJobs?.length || 0;
  const pendingJobsCount =
    recentJobs?.filter(j => j.status === 'pending').length || 0;
  const completedJobsCount =
    recentJobs?.filter(j => j.status === 'completed').length || 0;

  const totalEarnings =
    recentJobs
      ?.filter(j => j.status === 'completed')
      .reduce((sum, job) => sum + (Number(job.amount) || 0), 0) || 0;

  const stats = [
    {
      id: 1,
      label: { en: 'Total Records Count', bn: 'মোট অর্ডার এন্ট্রি' },
      value:
        currentLang === 'bn'
          ? `${totalOrdersCount}টি`
          : `${totalOrdersCount} Records`,
      icon: FiCheckCircle,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      id: 2,
      label: { en: 'Pending Collection', bn: 'চলতি/বাকি কাজ' },
      value:
        currentLang === 'bn'
          ? `${pendingJobsCount}টি`
          : `${pendingJobsCount} Pending`,
      icon: FiClock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
    {
      id: 3,
      label: { en: 'Total Revenue Generated', bn: 'মোট আয়ের হিসাব (নগদ)' },
      value:
        currentLang === 'bn'
          ? `৳${totalEarnings.toLocaleString('bn-BD')}`
          : `BDT ${totalEarnings.toLocaleString('en-US')}`,
      icon: FiDollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">
          {currentLang === 'bn'
            ? `স্বাগতম, ${mistriInfo?.fullName || 'মিস্ত্রী ভাই'}`
            : `Welcome, ${mistriInfo?.fullName || 'Mistri'}`}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {currentLang === 'bn'
            ? 'আপনার ব্যক্তিগত হিসাব খাতার বিবরণী নিচে দেওয়া হলো।'
            : 'Your manual bookkeeping system metrics are active below.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-md"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.label[currentLang]}
                </p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl shrink-0`}
              >
                <Icon />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Overview;
