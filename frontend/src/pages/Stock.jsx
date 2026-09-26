import { useEffect, useState } from "react";
import api from "../services/api";
import DataTable from "../component/DataTable";
import Pagination from "../component/Pagination";
import FormModal from "../component/Form/FormModal";
import FormField from "../component/Form/FormField";
import FormActions from "../component/Form/FormActions";

const initialForm = {
  distributor: "",
  brand: "",
  cylinderType: "",
  type: "SALE",
  quantity: "",
  date: "",
  remarks: ""
};

export default function Stock() {
  const [transactions, setTransactions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cylinderTypes, setCylinderTypes] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (pageNum = page) => {
    const res = await api.get(`/stock-transactions?page=${pageNum}&limit=10`);
    setTransactions(res.data.data);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      const res = await api.get(`/stock-transactions?page=${page}&limit=10`);
      if (!ignore) {
        setTransactions(res.data.data);
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
        await api.put(`/stock-transactions/${editingId}`, form);
      } else {
        await api.post("/stock-transactions", form);
      }
      setForm(initialForm);
      setEditingId(null);
      setShowForm(false);
      fetchTransactions();
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

  const handleEdit = (t) => {
    setForm({
      distributor: t.distributor?._id || "",
      brand: t.brand?._id || "",
      cylinderType: t.cylinderType?._id || "",
      type: t.type,
      quantity: t.quantity,
      date: t.date?.split("T")[0] || "",
      remarks: t.remarks || ""
    });
    setEditingId(t._id);
    setShowForm(true);
  };

  const filteredTransactions = transactions.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.distributor?.name?.toLowerCase().includes(q) ||
      t.brand?.name?.toLowerCase().includes(q) ||
      t.type?.toLowerCase().includes(q) ||
      t.remarks?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold">Stock Transactions</h2>
        <button
          className="p-2 px-3 border-round text-white border-none cursor-pointer flex align-items-center gap-2"
          style={{ background: "#3b82f6" }}
          onClick={handleAddNew}
        >
          <i className="pi pi-plus"></i>
          Add Transaction
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
            placeholder="Search distributor, brand, type, remarks..."
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
          title={editingId ? "Edit Transaction" : "New Transaction"}
          onClose={handleCancel}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium">Type</label>
            <select
              className="p-2 border-1 border-round surface-border w-full"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="SALE">Sale</option>
              <option value="RETURN">Return</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </div>

          <div className="flex flex-column gap-1">
            <label className="text-sm font-medium">Distributor</label>
            <select
              className="p-2 border-1 border-round surface-border w-full"
              name="distributor"
              value={form.distributor}
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

          <div className="flex gap-3">
            <FormField label="Quantity" type="number" name="quantity" value={form.quantity} onChange={handleChange} required style={{ width: "120px" }} />
            <FormField label="Date" type="date" name="date" value={form.date} onChange={handleChange} required style={{ flex: 1 }} />
          </div>

          <FormField label="Remarks" name="remarks" placeholder="e.g. Sales Plan 6.7" value={form.remarks} onChange={handleChange} />

          <FormActions onCancel={handleCancel} isEditing={!!editingId} />
        </FormModal>
      )}

      <DataTable
        columns={[
          { key: "date", label: "Date", render: (t) => new Date(t.date).toLocaleDateString() },
          { key: "type", label: "Type" },
          { key: "distributor", label: "Distributor", render: (t) => t.distributor?.name },
          { key: "brand", label: "Brand", render: (t) => t.brand?.name },
          { key: "cylinderType", label: "Type", render: (t) => `${t.cylinderType?.size || ""}${t.cylinderType?.unit || ""}` },
          { key: "quantity", label: "Quantity" },
          { key: "remarks", label: "Remarks" },
          {
            key: "actions",
            label: "Actions",
            render: (t) => (
              <button
                className="border-none bg-transparent cursor-pointer flex align-items-center justify-content-center"
                style={{ color: "#3b82f6", fontSize: "18px", width: "36px", height: "36px" }}
                onClick={() => handleEdit(t)}
                title="Edit"
              >
                <i className="pi pi-pencil"></i>
              </button>
            )
          }
        ]}
        data={filteredTransactions}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}