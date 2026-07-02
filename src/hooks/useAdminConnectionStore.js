import { useEffect, useState } from 'react';
import bundledBackupState from '../data/adminDataBackup.json';
import { cacheAdminState, getAdminState, normalizeAdminConnectionState } from '../services/adminConnectionStore';
import { loadBackupState, loadFirestoreStateOnce, subscribeToFirestoreState } from '../services/firebaseConnectionRepository';

const bundledBackup = normalizeAdminConnectionState({
  learners: bundledBackupState.learners || [],
  planningDays: bundledBackupState.planningDays || [],
  connectionTimes: bundledBackupState.connectionTimes || [],
});

const normalizeAdminState = (adminState = {}) => ({
  learners: Array.isArray(adminState.learners) ? adminState.learners : [],
  planningDays: Array.isArray(adminState.planningDays) ? adminState.planningDays : [],
  connectionTimes: Array.isArray(adminState.connectionTimes) ? adminState.connectionTimes : [],
});

const hasStateData = (adminState) => (
  normalizeAdminState(adminState).learners.length > 0 ||
  normalizeAdminState(adminState).planningDays.length > 0 ||
  normalizeAdminState(adminState).connectionTimes.length > 0
);

const loadRemoteOrBackupState = async () => {
  const remoteState = normalizeAdminState(await loadFirestoreStateOnce());
  if (hasStateData(remoteState)) return remoteState;
  return normalizeAdminState(await loadBackupState());
};

const getInitialState = () => {
  const adminState = normalizeAdminState(getAdminState());
  return hasStateData(adminState) ? adminState : bundledBackup;
};

const useAdminConnectionStore = () => {
  const [state, setState] = useState(() => {
    const adminState = getInitialState();
    return { ...adminState, isLoading: !hasStateData(adminState) };
  });

  useEffect(() => {
    let mounted = true;
    if (!hasStateData(getAdminState()) && hasStateData(bundledBackup)) {
      cacheAdminState(bundledBackup);
      setState({ ...bundledBackup, isLoading: false });
    }

    const refresh = () => {
      const adminState = normalizeAdminState(getAdminState());
      setState((current) => ({ ...adminState, isLoading: current.isLoading && !hasStateData(adminState) }));
    };
    window.addEventListener('connection-admin-store-updated', refresh);
    window.addEventListener('storage', refresh);

    loadRemoteOrBackupState()
      .then((remoteState) => {
        if (!mounted) return;

        if (hasStateData(remoteState)) {
          cacheAdminState(remoteState);
          setState({ ...getAdminState(), isLoading: false });
        }
      })
      .catch(async () => {
        if (!mounted) return;
        try {
          const backupState = await loadBackupState();
          if (!mounted) return;
          if (hasStateData(backupState)) {
            cacheAdminState(normalizeAdminState(backupState));
            setState({ ...getAdminState(), isLoading: false });
            return;
          }
        } catch {
          // Keep the current local state when both Firestore and backup are unavailable.
        }
        if (mounted) setState((current) => ({ ...current, isLoading: false }));
      });

    const unsubscribe = subscribeToFirestoreState((remoteState, metadata = {}) => {
      const currentState = normalizeAdminState(getAdminState());

      if (metadata.isEmpty) {
        setState((current) => ({ ...currentState, isLoading: current.isLoading }));
        return;
      }

      cacheAdminState(normalizeAdminState(remoteState));
      setState({ ...getAdminState(), isLoading: false });
    }, () => {
      setState((current) => ({ ...current, isLoading: false }));
    });

    return () => {
      mounted = false;
      window.removeEventListener('connection-admin-store-updated', refresh);
      window.removeEventListener('storage', refresh);
      unsubscribe();
    };
  }, []);

  return state;
};

export default useAdminConnectionStore;
