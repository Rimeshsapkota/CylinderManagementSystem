export default function DataTable({ columns, data = [], emptyMessage = "No records found." }) {
  return (
    <table className="w-full border-collapse" style={{ border: "1px solid #cbd5e1" }}>
      <thead>
        <tr style={{ background: "#e2e8f0" }}>
          {columns.map((col) => (
            <th
              key={col.key}
              className="p-2 text-left"
              style={{ border: "1px solid #cbd5e1" }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 && (
          <tr>
            <td className="p-2" style={{ border: "1px solid #cbd5e1" }} colSpan={columns.length}>
              {emptyMessage}
            </td>
          </tr>
        )}
        {data.map((row, i) => (
          <tr key={row._id || i}>
            {columns.map((col) => (
              <td key={col.key} className="p-2" style={{ border: "1px solid #cbd5e1" }}>
                {col.render ? col.render(row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}