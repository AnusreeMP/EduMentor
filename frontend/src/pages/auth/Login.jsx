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
      const user = await login(username, password); // 👈 data now exists

      if (user.is_admin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/courses");
      }
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
