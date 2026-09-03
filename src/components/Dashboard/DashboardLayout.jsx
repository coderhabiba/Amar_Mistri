import { Outlet, Link, useNavigate } from 'react-router-dom'; 
import { FiHome, FiArrowLeft, FiLogOut } from 'react-icons/fi'; 
import { useTranslation } from 'react-i18next'; 
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const currentLang = i18n.language === 'bn' ? 'bn' : 'en'; 

  // Defined fallback placeholder for handleLogout event trigger
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); 
    sessionStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full bg-slate-950 flex flex-col lg:flex-row overflow-hidden relative">
      {/* Mobile Top Header Viewport Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/60 px-4 flex items-center justify-between z-50 shadow-md">
        {/* Back Navigation Trigger */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-xs font-bold text-slate-300 transition-all active:scale-95"
        >
          <FiArrowLeft className="text-sm stroke-[3]" />
          <span>{currentLang === 'bn' ? 'পেছনে' : 'Back'}</span>
        </button>

        {/* Global Directory Home Route Target Link */}
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-400 transition-all active:scale-95"
        >
          <FiHome className="text-sm" />
          <span>{currentLang === 'bn' ? 'হোম' : 'Home'}</span>
        </Link>

        {/* Session Liquidation Authentication Action Trigger */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-red-400 min-w-[64px] shrink-0"
        >
          <FiLogOut className="text-lg" />
          <span className="text-[9px] font-medium">
            {currentLang === 'bn' ? 'লগআউট' : 'Logout'}
          </span>
        </button>
      </div>

      {/* Global Persistent Side Panel Navigation Column */}
      <Sidebar />

      {/* Primary Dashboard Route Yield Content Wrapper Container */}
      <main className="flex-1 h-full w-full pt-18 pb-20 lg:pb-6 lg:pt-6 overflow-y-auto text-slate-100 p-4 md:p-6 lg:p-8 custom-scrollbar">
        <div className="max-w-7xl mx-auto w-full space-y-4">
          {/* Large Screen Monitor Responsive Global Control Header Row */}
          <div className="hidden lg:flex items-center justify-between border-b border-slate-900 pb-4 mb-2">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 transition-all hover:text-white"
            >
              <FiArrowLeft className="text-sm stroke-[3]" />
              {currentLang === 'bn' ? 'পেছনে' : 'Back'}
            </button>

            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/10 to-amber-600/5 hover:from-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-bold uppercase tracking-wider text-amber-400 transition-all"
            >
              <FiHome className="text-sm" />
              <span>{currentLang === 'bn' ? 'হোম' : 'Home'}</span>
            </Link>
          </div>

          {/* Core Routed Workspace Outlet Interface Target */}
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
