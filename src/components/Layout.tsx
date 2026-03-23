import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../firebase';
import { 
  LayoutDashboard, 
  Users, 
  CloudSun, 
  TrendingUp, 
  Briefcase, 
  MessageSquare, 
  CreditCard, 
  LogOut, 
  Menu, 
  X,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile, isAdmin, isFarmer } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, show: !!user },
    { label: 'Farmers', path: '/admin/farmers', icon: Users, show: isAdmin },
    { label: 'Weather', path: '/weather', icon: CloudSun, show: !!user },
    { label: 'Market Prices', path: '/market', icon: TrendingUp, show: !!user },
    { label: 'Services', path: '/services', icon: Briefcase, show: !!user },
    { label: 'Messages', path: '/messages', icon: MessageSquare, show: !!user },
    { label: 'Payments', path: '/payments', icon: CreditCard, show: !!user },
    { label: 'Admin Panel', path: '/admin', icon: ShieldCheck, show: isAdmin },
  ];

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#1A1A1A] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-black/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="https://storage.googleapis.com/static.antigravity.dev/0195c104-1834-7123-9689-181f08461539/logo.png" 
              className="w-10 h-10 object-contain" 
              alt="JAMO Logo" 
              referrerPolicy="no-referrer" 
            />
            <span className="font-bold text-xl tracking-tight hidden sm:block">JAMO</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full">
                  <UserIcon size={16} />
                  <span className="text-sm font-medium">{profile?.fullName || user.displayName || 'User'}</span>
                  <span className="text-[10px] uppercase tracking-wider opacity-50 font-bold">{profile?.role || 'Guest'}</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-[#5A5A40] text-white px-6 py-2 rounded-full font-medium hover:bg-[#4A4A30] transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile/Side Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-64 bg-white z-50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-xl">Menu</span>
                <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
              </div>

              <nav className="flex-1 flex flex-col gap-2">
                {navItems.filter(item => item.show).map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl transition-all",
                      location.pathname === item.path 
                        ? "bg-[#5A5A40] text-white shadow-md" 
                        : "hover:bg-black/5"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>

              <button 
                onClick={handleLogout}
                className="mt-auto flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 border-top border-black/5 text-center text-sm text-black/40">
        <p>&copy; 2026 JAMO – Joint Agriculture Management Organization. All rights reserved.</p>
        <p className="mt-1 italic">Empowering Farmers. Transforming Communities.</p>
      </footer>
    </div>
  );
};
