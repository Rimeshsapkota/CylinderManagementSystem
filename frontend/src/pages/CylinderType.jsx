import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../component/DataTable";
import Pagination from "../component/Pagination";

export default function CylinderTypes() {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ size: "", unit: "kg" });
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTypes = async (pageNum = page) => {
    const res = await api.get(`/cylinder-types?page=${pageNum}&limit=10`);
    setTypes(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      const res = await api.get(`/cylinder-types?page=${page}&limit=10`);
      if (!ignore) {
        setTypes(res.data.data);
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
        await api.put(`/cylinder-types/${editingId}`, form);
      } else {
        await api.post("/cylinder-types", form);
      }
      setForm({ size: "", unit: "kg" });
      setEditingId(null);
      fetchTypes();
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleEdit = (type) => {
    setForm({ size: type.size, unit: type.unit });
    setEditingId(type._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this cylinder type?")) return;
    await api.delete(`/cylinder-types/${id}`);
    fetchTypes();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Cylinder Type Management</h2>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-5 align-items-end">
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Size</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="size"
            placeholder="e.g. 14.2kg"
            value={form.size}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Unit</label>
          <input
            className="p-2 border-1 border-round surface-border"
            style={{ width: "80px" }}
            type="text"
            name="unit"
            value={form.unit}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="p-2 px-3 border-round text-white border-none cursor-pointer"
          style={{ background: "#3b82f6" }}
        >
          {editingId ? "Update" : "Add"} Type
        </button>
        {editingId && (
          <button
            type="button"
            className="p-2 px-3 border-round cursor-pointer"
            onClick={() => {
              setEditingId(null);
              setForm({ size: "", unit: "kg" });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <DataTable
        columns={[
          { key: "size", label: "Size" },
          { key: "unit", label: "Unit" },
          {
            key: "actions",
            label: "Actions",
            render: (t) => (
              <div className="flex gap-2">
                <button
                  className="border-none bg-transparent cursor-pointer flex align-items-center justify-content-center"
                  style={{
                    color: "#3b82f6",
                    fontSize: "18px",
                    width: "36px",
                    height: "36px",
                  }}
                  onClick={() => handleEdit(t)}
                  title="Edit"
                >
                  <i className="pi pi-pencil"></i>
                </button>
                <button
                  className="border-none bg-transparent cursor-pointer flex align-items-center justify-content-center"
                  style={{
                    color: "#ef4444",
                    fontSize: "18px",
                    width: "36px",
                    height: "36px",
                  }}
                  onClick={() => handleDelete(t._id)}
                  title="Delete"
                >
                  <i className="pi pi-trash"></i>
                </button>
              </div>
            ),
          },
        ]}
        data={types}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
