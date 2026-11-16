
import { useState } from "react";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setMessage("Account created successfully!");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      setLoading(false);

    } catch (error) {
      console.error("Registration error:", error);

      setMessage("Unable to connect to Civixa server.");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* LEFT SIDE */}
      <div className="auth-showcase register-showcase">

        <div className="showcase-content">

          <div className="brand">
            <div className="brand-mark">C</div>
            <span>Civixa</span>
          </div>

          <div className="showcase-main">

            <div className="showcase-badge">
              JOIN THE COMMUNITY
            </div>

            <h1>
              Your voice can
              <br />
              <span>change your city.</span>
            </h1>

            <p>
              Join Civixa and help authorities discover,
              prioritize and resolve the civic issues
              that matter to your community.
            </p>

            <div className="showcase-features">

              <div>
                <span>✓</span>
                Report problems in seconds
              </div>

              <div>
                <span>✓</span>
                Track every complaint
              </div>

              <div>
                <span>✓</span>
                Make your community better
              </div>

            </div>

          </div>

          <div className="showcase-footer">
            © 2026 Civixa · Civic Issue Management
          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="auth-form-area">

        <div className="auth-form-container register-container">

          <div className="mobile-brand">
            <div className="brand-mark">C</div>
            <span>Civixa</span>
          </div>

          <div className="auth-heading">
            <h2>Create your account</h2>

            <p>
              Join Civixa and start making a difference.
            </p>
          </div>

          <form onSubmit={handleRegister}>

            {/* NAME */}
            <div className="input-group">
              <label>Full name</label>

              <div className="input-wrapper">
                <span className="input-icon">👤</span>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL */}
            <div className="input-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="input-group">
              <label>Password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength="6"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="input-group">
              <label>Confirm password</label>

              <div className="input-wrapper">
                <span className="input-icon">🔒</span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  minLength="6"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <label className="terms">
              <input type="checkbox" required />

              <span>
                I agree to the Civixa terms and conditions.
              </span>
            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}

              {!loading && <span>→</span>}
            </button>

          </form>

          {message && (
            <div
              className={`auth-message ${
                success ? "success" : "error"
              }`}
            >
              {message}
            </div>
          )}

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <p className="auth-switch">
            Sign in to your Civixa account to continue.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;

