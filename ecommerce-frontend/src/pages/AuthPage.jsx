import { useState } from "react";
import "./AuthPage.css";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-box">
        
        <h2 className="auth-title">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        <p className="auth-subtitle">
          {isLogin
            ? "Welcome back! Please login to continue."
            : "Sign up to start your shopping experience."}
        </p>

        <form className="auth-form">
          
          {!isLogin && (
            <input type="text" placeholder="Full Name" required />
          )}

          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />

          {!isLogin && (
            <input type="password" placeholder="Confirm Password" required />
          )}

          <button className="auth-btn">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>

      </div>
    </div>
  );
}