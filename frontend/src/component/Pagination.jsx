export default function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;
  
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
    const btnStyle = (active = false) => ({
      padding: "6px 10px",
      borderRadius: "4px",
      border: "1px solid #cbd5e1",
      background: active ? "#3b82f6" : "#fff",
      color: active ? "#fff" : "#334155",
      cursor: "pointer",
      fontWeight: active ? "bold" : "normal"
    });
  
    const disabledStyle = {
      padding: "6px 10px",
      borderRadius: "4px",
      border: "1px solid #cbd5e1",
      background: "#f1f5f9",
      color: "#94a3b8",
      cursor: "not-allowed"
    };
  
    return (
      <div className="flex justify-content-end gap-2 mt-3 align-items-center">
        <button
          style={page <= 1 ? disabledStyle : btnStyle()}
          disabled={page <= 1}
          onClick={() => onPageChange(1)}
          title="First page"
        >
          &laquo;
        </button>
  
        <button
          style={page <= 1 ? disabledStyle : btnStyle()}
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          title="Previous page"
        >
          &lsaquo;
        </button>
  
        {pageNumbers.map((num) => (
          <button
            key={num}
            style={btnStyle(num === page)}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}
  
        <button
          style={page >= totalPages ? disabledStyle : btnStyle()}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          title="Next page"
        >
          &rsaquo;
        </button>
  
        <button
          style={page >= totalPages ? disabledStyle : btnStyle()}
          disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)}
          title="Last page"
        >
          &raquo;
        </button>
      </div>
    );
  }