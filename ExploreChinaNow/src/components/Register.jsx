function Register() {
    return(
        <dialog className="register-dialog" open>
            <h2>Sign Up</h2>
            <form className="register-form">
                <label className="register-username">
                    <span>Enter Username</span>
                    <input type="text" className="enter-username"></input>
                </label>
                <label className="register-password">
                    <span>Enter Password</span>
                    <input type="password" className="enter-password"></input>
                </label>
                <label className="register-password-again">
                    <span>Enter Password Again</span>
                    <input type="password" className="enter-password-again"></input>
                </label>
                <label className="register-name">
                    <span>Name</span>
                    <input type="text" className="enter-name"></input>
                </label>
                <label className="register-avatar">
                    <span>Avatar</span>
                    <input className="enter-name" ></input>
                </label>
                <button className="submit-register" onClick={(e) => {
                    e.preventDefault();
                }}>Sign Up</button>
            </form>
        </dialog>
    );
}

export default Register;