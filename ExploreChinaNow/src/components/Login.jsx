import { signInWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { useContext, useState } from "react";
import { setDoc, doc } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { AppContext } from "../Context";
import { getUserData } from "../dbOperation";
import { Link, useNavigate } from "react-router-dom";
import { loginService } from "../dbOperation";
import "./Login.css";

/**
 * The Login component handles user authentication through email/password or Google Account sign-in.
 * 
 * @component
 * @example
 * import Login from './Login'
 * <Login />
 * 
 * @returns {JSX.Element} A login form with fields for e-mail and password input, as well as Google login button.
 * 
 * @description
 * - Users can log in with their email and password or use Google OAuth.
 * - If the server is unavailable, an error message is displayed and user cannot login.
 * - Successful login redirects users to homepage (`/`) route.
 * - Displays error messages for invalid credentials or service issues.
 * 
 * @requires firebase/auth
 * @requires firebase/firestore
 * @requires react
 * @requires react-router-dom
 * @requires react-bootstrap
 * @requires ./Context
 * @requires ./dbOperation
 * @requires ./Login.css
 * 
 * @param {Object} props - The component does not accept any external props.
 * 
 * @state {string} errorMsg - Error message to display when registration fails.
 * 
 * @context {Object} AppContext - Global context for managing user data and loading state.
 * @context {Object} userData - Current user data stored in the context.
 * @context {function} setUserData - Function to update user data in the global context.
 * @context {boolean} loading - Indicates whether a login request is in progress.
 * @context {function} setLoading - Function to toggle the loading state.
 * 
 * @async
 * @throws Will set an error message if login fails due to network issues, Firebase errors, or missing required fields.
 * 
 * @dependencies
 * - **Firebase Authentication**: To authenticate an user account login.
 * - **Firestore**: To extract user profile data from the "users" collection.
 * - **uploadFile**: A custom function for uploading avatar images to a storage service.
 * - **Context API**: To share user data and loading states globally.
 * - **React Router**: For navigation after registration.
 * - **getUserData**: A custom function for extracting user data from firestore service.
 * 
 * @CSS
 * - Uses `Login.css` for custom styling.
 * - Includes styles for the Login form, Google login button, and error messages.
 */
function Login() {
     /**
     * Global app context, including:
     * @property {Object} userData - The current user data.
     * @property {Function} setUserData - Function to update user data.
     * @property {boolean} loading - Indicates if a request is being processed.
     * @property {Function} setLoading - Function to update the loading state.
     */
    const {userData, setUserData, loading, setLoading} = useContext(AppContext);

    /**
     * Error message state for displaying issues during login.
     * @type {string}
     */
    const [errorMsg, setErrorMsg] = useState("");

    /**
     * React Router's `useNavigate` hook for navigation.
     * @see {@link https://reactrouter.com/en/main/hooks/use-navigate}
     */
    const navigate = useNavigate();
    
    /**
     * Handles the email&password login process.
     * 
     * @async
     * @function handleLogin
     * @param {Event} e - The form submission event.
     * @returns {void}
     * @description
     * - Checks server status before proceeding with login.
     * - If successful, navigates to `/`.
     * - Displays error messages for invalid credentials or server issues.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);
    
        const formData = new FormData(e.target);
    
        const {email, password} = Object.fromEntries(formData);
        
        // loginService(email, password)
        // .then((userData) => {
        //     setUserData(userData);
        //     navigate("/videos");
        // })
        // .catch((error) => {
        //     console.error("Error logging in:", error);
        //     setErrorMsg(error.message || "An unexpected error occurred.");
        // })
        // .finally(() => {
        //     setLoading(false);
        // });
        
        try {
            // Check the status of the server
            const response = await fetch("/auth/check-connect");
            if (!response.ok) {
                throw new Error("Service is not available now. Please try again later.");
            }

            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setUserData(getUserData(user.uid));
                navigate("/");
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMsg(errorMessage);
              });
        } catch (error) {
            console.log(error);
            setErrorMsg(error.message);
        }finally{
            setLoading(false);
        }
    }

    /**
     * Handles Google OAuth login process.
     * 
     * @async
     * @function handleGoogleLogin
     * @param {Event} e - The button click event.
     * @returns {void}
     * @description
     * - Checks server status before starting Google login.
     * - Saves user data to Firestore if logging in for the first time.
     * - Navigates to `/` after successful login.
     * - Displays error messages for failed Google login and server issues.
     */
    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            // Check the status of the server
            const response = await fetch("/auth/check-connect");
            if (!response.ok) {
                throw new Error("Service is not available now. Please try again later.");
            }
        

        signInWithPopup(auth, googleProvider)
        .then(async (result) => {
            // The signed-in user info.
            const user = result.user;

            const userInfo = {
                id: user.uid,
                username: user.displayName,
                email: user.email,
                avatar: user.photoURL,
                name: user.displayName,
            }

            try {
                let userData = await getUserData(user.uid);
                if(!userData) {
                    await setDoc(doc(db, "users", user.uid), userInfo);
    
                    await setDoc(doc(db, "blogs", user.uid), {
                        blogs: []
                    });
                    userData = userInfo;
                }
    
                setUserData(userData);
                navigate("/");
            }catch(err){
                console.log(err);
                setErrorMsg(err);
            }finally{
                setLoading(false);
            }
            // IdP data available using getAdditionalUserInfo(result)
            // ...
        }).catch((error) => {
            if (error.code === "auth/popup-closed-by-user") {
                console.log("Login popup closed by user.");
            } else {
                console.error("Google login failed:", error);
                setErrorMsg(error.message || "Google login failed");
            }
            setLoading(false);
        })
        } catch (error) {
            console.log(error);
            setErrorMsg(error.message);
        }finally{
            // setLoading(false);
        }
    }
    
    return(
        <div className="login-container">
            <div className="login-image">
                <img src="/4.Shanghai/dongfangmingzhu.jpeg" alt="login" />
            </div>
            <div className="login-dialog">
                <h2>Sign In</h2>
                <form className="login-form" onSubmit={handleLogin}>
                    <label className="login-email">
                        <span>Email</span>
                        <input type="text" className="enter-email" name="email"></input>
                    </label>
                    <label className="login-password">
                        <span>Password</span>
                        <input type="password" className="enter-password" name="password"></input>
                    </label>
                    <div className="error-message">{errorMsg}</div>
                    <button className="submit-login" disabled={loading}>{loading ? "Loading..." : "Login"}</button>
                </form>
                <div className="prop-and-googlelogin">
                <div className="signup-prompt">Don't have an account? <Link to={"/sign-up"}>Create one</Link></div>
                <button className="google-login-btn" onClick={handleGoogleLogin} disabled={loading}>
                    {loading ? <span>Loading...</span> : <><img className="google-icon" src="/google.png" alt="google icon"/><span>Login with Google</span></>}
                </button>
                </div>
            </div>
        </div>
    );
}

export default Login;