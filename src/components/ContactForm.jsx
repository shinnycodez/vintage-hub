import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// Ensure these global variables are defined in the Canvas environment
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

function ContactForm() { // Renamed from App to ContactForm
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Initialize Firebase and handle authentication
  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestore);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          // If no user is signed in, try to sign in with custom token or anonymously
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(firebaseAuth, initialAuthToken);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          } catch (error) {
            console.error("Firebase authentication error:", error);
            setMessage(`Authentication failed: ${error.message}`);
          }
        }
        setIsAuthReady(true); // Mark authentication as ready after initial check
      });

      return () => unsubscribe(); // Cleanup auth listener
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      setMessage(`Firebase initialization failed: ${error.message}`);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (!name || !email || !comment) {
      setMessage('Please fill in all required fields (Name, Email, Comment).');
      return;
    }

    if (!db || !userId) {
      setMessage('Firebase is not initialized or user is not authenticated. Please try again.');
      console.error('Firebase DB or userId is not available.');
      return;
    }

    try {
      // Store data in the user's private collection
      const contactsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/contacts`);
      await addDoc(contactsCollectionRef, {
        name,
        email,
        phone,
        comment,
        timestamp: new Date(),
      });
      setMessage('Message sent successfully!');
      setName('');
      setEmail('');
      setPhone('');
      setComment('');
    } catch (error) {
      console.error('Error adding document: ', error);
      setMessage(`Failed to send message: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-inter">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-xl">
        <h2 className="text-3xl font-light text-center mb-6 flex items-center justify-center">
          leave me a message
          <span className="ml-2 text-2xl" role="img" aria-label="bow tie">
            &#x1F380; {/* Unicode for a bow tie or ribbon */}
          </span>
        </h2>

        {/* Display User ID for multi-user apps */}
        {userId && (
          <p className="text-sm text-gray-600 text-center mb-4">
            Your User ID: <span className="font-mono break-all">{userId}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                id="name"
                placeholder="Name"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-200 text-gray-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="email"
                id="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-200 text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <input
              type="tel"
              id="phone"
              placeholder="Phone"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-200 text-gray-800"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <textarea
              id="comment"
              placeholder="Comment"
              rows="6"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 bg-gray-200 text-gray-800 resize-y"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-auto px-6 py-3 bg-black text-white font-semibold rounded-md shadow-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-700 transition duration-300 ease-in-out"
            disabled={!isAuthReady} // Disable button until Firebase auth is ready
          >
            Submit
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-md text-center ${message.includes('successfully') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactForm; // Exporting ContactForm as default
