export type UserRole = 'farmer' | 'admin' | 'staff';
export type UserStatus = 'pending' | 'verified' | 'rejected';

export interface UserProfile {
  uid: string;
  fullName: string;
  phoneNumber?: string;
  nationalId?: string;
  gender?: 'Male' | 'Female' | 'Other';
  region?: string;
  role: UserRole;
  status: UserStatus;
  profilePhotoUrl?: string;
  createdAt: string;
}

export interface LandRecord {
  id?: string;
  farmerUid: string;
  size: number;
  location: string;
  farmingType: 'crop' | 'livestock' | 'mixed';
  crops: string[];
  documentUrl?: string;
  status: UserStatus;
  createdAt: string;
}

export interface MarketPrice {
  id?: string;
  crop: string;
  region: string;
  priceLocal: number;
  priceRegional?: number;
  priceInternational?: number;
  updatedAt: string;
}

export interface JamoService {
  id?: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export interface ServiceApplication {
  id?: string;
  farmerUid: string;
  serviceId: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  createdAt: string;
}

export interface Payment {
  id?: string;
  farmerUid: string;
  amount: number;
  currency: string;
  method: 'Mobile Money' | 'Bank';
  transactionId?: string;
  status: 'pending' | 'completed' | 'failed';
  purpose: string;
  createdAt: string;
}

export interface Message {
  id?: string;
  senderUid: string;
  receiverUid: string;
  text: string;
  read: boolean;
  createdAt: string;
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}
