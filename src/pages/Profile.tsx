
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { User, Camera, Sparkles, Calendar, Edit } from 'lucide-react';

const Profile = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');
  const [uploading, setUploading] = useState(false);

  const handleSave = async () => {
    try {
      await updateUserProfile({ name });
      setEditing(false);
      toast({ title: "Success!", description: "Profile updated successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile", variant: "destructive" });
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'anand quote generator');

      const response = await fetch(
        'https://api.cloudinary.com/v1_1/dlvjvskje/image/upload',
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        await updateUserProfile({ profileImage: data.secure_url });
        toast({ title: "Success!", description: "Profile image updated" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getTimeUntilReset = () => {
    if (!userProfile?.lastCreditReset) return '24 hours';
    
    const lastReset = new Date(userProfile.lastCreditReset);
    const nextReset = new Date(lastReset.getTime() + 24 * 60 * 60 * 1000);
    const now = new Date();
    const diff = nextReset.getTime() - now.getTime();
    
    if (diff <= 0) return 'Credits can be reset now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-gray-600">
          Manage your account settings and view your activity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-purple-600" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={userProfile?.profileImage} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-2xl">
                      {userProfile?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg cursor-pointer hover:bg-gray-50">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {userProfile?.name || 'User'}
                  </h3>
                  <p className="text-gray-600">{userProfile?.email}</p>
                  {userProfile?.isAdmin && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="name">Full Name</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing(!editing)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                {editing ? (
                  <div className="flex space-x-2">
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                    <Button onClick={handleSave} size="sm">
                      Save
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Input
                    value={userProfile?.name || ''}
                    disabled
                  />
                )}

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={userProfile?.email || ''} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <span>Account Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Total Quotes Generated</h4>
                  <p className="text-2xl font-bold text-purple-600">
                    {200 - (userProfile?.credits || 0)}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-1">Saved Designs</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {userProfile?.savedQuotes?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Credits & Stats */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>Credits</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {userProfile?.credits || 0}
                </div>
                <p className="text-sm text-gray-600">Credits Remaining</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((userProfile?.credits || 0) / 200) * 100}%` }}
                ></div>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>Resets in: {getTimeUntilReset()}</p>
                <p className="mt-2">
                  Last reset: {userProfile?.lastCreditReset ? 
                    formatDate(new Date(userProfile.lastCreditReset)) : 'Never'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Today's Usage</span>
                <span className="font-medium">{200 - (userProfile?.credits || 0)} credits</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-medium text-green-600">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Favorite Category</span>
                <span className="font-medium">Motivation</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
