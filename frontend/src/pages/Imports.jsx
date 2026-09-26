import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../component/DataTable";
import Pagination from "../component/Pagination";
import FormModal from "../component/Form/FormModal";
import FormField from "../component/Form/FormField";
import FormActions from "../component/Form/FormActions";

const initialForm = {
  brand: "",
  cylinderType: "",
  quantity: "",
  sourceLocation: "",
  destinationDistributor: "",
  importDate: "",
  vehicleNumber: "",
  invoiceNumber: ""
};

export default function Imports() {
  const [imports, setImports] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cylinderTypes, setCylinderTypes] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchImports = async (pageNum = page) => {
    const res = await api.get(`/imports?page=${pageNum}&limit=10`);
    setImports(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      const res = await api.get(`/imports?page=${page}&limit=10`);
      if (!ignore) {
        setImports(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [page]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      const [brandRes, typeRes, distRes] = await Promise.all([
        api.get("/brands?limit=1000"),
        api.get("/cylinder-types?limit=1000"),
        api.get("/distributors?limit=1000")
      ]);
      if (!ignore) {
        setBrands(brandRes.data.data || []);
        setCylinderTypes(typeRes.data.data || []);
        setDistributors(distRes.data.data || []);
      }
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
        await api.put(`/imports/${editingId}`, form);
      } else {
        await api.post("/imports", form);
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      fetchImports();
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
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

  const handleEdit = (imp) => {
    setForm({
      brand: imp.brand?._id || "",
      cylinderType: imp.cylinderType?._id || "",
      quantity: imp.quantity,
      sourceLocation: imp.sourceLocation,
      destinationDistributor: imp.destinationDistributor?._id || "",
      importDate: imp.importDate?.split("T")[0] || "",
      vehicleNumber: imp.vehicleNumber || "",
      invoiceNumber: imp.invoiceNumber || ""
    });
    setEditingId(imp._id);
    setShowForm(true);
  };

  const filteredImports = imports.filter((imp) => {
    const q = search.toLowerCase();
    return (
      imp.brand?.name?.toLowerCase().includes(q) ||
      imp.destinationDistributor?.name?.toLowerCase().includes(q) ||
      imp.sourceLocation?.toLowerCase().includes(q) ||
      imp.vehicleNumber?.toLowerCase().includes(q) ||
      imp.invoiceNumber?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold">Import Management</h2>
        <button
          className="p-2 px-3 border-round text-white border-none cursor-pointer flex align-items-center gap-2"
          style={{ background: "#3b82f6" }}
          onClick={handleAddNew}
        >
          <i className="pi pi-plus"></i>
          Add Import
        </button>
      </div>

      <div
        className="p-3 border-round mb-4 flex flex-wrap gap-3 align-items-end"
        style={{ background: "#f1f5f9" }}
      >
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Search</label>
          <input
            className="p-2 border-1 border-round surface-border"
            style={{ width: "260px" }}
            placeholder="Search brand, distributor, source, vehicle, invoice..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {search && (
          <button
            className="p-2 px-3 border-round cursor-pointer"
            onClick={() => setSearch("")}
          >
            Clear
          </button>
        )}
      </div>

      {showForm && (
        <FormModal
          title={editingId ? "Edit Import" : "New Import"}
          onClose={handleCancel}
          onSubmit={handleSubmit}
        >
          <div className="flex gap-3">
            <div className="flex flex-column gap-1 flex-1">
              <label className="text-sm font-medium">Brand</label>
              <select
                className="p-2 border-1 border-round surface-border w-full"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                required
              >
                <option value="">Select Brand</option>
                {brands.filter(b => b.isActive).map((b) => (
                  <option key={b._id} value={b._id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-column gap-1 flex-1">
              <label className="text-sm font-medium">Cylinder Type</label>
              <select
                className="p-2 border-1 border-round surface-border w-full"
                name="cylinderType"
                value={form.cylinderType}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                {cylinderTypes.map((t) => (
                  <option key={t._id} value={t._id}>{t.size}{t.unit}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium">Destination Distributor</label>
            <select
              className="p-2 border-1 border-round surface-border w-full"
              name="destinationDistributor"
              value={form.destinationDistributor}
              onChange={handleChange}
              required
            >
              <option value="">Select Distributor</option>
              {distributors.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <FormField label="Quantity" type="number" name="quantity" value={form.quantity} onChange={handleChange} required style={{ width: "120px" }} />
            <FormField label="Import Date" type="date" name="importDate" value={form.importDate} onChange={handleChange} required style={{ flex: 1 }} />
          </div>

          <FormField label="Source Location" name="sourceLocation" placeholder="e.g. Raxaul Border" value={form.sourceLocation} onChange={handleChange} required />

          <div className="flex gap-3">
            <FormField label="Vehicle No." name="vehicleNumber" value={form.vehicleNumber} onChange={handleChange} style={{ flex: 1 }} />
            <FormField label="Invoice No." name="invoiceNumber" value={form.invoiceNumber} onChange={handleChange} style={{ flex: 1 }} />
          </div>

          <FormActions onCancel={handleCancel} isEditing={!!editingId} />
        </FormModal>
      )}

      <DataTable
        columns={[
          { key: "date", label: "Date", render: (imp) => new Date(imp.importDate).toLocaleDateString() },
          { key: "brand", label: "Brand", render: (imp) => imp.brand?.name },
          { key: "type", label: "Type", render: (imp) => `${imp.cylinderType?.size || ""}${imp.cylinderType?.unit || ""}` },
          { key: "distributor", label: "Distributor", render: (imp) => imp.destinationDistributor?.name },
          { key: "quantity", label: "Qty" },
          { key: "sourceLocation", label: "Source" },
          { key: "vehicleNumber", label: "Vehicle" },
          { key: "invoiceNumber", label: "Invoice" },
          {
            key: "actions",
            label: "Actions",
            render: (imp) => (
              <button
                className="border-none bg-transparent cursor-pointer flex align-items-center justify-content-center"
                style={{ color: "#3b82f6", fontSize: "18px", width: "36px", height: "36px" }}
                onClick={() => handleEdit(imp)}
                title="Edit"
              >
                <i className="pi pi-pencil"></i>
              </button>
            )
          },
        ]}
        data={filteredImports}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}