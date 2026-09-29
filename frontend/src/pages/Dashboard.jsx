import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../component/DataTable";
import Pagination from "../component/Pagination";

const PAGE_SIZE = 10;

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);

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
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearch("");
    setDistrict("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setPage(1);
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
            onChange={(e) => handleFilterChange(setSearch)(e.target.value)}
          />
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">District</label>
          <select
            className="p-2 border-1 border-round surface-border"
            style={{ width: "180px" }}
            value={district}
            onChange={(e) => handleFilterChange(setDistrict)(e.target.value)}
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
            onChange={(e) => handleFilterChange(setFromDate)(e.target.value)}
          />
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">To Date</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="date"
            value={toDate}
            onChange={(e) => handleFilterChange(setToDate)(e.target.value)}
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

      <DataTable
        columns={[
          {
            key: "date",
            label: "Sales Date",
            render: (s) => new Date(s.date).toLocaleDateString(),
          },
          { key: "dealer", label: "Dealer", render: (s) => s.distributor?.name },
          { key: "proprietor", label: "Proprietor", render: (s) => s.distributor?.proprietorName },
          { key: "phone", label: "Phone", render: (s) => s.distributor?.phone },
          { key: "address", label: "Address", render: (s) => s.distributor?.location?.municipality },
          { key: "district", label: "District", render: (s) => s.distributor?.location?.district },
          { key: "brand", label: "Brand", render: (s) => s.brand?.name },
          {
            key: "quantity",
            label: "Quantity",
            render: (s) => <span className="font-bold">{s.quantity}</span>,
          },
          { key: "remarks", label: "Remarks" },
        ]}
        data={paginated}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
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