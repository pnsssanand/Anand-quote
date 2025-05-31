
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  PenTool, 
  BookOpen, 
  TrendingUp,
  Users,
  Quote
} from 'lucide-react';

const Dashboard = () => {
  const { userProfile } = useAuth();

  const quickActions = [
    {
      title: 'Generate Quotes',
      description: 'Create AI-powered quotes for any mood or category',
      icon: Sparkles,
      href: '/generate',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Design Editor',
      description: 'Transform quotes into beautiful visual content',
      icon: PenTool,
      href: '/editor',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'My Quotes',
      description: 'View and manage your saved quotes',
      icon: BookOpen,
      href: '/quotes',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const stats = [
    { name: 'Credits Remaining', value: userProfile?.credits || 0, icon: Sparkles },
    { name: 'Saved Quotes', value: userProfile?.savedQuotes?.length || 0, icon: Quote },
    { name: 'Today\'s Generations', value: 200 - (userProfile?.credits || 0), icon: TrendingUp }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Welcome back, {userProfile?.name || 'User'}!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Create inspiring quotes, design beautiful graphics, and share your creativity with the world.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Card key={action.title} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${action.color}`}></div>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Link to={action.href}>
                <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Quick Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Maximize Your Credits</h4>
              <p className="text-sm text-purple-700">
                Your credits reset daily! Make sure to use them before the 24-hour reset.
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Design Pro Tip</h4>
              <p className="text-sm text-blue-700">
                Use contrasting colors and bold fonts to make your quotes stand out on social media.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
