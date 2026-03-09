import { Routes, Route, NavLink } from "react-router-dom";
import { ProviderAvailabilityPage } from "./presentation/pages/provider-availability/ProviderAvailabilityPage";
import { BookingManagementPage } from "./presentation/pages/booking-management/BookingManagementPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menú con fondo y padding */}
      <nav className="bg-blue-100 p-4 shadow-md flex gap-4 mb-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-4 py-2 rounded font-semibold ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-blue-800 hover:bg-blue-200"
            }`
          }
        >
          Availability
        </NavLink>

        <NavLink
          to="/bookings"
          className={({ isActive }) =>
            `px-4 py-2 rounded font-semibold ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-blue-800 hover:bg-blue-200"
            }`
          }
        >
          Bookings
        </NavLink>
      </nav>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow-sm">
        <Routes>
          <Route path="/" element={<ProviderAvailabilityPage />} />
          <Route path="/bookings" element={<BookingManagementPage />} />
        </Routes>
      </div>
    </div>
  );
}