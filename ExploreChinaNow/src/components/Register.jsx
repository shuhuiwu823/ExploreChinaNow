import { useContext, useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import uploadFile from "../dbOperation";
import { Button } from "react-bootstrap";
import { AppContext } from "../Context";
import "./Register.css";
import { useNavigate } from "react-router-dom";


/**
 * Register Component
 * 
 * A React functional component for user registration. 
 * It allows users to sign up by providing username, email, password, name, and optionally uploading an avatar image.
 * User data is stored in Firebase Authentication and Firestore, while avatar images can be uploaded to a storage service.
 * 
 * @component
 * 
 * @example
 * import Register from './Register';
 * <Register/>
 * 
 * @returns {JSX.Element} A registration form with fields for user data and avatar upload.
 * 
 * @description
 * - This component integrates Firebase Authentication for user registration.
 * - User information is stored in Firestore under the "users" collection.
 * - A default avatar is used if no image is uploaded.
 * - Uses `AppContext` for managing global state (user data and loading state).
 * - Redirects users to the homepage (`/`) after successful registration.
 * - Includes server connectivity check before registration.
 * 
 * @requires React
 * @requires react-router-dom
 * @requires react-bootstrap
 * @requires firebase/auth
 * @requires firebase/firestore
 * @requires AppContext
 * 
 * @param {Object} props - The component does not accept any external props.
 * 
 * @state {Object} avatar - State for managing the uploaded avatar file and its preview URL.
 * @state {File|null} avatar.file - The uploaded avatar file.
 * @state {string} avatar.url - The preview URL of the uploaded avatar. Defaults to "/avatar.png".
 * @state {string} errorMsg - Error message to display when registration fails.
 * 
 * @context {Object} AppContext - Global context for managing user data and loading state.
 * @context {Object} userData - Current user data stored in the context.
 * @context {function} setUserData - Function to update user data in the global context.
 * @context {boolean} loading - Indicates whether a registration request is in progress.
 * @context {function} setLoading - Function to toggle the loading state.
 * 
 * @async
 * @throws Will set an error message if registration fails due to network issues, Firebase errors, or missing required fields.
 * 
 * @dependencies
 * - **Firebase Authentication**: To create a new user account.
 * - **Firestore**: To store user profile data in the "users" collection.
 * - **uploadFile**: A custom function for uploading avatar images to a storage service.
 * - **Context API**: To share user data and loading states globally.
 * - **React Router**: For navigation after registration.
 * 
 * @CSS
 * - Uses `Register.css` for custom styling.
 * - Includes styles for the registration form, avatar preview, and error messages.
 */
function Register() {
    /**
     * Avatar state storing user's avatar info. If user doesn't upload, there is a default avatar.
     * @type {Object}
     */
    const [avatar, setAvatar] = useState({
        file: "",
        url:"/avatar.png"
    });

    /**
     * Global app context, including:
     * @property {Object} userData - The current user data.
     * @property {Function} setUserData - Function to update user data.
     * @property {boolean} loading - Indicates if a request is being processed.
     * @property {Function} setLoading - Function to update the loading state.
     */
    const {userData, setUserData, loading, setLoading} = useContext(AppContext);

    /**
     * Error message state for displaying issues during Register.
     * @type {string}
     */
    const [errorMsg, setErrorMsg] = useState("");

    /**
     * React Router's `useNavigate` hook for navigation.
     * @see {@link https://reactrouter.com/en/main/hooks/use-navigate}
     */
    const navigate = useNavigate();

    /**
     * Handles avatar image changes.
     * 
     * This function updates the `avatar` state when the user uploads a new avatar image.
     * It generates a local preview URL for the image using `URL.createObjectURL()`.
     * 
     * @function handleAvatar
     * @param {Event} e - The event object from the file input change.
     * @returns {void}
     */
    // When user change the avatar image, change the avatar state
    const handleAvatar = (e) => {
        if(e.target.files[0]){
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    }

    /**
     * Handles the registration process.
     * 
     * This function:
     * 1. Checks the server status.
     * 2. Retrieves user input from the form.
     * 3. Creates a new user account in Firebase Authentication.
     * 4. Uploads the avatar image to a storage service (if provided).
     * 5. Stores the user profile in Firestore.
     * 6. Updates the global user data context.
     * 7. Redirects the user to the homepage.
     * 
     * @async
     * @function handleRegister
     * @param {Event} e - The form submission event.
     * @returns {Promise<void>} Resolves after the registration process completes.
     * @throws Will set an error message if any step fails (e.g., server unavailability, invalid inputs, Firebase errors).
     */
    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            // Check the status of the server
            const response = await fetch(`${https://explorechinanow-backend.onrender.com}/auth/check-connect`);
            if (!response.ok) {
                throw new Error("Service is not available now. Please try again later.");
            }
        
            const formData = new FormData(e.target);

            const {username, email, password, name} = Object.fromEntries(formData);
    
            const imgURL = avatar.file ? await uploadFile(avatar.file) : avatar.url;
            const res = await createUserWithEmailAndPassword(auth, email, password);
            
            console.log(imgURL);

            const userInfo = {
                id: res.user.uid,
                username: username,
                email: email,
                avatar: imgURL,
                name: name,
            }
            await setDoc(doc(db, "users", res.user.uid), userInfo);

            await setDoc(doc(db, "blogs", res.user.uid), {
                blogs: []
            });

            setUserData(userInfo);
            navigate("/");
        }catch(err){
            console.log(err);
            setErrorMsg(err.message);
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="register-container">
            <div className="register-img">
                <img src="/4.Shanghai/dongfangmingzhu.jpeg" alt="login" />
            </div>
            <div className="register-dialog">
                <h2>Sign Up</h2>
                <form className="register-form" onSubmit={handleRegister}>
                    <label className="register-username">
                        <span>Username</span>
                        <input type="text" className="enter-username" name="username"></input>
                    </label>
                    <label className="register-email">
                        <span>E-mail</span>
                        <input type="text" className="enter-email" name="email"></input>
                    </label>
                    <label className="register-password">
                        <span>Password</span>
                        <input type="password" className="enter-password" name="password"></input>
                    </label>
                    <label className="register-name">
                        <span>Name</span>
                        <input type="text" className="enter-name" name="name"></input>
                    </label>
                    <label className="register-avatar">
                        <img src={avatar.url || "/avatar.png"} alt=""/>
                        <span>Upload an Image</span>
                        <input type="file" className="upload-file" style={{display: "none"}} onChange={handleAvatar}></input>
                    </label>
                    <div className="error-message">{errorMsg}</div>
                    <button className="submit-register" disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
