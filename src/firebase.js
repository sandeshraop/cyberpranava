import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserLocalPersistence, 
  setPersistence,
  updateProfile
} from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, doc, setDoc, getDoc, getCountFromServer } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDEKYJfpU5tlLCuWTpxXQg9Sesulfb2xMg",
  authDomain: "cyberpranava-cb7ad.firebaseapp.com",
  projectId: "cyberpranava-cb7ad",
  storageBucket: "cyberpranava-cb7ad.firebasestorage.app",
  messagingSenderId: "775388733940",
  appId: "1:775388733940:web:152e1a872b1b5bb0c419a1",
  measurementId: "G-3Z7MGX633G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Enable persistence for better development experience
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistence enabled');
  })
  .catch((error) => {
    console.error('Error enabling persistence:', error);
  });

// Add any additional scopes you need
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Function to sign in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info
    const user = result.user;
    return { user, token };
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Function to create a new user with email/password and store additional data in Firestore
const signUpWithEmailPassword = async (email, password, name) => {
  try {
    console.log('Starting sign up process for:', email);
    
    // First, get the current count of users to generate the next sequential ID
    const usersRef = collection(db, 'users');
    const snapshot = await getCountFromServer(usersRef);
    const nextId = (snapshot.data().count || 0) + 1; // Start from 1 if no users exist
    
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('User created in Auth:', user.uid);

    // Update user profile with display name
    await updateProfile(user, { displayName: name });
    console.log('User profile updated with display name');

    // Create a user document in Firestore with sequential ID
    const userRef = doc(db, 'users', nextId.toString());
    const userData = {
      id: nextId, // Sequential ID
      uid: user.uid, // Keep Firebase UID for reference
      name: name,
      email: email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Attempting to write to Firestore:', userData);
    await setDoc(userRef, userData);
    console.log('Successfully wrote to Firestore with ID:', nextId);

    return { ...user, customId: nextId }; // Return the user with the custom ID
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Function to get user data from Firestore
const getUserData = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log('No such user!');
      return null;
    }
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

export { 
  auth, 
  db, 
  googleProvider, 
  analytics, 
  signInWithEmailAndPassword,
  signUpWithEmailPassword,
  getUserData,
  signInWithGoogle
};
