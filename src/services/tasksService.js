import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "tasks";

/**
 * Create a new task (assign a volunteer to a need).
 */
export async function createTask(taskData) {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...taskData,
    status: "pending",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update a task's status.
 */
export async function updateTaskStatus(taskId, status) {
  const taskRef = doc(db, COLLECTION, taskId);
  await updateDoc(taskRef, { status });
}

/**
 * Get a single task by ID.
 */
export async function getTaskById(taskId) {
  const taskRef = doc(db, COLLECTION, taskId);
  const snapshot = await getDoc(taskRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
}

/**
 * Subscribe to tasks assigned to a specific volunteer.
 */
export function subscribeToVolunteerTasks(volunteerId, callback) {
  if (!db) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTION),
    where("assignedVolunteerId", "==", volunteerId)
  );

  return onSnapshot(q, (snapshot) => {
    const tasks = [];
    snapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
    callback(tasks);
  }, (error) => {
    console.error("Tasks subscription error:", error);
    callback([]);
  });
}

/**
 * Get tasks for a specific need.
 */
export async function getTasksForNeed(needId) {
  const q = query(
    collection(db, COLLECTION),
    where("needId", "==", needId)
  );
  const snapshot = await getDocs(q);
  const tasks = [];
  snapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() });
  });
  return tasks;
}

/**
 * Accept a task.
 */
export async function acceptTask(taskId) {
  await updateTaskStatus(taskId, "accepted");
}

/**
 * Complete a task.
 */
export async function completeTask(taskId) {
  await updateTaskStatus(taskId, "done");
}

/**
 * Decline/remove a task.
 */
export async function declineTask(taskId) {
  await updateTaskStatus(taskId, "declined");
}
