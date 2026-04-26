import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, firebaseConfigured } from "./firebase";

/**
 * Sign up a new user with email/password and store their role in Firestore.
 */
export async function signUpUser(email, password, role, displayName = "") {
  if (!firebaseConfigured) {
    throw new Error("Firebase is not configured. Please add your Firebase config to .env file.");
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Store user role in Firestore
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    displayName: displayName || email.split("@")[0],
    role, // "ngo" or "volunteer"
    createdAt: serverTimestamp(),
  });

  return user;
}

/**
 * Sign in existing user with email/password.
 */
export async function signInUser(email, password) {
  if (!firebaseConfigured) {
    throw new Error("Firebase is not configured. Please add your Firebase config to .env file.");
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

/**
 * Sign out the current user.
 */
export async function logoutUser() {
  if (!auth) return;
  await signOut(auth);
}

/**
 * Get user role from Firestore.
 */
export async function getUserRole(uid) {
  if (!db) return null;
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data().role;
  }
  return null;
}

/**
 * Subscribe to auth state changes.
 */
export function onAuthChange(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
