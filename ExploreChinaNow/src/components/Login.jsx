import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useContext } from "react";
import { Button } from "react-bootstrap";
import { AppContext } from "../context";
import { getUserData } from "../dbOperation";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {

    const {userData, setUserData, loading, setLoading, errorMsg, setErrorMsg} = useContext(AppContext);
    const navigate = useNavigate();
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);
    
        const formData = new FormData(e.target);
    
        const {email, password} = Object.fromEntries(formData);
    
        try {
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                setUserData(getUserData(user.uid));
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setErrorMsg(errorMessage);
              });
        } catch (error) {
            console.log(error);
            setErrorMsg(error);
        }finally{
            setLoading(false);
            navigate("/profile")
        }
    }
    
    return(
        <dialog className="login-dialog" open>
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
        </dialog>
    );
}

export default Login;