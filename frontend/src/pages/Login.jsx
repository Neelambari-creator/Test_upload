
import { useState } from "react";
import "./Auth.css";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Invalid email or password.");
        setLoading(false);
        return;
      }

      // Store JWT token
      localStorage.setItem("token", data.token);

      // Store logged-in user information
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage("Login successful!");

      console.log("Logged in user:", data.user);

      setLoading(false);

      // Open Citizen Dashboard
      if (onLoginSuccess) {
        onLoginSuccess(data.user);
      }

    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        "Unable to connect to Civixa server."
      );

      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ================= LEFT SHOWCASE ================= */}

      <div className="auth-showcase">

        <div className="showcase-content">

          <div className="brand">

            <div className="brand-mark">
              C
            </div>

            <span>Civixa</span>

          </div>

          <div className="showcase-main">

            <div className="showcase-badge">
              SMART CIVIC PLATFORM
            </div>

            <h1>
              Make your city
              <br />
              <span>better together.</span>
            </h1>

            <p>
              Report civic problems, track their progress,
              and help create cleaner, safer and better
              communities.
            </p>

            <div className="showcase-features">

              <div>
                <span>✓</span>
                Easy civic reporting
              </div>

              <div>
                <span>✓</span>
                Smart issue classification
              </div>

              <div>
                <span>✓</span>
                Real-time complaint tracking
              </div>

            </div>

          </div>

          <div className="showcase-footer">
            © 2026 Civixa · Civic Issue Management
          </div>

        </div>

      </div>


      {/* ================= RIGHT FORM ================= */}

      <div className="auth-form-area">

        <div className="auth-form-container">

          <div className="mobile-brand">

            <div className="brand-mark">
              C
            </div>

            <span>Civixa</span>

          </div>


          <div className="auth-heading">

            <h2>
              Welcome back
            </h2>

            <p>
              Sign in to continue to your Civixa account.
            </p>

          </div>


          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div className="input-group">

              <label>
                Email address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div className="input-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>

              </div>

            </div>


            {/* OPTIONS */}

            <div className="form-options">

              <label className="remember">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>

              <button
                type="button"
                className="forgot-password"
              >
                Forgot password?
              </button>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >

              {loading
                ? "Signing in..."
                : "Sign in"}

              {!loading && (
                <span>
                  →
                </span>
              )}

            </button>

          </form>


          {/* MESSAGE */}

          {message && (
            <div
              className={`auth-message ${
                message === "Login successful!"
                  ? "success"
                  : "error"
              }`}
            >
              {message}
            </div>
          )}


          <div className="auth-divider">
            <span>
              New to Civixa?
            </span>
          </div>

          <p className="auth-switch">
            Create an account to start reporting
            civic issues.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;

