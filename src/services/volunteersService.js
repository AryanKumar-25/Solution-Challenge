import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "volunteers";

/**
 * Create or set a volunteer profile in Firestore.
 */
export async function createVolunteerProfile(uid, volunteerData) {
  await setDoc(doc(db, COLLECTION, uid), {
    uid,
    ...volunteerData,
    isAvailable: true,
    tasksCompleted: 0,
    tasksAccepted: 0,
  });
}

/**
 * Get a volunteer profile by UID.
 */
export async function getVolunteerProfile(uid) {
  const volunteerDoc = await getDoc(doc(db, COLLECTION, uid));
  if (volunteerDoc.exists()) {
    return { id: volunteerDoc.id, ...volunteerDoc.data() };
  }
  return null;
}

/**
 * Update a volunteer profile.
 */
export async function updateVolunteerProfile(uid, updates) {
  const volunteerRef = doc(db, COLLECTION, uid);
  await updateDoc(volunteerRef, updates);
}

/**
 * Toggle volunteer availability.
 */
export async function toggleAvailability(uid, isAvailable) {
  await updateDoc(doc(db, COLLECTION, uid), { isAvailable });
}

/**
 * Increment the volunteer's completed tasks count.
 */
export async function incrementTasksCompleted(uid) {
  await updateDoc(doc(db, COLLECTION, uid), {
    tasksCompleted: increment(1),
  });
}

/**
 * Increment the volunteer's accepted tasks count.
 */
export async function incrementTasksAccepted(uid) {
  await updateDoc(doc(db, COLLECTION, uid), {
    tasksAccepted: increment(1),
  });
}

/**
 * Get all available volunteers (for matching).
 */
export async function getAvailableVolunteers() {
  const q = query(
    collection(db, COLLECTION),
    where("isAvailable", "==", true)
  );
  const snapshot = await getDocs(q);
  const volunteers = [];
  snapshot.forEach((doc) => {
    volunteers.push({ id: doc.id, ...doc.data() });
  });
  return volunteers;
}

/**
 * Subscribe to a volunteer profile in real-time.
 */
export function subscribeToVolunteerProfile(uid, callback) {
  return onSnapshot(doc(db, COLLECTION, uid), (snapshot) => {
    if (snapshot.exists()) {
      callback({ id: snapshot.id, ...snapshot.data() });
    }
  });
}
