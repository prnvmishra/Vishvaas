"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  User, 
  GoogleAuthProvider,
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  deleteUser,
  reauthenticateWithPopup,
  reauthenticateWithCredential
} from "firebase/auth";
import { auth, googleProvider, db } from "../lib/firebase";
import { ref, get, set, remove } from "firebase/database";

interface UserProfile {
  id: number;
  firebase_uid: string;
  email: string;
  name: string;
  xp_points: number;
  level: number;
  badges: string[];
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (firebaseUser: any, overrideName?: string) => {
    try {
      // Sync strictly via Native Firebase Realtime Database
      const userRef = ref(db, `users/${firebaseUser.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        setProfile(snapshot.val());
      } else {
        // Build initial zero-state profile
        const nameFromEmail = firebaseUser.email?.split('@')[0]?.replace(/[._]/g, ' ') || 'Agent';
        const capitalizedName = nameFromEmail.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        const newProfile: UserProfile = {
          id: Date.now(),
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: overrideName || firebaseUser.displayName || capitalizedName,
          xp_points: 0,
          level: 1,
          badges: ["Scam Tracker Initiate"]
        };
        await set(userRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error("Failed to sync profile from Realtime DB:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await fetchProfile(result.user);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      // Save profile to RTDB with the actual name user entered
      await fetchProfile(result.user, name);
      // Sign out immediately — user must login manually
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      await fetchProfile(result.user);
    } catch (error) {
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error logging out", error);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user);
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      // Wipe all user data from Firebase Realtime Database
      await remove(ref(db, `users/${user.uid}`));
      // Fully delete Firebase Auth account
      await deleteUser(user);
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      // If deleteUser fails (stale session), at least sign out
      if (error?.code === 'auth/requires-recent-login') {
        await firebaseSignOut(auth);
        setUser(null);
        setProfile(null);
      } else {
        console.error("Account deletion failed:", error);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, logOut, refreshProfile, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
