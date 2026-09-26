export default function ToggleSwitch({ checked, onChange }) {
    return (
      <div
        onClick={onChange}
        style={{
          width: "44px",
          height: "24px",
          borderRadius: "999px",
          background: checked ? "#10b981" : "#cbd5e1",
          position: "relative",
          cursor: "pointer",
          transition: "background 0.2s ease",
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: "18px",
            height: "18px",
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: "3px",
            left: checked ? "23px" : "3px",
            transition: "left 0.2s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.3)"
          }}
        />
      </div>
    );
  }