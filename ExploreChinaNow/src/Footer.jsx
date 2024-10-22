import './Footer.css';

function Footer() {
    return(
        <footer className='footer'>
            <div className='navigation-buttons'>
                <button className='home-button navigation-button'>
                    <img className='navigation-button-icon' src={'home.png'} alt='Home Icon' /><br/>
                    HOME
                </button>
                <button className='plan-button navigation-button'>
                    <img className='navigation-button-icon' src={'looking_glass.png'} alt='Plan Icon' /><br/>
                    PLAN
                </button>
                <button className='blog-button navigation-button'>
                    <img className='navigation-button-icon' src={'slack.png'} alt='Blog Icon' /><br/>
                    BLOG
                </button>
            </div>
        </footer>
    );
}

export default Footer;