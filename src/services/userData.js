import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const DATA_DOC_ID = 'app_data';

export async function loadUserData(uid) {
  if (!db || !uid) return null;
  const ref = doc(db, 'users', uid, 'data', DATA_DOC_ID);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? snapshot.data() : null;
}

export async function saveUserData(uid, data) {
  if (!db || !uid) return null;
  const ref = doc(db, 'users', uid, 'data', DATA_DOC_ID);
  await setDoc(ref, data, { merge: true });
}