const express = require("express");
const axios = require("axios");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 4000;

const dotenv = require('dotenv');
dotenv.config();

// Firebase Web API Key from your Firebase project
const FIREBASE_WEB_API_KEY = process.env.VITE_FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;
app.use(cookieParser());
app.use(express.static("./dist"));
app.use(express.json());

app.get("/auth/check-connect", (req, res) => {
  res.status(200).send("Database Server is running")
});

/**
 * Get user data by UID using Firestore REST API
 */
app.get("/auth/getUserData/:uid", (req, res) => {
  const { uid } = req.params;

  // Firestore REST API URL
  const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${uid}`;

  axios
    .get(firestoreUrl, {
        params: { key: FIREBASE_WEB_API_KEY },
    })
    .then((response) => {
      const data = response.data.fields;

      // Transform Firestore data format to a simpler format
      const userData = Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          value.stringValue || value.integerValue || value.mapValue,
        ])
      );

      res.status(200).json(userData);
    })
    .catch((error) => {
      console.error("Error fetching user data:", error.response?.data || error.message);
      res.status(500).json({ message: "Failed to fetch user data" });
    });
});

/**
 * User login service using Firebase Authentication REST API
 */
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  axios
    .post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_WEB_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    )
    .then((response) => {
      const { idToken, localId } = response.data;

      // Store the ID token in a secure HTTP-only cookie
      res.cookie("token", idToken, { httpOnly: true });
      res.status(200).json({ uid: localId, message: "Login successful" });
    })
    .catch((error) => {
      console.error("Login error:", error.response?.data || error.message);
      res.status(401).json({ message: "Invalid email or password" });
    });
});

/**
 * User logout service
 */
app.post("/auth/logout", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "User is not logged in." });
  }

  // Clear the cookie to log the user out
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

/**
 * Global error handling middleware
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server." });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
