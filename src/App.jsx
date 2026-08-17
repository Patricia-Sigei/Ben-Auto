import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";

import Home from "./pages/Home";
import Cars from "./pages/Cars";
import CarDetails from "./pages/CarDetails";
import Consultation from "./pages/Consultation";
import Import from "./pages/Import";
import NotFound from "./pages/NotFound";
import { Reviews, News, Lifestyle, Travel, About, Contact, SellTradeIn } from "./pages/ContentPages";

import AdminLogin from "./pages/Admin/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import VehicleForm from "./pages/Admin/VehicleForm";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:slug" element={<CarDetails />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/import" element={<Import />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/news" element={<News />} />
          <Route path="/lifestyle" element={<Lifestyle />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sell-trade-in" element={<SellTradeIn />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/vehicles/new" element={<ProtectedRoute><VehicleForm /></ProtectedRoute>} />
          <Route path="/admin/vehicles/:id/edit" element={<ProtectedRoute><VehicleForm /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </AuthProvider>
  );
}
