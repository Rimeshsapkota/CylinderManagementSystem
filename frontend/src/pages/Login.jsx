import { useState } from "react";
import api from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      window.location.assign("/brands");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="flex justify-content-center p-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-column gap-3 p-4 border-round"
        style={{ width: "340px", border: "1px solid #e2e8f0" }}
      >
        <h2 className="text-xl font-bold">Owner Login</h2>
        <input
          className="p-2 border-1 border-round surface-border"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          className="p-2 border-1 border-round surface-border"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <span style={{ color: "#ef4444" }}>{error}</span>}
        <button
          type="submit"
          className="p-2 border-round text-white border-none cursor-pointer"
          style={{ background: "#3b82f6" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}