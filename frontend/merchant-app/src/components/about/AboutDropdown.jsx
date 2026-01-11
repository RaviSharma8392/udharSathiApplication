import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

function AboutDropdown() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Dropdown Header */}
      <div
        className="bg-white shadow rounded-lg p-4 mb-4 cursor-pointer"
        onClick={() => setOpen(!open)}>
        <h2 className="text-lg font-semibold">About UdhaarSathi ▾</h2>
      </div>

      {/* Dropdown Links */}
      {open && (
        <div className="bg-white shadow rounded-lg p-2 mb-4 space-y-2">
          <Link
            to="terms"
            className="block text-gray-700 hover:text-indigo-600">
            Terms & Conditions
          </Link>
          <Link
            to="privacy"
            className="block text-gray-700 hover:text-indigo-600">
            Privacy Policy
          </Link>
          <Link
            to="company"
            className="block text-gray-700 hover:text-indigo-600">
            About UdhaarSathi
          </Link>
        </div>
      )}

      {/* Page Content */}
      <div className="bg-white p-4 rounded-lg shadow">
        <Outlet />
      </div>
    </div>
  );
}

export default AboutDropdown;
