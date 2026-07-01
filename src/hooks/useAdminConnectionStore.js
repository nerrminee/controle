import { useEffect, useState } from 'react';
import { cacheAdminState, getAdminState } from '../services/adminConnectionStore';
import { subscribeToFirestoreState } from '../services/firebaseConnectionRepository';

const useAdminConnectionStore = () => {
  const [state, setState] = useState(getAdminState);

  useEffect(() => {
    const refresh = () => setState(getAdminState());
    window.addEventListener('connection-admin-store-updated', refresh);
    window.addEventListener('storage', refresh);
    const unsubscribe = subscribeToFirestoreState((remoteState) => {
      cacheAdminState(remoteState);
      setState(getAdminState());
    }, () => {});

    return () => {
      window.removeEventListener('connection-admin-store-updated', refresh);
      window.removeEventListener('storage', refresh);
      unsubscribe();
    };
  }, []);

  return state;
};

export default useAdminConnectionStore;
