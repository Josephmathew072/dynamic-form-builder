import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { LayoutDashboard, FileText, PlusCircle, BarChart3, ClipboardList, UserPlus, LogOut } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

export default function Sidebar() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/forms', label: 'Forms Manager', icon: ClipboardList },
    { path: '/admin/forms/new', label: 'Form Builder', icon: PlusCircle },
    { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
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
    </aside>
  );
}