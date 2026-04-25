import "./AccountPage.css";
import { NavLink } from "react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function AccountPage() {
  const user = {
    name: "John Doe",
    email: "john@example.com"
  };

  return (
    <>
      <Navbar />

      <div className="account-page">

        {/* Sidebar */}
        <div className="account-sidebar">
          <h3 className="sidebar-title">My Account</h3>

          <NavLink to="/account" className="sidebar-link">Dashboard</NavLink>
          <NavLink to="/orders" className="sidebar-link">My Orders</NavLink>
          <NavLink to="/wishlist" className="sidebar-link">Wishlist</NavLink>
          <NavLink to="/address" className="sidebar-link">Addresses</NavLink>

          <button className="logout-btn">Logout</button>
        </div>

        {/* Main Content */}
        <div className="account-content">

          <h2 className="account-heading">Account Overview</h2>

          <div className="account-card">
            <h3>Profile Information</h3>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>

            <button className="edit-btn">Edit Profile</button>
          </div>

          <div className="account-grid">
            <div className="account-box-item">
              <h4>Orders</h4>
              <p>Track, manage and review your orders</p>
              <NavLink to="/orders">View Orders →</NavLink>
            </div>

            <div className="account-box-item">
              <h4>Security</h4>
              <p>Update password and secure your account</p>
              <button>Change Password →</button>
            </div>

            <div className="account-box-item">
              <h4>Addresses</h4>
              <p>Manage your delivery addresses</p>
              <button>Manage →</button>
            </div>

            <div className="account-box-item">
              <h4>Wishlist</h4>
              <p>View and manage saved items</p>
              <button>View Wishlist →</button>
            </div>
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
}