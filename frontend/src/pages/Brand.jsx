import { useEffect, useState } from "react";
import api from "../services/api";
import ToggleSwitch from "../component/ToggleSwitch";
import Pagination from "../component/Pagination";
import DataTable from "../component/DataTable";

export default function Brand() {
  const [brands, setBrands] = useState([]);
  const [form, setForm] = useState({ name: "", code: "" });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBrands = async (pageNum = page) => {
    const res = await api.get(`/brands?page=${pageNum}&limit=10`);
    setBrands(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      const res = await api.get(`/brands?page=${page}&limit=10`);
      if (!ignore) {
        setBrands(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [page]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/brands/${editingId}`, form);
      } else {
        await api.post("/brands", form);
      }
      setForm({ name: "", code: "" });
      setEditingId(null);
      fetchBrands();
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleEdit = (brand) => {
    setForm({ name: brand.name, code: brand.code });
    setEditingId(brand._id);
  };

  const handleToggleStatus = async (brand) => {
    try {
      await api.put(`/brands/${brand._id}`, { isActive: !brand.isActive });
      fetchBrands();
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  const filteredBrands = brands.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.code.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "active"
        ? b.isActive
        : !b.isActive;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Brand Management</h2>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-4 align-items-end">
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Name</label>
          <input
            className="p-2 border-1 border-round surface-border"
            style={{ minWidth: "200px" }}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Code</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
          />
        </div>
        <button
          type="submit"
          className="p-2 px-3 border-round text-white border-none cursor-pointer"
          style={{ background: "#3b82f6" }}
        >
          {editingId ? "Update" : "Add"} Brand
        </button>
        {editingId && (
          <button
            type="button"
            className="p-2 px-3 border-round cursor-pointer"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", code: "" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div
        className="p-3 border-round mb-4 flex flex-wrap gap-3 align-items-end"
        style={{ background: "#f1f5f9" }}
      >
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Search</label>
          <input
            className="p-2 border-1 border-round surface-border"
            style={{ width: "220px" }}
            placeholder="Search name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Status</label>
          <select
            className="p-2 border-1 border-round surface-border"
            style={{ width: "150px" }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {(search || statusFilter !== "all") && (
          <button
            className="p-2 px-3 border-round cursor-pointer"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
          >
            Clear
          </button>
        )}
      </div>

      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "code", label: "Code" },
          {
            key: "status",
            label: "Status",
            render: (b) => (
              <span
                className="p-1 px-2 border-round text-white text-sm font-bold"
                style={{ background: b.isActive ? "#10b981" : "#ef4444" }}
              >
                {b.isActive ? "Active" : "Inactive"}
              </span>
            )
          },
          {
            key: "actions",
            label: "Actions",
            render: (b) => (
              <div className="flex gap-2">
                <button
                  className="p-2 border-round border-none text-white cursor-pointer flex align-items-center justify-content-center"
                  style={{ background: "#3b82f6", width: "36px", height: "36px" }}
                  onClick={() => handleEdit(b)}
                  title="Edit"
                >
                  <i className="pi pi-pencil"></i>
                </button>
                <ToggleSwitch checked={b.isActive} onChange={() => handleToggleStatus(b)} />
              </div>
            )
          }
        ]}
        data={filteredBrands}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}