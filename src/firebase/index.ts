'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

/**
 * Inizializza l'istanza Firebase per l'applicazione.
 * Forza l'uso di firebaseConfig per garantire che l'app si colleghi al progetto Cloud
 * corretto e non all'emulatore locale predefinito di Firebase Studio.
 */
export function initializeFirebase() {
  const apps = getApps();
  let firebaseApp: FirebaseApp;

  if (!apps.length) {
    // Inizializzazione pulita con config esplicita
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    // Se l'app esiste già, la utilizziamo. 
    // Nota: in caso di errori persistenti di permessi in Studio, 
    // potrebbe essere necessario eliminare apps[0] e reinizializzare.
    firebaseApp = apps[0];
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
