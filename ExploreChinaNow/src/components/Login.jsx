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

function Login() {

    const {userData, setUserData, loading, setLoading} = useContext(AppContext);
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    
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
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            try {
                const userData = await getUserData(user.uid);
                if(userData) {
                    setUserData(userData);
                    navigate("/");
                    return;
                }

                const userInfo = {
                    id: user.uid,
                    username: user.displayName,
                    email: user.email,
                    avatar: user.photoURL,
                    name: user.displayName,
                }
                await setDoc(doc(db, "users", user.uid), userInfo);
    
                await setDoc(doc(db, "blogs", user.uid), {
                    blogs: []
                });
    
                setUserData(userInfo);
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
            setLoading(false);
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