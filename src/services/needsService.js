import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  where,
  onSnapshot,
  serverTimestamp,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db, firebaseConfigured } from "./firebase";

const COLLECTION = "needs";

/**
 * Add a new community need to Firestore.
 */
export async function addNeed(needData) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...needData,
    status: "open",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update a need document.
 */
export async function updateNeed(needId, updates) {
  const needRef = doc(db, COLLECTION, needId);
  await updateDoc(needRef, updates);
}

/**
 * Get a single need by ID.
 */
export async function getNeedById(needId) {
  const needRef = doc(db, COLLECTION, needId);
  const snapshot = await getDoc(needRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
}

/**
 * Subscribe to real-time needs updates.
 * Sorting and multi-field filtering done client-side to avoid requiring composite indexes.
 */
export function subscribeToNeeds(filters = {}, callback) {
  if (!firebaseConfigured || !db) {
    callback([]);
    return () => {};
  }

  // Use a simple query — filter/sort client-side to avoid composite index requirement
  const q = query(collection(db, COLLECTION));

  return onSnapshot(q, (snapshot) => {
    let needs = [];
    snapshot.forEach((doc) => {
      needs.push({ id: doc.id, ...doc.data() });
    });

    // Client-side filtering
    if (filters.category) {
      needs = needs.filter((n) => n.category === filters.category);
    }
    if (filters.status) {
      needs = needs.filter((n) => n.status === filters.status);
    }

    // Sort by urgency score descending
    needs.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));

    callback(needs);
  }, (error) => {
    console.error("Firestore subscription error:", error);
    callback([]);
  });
}

/**
 * Subscribe to all open needs (for map view and matching).
 */
export function subscribeToOpenNeeds(callback) {
  if (!firebaseConfigured || !db) {
    callback([]);
    return () => {};
  }

  // Simple query — filter client-side
  const q = query(collection(db, COLLECTION));

  return onSnapshot(q, (snapshot) => {
    let needs = [];
    snapshot.forEach((doc) => {
      needs.push({ id: doc.id, ...doc.data() });
    });

    // Filter open only, sort by urgency
    needs = needs.filter((n) => n.status === "open");
    needs.sort((a, b) => (b.urgencyScore || 0) - (a.urgencyScore || 0));

    callback(needs);
  }, (error) => {
    console.error("Firestore subscription error:", error);
    callback([]);
  });
}
