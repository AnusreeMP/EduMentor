import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        alert("Enter username and password");
        return;
      }

      // ✅ trim username (important)
      const user = await login(username.trim(), password);

      if (user?.is_admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/courses");
      }
    } catch (err) {
      console.log("Login error:", err);
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
