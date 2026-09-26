import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../component/DataTable";
import Pagination from "../component/Pagination";
import FormModal from "../component/Form/FormModal";
import FormField from "../component/Form/FormField";
import FormActions from "../component/Form/FormActions";

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
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDistributors = async (pageNum = page) => {
    const res = await api.get(`/distributors?page=${pageNum}&limit=10`);
    setDistributors(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      const res = await api.get(`/distributors?page=${page}&limit=10`);
      if (!ignore) {
        setDistributors(res.data.data);
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
      setShowForm(false);
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
        ward: d.location?.ward || "",
      },
      contact: d.contact || "",
    });
    setEditingId(d._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this distributor?")) return;
    await api.delete(`/distributors/${id}`);
    fetchDistributors();
  };

  const handleAddNew = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(initialForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold">Distributor Management</h2>
        {!showForm && (
          <button
            className="p-2 px-3 border-round text-white border-none cursor-pointer flex align-items-center gap-2"
            style={{ background: "#3b82f6" }}
            onClick={handleAddNew}
          >
            <i className="pi pi-plus"></i>
            Add Distributor
          </button>
        )}
      </div>

      {showForm && (
        <FormModal
          title={editingId ? "Edit Distributor" : "New Distributor"}
          onClose={handleCancel}
          onSubmit={handleSubmit}
        >
          <FormField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <FormField
            label="Proprietor Name"
            name="proprietorName"
            value={form.proprietorName}
            onChange={handleChange}
          />
          <FormField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />

          <div className="flex gap-3">
            <FormField
              label="District"
              name="district"
              value={form.location.district}
              onChange={handleLocationChange}
              required
              style={{ flex: 1 }}
            />
            <FormField
              label="Municipality"
              name="municipality"
              value={form.location.municipality}
              onChange={handleLocationChange}
              style={{ flex: 1 }}
            />
            <FormField
              label="Ward"
              name="ward"
              value={form.location.ward}
              onChange={handleLocationChange}
              style={{ width: "80px" }}
            />
          </div>

          <FormField
            label="Contact"
            name="contact"
            value={form.contact}
            onChange={handleChange}
          />

          <FormActions onCancel={handleCancel} isEditing={!!editingId} />
        </FormModal>
      )}
      <DataTable
        columns={[
          { key: "name", label: "Name" },
          { key: "proprietorName", label: "Proprietor" },
          { key: "phone", label: "Phone" },
          {
            key: "district",
            label: "District",
            render: (d) => d.location?.district,
          },
          {
            key: "municipality",
            label: "Municipality",
            render: (d) => d.location?.municipality,
          },
          { key: "ward", label: "Ward", render: (d) => d.location?.ward },
          {
            key: "actions",
            label: "Actions",
            render: (d) => (
              <div className="flex gap-2">
                <button
                  className="border-none bg-transparent cursor-pointer flex align-items-center justify-content-center"
                  style={{
                    color: "#3b82f6",
                    fontSize: "18px",
                    width: "36px",
                    height: "36px",
                  }}
                  onClick={() => handleEdit(d)}
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
                  onClick={() => handleDelete(d._id)}
                  title="Delete"
                >
                  <i className="pi pi-trash"></i>
                </button>
              </div>
            ),
          },
        ]}
        data={distributors}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
