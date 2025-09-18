import axios from 'axios';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { scrollToTop } from '../../utils/scrollUtils';

const AdminDashboard = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingCGCC, setIsExportingCGCC] = useState(false);

  async function handleExportClick() {
    try {
      setIsExporting(true);
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/export-user-data`, {
        responseType: 'blob' // Important for handling file downloads
      });
      
      // Create a download link for the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'volunteer-data.csv'); // or .xlsx depending on your backend
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      alert("User data has been exported successfully");
    } catch (error) {
      console.error("Error exporting user data:", error);
      alert("Failed to export user data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleExportCGCCClick() {
    try {
      setIsExportingCGCC(true);
      
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/cgcc2025/export-csv`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cgcc2025-registrations-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      alert("CGCC registrations have been exported successfully");
    } catch (error) {
      console.error("Error exporting CGCC registrations:", error);
      alert("Failed to export CGCC registrations. Please try again.");
    } finally {
      setIsExportingCGCC(false);
    }
  }

  const handleAdminNavClick = () => {
    scrollToTop();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Admin Dashboard</h2>
        <div className="space-y-4 flex flex-col justify-center items-center">
          <Link
            to="/admin/edit-carousel"
            onClick={handleAdminNavClick}
            className="block text-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-full"
          >
            Edit Carousel Images
          </Link>
          <Link
            to="/admin/edit-upcoming-events"
            onClick={handleAdminNavClick}
            className="block text-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-full"
          >
            Edit Upcoming Events
          </Link>
          <Link
            to="/admin/edit-featured-events"
            onClick={handleAdminNavClick}
            className="block text-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-full"
          >
            Edit Featured Events
          </Link>
          <Link
            to="/admin/archived-events"
            onClick={handleAdminNavClick}
            className="block text-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-full"
          >
            Manage Archived Events
          </Link>
          <Link
            to="/admin/donations"
            onClick={handleAdminNavClick}
            className="block text-center bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 w-full"
          >
            Manage Donations
          </Link>
          <Link
            to="/admin/cgcc-registrations"
            onClick={handleAdminNavClick}
            className="block text-center bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 w-full"
          >
            Manage CGCC Registrations
          </Link>
          <button 
            className="block text-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 w-full"
            onClick={handleExportClick}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export User Data"}
          </button>
          <button 
            className="block text-center bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 w-full"
            onClick={handleExportCGCCClick}
            disabled={isExportingCGCC}
          >
            {isExportingCGCC ? "Exporting..." : "Export CGCC Registrations"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;