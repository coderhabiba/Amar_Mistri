import { NavLink, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import {
  FiGrid,
  FiUser,
  FiDollarSign,
  FiSettings,
  FiLogOut,
  FiLayers,
  FiBriefcase,
  FiAward,
  FiMapPin,
} from 'react-icons/fi';

const Sidebar = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en';

  const userSession = {
    name: 'Habibur Rahman',
    role: 'mistri',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60',
    isVerified: true,
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const adminMenuItems = [
    {
      path: '/dashboard/admin',
      label: { en: 'Overview', bn: 'ওভারভিউ' },
      icon: FiGrid,
      exact: true,
    },
    {
      path: '/dashboard/profile',
      label: { en: 'Profile', bn: 'প্রোফাইল' },
      icon: FiUser,
    },
    {
      path: '/dashboard/jobs',
      label: { en: 'Jobs', bn: 'অর্ডার' },
      icon: FiBriefcase,
    },
    {
      path: '/dashboard/certificates',
      label: { en: 'Awards', bn: 'সার্টিফিকেট' },
      icon: FiAward,
    },
    {
      path: '/dashboard/earnings',
      label: { en: 'Earnings', bn: 'আয়' },
      icon: FiDollarSign,
    },
    {
      path: '/dashboard/settings',
      label: { en: 'Settings', bn: 'সেটিংস' },
      icon: FiSettings,
    },
  ];

  const mistriMenuItems = [
    {
      path: '/dashboard/mistri?tab=overview',
      label: { en: 'Overview', bn: 'ওভারভিউ' },
      icon: FiGrid,
      exact: true,
    },
    {
      path: '/dashboard/mistri?tab=profile',
      label: { en: 'Profile', bn: 'প্রোফাইল' },
      icon: FiUser,
      exact: true,
    },
    {
      path: '/dashboard/mistri?tab=jobs',
      label: { en: 'Jobs', bn: 'কাজ' },
      icon: FiBriefcase,
      exact: true,
    },
    {
      path: '/dashboard/mistri?tab=earnings',
      label: { en: 'Earnings', bn: 'আয়' },
      icon: FiDollarSign,
      exact: true,
    },
    {
      path: '/dashboard/mistri?tab=certificates',
      label: { en: 'Awards', bn: 'সার্টিফিকেট' },
      icon: FiAward,
      exact: true,
    },
    {
      path: '/dashboard/mistri?tab=location',
      label: { en: 'Location', bn: 'লোকেশন' },
      icon: FiMapPin,
      exact: true,
    },
    {
      path: '/dashboard/mistri?tab=settings',
      label: { en: 'Settings', bn: 'সেটিংস' },
      icon: FiSettings,
      exact: true,
    },
  ];

  const menuItems = userSession.role === 'admin' ? adminMenuItems : mistriMenuItems;

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800/80 py-1 z-50 flex items-center justify-around shadow-2xl h-16 overflow-x-auto custom-scrollbar">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => `
                flex flex-col items-center justify-center gap-1 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 min-w-[64px] shrink-0
                ${
                  isActive
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              <Icon className="text-lg" />
              <span className="text-[9px] font-medium truncate max-w-[65px]">
                {item.label[currentLang]}
              </span>
            </NavLink>
          );
        })}
  
      </nav>

     {/* pc mode */}
      <aside className="hidden lg:flex fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800/60 flex-col justify-between h-[100dvh] lg:sticky overflow-hidden">
        {/*  */}
        <div className="p-6 border-b border-slate-800/50 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center">
            <FiLayers className="text-amber-400 text-lg" />
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-wider uppercase">
              Mistry <span className="text-amber-400">Hub</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest mt-0.5">
              Control Panel
            </p>
          </div>
        </div>

        {/*  */}
        <div className="flex-1 py-6 px-4 overflow-y-auto space-y-1.5 custom-scrollbar">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-3 mb-3">
            {currentLang === 'bn' ? 'মেনু নেভিগেশন' : 'Navigation'}
          </p>

          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                end={item.exact}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 group
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/15 to-transparent border-l-4 border-amber-500 text-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border-l-4 border-transparent'
                  }
                `}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`text-base transition-colors ${isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'}`}
                    />
                    <span>
                      {item.label[currentLang] === 'ওভারভিউ'
                        ? 'ড্যাশবোর্ড ওভারভিউ'
                        : item.label[currentLang] === 'প্রোফাইল'
                          ? 'আমার প্রোফাইল'
                          : item.label[currentLang] === 'অর্ডার'
                            ? 'কাজের অর্ডারসমূহ'
                            : item.label[currentLang]}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>

        {/*  */}
        <div className="p-4 border-t border-slate-800/50 bg-slate-950/40 space-y-2 shrink-0">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/40">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
              <img
                src={userSession.avatar}
                alt="Active Profile Display"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">
                {userSession.name}
              </p>

              {userSession.isVerified ? (
                <p className="text-[10px] text-emerald-400 font-medium tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  {userSession.role === 'admin'
                    ? currentLang === 'bn'
                      ? 'সিস্টেম অ্যাডমিন'
                      : 'System Admin'
                    : currentLang === 'bn'
                      ? 'যাচাইকৃত মিস্ত্রি'
                      : 'Verified Mistry'}
                </p>
              ) : (
                <p className="text-[10px] text-amber-400 font-medium tracking-wide">
                  {currentLang === 'bn'
                    ? 'অনুমোদন পেন্ডিং'
                    : 'Pending Verification'}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150"
          >
            <FiLogOut className="text-base" />
            <span>{currentLang === 'bn' ? 'লগআউট করুন' : 'Logout'}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
