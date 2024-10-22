function Header({}) {
    return(
        <header className="header">
            <h1>Explore China Now</h1>
            <button
                onClick={ () => {
                    fetch('/api/homepage');
            }}
            >Test</button>
        </header>
    );
}

export default Header;