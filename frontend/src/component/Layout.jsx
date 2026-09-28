import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const isOwner = !!localStorage.getItem("token");

  return (
    <div className="flex">
      {isOwner && <Sidebar />}

      <div className="flex-1" style={{ minHeight: "100vh" }}>
        {!isOwner && (
          <div className="flex justify-content-end p-3">
            <Link to="/login">Owner Login</Link>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}