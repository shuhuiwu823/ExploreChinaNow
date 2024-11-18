import { useContext } from "react";
import "./Profile.css"
import { AppContext } from "../context";

function Profile() {
    const {userData} = useContext(AppContext);

    return(
    <>
    <div className="profile-block">
        <img className="profile-avatar" src={userData.avatar} alt={userData.username}/>
        <div className="profile-username-below-avatar">{userData.username}</div><br/>
        <div className="profile-username" data-label="Username:">{userData.username}</div>
        <div className="profile-email" data-label="E-mail:">{userData.email}</div>
        <div className="profile-name" data-label="Name:">{userData.name}</div>
    </div>
    </>
    );
}

export default Profile;