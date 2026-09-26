import { useEffect, useState } from "react";
import api from "../services/api";

export default function CylinderTypes() {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ size: "", unit: "kg" });
  const [editingId, setEditingId] = useState(null);

  const fetchTypes = async () => {
    const res = await api.get("/cylinder-types");
    setTypes(res.data);
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      const res = await api.get("/cylinder-types");
      if (!ignore) setTypes(res.data);
    })();

    return () => {
      ignore = true;
    };
  }, []);

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

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-bottom-2 surface-border">
            <th className="p-2">Size</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
  {types.map((t) => (
    <tr key={t._id} className="border-bottom-1 surface-border">
      <td className="p-2">{t.size}</td>
      <td className="p-2">{t.unit}</td>
      <td className="p-2 flex gap-2">
        <button
          className="p-2 border-round border-none text-white cursor-pointer flex align-items-center justify-content-center"
          style={{ background: "#3b82f6", width: "36px", height: "36px" }}
          onClick={() => handleEdit(t)}
          title="Edit"
        >
          <i className="pi pi-pencil"></i>
        </button>
        <button
          className="p-2 border-round border-none text-white cursor-pointer flex align-items-center justify-content-center"
          style={{ background: "#ef4444", width: "36px", height: "36px" }}
          onClick={() => handleDelete(t._id)}
          title="Delete"
        >
          <i className="pi pi-trash"></i>
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}