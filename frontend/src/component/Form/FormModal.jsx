export default function FormModal({ title, onClose, onSubmit, children }) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}
        onClick={onClose}
      >
        <div
          className="p-4 border-round"
          style={{
            background: "#fff",
            width: "600px",
            maxWidth: "90%",
            maxHeight: "85vh",
            overflowY: "auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-content-between align-items-center mb-3">
            <h3 className="text-lg font-bold">{title}</h3>
            <button
              className="border-none bg-transparent cursor-pointer"
              style={{ fontSize: "20px", color: "#64748b" }}
              onClick={onClose}
            >
              <i className="pi pi-times"></i>
            </button>
          </div>
  
          <form onSubmit={onSubmit} className="flex flex-column gap-3">
            {children}
          </form>
        </div>
      </div>
    );
  }