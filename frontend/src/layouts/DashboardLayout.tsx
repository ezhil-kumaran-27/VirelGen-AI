import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Settings, History } from 'lucide-react';

export default function DashboardLayout() {
  // Authentication bypassed for free usage

  return (
    <div className="min-h-screen bg-background text-textMain flex">
      {/* Sidebar */}
      <aside className="w-64 glass hidden md:flex flex-col border-r border-white/10">
        <div className="p-6 flex items-center justify-center">
          <img src="/ViralGen%20AI%20logo.png" alt="ViralGen AI Logo" className="max-h-16 w-auto object-contain" />
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-textMuted hover:text-white">
            <LayoutDashboard className="w-5 h-5" />
            <span>Generate</span>
          </Link>
          <Link to="/history" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-textMuted hover:text-white">
            <History className="w-5 h-5" />
            <span>History</span>
          </Link>
          <Link to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-textMuted hover:text-white">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 mt-auto">
          {/* Logout removed */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>
        
        <header className="h-16 glass border-b border-white/10 flex items-center px-8 z-10">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 z-10 scrollbar-hide">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
