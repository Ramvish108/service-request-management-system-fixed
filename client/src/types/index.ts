export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface StatusHistory {
  status: 'OPEN' | 'IN_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';
  changedAt: string;
  changedBy: {
    _id: string;
    name: string;
    email: string;
  } | string;
  note?: string;
}

export interface ServiceRequest {
  _id: string;
  requestNumber: string;
  title: string;
  description: string;
  aiSummary?: string;
  category: 'SOFTWARE' | 'HARDWARE' | 'NETWORK' | 'ACCESS' | 'OTHER';
  aiSuggestedCategory?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  aiSuggestedPriority?: string;
  status: 'OPEN' | 'IN_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CANCELLED';
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  } | null;
  statusHistory: StatusHistory[];
  createdAt: string;
  updatedAt: string;
}
