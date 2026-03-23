import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { OperationType, FirestoreErrorInfo, UserProfile, LandRecord, MarketPrice, JamoService, ServiceApplication, Payment, Message } from '../types';

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const dataService = {
  // User Profile
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `users/${uid}`);
      return null;
    }
  },

  async createUserProfile(profile: UserProfile): Promise<void> {
    try {
      await setDoc(doc(db, 'users', profile.uid), {
        ...profile,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${profile.uid}`);
    }
  },

  async updateUserProfile(uid: string, data: Partial<UserProfile>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', uid), data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    }
  },

  // Land Records
  async createLandRecord(record: LandRecord): Promise<void> {
    try {
      await addDoc(collection(db, 'land_records'), {
        ...record,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'land_records');
    }
  },

  subscribeToLandRecords(uid: string, callback: (records: LandRecord[]) => void) {
    const q = query(collection(db, 'land_records'), where('farmerUid', '==', uid));
    return onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LandRecord));
      callback(records);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'land_records'));
  },

  // Market Prices
  subscribeToMarketPrices(callback: (prices: MarketPrice[]) => void) {
    const q = query(collection(db, 'market_prices'), orderBy('updatedAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const prices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MarketPrice));
      callback(prices);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'market_prices'));
  },

  // Services
  async getServices(): Promise<JamoService[]> {
    try {
      const snapshot = await getDocs(collection(db, 'services'));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JamoService));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, 'services');
      return [];
    }
  },

  // Applications
  async applyForService(app: ServiceApplication): Promise<void> {
    try {
      await addDoc(collection(db, 'applications'), {
        ...app,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'applications');
    }
  },

  subscribeToApplications(uid: string, callback: (apps: ServiceApplication[]) => void) {
    const q = query(collection(db, 'applications'), where('farmerUid', '==', uid));
    return onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ServiceApplication));
      callback(apps);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'applications'));
  },

  // Payments
  async recordPayment(payment: Payment): Promise<void> {
    try {
      await addDoc(collection(db, 'payments'), {
        ...payment,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'payments');
    }
  },

  // Admin Functions
  subscribeToAllFarmers(callback: (farmers: UserProfile[]) => void) {
    const q = query(collection(db, 'users'), where('role', '==', 'farmer'));
    return onSnapshot(q, (snapshot) => {
      const farmers = snapshot.docs.map(doc => doc.data() as UserProfile);
      callback(farmers);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'users'));
  },

  async updateApplicationStatus(id: string, status: 'approved' | 'rejected'): Promise<void> {
    try {
      await updateDoc(doc(db, 'applications', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `applications/${id}`);
    }
  }
};
