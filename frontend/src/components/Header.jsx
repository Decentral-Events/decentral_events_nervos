import axios from "axios";
import { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context";
import { getUrl, shortenAddress } from "../helpers";
import Logo from "../Images/logo.png";

function Header({ provider }) {
    const auth = useContext(AuthContext);
    const { search } = useLocation();
    const navigate = useNavigate();
    let searchValue = "";
    const [showUserMenu, setShowUserMenu] = useState(false);
    if (search.includes("?search=")) {
        searchValue = search.split("?search=")[1].split('&')[0];
    } else if (search.includes("&search=")) {
        searchValue = search.split("&search=")[1].split('&')[0];
    }
    const [searchText, setSearchText] = useState(searchValue);

    async function connect() {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const { data: { message, registered } } = await axios.get(`${window.server}/auth/get-nonce-message/${address}`);
        if (!registered) {
            // redirect to register page
            navigate("/register");
            return;
        }
        const signature = await signer.signMessage(message);
        const { data: { user, token } } = await axios.post(`${window.server}/auth/login`, { address, signature });
        console.log(user)
        auth.setLoginData({
            user,
            signer,
            token,
            isLoggedIn: true,
            expireTimeStamp: 0
        });
        localStorage.setItem('auth', JSON.stringify({
            user,
            token,
            isLoggedIn: true,
            expireTimeStamp: 0
        }));
    }

    function logout(e) {
        e.preventDefault();
        setShowUserMenu(false);
        auth.setLoginData({
            isLoggedIn: false,
            user: {
                name: "",
                address: "",
                image: "",
                isAdmin: false,
                username: ""
            },
            token: "",
            expireTimeStamp: 0,
            signer: null
        });
        localStorage.removeItem('auth');
    }

    function trackEnter(e) {
        if (e.key === 'Enter') {
            navigate(`/events?search=${searchText}`);
            return;
        }
    }

    return <>
        <header>
            <div className="header-logo-cont">
                <div className="header-img-cont">
                    <Link to="/">
                        <img src={Logo} alt="" className="header-logo"
                        /></Link>
                </div>
                <Link to="/" className="logo-heading">Decentral Events</Link>
            </div>
            <div className="search-cont">
                <div className="search-cont--modifier">
                    <ion-icon class="search-icon" name="search-outline"></ion-icon>
                    <input
                        className="search-box"
                        type="search"
                        name="search box"
                        id=""
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => trackEnter(e)}
                        placeholder="Event Name"
                    />
                </div>
            </div>
            <div className="header-button-cont">
                {/* <div className="header-button-cont user-prof-cont"></div> */}
                {auth.isLoggedIn
                    ? <button className="user-prof-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                        <img src={getUrl(auth.user.image)} className="user-prof-img" alt="" />
                        <span className="user-name-head">{auth.user.name}</span>
                    </button>
                    : <button className="btn" onClick={connect}>
                        <span className="btn-visible">Connect With Metamask</span>
                    </button>
                }
            </div>
        </header>
        <div className="drp-dwn-list" style={auth.isLoggedIn && showUserMenu ? { visibility: 'visible', zIndex: '100' } : {}}>
            <p className="drp-dwn-list-item drp-dwn-name">{auth.user.username}</p>
            <p className="drp-dwn-list-item drp-dwn-address">{shortenAddress(auth.user.address)}</p>
            <Link to="/tokens" style={{ textDecoration: "none" }} className="drp-dwn-list-item drp-dwn-token">Mint Token</Link>
            <Link to="/reservations" style={{ textDecoration: "none" }} className="drp-dwn-list-item drp-dwn-reservations">Your Reservations</Link>
            <button onClick={logout} style={{ border: "none" }} className="drp-dwn-list-item drp-dwn-logout">Logout</button>
        </div>
    </>;
}

export default Header;