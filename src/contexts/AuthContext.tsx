
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

interface UserProfile {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  credits: number;
  lastCreditReset: Date;
  isAdmin: boolean;
  savedQuotes: string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAndResetCredits = async (userId: string) => {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastReset = userData.lastCreditReset?.toDate() || new Date(0);
      const now = new Date();
      const timeDiff = now.getTime() - lastReset.getTime();
      const hoursDiff = timeDiff / (1000 * 3600);

      if (hoursDiff >= 24) {
        await updateDoc(doc(db, 'users', userId), {
          credits: 200,
          lastCreditReset: now
        });
        return { ...userData, credits: 200, lastCreditReset: now };
      }
      return userData;
    }
    return null;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = await checkAndResetCredits(user.uid);
        if (userData) {
          setUserProfile({
            id: user.uid,
            email: user.email!,
            name: userData.name || '',
            profileImage: userData.profileImage || '',
            credits: userData.credits || 200,
            lastCreditReset: userData.lastCreditReset?.toDate() || new Date(),
            isAdmin: userData.isAdmin || false,
            savedQuotes: userData.savedQuotes || []
          });
        }
      } else {
        setUserProfile(null);
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser = userCredential.user;
    
    // Check if this is the first user (make them admin)
    const isFirstUser = email === 'admin@anandquotes.com';
    
    await setDoc(doc(db, 'users', newUser.uid), {
      name,
      email: newUser.email,
      credits: 200,
      lastCreditReset: new Date(),
      isAdmin: isFirstUser,
      savedQuotes: []
    });
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    
    await updateDoc(doc(db, 'users', user.uid), data);
    if (userProfile) {
      setUserProfile({ ...userProfile, ...data });
    }
  };

  const value = {
    user,
    userProfile,
    login,
    signup,
    logout,
    loading,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
