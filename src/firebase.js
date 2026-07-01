import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBl4E4mtA8tTRbUkrXs-BOi9OX-0NiOo1I',
  authDomain: 'controle-137d7.firebaseapp.com',
  projectId: 'controle-137d7',
  storageBucket: 'controle-137d7.firebasestorage.app',
  messagingSenderId: '307808660817',
  appId: '1:307808660817:web:c768ce81cc31160fdbb770',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
