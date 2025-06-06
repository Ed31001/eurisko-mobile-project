import { Platform } from 'react-native';
import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

const firebaseConfig = {
  apiKey: "your apiKey",
  authDomain: "your authDomain",
  databaseURL: "your databaseURL",
  projectId: "your projectId",
  storageBucket: "your storage bucket",
  messagingSenderId: "your messaginId",
  appId: Platform.OS === 'ios'
    ? "your ios appid"
    : "your_android_app_id",
  measurementId: "G-measurement-id",
};

console.log('Initializing Firebase...');

// Initialize Firebase Analytics and Crashlytics
analytics().logAppOpen();
crashlytics().log('App started.');

// Screen View Tracking
export const logScreenView = (screenName: string, screenClass: string) => {
  analytics().logScreenView({
    screen_name: screenName,
    screen_class: screenClass,
  });
};

// Custom Event Logging
export const logEvent = (eventName: string, params: Record<string, any> = {}) => {
  analytics().logEvent(eventName, params);
};

// Error Logging with Crashlytics
export const logError = (error: Error, context: string = '') => {
  if (context) {
    crashlytics().log(context);
  }
  crashlytics().recordError(error);
};

// Setting Custom Keys for Crashlytics
export const setCustomKey = (key: string, value: string) => {
  crashlytics().setAttribute(key, value);
};

// Force a Crash (Useful for testing)
export const triggerCrash = () => {
  crashlytics().crash();
};

export default firebase;
