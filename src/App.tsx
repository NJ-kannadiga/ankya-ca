import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
// import Clients from "./pages/Clients"
// import Reports from "./pages/Reports"
import Home from "./pages/Home"
import Opex from "./pages/dashboard/Opex"
import Capex from "./pages/dashboard/Capex"
import Adhoc from "./pages/dashboard/Adhoc"
import { Navigate } from "react-router-dom"
import DashboardLayout from "./pages/dashboard/DashboardLayout"
import Overview from "./pages/dashboard/Overview"

function App() {
  return (
   <Routes>
      {/* <Route path="/" element={<Home />} /> */}
   
 <Route path="/" element={<DashboardLayout />}>
        {/* DEFAULT PAGE */}
        <Route index element={<Overview />} />
 {/* <Route path="/dashboard" element={<DashboardLayout />}> */}

        {/* INTERNAL ROUTES */}
        <Route path="dashboard/opex" element={<Opex />} />
        <Route path="dashboard/capex" element={<Capex />} />
        <Route path="dashboard/adhoc" element={<Adhoc />} />
      </Route>

      {/* PLACEHOLDERS */}
      {/* <Route
        path="/cxp-export"
        element={<div className="p-6">CXP Export – Coming Soon</div>}
      />
      <Route
        path="/ocr"
        element={<div className="p-6">OCR – Coming Soon</div>}
      /> */}
    </Routes>
  )
}
export default App