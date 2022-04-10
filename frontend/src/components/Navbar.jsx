import { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context";

function Navbar() {
    const { pathname } = useLocation();
    const auth = useContext(AuthContext);

    return <div className="navigation-cont">
        <nav className="navigation-pane">
            <ul className="navigation-list" style={{ gridTemplateColumns: `repeat(${auth.user.isAdmin ? 4 : 3}, 1fr)` }}>
                <Link to="/" className={(pathname === '/' ? "nav-link-active " : "") + "nav-list-item"}>
                    <ion-icon name="home" class="nav-icon"></ion-icon>
                    <span>home</span>
                </Link>
                {auth.user.isAdmin && <Link to="/admin" className={(pathname === '/admin' ? "nav-link-active " : "") + "nav-list-item"}>
                    <ion-icon name="people-circle" class="nav-icon"></ion-icon>
                    <span>Admin</span>
                </Link>}
                <Link to="/events" className={(pathname === '/events' ? "nav-link-active " : "") + "nav-list-item"}>
                    <ion-icon name="diamond" class="nav-icon"></ion-icon>
                    <span>Events</span>
                </Link>

                <Link to="/contact" className={(pathname === '/contact' ? "nav-link-active " : "") + "nav-list-item"}>
                    <ion-icon name="people" class="nav-icon"></ion-icon>
                    <span>contact</span>
                </Link>
            </ul>
        </nav>
    </div>;
}

export default Navbar;