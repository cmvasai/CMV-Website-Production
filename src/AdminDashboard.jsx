import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Admin Dashboard</h2>
        <div className="space-y-4">
          <Link to="/admin/edit-carousel" className="block text-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            Edit Carousel Images
          </Link>
          <Link to="/admin/edit-upcoming-events" className="block text-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            Edit Upcoming Events
          </Link>
          <Link to="/admin/edit-featured-events" className="block text-center bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">
            Edit Featured Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;