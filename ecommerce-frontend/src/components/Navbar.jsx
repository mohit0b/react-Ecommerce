import './Navbar.css';
import { NavLink } from 'react-router';
import BagIcon from '../assets/images/bag.png'
import UserIcon from '../assets/images/user.png'
export function Navbar () {
    return (
        <>
            <div className="header">
                <div className="header-container">
                    <div className="logo">ELECTRON</div>

                    <nav>
                        <ul className="nav-list">
                            <li><NavLink className="navLink" to="/">Home</NavLink></li>
                            <li><NavLink className="navLink" to="/products">Products</NavLink></li>
                            <li><NavLink className="navLink" to="/orders">Orders</NavLink></li>
                        </ul>
                    </nav>

                    <div className="right-section">
                        <NavLink className="navLink icon" to="/checkout"><img src={BagIcon} className="icon" /></NavLink>
                        
                            <NavLink className="navLink icon" to="/account"><img src={UserIcon} className="icon" /></NavLink>
                            </div>
                    </div>
                </div>
        </>
            );
};