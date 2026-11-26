const DEFAULT_API_BASE_URL = 'http://localhost:3010/v1';
const MOCK_FLAG = 'true';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;

/** `npm run dev:mock` 時為 true：以 MSW 模擬 API，並以假的簡訊驗證取代 Firebase。 */
export const IS_API_MOCK = import.meta.env.VITE_API_MOCK === MOCK_FLAG;

export const IS_PRODUCTION = import.meta.env.PROD;

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
} as const;
