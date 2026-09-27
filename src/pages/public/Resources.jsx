import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaFolderOpen, FaFileAudio, FaFilePdf } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import resourcesService from '../../services/resourcesService';
import { showToast } from '../../components/Toast';
import { scrollToTop } from '../../utils/scrollUtils';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const data = await resourcesService.getAll({
          ...(searchQuery.trim() && { search: searchQuery.trim() }),
        });
        setResources(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setResources([]);
        showToast('Failed to load resources', 'error');
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchResources, searchQuery ? 300 : 0);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  return (
    <>
      <Helmet>
        <title>Resources | Chinmaya Mission Vasai</title>
        <meta
          name="description"
          content="Listen to audio and download study PDFs from Chinmaya Mission Vasai resource folders."
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Resources
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Study materials, chanting audio, and PDFs organized into folders for easy learning.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search resource folders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#BC3612] dark:focus:ring-[#F47930] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-300">Loading resources...</p>
          ) : resources.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center text-gray-600 dark:text-gray-300">
              <FaFolderOpen className="mx-auto text-5xl mb-4 text-[#BC3612] dark:text-[#F47930]" />
              <p className="text-xl mb-2">No resource folders yet</p>
              <p>Check back soon for study audio and PDFs.</p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              resources.length === 1
                ? 'grid-cols-1 max-w-sm mx-auto'
                : resources.length === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {resources.map((resource) => (
                <Link
                  key={resource._id}
                  to={`/resources/${resource._id}`}
                  onClick={scrollToTop}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center mb-4">
                    <FaFolderOpen className="text-[#BC3612] dark:text-[#F47930] text-xl" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {resource.title}
                  </h2>
                  {resource.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                      {resource.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <FaFileAudio /> {resource.audioCount ?? resource.audioFiles?.length ?? 0} audio
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <FaFilePdf /> {resource.pdfCount ?? resource.pdfFiles?.length ?? 0} PDF
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Resources;
