import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeft, FaFileAudio, FaFilePdf, FaDownload, FaTimes } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import resourcesService from '../../services/resourcesService';
import { showToast } from '../../components/Toast';
import OnsitePdfViewer from '../../components/OnsitePdfViewer';

const ResourceDetails = () => {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewingPdf, setViewingPdf] = useState(null);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const data = await resourcesService.getById(id);
        setResource(data);
      } catch (error) {
        console.error('Error fetching resource:', error);
        setResource(null);
        showToast('Failed to load this resource', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchResource();
  }, [id]);

  const openPdfViewer = (file) => {
    setViewingPdf({
      name: file.name,
      src: resourcesService.getPdfViewerUrl(file),
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading resource...</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center px-4">
        <p className="text-gray-600 dark:text-gray-300 mb-4">This resource folder was not found.</p>
        <Link to="/resources" className="text-[#BC3612] dark:text-[#F47930] font-semibold">
          Back to Resources
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{resource.title} | Resources | Chinmaya Mission Vasai</title>
        <meta name="description" content={resource.description || `Study files for ${resource.title}`} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-10 max-w-5xl">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-[#BC3612] dark:text-[#F47930] font-semibold mb-6"
          >
            <FaArrowLeft /> All Resources
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {resource.title}
          </h1>
          {resource.description && (
            <p className="text-gray-600 dark:text-gray-300 mb-8">{resource.description}</p>
          )}

          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
              <FaFileAudio className="text-[#BC3612] dark:text-[#F47930]" /> Audio
            </h2>
            {resource.audioFiles?.length ? (
              <div className="space-y-4">
                {resource.audioFiles.map((file) => (
                  <div key={file._id || file.url} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="font-medium text-gray-900 dark:text-white mb-3">{file.name}</p>
                    <audio controls preload="metadata" className="w-full">
                      <source src={file.url} />
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No audio files in this folder.</p>
            )}
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 inline-flex items-center gap-2">
              <FaFilePdf className="text-[#BC3612] dark:text-[#F47930]" /> PDFs
            </h2>
            {resource.pdfFiles?.length ? (
              <div className="space-y-3">
                {resource.pdfFiles.map((file) => (
                  <div
                    key={file._id || file.url}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                  >
                    <p className="font-medium text-gray-900 dark:text-white">{file.name}</p>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => openPdfViewer(file)}
                        className="inline-flex items-center px-4 py-2 bg-[#BC3612] dark:bg-[#F47930] text-white text-sm font-medium rounded-lg hover:opacity-90"
                      >
                        View PDF
                      </button>
                      <a
                        href={resourcesService.getPdfViewerUrl(file, { download: true })}
                        download={file.name}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-lg text-gray-800 dark:text-white"
                      >
                        <FaDownload /> Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No PDF files in this folder.</p>
            )}

            {viewingPdf && (
              <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white truncate">{viewingPdf.name}</p>
                  <button
                    type="button"
                    onClick={() => setViewingPdf(null)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                    aria-label="Close PDF viewer"
                  >
                    <FaTimes /> Close
                  </button>
                </div>
                <div className="max-h-[80vh] overflow-y-auto">
                  <OnsitePdfViewer src={viewingPdf.src} title={viewingPdf.name} />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
};

export default ResourceDetails;
