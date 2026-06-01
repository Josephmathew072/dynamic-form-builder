import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { LayoutDashboard, FileText, PlusCircle, BarChart3, ClipboardList, UserPlus, LogOut, Menu, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export default function Sidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024); // 1024px and above = desktop, below = mobile/tablet
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/forms', label: 'Forms Manager', icon: ClipboardList },
    { path: '/admin/forms/new', label: 'Form Builder', icon: PlusCircle },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    dispatch(logout());
    setIsMobileMenuOpen(false);
  };

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Dynamic Forms
        </h1>
        <p className="text-xs text-gray-500 mt-1">Form Builder Platform</p>
        {user && (
          <p className="text-xs text-gray-400 mt-2">
            Logged in as <span className="font-medium">{user.username}</span>
            <br />
            <span className="capitalize">{user.role}</span>
          </p>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        {user?.role === 'superadmin' && (
          <NavLink
            to="/admin/create-admin"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <UserPlus className="h-5 w-5" />
            <span>Create Admin</span>
          </NavLink>
        )}
      </nav>
      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button> */}
        <div className="text-xs text-gray-500 text-center pt-2">
          <p>Built with React & Express</p>
          <p className="mt-1">Dynamic Form Builder</p>
        </div>
      </div>
    </>
  );

  // Mobile/Tablet (below 1024px): Hamburger menu
  if (!isDesktop) {
    return (
      <>
        {/* Hamburger Button - only visible on mobile/tablet */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-all lg:hidden"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <NavContent />
          </div>
        </aside>
      </>
    );
  }

  // Desktop (1024px and above): Fixed sidebar
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-30">
      <div className="flex flex-col h-full overflow-y-auto">
        <NavContent />
      </div>
    </aside>
  );
}