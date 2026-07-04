import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Coins, 
  FolderGit, 
  LogOut, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  FolderTree, 
  FolderHeart, 
  Layout, 
  PieChart, 
  MapPin, 
  FileText, 
  Star, 
  Settings, 
  Bell 
} from 'lucide-react';


export const AdminLayout: React.FC = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to premium dark mode for admins
  const [showNotifications, setShowNotifications] = useState(false);

  const { notifications, unreadCount, markAllAsRead, clearAll } = useNotifications();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      roles: ['super_admin', 'catalog_manager', 'store_manager'],
    },
    {
      name: 'Business Analytics',
      path: '/admin/analytics',
      icon: PieChart,
      roles: ['super_admin', 'store_manager'],
    },
    {
      name: 'Showrooms Locations',
      path: '/admin/stores',
      icon: MapPin,
      roles: ['super_admin', 'store_manager'],
    },
    {
      name: 'Product Catalog',
      path: '/admin/products',
      icon: FolderGit,
      roles: ['super_admin', 'catalog_manager'],
    },
    {
      name: 'Categories',
      path: '/admin/categories',
      icon: FolderTree,
      roles: ['super_admin', 'catalog_manager'],
    },
    {
      name: 'Collections',
      path: '/admin/collections',
      icon: FolderHeart,
      roles: ['super_admin', 'catalog_manager'],
    },
    {
      name: 'Blog CMS',
      path: '/admin/blogs',
      icon: FileText,
      roles: ['super_admin', 'catalog_manager'],
    },
    {
      name: 'Testimonials',
      path: '/admin/testimonials',
      icon: Star,
      roles: ['super_admin', 'catalog_manager'],
    },
    {
      name: 'Media Library',
      path: '/admin/media',
      icon: ImageIcon,
      roles: ['super_admin', 'catalog_manager'],
    },
    {
      name: 'Daily Rates',
      path: '/admin/rates',
      icon: Coins,
      roles: ['super_admin', 'store_manager'],
    },
    {
      name: 'Homepage Builder',
      path: '/admin/homepage',
      icon: Layout,
      roles: ['super_admin', 'catalog_manager'],
    },
    {
      name: 'Global Settings',
      path: '/admin/settings',
      icon: Settings,
      roles: ['super_admin'],
    },
  ];

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  // Filter menu items by active role permissions
  const filteredMenuItems = menuItems.filter(
    item => !role || item.roles.includes(role)
  );

  return (
    <div className="min-h-screen bg-pearl dark:bg-obsidian text-obsidian dark:text-pearl flex transition-colors duration-300 font-sans relative">
      
      {/* 1. DESKTOP FIXED SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 border-r border-gold-primary/20 bg-obsidian text-pearl shrink-0 h-screen sticky top-0 justify-between p-6">
        <div className="flex flex-col gap-6 overflow-y-auto">
          {/* Logo */}
          <div className="flex flex-col items-center border-b border-gold-primary/10 pb-4">
            <span className="font-serif text-lg tracking-[0.25em] text-gold-primary uppercase">CHANDRAKALA</span>
            <span className="text-[8px] tracking-[0.45em] text-pearl/50 uppercase mt-0.5">JEWELLERS</span>
            <span className="text-[9px] text-gold-primary/70 uppercase tracking-widest mt-2 font-mono">Control Center</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.path)}
                  className={`flex items-center gap-3 px-3 py-2 text-[11px] uppercase tracking-widest font-semibold rounded-luxury-sm text-left transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-gold-primary text-obsidian shadow-lg' 
                      : 'text-pearl/70 hover:text-gold-primary hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Administrator Profile Card */}
        <div className="flex flex-col gap-4 border-t border-gold-primary/10 pt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold-primary/15 border border-gold-primary/30 text-gold-primary rounded-full flex items-center justify-center font-bold">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate">{user?.user_metadata?.name || 'Admin User'}</p>
              <p className="text-[9px] text-gold-primary uppercase tracking-widest mt-0.5 truncate">{role || 'No Role'}</p>
            </div>
          </div>

          <div className="flex gap-2 justify-between items-center relative">
            <button
              onClick={toggleTheme}
              className="p-2 text-pearl/50 hover:text-gold-primary hover:bg-white/5 rounded-full transition-colors cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Notification center bell with badge trigger */}
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-pearl/50 hover:text-gold-primary hover:bg-white/5 rounded-full transition-colors relative cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[7px] font-sans rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={logout}
              className="py-1.5 px-3 text-[9px] uppercase tracking-wider font-semibold border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 rounded transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>

            {/* Desktop Notification center popover menu */}
            {showNotifications && (
              <div className="absolute bottom-12 left-0 z-50 w-72 bg-obsidian border border-gold-primary/20 rounded shadow-2xl p-4 flex flex-col gap-3 font-sans text-pearl">
                <div className="flex justify-between items-center border-b border-gold-primary/10 pb-2">
                  <h4 className="text-[10px] uppercase tracking-wider text-gold-primary font-bold">Operational Alerts</h4>
                  <div className="flex gap-2">
                    <button onClick={markAllAsRead} className="text-[8px] underline text-pearl/50 hover:text-pearl cursor-pointer">Read All</button>
                    <button onClick={clearAll} className="text-[8px] underline text-rose-400 hover:text-rose-500 cursor-pointer">Clear</button>
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto space-y-2 text-left">
                  {notifications.length === 0 ? (
                    <p className="text-[9px] text-pearl/40 py-4 text-center">No alerts logged.</p>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className={`p-2 rounded text-[10px] ${n.read ? 'bg-white/5 opacity-60' : 'bg-gold-primary/5 border border-gold-primary/10'}`}>
                        <div className="flex justify-between font-semibold">
                          <span className="truncate">{n.title}</span>
                          <span className="text-[8px] opacity-40 shrink-0">{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[9px] opacity-75 mt-0.5 leading-normal">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </aside>

      {/* 2. MOBILE TOP NAVIGATION BAR */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between p-4 bg-obsidian border-b border-gold-primary/20 text-pearl z-30 sticky top-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gold-primary hover:text-gold-light focus:outline-none p-1 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          
          <div className="flex flex-col items-center">
            <span className="font-serif text-sm tracking-[0.2em] text-gold-primary uppercase">CHANDRAKALA</span>
            <span className="text-[7px] tracking-[0.4em] text-pearl/50 uppercase mt-0.5">JEWELLERS</span>
          </div>

          <div className="w-8 h-8 bg-gold-primary/10 border border-gold-primary/25 text-gold-primary rounded-full flex items-center justify-center font-bold text-xs">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
        </header>

        {/* Mobile Slide Drawer Menu */}
        <div
          className={`
            md:hidden fixed top-[61px] left-0 w-full h-[calc(100vh-61px)] bg-obsidian/95 backdrop-blur-md border-t border-gold-primary/10 transition-all duration-500 ease-out transform z-20
            ${mobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
          `}
        >
          <div className="flex flex-col justify-between h-full p-6 text-pearl">
            <div className="flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
              <nav className="flex flex-col gap-3">
                {filteredMenuItems.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item.path)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors cursor-pointer ${
                        isActive 
                          ? 'bg-gold-primary text-obsidian font-bold' 
                          : 'text-pearl/70 hover:text-gold-primary'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gold-primary/10">
              <button
                onClick={toggleTheme}
                className="p-2 text-pearl/50 hover:text-gold-primary transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={logout}
                className="py-2 px-6 text-xs uppercase tracking-wider font-semibold border border-rose-500/20 text-rose-400 rounded cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* 3. MAIN ADMINISTRATIVE CONTENT OUTLET */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
