import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

function Register() {
    const [avatar, setAvatar] = useState({
        file: null,
        url:""
    });

    const [errorMsg, setErrorMsg] = useState("");

    const handleAvatar = (e) => {
        if(e.target.files[0]){
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);

        const {username, email, password, name} = Object.fromEntries(formData);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(db, "users", res.user.uid), {
                username: username,
                email: email,
                id: res.user.uid,
                name: name,
                blocked: [] 
            });

            await setDoc(doc(db, "blogs", res.user.uid), {
                blogs: []
            });

            setErrorMsg("Created a new account")
        }catch(err){
            console.log(err);
            setErrorMsg(err.message);
        }
    }

    return(
        <dialog className="register-dialog" open>
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
                    <img src={avatar.url || "avatar.png"} alt=""/>
                    <span>Upload an Image</span>
                    <input type="file" className="upload-file" style={{display: "none"}} onChange={handleAvatar}></input>
                </label>
                <div className="error-message">{errorMsg}</div>
                <button className="submit-register" onClick={(e) => {
                }}>Sign Up</button>
            </form>
        </dialog>
    );
}

export default Register;