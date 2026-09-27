import { useEffect, useState } from "react";
import api from "../services/api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      const res = await api.get("/dashboard");
      if (!ignore) setSummary(res.data);
    })();
    return () => { ignore = true; };
  }, []);

  if (!summary) return <div className="p-4">Loading...</div>;

  const { brandCount, distributorCount, salesRegister = [] } = summary;

  const districts = [...new Set(
    salesRegister
      .map((s) => s.distributor?.location?.district)
      .filter(Boolean)
  )];

  const filtered = salesRegister.filter((s) => {
    const matchesSearch =
      s.distributor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.distributor?.location?.district?.toLowerCase().includes(search.toLowerCase());

    const matchesDistrict = district
      ? s.distributor?.location?.district === district
      : true;

    const txnDate = new Date(s.date);
    const matchesFrom = fromDate ? txnDate >= new Date(fromDate) : true;
    const matchesTo = toDate ? txnDate <= new Date(toDate) : true;

    return matchesSearch && matchesDistrict && matchesFrom && matchesTo;
  });

  const filteredTotal = filtered.reduce((sum, s) => sum + s.quantity, 0);

  const isFiltering = search || district || fromDate || toDate;

  const clearFilters = () => {
    setSearch("");
    setDistrict("");
    setFromDate("");
    setToDate("");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Sales Register</h2>

      <div className="flex gap-4 mb-5 flex-wrap">
        <CircleStat label="Brands" value={brandCount} color="#3b82f6" />
        <CircleStat label="Dealers" value={distributorCount} color="#10b981" />
        {isFiltering && (
          <CircleStat label="Filtered Qty" value={filteredTotal} color="#f59e0b" />
        )}
      </div>

      <div
        className="p-3 border-round mb-4 flex flex-wrap gap-3 align-items-end"
        style={{ background: "#f1f5f9" }}
      >
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Search Dealer/District</label>
          <input
            className="p-2 border-1 border-round surface-border"
            style={{ width: "220px" }}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">District</label>
          <select
            className="p-2 border-1 border-round surface-border"
            style={{ width: "180px" }}
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">From Date</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">To Date</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

        {isFiltering && (
          <button
            className="p-2 px-3 border-round cursor-pointer"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-bottom-2 surface-border">
            <th className="p-2">S.N.</th>
            <th className="p-2">Sales Date</th>
            <th className="p-2">Dealer</th>
            <th className="p-2">Proprietor</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Address</th>
            <th className="p-2">District</th>
            <th className="p-2">Brand</th>
            <th className="p-2">Quantity</th>
            <th className="p-2">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td className="p-2" colSpan={10}>No records found.</td>
            </tr>
          )}
          {filtered.map((s, i) => (
            <tr key={s._id} className="border-bottom-1 surface-border">
              <td className="p-2">{i + 1}</td>
              <td className="p-2">{new Date(s.date).toLocaleDateString()}</td>
              <td className="p-2">{s.distributor?.name}</td>
              <td className="p-2">{s.distributor?.proprietorName}</td>
              <td className="p-2">{s.distributor?.phone}</td>
              <td className="p-2">{s.distributor?.location?.municipality}</td>
              <td className="p-2">{s.distributor?.location?.district}</td>
              <td className="p-2">{s.brand?.name}</td>
              <td className="p-2 font-bold">{s.quantity}</td>
              <td className="p-2">{s.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CircleStat({ label, value, color }) {
  return (
    <div className="flex flex-column align-items-center gap-2">
      <div
        className="flex align-items-center justify-content-center text-white font-bold"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: color,
          fontSize: "1.5rem"
        }}
      >
        {value}
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}