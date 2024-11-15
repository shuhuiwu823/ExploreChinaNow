import { useContext, useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import uploadFile from "../dbOperation";
import { Button } from "react-bootstrap";
import { AppContext } from "../Context";
import "./Register.css";

function Register() {
    const [avatar, setAvatar] = useState({
        file: "",
        url:"/avatar.png"
    });

    const {userData, setUserData, errorMsg, setErrorMsg, loading, setLoading} = useContext(AppContext);
    
    // When user change the avatar image, change the avatar state
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
        setLoading(true);
        
        const formData = new FormData(e.target);

        const {username, email, password, name} = Object.fromEntries(formData);
    
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            const imgURL = avatar.file ? await uploadFile(avatar.file) : avatar.url;
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
        }catch(err){
            console.log(err);
            setErrorMsg(err.message);
        }finally{
            setLoading(false);
            navigate("/profile");
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
                    <img src={avatar.url || "/avatar.png"} alt=""/>
                    <span>Upload an Image</span>
                    <input type="file" className="upload-file" style={{display: "none"}} onChange={handleAvatar}></input>
                </label>
                <div className="error-message">{errorMsg}</div>
                <button className="submit-register" disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
            </form>
        </dialog>
    );
}

export default Register;