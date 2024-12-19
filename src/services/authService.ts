import { 
  getAuth, 
  updateProfile,
  sendEmailVerification as firebaseSendEmailVerification,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { app } from './firebase';

const auth = getAuth(app);

export interface SignUpData {
  email: string;
  password: string;
  name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export async function signUp({ email, password, name }: SignUpData) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  return userCredential.user;
}

export async function signIn({ email, password }: SignInData) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function signInAnon() {
  const userCredential = await signInAnonymously(auth);
  return userCredential.user;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export async function sendEmailVerification() {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user is currently signed in');
  }

  try {
    await firebaseSendEmailVerification(user);
  } catch (error) {
    handleFirebaseError('Failed to send verification email', error);
  }
}

interface ProfileUpdateData {
  displayName?: string;
  photoURL?: string;
}

export async function updateUserProfile(data: ProfileUpdateData) {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user is currently signed in');
  }

  try {
    await updateProfile(user, data);
  } catch (error) {
    handleFirebaseError('Failed to update profile', error);
  }
}

export async function updateUserPassword(currentPassword: string, newPassword: string) {
  const user = getCurrentUser();
  if (!user?.email) {
    throw new Error('No user is currently signed in or user has no email');
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (error) {
    handleFirebaseError('Failed to update password', error);
  }
}