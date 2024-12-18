import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { getCurrentUser } from './authService';
import { handleFirebaseError, isFirebaseIndexError } from '../utils/errorHandling';

export interface GameScore {
  score: number;
  timestamp: Date;
  userId: string | null;
  displayName: string;
  isAnonymous: boolean;
  completed: boolean;
}

export async function saveScore(score: number, completed: boolean) {
  try {
    const scoresRef = collection(db, 'scores');
    const timestamp = new Date();
    const user = getCurrentUser();
    if (!user) {
      console.warn('No user found when trying to save score');
      return;
    }
    
    // Ensure completed is explicitly a boolean
    const scoreData = {
      score,
      timestamp,
      userId: user.uid,
      displayName: user.displayName || 'Guest',
      isAnonymous: user.isAnonymous,
      completed: Boolean(completed),
      deviceInfo: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform
      }
    };

    const docRef = await addDoc(scoresRef, scoreData);
    console.log('Score saved with ID:', docRef.id);
  } catch (error) {
    handleFirebaseError('Error saving score', error);
  }
}

export async function getUserScores(): Promise<GameScore[]> {
  const user = getCurrentUser();
  if (!user) return [];

  try {
    const scoresRef = collection(db, 'scores');
    const q = query(
      scoresRef,
      where('userId', '==', user.uid)
    );

    const querySnapshot = await getDocs(q);

    // Sort the results in memory since we can't use orderBy without an index
    const scores = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        timestamp: data.timestamp.toDate(),
        completed: Boolean(data.completed),
      } as GameScore;
    });
    
    return scores.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  } catch (error) {
    if (isFirebaseIndexError(error)) {
      console.error('Missing Firestore index. Please create the required index.');
      // Fall back to unordered query
      return [];
    }
    throw handleFirebaseError('Error fetching user scores', error);
    return [];
  }
}