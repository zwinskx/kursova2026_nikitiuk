import React from 'react';
import {
  LayoutDashboard, Compass, BarChart2, Bookmark, Settings,
  Sun, Moon, ShieldPlus, MessageSquare, History, UserCheck
} from 'lucide-react';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppProvider, useApp } from './context/AppContext';

import CarComparisonModal from './components/CarComparisonModal';
import CarDetailModal from './components/CarDetailModal';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import AccountSwitcherModal from './components/AccountSwitcherModal';
import AccountSettingsModal from './components/AccountSettingsModal';
import AiAssistant from './components/AiAssistant';

import OverviewPage from './pages/OverviewPage';
import DiscoverPage from './pages/DiscoverPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SavedPage from './pages/SavedPage';
import RecentPage from './pages/RecentPage';
import ReviewsPage from './pages/ReviewsPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const { theme, setTheme } = useTheme();
  const {
    activeTab, setActiveTab, lang, currency, distanceUnit, user, setUser, currentText,
    currentUserData, setIsAccountSwitcherOpen, setIsAuthModalOpen, setAuthMode,
    setSettingsName, setSettingsAvatar, setSettingsLang, setSettingsCurrency,
    setSettingsDistance, setIsSettingsOpen,
    isFullComparisonOpen, setIsFullComparisonOpen, compareCar1, compareCar2, formatPrice,
     selectedCarForModal, setSelectedCarForModal, handleOpenBookingModal
  } = useApp();

  const formatMileage = (mileage) => {
  const value = Number(mileage) || 0;

  if (distanceUnit === 'km') {
    return `${Math.round(value * 1.60934).toLocaleString(lang === 'ua' ? 'uk-UA' : 'en-US')} км`;
  }

  return `${Math.round(value).toLocaleString(lang === 'ua' ? 'uk-UA' : 'en-US')} mi`;
};
  return (
    <div className={theme === 'dark' ? 'dark bg-[#0b0f19] text-slate-100 min-h-screen flex font-sans' : 'bg-slate-100 text-slate-900 min-h-screen flex font-sans'}>

      {/* Лівий навбар */}
      <aside className={`w-64 h-screen sticky top-0 flex flex-col justify-between p-6 border-r transition-colors z-30 shadow-2xl ${theme === 'dark' ? 'bg-[#0d1322] border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-500/30">
              📈
            </div>
            <span className={`text-xl font-extrabold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>AutoAdvisor</span>
          </div>

          <nav className="space-y-1.5 text-left">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${activeTab === 'overview' ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200/80 text-slate-800'}`}>
              <LayoutDashboard size={18} className="shrink-0" />
              <span className="leading-tight">{currentText.overview}</span>
            </button>
            <button onClick={() => setActiveTab('discover')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${activeTab === 'discover' ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200/80 text-slate-800'}`}>
              <Compass size={18} className="shrink-0" />
              <span className="leading-tight">{currentText.discover}</span>
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${activeTab === 'analytics' ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200/80 text-slate-800'}`}>
              <BarChart2 size={18} className="shrink-0" />
              <span className="leading-tight">{currentText.analytics}</span>
            </button>

            <button onClick={() => setActiveTab('saved')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${activeTab === 'saved' ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200/80 text-slate-800'}`}>
              <Bookmark size={18} className="shrink-0" />
              <span className="leading-tight">{currentText.saved}</span>
              {currentUserData.saved.length > 0 && (
                <span className="ml-auto shrink-0 px-2 py-0.5 bg-emerald-500 text-white rounded-full text-xs font-black">
                  {currentUserData.saved.length}
                </span>
              )}
            </button>

            {user && (
              <button onClick={() => setActiveTab('recent')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${activeTab === 'recent' ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200/80 text-slate-800'}`}>
                <History size={18} className="shrink-0" />
                <span className="leading-tight">{currentText.recent}</span>
                {currentUserData.recent.length > 0 && (
                  <span className="ml-auto shrink-0 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-black">
                    {currentUserData.recent.length}
                  </span>
                )}
              </button>
            )}

            <button onClick={() => setActiveTab('reviews')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${activeTab === 'reviews' ? 'bg-emerald-500/20 text-emerald-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200/80 text-slate-800'}`}>
              <MessageSquare size={18} className="shrink-0" />
              <span className="leading-tight">{currentText.reviews}</span>
            </button>
            {user?.is_admin && (
              <button onClick={() => setActiveTab('admin')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-all ${activeTab === 'admin' ? 'bg-amber-500/20 text-amber-400 font-bold shadow-sm' : theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200/80 text-slate-800'}`}>
                <ShieldPlus size={18} className="shrink-0" />
                <span className="leading-tight">{currentText.admin}</span>
              </button>
            )}
          </nav>
        </div>

        <div className={`pt-6 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} space-y-3`}>
          <button onClick={() => {
            if (!user) { setIsAuthModalOpen(true); setAuthMode('login'); }
            else {
              setSettingsName(user.display_name);
              setSettingsAvatar(user.avatar_url || '');
              setSettingsLang(lang);
              setSettingsCurrency(currency);
              setSettingsDistance(distanceUnit);
              setIsSettingsOpen(true);
            }
          }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all ${theme === 'dark' ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-200/80 text-slate-800'}`}>
            <Settings size={18} className="shrink-0" />
            <span className="leading-tight">{currentText.settings}</span>
          </button>

          <div className="flex items-center justify-between pt-2">
            {user ? (
              <div className="flex items-center gap-2.5 text-left overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-9 h-9 rounded-full object-cover shadow-md shrink-0 border border-emerald-500/50" />
                ) : (
                  <div className="w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md shrink-0">
                    {user.display_name[0]}
                  </div>
                )}
                <div className="overflow-hidden flex-1">
                  <p className={`text-xs font-bold truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{user.display_name}</p>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setIsAccountSwitcherOpen(true)} className="text-[10px] text-emerald-400 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer">
                      <UserCheck size={10} /> {currentText.switchAccount}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }} className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg transition-all">
                {currentText.signIn}
              </button>
            )}

            <div>
              <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-2.5 rounded-xl border ml-2 transition-transform hover:scale-110 ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-800'}`}>
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto flex flex-col justify-between min-h-screen text-left relative">
        <div>
          <div className="flex justify-between items-center mb-8">
            <span className="text-xs text-slate-300 dark:text-slate-400 uppercase tracking-widest font-bold text-left">Workspace / <span className="text-emerald-400 font-extrabold">{activeTab}</span></span>
            {user && <button onClick={() => setUser(null)} className="text-xs px-3.5 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all cursor-pointer">{currentText.logout}</button>}
          </div>

          {activeTab === 'overview' && <OverviewPage />}
          {activeTab === 'discover' && <DiscoverPage />}
          {activeTab === 'analytics' && <AnalyticsPage />}
          {activeTab === 'saved' && <SavedPage />}
          {activeTab === 'recent' && <RecentPage />}
          {activeTab === 'reviews' && <ReviewsPage />}
          {activeTab === 'admin' && user?.is_admin && <AdminPage />}
        </div>

        <CarComparisonModal
          isOpen={isFullComparisonOpen}
          onClose={() => setIsFullComparisonOpen(false)}
          car1={compareCar1}
          car2={compareCar2}
          theme={theme}
          lang={lang}
          formatPrice={formatPrice}
        />

        {selectedCarForModal && (
          <CarDetailModal
            car={selectedCarForModal}
            isOpen={!!selectedCarForModal}
            onClose={() => setSelectedCarForModal(null)}
            theme={theme}
            lang={lang}
            formatPrice={formatPrice}
            formatMileage={formatMileage}
            onBook={(car) => { setSelectedCarForModal(null); handleOpenBookingModal(car); }}
          />
        )}

        <BookingModal />
        <AuthModal />
        <AccountSwitcherModal />
        <AccountSettingsModal />

        <footer className={`mt-16 pt-6 border-t ${theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-600'} text-xs font-medium flex justify-between items-center`}>
          <p>{currentText.footerRights}</p>
          <div className="flex gap-6">
            <span>📞 +38 (068) 331-78-25</span>
            <span>✉️ support.autoadvisor@gmail.com</span>
            <span>📍 {lang === 'ua' ? 'м. Хмельницький, вул. Залізняка, 34/1' : 'Kyiv, Technichna str., 12'}</span>
          </div>
        </footer>
      </main>

      <AiAssistant />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}