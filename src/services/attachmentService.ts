import { collection, addDoc, getDocs, query, where, updateDoc, doc, increment, Timestamp, orderBy } from 'firebase/firestore';
import { attachmentDb } from './attachmentFirebase';
import { AttachmentType, Location, AttachmentInventory, AttachmentTransaction } from '../types/attachment';

// Attachment Types
export const addAttachmentType = async (data: Omit<AttachmentType, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(attachmentDb, 'attachmentTypes'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getAttachmentTypes = async (): Promise<AttachmentType[]> => {
  const querySnapshot = await getDocs(collection(attachmentDb, 'attachmentTypes'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as AttachmentType));
};

// Locations
export const addLocation = async (data: Omit<Location, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(attachmentDb, 'locations'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getLocations = async (): Promise<Location[]> => {
  const querySnapshot = await getDocs(collection(attachmentDb, 'locations'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as Location));
};

// Inventory
export const getInventory = async (): Promise<AttachmentInventory[]> => {
  const querySnapshot = await getDocs(collection(attachmentDb, 'attachmentInventory'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    lastUpdated: doc.data().lastUpdated?.toDate(),
  } as AttachmentInventory));
};

export const getInventoryByLocation = async (locationId: string): Promise<AttachmentInventory[]> => {
  const q = query(collection(attachmentDb, 'attachmentInventory'), where('locationId', '==', locationId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    lastUpdated: doc.data().lastUpdated?.toDate(),
  } as AttachmentInventory));
};

export const updateInventory = async (
  attachmentTypeId: string,
  attachmentTypeCode: string,
  locationId: string,
  locationName: string,
  quantityChange: number
) => {
  // Check if inventory record exists
  const q = query(
    collection(attachmentDb, 'attachmentInventory'),
    where('attachmentTypeId', '==', attachmentTypeId),
    where('locationId', '==', locationId)
  );
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    // Create new inventory record
    await addDoc(collection(attachmentDb, 'attachmentInventory'), {
      attachmentTypeId,
      attachmentTypeCode,
      locationId,
      locationName,
      quantity: quantityChange,
      lastUpdated: Timestamp.now(),
    });
  } else {
    // Update existing record
    const docRef = doc(attachmentDb, 'attachmentInventory', querySnapshot.docs[0].id);
    await updateDoc(docRef, {
      quantity: increment(quantityChange),
      lastUpdated: Timestamp.now(),
    });
  }
};

// Transactions
export const addTransaction = async (data: Omit<AttachmentTransaction, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(collection(attachmentDb, 'attachmentTransactions'), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
};

export const getTransactions = async (): Promise<AttachmentTransaction[]> => {
  const q = query(collection(attachmentDb, 'attachmentTransactions'), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as AttachmentTransaction));
};

export const getTransactionsByAttachment = async (attachmentTypeId: string): Promise<AttachmentTransaction[]> => {
  const q = query(
    collection(attachmentDb, 'attachmentTransactions'),
    where('attachmentTypeId', '==', attachmentTypeId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as AttachmentTransaction));
};

// Issue Attachment
export const issueAttachment = async (
  attachmentTypeId: string,
  attachmentTypeCode: string,
  locationId: string,
  locationName: string,
  quantity: number,
  requestedBy: string,
  comment: string,
  createdBy: string
) => {
  // Update inventory
  await updateInventory(attachmentTypeId, attachmentTypeCode, locationId, locationName, quantity);

  // Add transaction
  await addTransaction({
    transactionType: 'issue',
    attachmentTypeId,
    attachmentTypeCode,
    quantity,
    toLocationId: locationId,
    toLocationName: locationName,
    requestedBy,
    comment,
    createdBy,
  });
};

// Return Attachment
export const returnAttachment = async (
  attachmentTypeId: string,
  attachmentTypeCode: string,
  fromLocationId: string,
  fromLocationName: string,
  toLocationId: string,
  toLocationName: string,
  quantity: number,
  comment: string,
  createdBy: string
) => {
  // Decrease from source location
  await updateInventory(attachmentTypeId, attachmentTypeCode, fromLocationId, fromLocationName, -quantity);

  // Increase in destination (stock) location
  await updateInventory(attachmentTypeId, attachmentTypeCode, toLocationId, toLocationName, quantity);

  // Add transaction
  await addTransaction({
    transactionType: 'return',
    attachmentTypeId,
    attachmentTypeCode,
    quantity,
    fromLocationId,
    fromLocationName,
    toLocationId,
    toLocationName,
    requestedBy: createdBy,
    comment,
    createdBy,
  });
};

// Move Attachment
export const moveAttachment = async (
  attachmentTypeId: string,
  attachmentTypeCode: string,
  fromLocationId: string,
  fromLocationName: string,
  toLocationId: string,
  toLocationName: string,
  quantity: number,
  comment: string,
  createdBy: string
) => {
  // Decrease from source location
  await updateInventory(attachmentTypeId, attachmentTypeCode, fromLocationId, fromLocationName, -quantity);

  // Increase in destination location
  await updateInventory(attachmentTypeId, attachmentTypeCode, toLocationId, toLocationName, quantity);

  // Add transaction
  await addTransaction({
    transactionType: 'move',
    attachmentTypeId,
    attachmentTypeCode,
    quantity,
    fromLocationId,
    fromLocationName,
    toLocationId,
    toLocationName,
    requestedBy: createdBy,
    comment,
    createdBy,
  });
};

// Add Stock
export const addStock = async (
  attachmentTypeId: string,
  attachmentTypeCode: string,
  locationId: string,
  locationName: string,
  quantity: number,
  comment: string,
  createdBy: string
) => {
  // Update inventory
  await updateInventory(attachmentTypeId, attachmentTypeCode, locationId, locationName, quantity);

  // Add transaction
  await addTransaction({
    transactionType: 'add',
    attachmentTypeId,
    attachmentTypeCode,
    quantity,
    toLocationId: locationId,
    toLocationName: locationName,
    requestedBy: createdBy,
    comment,
    createdBy,
  });
};
