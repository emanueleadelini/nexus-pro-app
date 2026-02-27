'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

/**
 * Inizializza l'istanza Firebase per l'applicazione.
 * Forza l'uso di firebaseConfig per garantire che l'app si colleghi al progetto Cloud
 * ed eviti l'instradamento automatico verso l'emulatore di Firebase Studio.
 */
export function initializeFirebase() {
  const apps = getApps();
  let firebaseApp: FirebaseApp;

  // In Firebase Studio, initializeApp() potrebbe essere chiamato automaticamente.
  // Forziamo l'uso della nostra configurazione esplicita.
  if (!apps.length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }

  return getSdks(firebaseApp);
}

/**
 * Estrae gli SDK principali (Auth e Firestore) dall'app inizializzata.
 */
export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

// Esportazione dei moduli core per l'app
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
