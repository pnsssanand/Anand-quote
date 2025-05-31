
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  PenTool, 
  BookOpen, 
  User, 
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';

const Layout = () => {
  const { userProfile, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Generate', href: '/generate', icon: Sparkles },
    { name: 'Design Editor', href: '/editor', icon: PenTool },
    { name: 'My Quotes', href: '/quotes', icon: BookOpen },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  if (userProfile?.isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin', icon: Settings });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Anand Quotes
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link key={item.name} to={item.href}>
                  <Button 
                    variant={location.pathname === item.href ? "default" : "ghost"}
                    size="sm"
                    className={location.pathname === item.href ? "bg-purple-600 hover:bg-purple-700" : ""}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-purple-100 px-3 py-1 rounded-full">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-700">
                  {userProfile?.credits || 0} credits
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t">
        <div className="grid grid-cols-4 gap-1 p-2">
          {navigation.slice(0, 4).map((item) => (
            <Link key={item.name} to={item.href}>
              <Button
                variant={location.pathname === item.href ? "default" : "ghost"}
                size="sm"
                className={`w-full flex-col h-12 ${
                  location.pathname === item.href ? "bg-purple-600 hover:bg-purple-700" : ""
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-xs mt-1">{item.name}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Layout;
