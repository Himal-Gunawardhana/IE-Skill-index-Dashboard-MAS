export interface AttachmentType {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface AttachmentInventory {
  id: string;
  attachmentTypeId: string;
  attachmentTypeCode: string;
  locationId: string;
  locationName: string;
  quantity: number;
  lastUpdated: Date;
}

export interface AttachmentTransaction {
  id: string;
  transactionType: 'issue' | 'return' | 'move' | 'add';
  attachmentTypeId: string;
  attachmentTypeCode: string;
  quantity: number;
  fromLocationId?: string;
  fromLocationName?: string;
  toLocationId: string;
  toLocationName: string;
  requestedBy: string;
  comment: string;
  createdBy: string;
  createdAt: Date;
}
