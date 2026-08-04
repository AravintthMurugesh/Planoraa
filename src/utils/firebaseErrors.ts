/**
 * Firebase Auth Error Helper
 * Maps Firebase Auth error codes to user-friendly human readable error messages.
 */
export function getFirebaseErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  
  const code = error.code || '';
  const message = error.message || '';

  if (code.includes('api-key') || message.toLowerCase().includes('api key') || message.toLowerCase().includes('api-key')) {
    return 'Invalid or unconfigured Firebase API key. Please add your actual Firebase Web App credentials to .env (VITE_FIREBASE_API_KEY) or src/firebase.ts.';
  }

  switch (code) {
    case 'auth/invalid-email':
      return 'Invalid email address format. Please check your email and try again.';
    case 'auth/user-not-found':
      return 'No account found with this email address. Please check your email or sign up.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'The password is too weak. Please use at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Access is temporarily disabled. Reset your password or try again later.';
    case 'auth/user-disabled':
      return 'This user account has been disabled. Please contact support.';
    case 'auth/requires-recent-login':
      return 'Please sign in again to perform this sensitive action.';
    case 'auth/operation-not-allowed':
      return 'Email/Password authentication is not enabled in your Firebase Console.';
    case 'auth/popup-closed-by-user':
      return 'Authentication popup was closed before completing.';
    default:
      return error.message || 'An unexpected authentication error occurred. Please try again.';
  }
}
