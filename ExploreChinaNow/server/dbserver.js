const express = require("express");
const axios = require("axios");
const cors = require('cors');
const path = require('path');
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 4000;

const dotenv = require('dotenv');
dotenv.config();

// Allow requests from your Vite static site
const allowedOrigins = ['https://explorechinanow-1de2.onrender.com','http://localhost:5173','http://localhost:3000','http://localhost:4000'];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // if using cookies/authentication
}));

// Firebase Web API Key from your Firebase project
const FIREBASE_WEB_API_KEY = process.env.VITE_FIREBASE_API_KEY;
const FIREBASE_PROJECT_ID = process.env.VITE_FIREBASE_PROJECT_ID;
app.use(cookieParser());
app.use(express.static("./dist"));
app.use(express.json());

// Serve static files from React's build folder
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all route for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

/**
 * @api {get} /auth/check-connect Check server connection
 * @apiName CheckServerConnection
 * @apiGroup Auth
 * @apiSuccess {String} message Success message indicating the server is running.
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     "Database Server is running"
 */
app.get("/auth/check-connect", (req, res) => {
  res.status(200).send("Database Server is running")
});

/**
 * @api {get} /auth/getUserData/:uid Get user data
 * @apiName GetUserData
 * @apiGroup Auth
 * @apiParam {String} uid User's unique identifier.
 * @apiSuccess {Object} userData User data retrieved from Firestore.
 * @apiError (500) {String} message Error message in case of failure.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "message": "Failed to fetch user data"
 *     }
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
 * @api {post} /auth/login User login
 * @apiName UserLogin
 * @apiGroup Auth
 * @apiParam {String} email User's email address.
 * @apiParam {String} password User's password.
 * @apiSuccess {String} uid The unique identifier of the user.
 * @apiSuccess {String} message Success message indicating login success.
 * @apiError (400) {String} message Error message if email or password is missing.
 * @apiError (401) {String} message Error message if email or password is invalid.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "message": "Invalid email or password"
 *     }
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
 * @api {post} /auth/logout User logout
 * @apiName UserLogout
 * @apiGroup Auth
 * @apiSuccess {String} message Success message indicating logout success.
 * @apiError (400) {String} message Error message if user is not logged in.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "message": "User is not logged in."
 *     }
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
 * @param {Error} err The error object.
 * @param {Object} req The HTTP request object.
 * @param {Object} res The HTTP response object.
 * @param {Function} next The next middleware function.
 */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server." });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
