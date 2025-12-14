// Initial Setup Script for Attachment Store
// Run this once to initialize default attachment types and a main stock location

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { attachmentDb } from '../services/attachmentFirebase';

export const initializeAttachmentStore = async () => {
  if (!attachmentDb) {
    console.error('Attachment Firebase is not configured!');
    return false;
  }

  try {
    // Default Attachment Types
    const defaultTypes = [
      { code: 'WA001', name: 'Walking Foot Attachment', description: 'For heavy fabrics' },
      { code: 'WA006', name: 'Zipper Foot', description: 'For installing zippers' },
      { code: 'WA011', name: 'Button Hole Attachment', description: 'For creating buttonholes' },
      { code: 'WA022', name: 'Hemming Foot', description: 'For precise hems' },
      { code: 'WA033', name: 'Overlock Attachment', description: 'For edge finishing' },
    ];

    // Default Locations
    const defaultLocations = [
      { name: 'Main Stock', description: 'Central inventory storage' },
      { name: 'Line 1', description: 'Production Line 1' },
      { name: 'Line 2', description: 'Production Line 2' },
    ];

    console.log('Initializing Attachment Store...');

    // Add attachment types
    for (const type of defaultTypes) {
      await addDoc(collection(attachmentDb, 'attachmentTypes'), {
        ...type,
        createdAt: Timestamp.now(),
      });
      console.log(`Added attachment type: ${type.code}`);
    }

    // Add locations
    for (const location of defaultLocations) {
      await addDoc(collection(attachmentDb, 'locations'), {
        ...location,
        createdAt: Timestamp.now(),
      });
      console.log(`Added location: ${location.name}`);
    }

    console.log('✅ Attachment Store initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing Attachment Store:', error);
    return false;
  }
};

// To run this, temporarily call it from a component or create a setup page
// Example: Add a "Initialize" button in Settings tab that calls this function
