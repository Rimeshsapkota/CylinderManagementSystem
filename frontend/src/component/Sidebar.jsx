import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/brands", label: "Brands" },
  { to: "/cylinder-types", label: "Cylinder Types" },
  { to: "/distributors", label: "Distributors" },
  { to: "/imports", label: "Imports" },
  { to: "/stock", label: "Stock Transactions" }
];

export default function Sidebar() {
  return (
    <div
      className="flex flex-column p-3 gap-2"
      style={{
        width: "220px",
        minHeight: "100vh",
        background: "#1e293b",
        color: "#fff"
      }}
    >
      <h3 className="text-xl font-bold mb-3 px-2">Cylinder MS</h3>

      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `p-2 border-round no-underline ${isActive ? "font-bold" : ""}`
          }
          style={({ isActive }) => ({
            background: isActive ? "#3b82f6" : "transparent",
            color: "#fff"
          })}
        >
          {link.label}
        </NavLink>
      ))}

<button
  className="p-2 border-round border-none cursor-pointer mt-4"
  onClick={() => {
    localStorage.removeItem("token");
    window.location.assign("/");
  }}
>
  Logout
</button>
    </div>

    
  );
  
}