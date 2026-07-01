import { collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '../firebase';

export const firebaseCollections = {
  learners: 'learners',
  planningDays: 'planningDays',
  connectionTimes: 'connectionTimes',
};

export const mirrorStateToFirestore = async (state) => {
  const writes = [
    ...state.learners.map((learner) => setDoc(doc(db, firebaseCollections.learners, learner.id), learner)),
    ...state.planningDays.map((day) => setDoc(doc(db, firebaseCollections.planningDays, day.id), day)),
    ...state.connectionTimes.map((entry) => setDoc(doc(db, firebaseCollections.connectionTimes, entry.id), entry)),
  ];

  await Promise.all(writes);
};

export const subscribeToFirestoreState = (onData, onError) => {
  const state = {
    learners: [],
    planningDays: [],
    connectionTimes: [],
  };
  const loaded = {
    learners: false,
    planningDays: false,
    connectionTimes: false,
  };

  const notifyWhenReady = () => {
    if (loaded.learners && loaded.planningDays && loaded.connectionTimes) {
      onData({ ...state });
    }
  };

  const subscriptions = Object.entries(firebaseCollections).map(([key, collectionName]) => (
    onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        state[key] = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        loaded[key] = true;
        notifyWhenReady();
      },
      onError,
    )
  ));

  return () => subscriptions.forEach((unsubscribe) => unsubscribe());
};

export const deleteLearnerCascadeFromFirestore = async (learnerId) => {
  const planningQuery = query(collection(db, firebaseCollections.planningDays), where('learnerId', '==', learnerId));
  const connectionQuery = query(collection(db, firebaseCollections.connectionTimes), where('learnerId', '==', learnerId));
  const [planningSnapshot, connectionSnapshot] = await Promise.all([
    getDocs(planningQuery),
    getDocs(connectionQuery),
  ]);

  const deletes = [
    deleteDoc(doc(db, firebaseCollections.learners, learnerId)),
    ...planningSnapshot.docs.map((item) => deleteDoc(item.ref)),
    ...connectionSnapshot.docs.map((item) => deleteDoc(item.ref)),
  ];

  await Promise.all(deletes);
};

export const deletePlanningDayFromFirestore = async (planningDayId) => {
  const connectionQuery = query(collection(db, firebaseCollections.connectionTimes), where('planningDayId', '==', planningDayId));
  const connectionSnapshot = await getDocs(connectionQuery);

  await Promise.all([
    deleteDoc(doc(db, firebaseCollections.planningDays, planningDayId)),
    ...connectionSnapshot.docs.map((item) => deleteDoc(item.ref)),
  ]);
};

export const deleteConnectionTimeFromFirestore = async (connectionTimeId) => {
  await deleteDoc(doc(db, firebaseCollections.connectionTimes, connectionTimeId));
};
