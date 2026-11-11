// STEP 1: paste your Firebase web app settings here (Firebase console → Project settings → Your apps → Config).
// Until you do, the games still work but the leaderboard and tracker stay switched off.
export const firebaseConfig = {
  apiKey: "AIzaSyC7dv76nU4PDCAGZIuzOw77-ubX18934do",
  authDomain: "maths-arcade-7f692.firebaseapp.com",
  projectId: "maths-arcade-7f692",
  storageBucket: "maths-arcade-7f692.firebasestorage.app",
  messagingSenderId: "5131058276",
  appId: "1:5131058276:web:679083e41093bb1c837371"
};

// STEP 2: the Google account(s) allowed to open dashboard.html (the usage tracker).
// Put the same email(s) in firestore.rules.
export const teacherEmails = ["xxyanzhangxx@gmail.com"];
