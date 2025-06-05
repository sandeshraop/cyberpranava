import { auth } from '../firebase';

// Function to check if user is logged in
export const checkAuthStatus = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe(); // Unsubscribe immediately after getting the user
      resolve(!!user);
    });
  });
};

// Function to get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};
