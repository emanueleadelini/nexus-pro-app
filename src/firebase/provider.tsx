'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, onSnapshot } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { UserProfile } from '@/types/user';

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

interface UserAuthState {
  user: User | null;
  userData: UserProfile | null;
  isUserLoading: boolean;
  isUserDataLoading: boolean;
  userError: Error | null;
}

export interface FirebaseContextState extends UserAuthState {
  areServicesAvailable: boolean;
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  isAdmin: boolean;
}

export interface UserHookResult extends UserAuthState {
  isAdmin: boolean;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [authState, setAuthState] = useState<UserAuthState>({
    user: null,
    userData: null,
    isUserLoading: true,
    isUserDataLoading: false,
    userError: null,
  });

  useEffect(() => {
    if (!auth) return;

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (firebaseUser) {
          setAuthState(prev => ({ 
            ...prev, 
            user: firebaseUser, 
            isUserLoading: false, 
            isUserDataLoading: true 
          }));
          
          const userDocRef = doc(firestore, 'users', firebaseUser.uid);
          const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
            setAuthState(prev => ({
              ...prev,
              userData: docSnap.exists() ? (docSnap.data() as UserProfile) : null,
              isUserDataLoading: false
            }));
          }, (err) => {
            // Se l'errore è di permessi ma l'email è quella del superadmin, ignoriamo l'errore nel caricamento del profilo
            if (firebaseUser.email === 'emanueleadelini@gmail.com') {
              setAuthState(prev => ({ ...prev, isUserDataLoading: false }));
            } else {
              console.error("Errore recupero profilo:", err);
              setAuthState(prev => ({ 
                ...prev, 
                isUserDataLoading: false,
                userData: null
              }));
            }
          });

          return () => unsubscribeDoc();
        } else {
          setAuthState({ 
            user: null, 
            userData: null, 
            isUserLoading: false, 
            isUserDataLoading: false, 
            userError: null 
          });
        }
      },
      (error) => {
        setAuthState({ 
          user: null, 
          userData: null, 
          isUserLoading: false, 
          isUserDataLoading: false, 
          userError: error 
        });
      }
    );

    return () => unsubscribeAuth();
  }, [auth, firestore]);

  const isAdmin = useMemo(() => {
    if (!authState.user) return false;
    
    // Accesso immediato e prioritario per l'email del proprietario
    if (authState.user.email === 'emanueleadelini@gmail.com') return true;
    
    const role = authState.userData?.ruolo;
    return role === 'super_admin' || role === 'operatore' || role === 'admin';
  }, [authState.userData, authState.user]);

  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      ...authState,
      isAdmin,
    };
  }, [firebaseApp, firestore, auth, authState, isAdmin]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) throw new Error('useFirebase must be used within a FirebaseProvider.');
  return context;
};

export const useAuth = () => useFirebase().auth!;
export const useFirestore = () => useFirebase().firestore!;
export const useFirebaseApp = () => useFirebase().firebaseApp!;

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T & {__memo?: boolean} {
  const memoized = useMemo(factory, deps);
  if(typeof memoized === 'object' && memoized !== null) {
    (memoized as any).__memo = true;
  }
  return memoized as any;
}

export const useUser = (): UserHookResult => {
  const { user, userData, isUserLoading, isUserDataLoading, userError, isAdmin } = useFirebase();
  return { user, userData, isUserLoading, isUserDataLoading, userError, isAdmin };
};