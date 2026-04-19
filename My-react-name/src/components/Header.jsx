import './Header.css';
import BagIcon from '../assets/bag.png'
import UserIcon from '../assets/user.png'
export function Header() {
    return (
        <>
            <div className="header">
                <div className="header-container">
                    <div className="logo">ELECTRON</div>

                    <nav>
                        <ul className="nav-list">
                            <li><a className="navLink" href="#">Audio</a></li>
                            <li><a className="navLink" href="#">Computing</a></li>
                            <li><a className="navLink" href="#">Living</a></li>
                            <li><a className="navLink" href="#">Collections</a></li>
                        </ul>
                    </nav>

                    <div className="right-section">
                        <img src={BagIcon} className="icon" />
                            <img src={UserIcon} className="icon" />
                            </div>
                    </div>
                </div>
        </>
            );
};