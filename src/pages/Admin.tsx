
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
  Settings, 
  Search,
  RefreshCw,
  Shield
} from 'lucide-react';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserData {
  id: string;
  name: string;
  email: string;
  credits: number;
  lastCreditReset: Date;
  isAdmin: boolean;
}

const Admin = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [defaultCredits, setDefaultCredits] = useState(200);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('email'));
      const snapshot = await getDocs(q);
      
      const userData: UserData[] = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        userData.push({
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          credits: data.credits || 0,
          lastCreditReset: data.lastCreditReset?.toDate() || new Date(),
          isAdmin: data.isAdmin || false
        });
      });
      
      setUsers(userData);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateUserCredits = async (userId: string, newCredits: number) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        credits: newCredits,
        lastCreditReset: new Date()
      });
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, credits: newCredits, lastCreditReset: new Date() }
          : user
      ));
      
      toast({ title: "Success!", description: "User credits updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update credits", variant: "destructive" });
    }
  };

  const toggleAdminStatus = async (userId: string, isAdmin: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isAdmin: !isAdmin
      });
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, isAdmin: !isAdmin }
          : user
      ));
      
      toast({ title: "Success!", description: "Admin status updated" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update admin status", variant: "destructive" });
    }
  };

  const resetAllCredits = async () => {
    try {
      const promises = users.map(user => 
        updateDoc(doc(db, 'users', user.id), {
          credits: defaultCredits,
          lastCreditReset: new Date()
        })
      );
      
      await Promise.all(promises);
      await fetchUsers();
      
      toast({ title: "Success!", description: "All user credits reset" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to reset credits", variant: "destructive" });
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = users.length;
  const totalCreditsUsed = users.reduce((sum, user) => sum + (200 - user.credits), 0);
  const adminUsers = users.filter(user => user.isAdmin).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage users, credits, and system settings
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Credits Used Today</p>
                <p className="text-3xl font-bold text-gray-900">{totalCreditsUsed}</p>
              </div>
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Users</p>
                <p className="text-3xl font-bold text-gray-900">{adminUsers}</p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Usage</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalUsers > 0 ? Math.round(totalCreditsUsed / totalUsers) : 0}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-purple-600" />
              <span>System Controls</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Daily Credits</Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={defaultCredits}
                  onChange={(e) => setDefaultCredits(Number(e.target.value))}
                  min={1}
                  max={1000}
                />
                <Button variant="outline">Update</Button>
              </div>
            </div>
            
            <Button 
              onClick={resetAllCredits}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset All User Credits
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>User Management</CardTitle>
          <Button variant="outline" onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-600" />
              <p className="mt-2 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Credits</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{user.name || 'No name'}</p>
                          <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{user.credits}</span>
                          <Input
                            type="number"
                            className="w-20 h-8"
                            min={0}
                            max={1000}
                            defaultValue={user.credits}
                            onBlur={(e) => {
                              const newCredits = Number(e.target.value);
                              if (newCredits !== user.credits) {
                                updateUserCredits(user.id, newCredits);
                              }
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          {user.isAdmin && (
                            <Badge variant="default" className="bg-purple-100 text-purple-800">
                              Admin
                            </Badge>
                          )}
                          <p className="text-xs text-gray-500">
                            Reset: {user.lastCreditReset.toLocaleDateString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAdminStatus(user.id, user.isAdmin)}
                        >
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
