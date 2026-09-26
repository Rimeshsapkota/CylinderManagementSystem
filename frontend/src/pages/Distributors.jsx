import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  name: "",
  proprietorName: "",
  phone: "",
  location: { district: "", municipality: "", ward: "" },
  contact: "",
};

export default function Distributors() {
  const [distributors, setDistributors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const fetchDistributors = async () => {
    const res = await api.get("/distributors");
    setDistributors(res.data);
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      const res = await api.get("/distributors");
      if (!ignore) setDistributors(res.data);
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLocationChange = (e) => {
    setForm({
      ...form,
      location: { ...form.location, [e.target.name]: e.target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/distributors/${editingId}`, form);
      } else {
        await api.post("/distributors", form);
      }
      setForm(initialForm);
      setEditingId(null);
      fetchDistributors();
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  const handleEdit = (d) => {
    setForm({
      name: d.name,
      proprietorName: d.proprietorName || "",
      phone: d.phone || "",
      location: {
        district: d.location?.district || "",
        municipality: d.location?.municipality || "",
        ward: d.location?.ward || ""
      },
      contact: d.contact || ""
    });
    setEditingId(d._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this distributor?")) return;
    await api.delete(`/distributors/${id}`);
    fetchDistributors();
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Distributor Management</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-3 mb-5 align-items-end"
      >
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Name</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Proprietor Name</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="proprietorName"
            value={form.proprietorName}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Phone</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">District</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="district"
            value={form.location.district}
            onChange={handleLocationChange}
            required
          />
        </div>
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Municipality</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="municipality"
            value={form.location.municipality}
            onChange={handleLocationChange}
          />
        </div>
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Ward</label>
          <input
            className="p-2 border-1 border-round surface-border"
            style={{ width: "70px" }}
            type="text"
            name="ward"
            value={form.location.ward}
            onChange={handleLocationChange}
          />
        </div>
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Contact</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="contact"
            value={form.contact}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="p-2 px-3 border-round text-white border-none cursor-pointer"
          style={{ background: "#3b82f6" }}
        >
          {editingId ? "Update" : "Add"} Distributor
        </button>
        {editingId && (
          <button
            type="button"
            className="p-2 px-3 border-round cursor-pointer"
            onClick={() => {
              setEditingId(null);
              setForm(initialForm);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-bottom-2 surface-border">
            <th className="p-2">Name</th>
            <th className="p-2">District</th>
            <th className="p-2">Municipality</th>
            <th className="p-2">Ward</th>
            <th className="p-2">Contact</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
  {distributors.map((d) => (
    <tr key={d._id} className="border-bottom-1 surface-border">
      <td className="p-2">{d.name}</td>
      <td className="p-2">{d.location?.district}</td>
      <td className="p-2">{d.location?.municipality}</td>
      <td className="p-2">{d.location?.ward}</td>
      <td className="p-2">{d.contact}</td>
      <td className="p-2 flex gap-2">
        <button
          className="p-2 border-round border-none text-white cursor-pointer flex align-items-center justify-content-center"
          style={{ background: "#3b82f6", width: "36px", height: "36px" }}
          onClick={() => handleEdit(d)}
          title="Edit"
        >
          <i className="pi pi-pencil"></i>
        </button>
        <button
          className="p-2 border-round border-none text-white cursor-pointer flex align-items-center justify-content-center"
          style={{ background: "#ef4444", width: "36px", height: "36px" }}
          onClick={() => handleDelete(d._id)}
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
