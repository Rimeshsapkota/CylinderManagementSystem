import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../component/DataTable";
import Pagination from "../component/Pagination";

const PAGE_SIZE = 10;

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [brand, setBrand] = useState("");
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

  if (!summary) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
        <span>Loading sales register…</span>
        <DashboardStyles />
      </div>
    );
  }

  const { brandCount, distributorCount, salesRegister = [] } = summary;

  const districts = [...new Set(
    salesRegister.map((s) => s.distributor?.location?.district).filter(Boolean)
  )].sort();

  const brands = [...new Set(
    salesRegister.map((s) => s.brand?.name).filter(Boolean)
  )].sort();

  const filtered = salesRegister.filter((s) => {
    const matchesSearch =
      s.distributor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.distributor?.location?.district?.toLowerCase().includes(search.toLowerCase());

    const matchesDistrict = district ? s.distributor?.location?.district === district : true;
    const matchesBrand = brand ? s.brand?.name === brand : true;

    const txnDate = new Date(s.date);
    const matchesFrom = fromDate ? txnDate >= new Date(fromDate) : true;
    const matchesTo = toDate ? txnDate <= new Date(toDate) : true;

    return matchesSearch && matchesDistrict && matchesBrand && matchesFrom && matchesTo;
  });

  const filteredTotal = filtered.reduce((sum, s) => sum + s.quantity, 0);
  const isFiltering = search || district || brand || fromDate || toDate;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const clearFilters = () => {
    setSearch("");
    setDistrict("");
    setBrand("");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  const onFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  return (
    <div className="dash">
      <DashboardStyles />

      <header className="dash-header">
        <div>
          <h1>Sales Register</h1>
          <p>Dealer transactions across all brands and districts</p>
        </div>
      </header>

      <div className="dash-stats">
        <StatTile label="Brands" value={brandCount} accent="#2563EB" />
        <StatTile label="Dealers" value={distributorCount} accent="#059669" />
        <StatTile
          label="Filtered quantity"
          value={isFiltering ? filteredTotal : "—"}
          accent="#D97706"
          muted={!isFiltering}
        />
      </div>

      <div className="dash-toolbar">
        <div className="dash-field" style={{ flex: "1 1 220px" }}>
          <label>Search</label>
          <input
            placeholder="Dealer or district"
            value={search}
            onChange={(e) => onFilter(setSearch)(e.target.value)}
          />
        </div>

        <div className="dash-field">
          <label>District</label>
          <select value={district} onChange={(e) => onFilter(setDistrict)(e.target.value)}>
            <option value="">All districts</option>
            {districts.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="dash-field">
          <label>Brand</label>
          <select value={brand} onChange={(e) => onFilter(setBrand)(e.target.value)}>
            <option value="">All brands</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="dash-field">
          <label>From</label>
          <input type="date" value={fromDate} onChange={(e) => onFilter(setFromDate)(e.target.value)} />
        </div>

        <div className="dash-field">
          <label>To</label>
          <input type="date" value={toDate} onChange={(e) => onFilter(setToDate)(e.target.value)} />
        </div>

        {isFiltering && (
          <button className="dash-clear" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <div className="dash-table-wrap">
        <DataTable
          columns={[
            {
              key: "date",
              label: "Sales date",
              render: (s) => new Date(s.date).toLocaleDateString(undefined, {
                day: "2-digit", month: "short", year: "numeric",
              }),
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
              render: (s) => <span className="dash-qty">{s.quantity}</span>,
            },
            { key: "remarks", label: "Remarks", render: (s) => s.remarks || <span className="dash-dim">—</span> },
          ]}
          data={paginated}
        />

        {filtered.length === 0 && (
          <div className="dash-empty">
            No transactions match these filters.
            {isFiltering && (
              <button onClick={clearFilters}>Clear filters</button>
            )}
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="dash-footer">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}

function StatTile({ label, value, accent, muted }) {
  return (
    <div className="dash-stat" style={{ borderLeftColor: accent }}>
      <span className="dash-stat-value" style={muted ? { color: "#94A3B8" } : undefined}>
        {value}
      </span>
      <span className="dash-stat-label">{label}</span>
    </div>
  );
}

function DashboardStyles() {
  return (
    <style>{`
      .dash {
        font-family: -apple-system, "Inter", "Segoe UI", sans-serif;
        color: #0F172A;
        max-width: 1280px;
        margin: 0 auto;
        padding: 28px 24px 48px;
      }

      .dash-loading {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 48px;
        color: #64748B;
        font-family: -apple-system, "Inter", "Segoe UI", sans-serif;
      }
      .dash-spinner {
        width: 16px; height: 16px;
        border: 2px solid #E2E8F0;
        border-top-color: #2563EB;
        border-radius: 50%;
        animation: dash-spin 0.7s linear infinite;
      }
      @keyframes dash-spin { to { transform: rotate(360deg); } }

      .dash-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 24px;
      }
      .dash-header h1 {
        font-size: 22px;
        font-weight: 600;
        margin: 0 0 4px;
        letter-spacing: -0.01em;
      }
      .dash-header p {
        margin: 0;
        color: #64748B;
        font-size: 13.5px;
      }

      .dash-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
        margin-bottom: 20px;
      }
      .dash-stat {
        background: #fff;
        border: 1px solid #E2E8F0;
        border-left: 3px solid;
        border-radius: 6px;
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .dash-stat-value {
        font-size: 24px;
        font-weight: 650;
        font-variant-numeric: tabular-nums;
        line-height: 1;
      }
      .dash-stat-label {
        font-size: 12.5px;
        color: #64748B;
      }

      .dash-toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-end;
        gap: 14px;
        background: #fff;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        padding: 14px 16px;
        margin-bottom: 18px;
      }
      .dash-field {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .dash-field label {
        font-size: 11.5px;
        font-weight: 600;
        color: #64748B;
      }
      .dash-field input,
      .dash-field select {
        border: 1px solid #CBD5E1;
        border-radius: 6px;
        padding: 7px 10px;
        font-size: 13.5px;
        color: #0F172A;
        background: #fff;
        min-width: 140px;
        outline: none;
      }
      .dash-field input:focus,
      .dash-field select:focus {
        border-color: #2563EB;
        box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
      }
      .dash-clear {
        border: none;
        background: transparent;
        color: #2563EB;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        padding: 8px 4px;
      }
      .dash-clear:hover { text-decoration: underline; }

      .dash-table-wrap {
        background: #fff;
        border: 1px solid #E2E8F0;
        border-radius: 8px;
        overflow: hidden;
      }

      .dash-qty {
        font-variant-numeric: tabular-nums;
        font-weight: 600;
      }
      .dash-dim { color: #94A3B8; }

      .dash-empty {
        padding: 36px 16px;
        text-align: center;
        color: #64748B;
        font-size: 13.5px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        align-items: center;
      }
      .dash-empty button {
        border: 1px solid #CBD5E1;
        background: #fff;
        border-radius: 6px;
        padding: 6px 12px;
        font-size: 13px;
        cursor: pointer;
      }

      .dash-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 14px;
        font-size: 12.5px;
        color: #64748B;
      }
    `}</style>
  );
}