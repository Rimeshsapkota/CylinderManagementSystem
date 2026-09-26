import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./component/Layout";
import Dashboard from "./pages/Dashboard";
import Brand from "./pages/Brand";
import CylinderTypes from "./pages/CylinderType";
import Distributors from "./pages/Distributors";
import Imports from "./pages/Imports";
import Stock from "./pages/Stock";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/brands" element={<Brand />} />
          <Route path="/cylinder-types" element={<CylinderTypes />} />
          <Route path="/distributors" element={<Distributors />} />
          <Route path="/imports" element={<Imports />} />
          <Route path="/stock" element={<Stock />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;