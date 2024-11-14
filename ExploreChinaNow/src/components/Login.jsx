import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { doc, getDoc } from "firebase/firestore";

function Login() {
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);
    
        const formData = new FormData(e.target);
    
        const {email, password} = Object.fromEntries(formData);
    
        try {
            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                getUserData(user.uid);
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
        }
    }

    const handleLogout = () => {
        signOut(auth).then(() => {
            // Sign-out successful.
            setUser({});
          }).catch((error) => {
            console.log(error)
          });
    }

    const getUserData = async (uid) => {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setUser(docSnap.data());
        } else {
        // docSnap.data() will be undefined in this case
            console.log("No such document!");
        }
    }

    return(
        <dialog className="login-dialog" open>
            <h2>Log In</h2>
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
            {user.username ? 
            <div>
                <img src={user.avatar} alt=""/><br/>
                <span>Username: {user.username}</span><br/>
                <span>E-mail: {user.email}</span><br/>
                <span>Name: {user.name}</span><br/>
                <button className="logout-btn" onClick={handleLogout} disabled={loading}>{loading ? "Loading..." : "Logout"}</button>
            </div>: ""}
        </dialog>
    );
}

export default Login;