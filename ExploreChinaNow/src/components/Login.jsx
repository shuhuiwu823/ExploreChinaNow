function Login() {
    return(
        <dialog className="login-dialog" open>
            <h2>Log In</h2>
            <form className="login-form" onClick={(e)=>{
                e.preventDefault();
            }}>
                <label className="login-username">
                    <span>Username</span>
                    <input type="text" className="enter-username"></input>
                </label>
                <label className="login-password">
                    <span>Password</span>
                    <input type="password" className="enter-password"></input>
                </label>
                <button className="submit-login" onClick={(e) => {
                    e.preventDefault();
                }}>Login</button>
            </form>
        </dialog>
    );
}

export default Login;