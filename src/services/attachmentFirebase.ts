import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { db, auth } from './firebase';

// For now, use the same database instance
// When you create a separate Firebase project, this file will initialize a separate app instance
const attachmentDb: Firestore = db;
const attachmentAuth: Auth = auth;
const isAttachmentFirebaseConfigured = true;

export { attachmentDb, attachmentAuth, isAttachmentFirebaseConfigured };
export type { Firestore };
