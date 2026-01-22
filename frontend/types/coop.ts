export interface Community {
  id: number;
  name: string;
  admin: string;
  createdAt: number;
  status: number;
  totalDonations: number;
  totalSpending: number;
  memberCount: number;
}

export interface Member {
  communityId: number;
  address: string;
  role: 'admin' | 'contributor' | 'viewer';
  joinedAt: number;
  active: boolean;
}

export interface Record {
  id: number;
  communityId: number;
  recordType: 'donation' | 'spending' | 'project' | 'grant';
  amount: number;
  description: string;
  submitter: string;
  timestamp: number;
  status: number; // 0: Pending, 1: Verified, 2: Rejected
  verifiedBy?: string;
  projectId?: number;
}
