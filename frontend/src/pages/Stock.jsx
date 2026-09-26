import { useEffect, useState } from "react";
import api from "../services/api";

const initialForm = {
  distributor: "",
  brand: "",
  cylinderType: "",
  type: "SALE",
  quantity: "",
  date: "",
  remarks: "",
};

export default function Stock() {
  const [transactions, setTransactions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cylinderTypes, setCylinderTypes] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [form, setForm] = useState(initialForm);

  const fetchTransactions = async () => {
    const res = await api.get("/stock-transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      const [txnRes, brandRes, typeRes, distRes] = await Promise.all([
        api.get("/stock-transactions"),
        api.get("/brands"),
        api.get("/cylinder-types"),
        api.get("/distributors"),
      ]);
      if (!ignore) {
        setTransactions(txnRes.data);
        setBrands(brandRes.data);
        setCylinderTypes(typeRes.data);
        setDistributors(distRes.data);
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
      await api.post("/stock-transactions", form);
      setForm(initialForm);
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Stock Transactions</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap gap-3 mb-5 align-items-end"
      >
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Type</label>
          <select
            className="p-2 border-1 border-round surface-border"
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
            className="p-2 border-1 border-round surface-border"
            name="distributor"
            value={form.distributor}
            onChange={handleChange}
            required
          >
            <option value="">Select Distributor</option>
            {distributors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Brand</label>
          <select
            className="p-2 border-1 border-round surface-border"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            required
          >
            <option value="">Select Brand</option>
            {brands.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Cylinder Type</label>
          <select
            className="p-2 border-1 border-round surface-border"
            name="cylinderType"
            value={form.cylinderType}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            {cylinderTypes.map((t) => (
              <option key={t._id} value={t._id}>
                {t.size}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Quantity</label>
          <input
            className="p-2 border-1 border-round surface-border"
            style={{ width: "100px" }}
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Date</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Remarks</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="remarks"
            placeholder="e.g. Sales Plan 6.7"
            value={form.remarks}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="p-2 px-3 border-round text-white border-none cursor-pointer"
          style={{ background: "#3b82f6" }}
        >
          Add Transaction
        </button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-bottom-2 surface-border">
            <th className="p-2">Date</th>
            <th className="p-2">Type</th>
            <th className="p-2">Distributor</th>
            <th className="p-2">Brand</th>
            <th className="p-2">Cylinder Type</th>
            <th className="p-2">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id} className="border-bottom-1 surface-border">
              <td className="p-2">{new Date(t.date).toLocaleDateString()}</td>
              <td className="p-2">{t.type}</td>
              <td className="p-2">{t.distributor?.name}</td>
              <td className="p-2">{t.brand?.name}</td>
              <td className="p-2">{t.cylinderType?.size}</td>
              <td className="p-2">{t.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
