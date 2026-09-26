import { useEffect, useState } from "react";
import api from "../services/api";

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
  const [cylinderType, setCylinderType] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [form, setForm] = useState(initialForm);

  const fetchImports = async () => {
    const res = await api.get("/imports");
    setImports(res.data);
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      const [impRes, brandRes, typeRes, distRes] = await Promise.all([
        api.get("/imports"),
        api.get("/brands"),
        api.get("/cylinder-types"),
        api.get("/distributors")
      ]);
      if (!ignore) {
        setImports(impRes.data);
        setBrands(brandRes.data);
        setCylinderType(typeRes.data);
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
      await api.post("/imports", form);
      setForm(initialForm);
      fetchImports();
    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Import Management</h2>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-5 align-items-end">
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
              <option key={b._id} value={b._id}>{b.name}</option>
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
            {cylinderType.map((t) => (
              <option key={t._id} value={t._id}>{t.size}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Destination Distributor</label>
          <select
            className="p-2 border-1 border-round surface-border"
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
          <label className="text-sm font-medium">Source Location</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="sourceLocation"
            placeholder="e.g. Raxaul Border"
            value={form.sourceLocation}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Import Date</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="date"
            name="importDate"
            value={form.importDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Vehicle No.</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="vehicleNumber"
            value={form.vehicleNumber}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-column gap-1">
          <label className="text-sm font-medium">Invoice No.</label>
          <input
            className="p-2 border-1 border-round surface-border"
            type="text"
            name="invoiceNumber"
            value={form.invoiceNumber}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="p-2 px-3 border-round text-white border-none cursor-pointer"
          style={{ background: "#3b82f6" }}
        >
          Add Import
        </button>
      </form>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-bottom-2 surface-border">
            <th className="p-2">Date</th>
            <th className="p-2">Brand</th>
            <th className="p-2">Type</th>
            <th className="p-2">Distributor</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Source</th>
            <th className="p-2">Vehicle</th>
            <th className="p-2">Invoice</th>
          </tr>
        </thead>
        <tbody>
          {imports.map((imp) => (
            <tr key={imp._id} className="border-bottom-1 surface-border">
              <td className="p-2">{new Date(imp.importDate).toLocaleDateString()}</td>
              <td className="p-2">{imp.brand?.name || brands.find(b => b._id === imp.brand)?.name}</td>
              <td className="p-2">
           {imp.cylinderType?.size || cylinderType.find(t => t._id === imp.cylinderType)?.size}
          {imp.cylinderType?.unit || cylinderType.find(t => t._id === imp.cylinderType)?.unit}
</td>
              <td className="p-2">{imp.destinationDistributor?.name || distributors.find(d => d._id === imp.destinationDistributor)?.name}</td>
              <td className="p-2">{imp.quantity}</td>
              <td className="p-2">{imp.sourceLocation}</td>
              <td className="p-2">{imp.vehicleNumber}</td>
              <td className="p-2">{imp.invoiceNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}