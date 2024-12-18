import { FirebaseError } from 'firebase/app';

export function isFirebaseIndexError(error: unknown): boolean {
  return error instanceof FirebaseError && 
         error.code === 'failed-precondition' && 
         error.message.includes('requires an index');
}

export function handleFirebaseError(context: string, error: unknown): never {
  if (error instanceof FirebaseError) {
    console.error(`${context}:`, {
      code: error.code,
      message: error.message,
      details: error.customData
    });
    
    switch (error.code) {
      case 'failed-precondition':
        if (error.message.includes('requires an index')) {
          throw new Error('Database configuration issue. Please try again later.');
        }
        throw new Error('Database access denied. Please try again later.');
      case 'permission-denied':
        throw new Error('You do not have permission to perform this action.');
      case 'not-found':
        throw new Error('The requested resource was not found.');
      case 'already-exists':
        throw new Error('This record already exists.');
      default:
        throw new Error(`${context}: ${error.message}`);
    }
  }
  
  // Handle non-Firebase errors
  console.error(`${context}:`, error);
  throw new Error('An unexpected error occurred. Please try again.');
}