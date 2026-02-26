// scripts/set-claims.mjs
// Esegui con: node scripts/set-claims.mjs

import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';

// ── Configurazione ──
const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';
const TARGET_UID = 'DaRQQ7aTpnbw195PmvTE98F2kwD2';
const CLAIMS = {
  ruolo: 'super_admin',
  cliente_id: null,
};

// ── Esecuzione ──
try {
  const serviceAccount = JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));
  
  initializeApp({
    credential: cert(serviceAccount),
  });

  const auth = getAuth();
  
  await auth.setCustomUserClaims(TARGET_UID, CLAIMS);
  
  const user = await auth.getUser(TARGET_UID);
  console.log('✅ Custom claims impostati con successo!');
  console.log('   UID:', TARGET_UID);
  console.log('   Email:', user.email);
  console.log('   Claims:', JSON.stringify(user.customClaims, null, 2));
  console.log('');
  console.log('⚠️  IMPORTANTE: L\'utente deve fare LOGOUT e LOGIN');
  
} catch (error) {
  console.error('❌ Errore:', error.message);
}