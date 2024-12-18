interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface Environment {
  firebase: FirebaseConfig;
  socket: {
    url: string;
  };
}

const env: Environment = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  },
  socket: {
    url: import.meta.env.PROD ? 'https://finditfirst.xyz' : 'http://localhost:3000',
  },
};

const validateEnv = () => {
  const missingVars = Object.entries(env.firebase)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.error('Firebase configuration error:', env.firebase);
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};

validateEnv();

export default env;