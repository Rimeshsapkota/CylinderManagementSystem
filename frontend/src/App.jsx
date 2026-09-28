import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./component/Layout";
import ProtectedRoute from "./component/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
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

          <Route path="/login" element={<Login />} />

          <Route
            path="/brands"
            element={
              <ProtectedRoute>
                <Brand />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cylinder-types"
            element={
              <ProtectedRoute>
                <CylinderTypes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/distributors"
            element={
              <ProtectedRoute>
                <Distributors />
              </ProtectedRoute>
            }
          />

          <Route
            path="/imports"
            element={
              <ProtectedRoute>
                <Imports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock"
            element={
              <ProtectedRoute>
                <Stock />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;