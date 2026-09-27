import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFileAudio, FaFilePdf, FaTrash, FaTimes } from 'react-icons/fa';
import resourcesService from '../../services/resourcesService';

const AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/m4a', 'audio/aac', 'audio/ogg', 'audio/webm'];
const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.webm'];
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const isAudioFile = (file) =>
  AUDIO_TYPES.includes(file.type) || AUDIO_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

const isPdfFile = (file) =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

const formatBytes = (bytes) => {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [audioFiles, setAudioFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState('');

  const fetchResources = async () => {
    try {
      setLoading(true);
      const data = await resourcesService.getAll();
      setResources(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load resources');
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const addFiles = (incoming, kind) => {
    const files = Array.from(incoming || []);
    const accepted = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} is larger than 25MB.`);
        return;
      }
      if (kind === 'audio' && !isAudioFile(file)) {
        alert(`${file.name} is not a supported audio file.`);
        return;
      }
      if (kind === 'pdf' && !isPdfFile(file)) {
        alert(`${file.name} is not a PDF.`);
        return;
      }
      accepted.push(file);
    });

    if (kind === 'audio') {
      setAudioFiles((prev) => [...prev, ...accepted]);
    } else {
      setPdfFiles((prev) => [...prev, ...accepted]);
    }
  };

  const removePendingFile = (kind, index) => {
    if (kind === 'audio') {
      setAudioFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setPdfFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setAudioFiles([]);
    setPdfFiles([]);
    setStatus('');
  };

  const handleAddResource = async () => {
    if (!title.trim()) {
      alert('Please enter a folder title, for example "Geeta Chanting Chapter 12".');
      return;
    }
    if (audioFiles.length === 0 && pdfFiles.length === 0) {
      alert('Please add at least one audio or PDF file.');
      return;
    }

    setUploading(true);
    setStatus('Uploading files...');

    try {
      const uploadedAudio = [];
      for (let i = 0; i < audioFiles.length; i += 1) {
        setStatus(`Uploading audio ${i + 1} of ${audioFiles.length}...`);
        uploadedAudio.push(await resourcesService.uploadFile(audioFiles[i], 'audio'));
      }

      const uploadedPdfs = [];
      for (let i = 0; i < pdfFiles.length; i += 1) {
        setStatus(`Uploading PDF ${i + 1} of ${pdfFiles.length}...`);
        uploadedPdfs.push(await resourcesService.uploadFile(pdfFiles[i], 'pdf'));
      }

      setStatus('Saving resource folder...');
      const created = await resourcesService.create({
        title: title.trim(),
        description: description.trim(),
        audioFiles: uploadedAudio,
        pdfFiles: uploadedPdfs,
      });

      setResources((prev) => [created, ...prev]);
      resetForm();
      alert('Resource folder created successfully.');
    } catch (err) {
      console.error('Error creating resource:', err);
      const status = err.response?.status;
      const apiMessage = err.response?.data?.error;
      if (status === 413) {
        alert('The file is too large for the server upload limit. Try a smaller file or refresh after the latest deploy.');
      } else {
        alert(apiMessage || err.message || 'Failed to create resource. Please try again.');
      }
    } finally {
      setUploading(false);
      setStatus('');
    }
  };

  const handleRemoveResource = async (id) => {
    if (!window.confirm('Delete this resource folder and all of its files?')) {
      return;
    }

    try {
      await resourcesService.delete(id);
      setResources((prev) => prev.filter((resource) => resource._id !== id));
    } catch (err) {
      console.error('Error deleting resource:', err);
      alert('Failed to delete resource.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 py-10 px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Add New Resource</h2>
          <Link
            to="/admin/dashboard"
            className="text-sm text-blue-500 hover:underline"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8 space-y-3">
          <input
            type="text"
            placeholder='Folder title, e.g. "Geeta Chanting Chapter 12"'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <textarea
            placeholder="Optional description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span className="block mb-2 font-semibold dark:text-white">Audio files</span>
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.aac,.ogg"
                multiple
                onChange={(e) => {
                  addFiles(e.target.files, 'audio');
                  e.target.value = '';
                }}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <ul className="mt-2 space-y-1">
                {audioFiles.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="flex items-center justify-between text-sm dark:text-gray-200">
                    <span className="truncate mr-2">{file.name}</span>
                    <button type="button" onClick={() => removePendingFile('audio', index)} aria-label={`Remove ${file.name}`}>
                      <FaTimes className="text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            </label>

            <label className="block">
              <span className="block mb-2 font-semibold dark:text-white">PDF files</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                multiple
                onChange={(e) => {
                  addFiles(e.target.files, 'pdf');
                  e.target.value = '';
                }}
                className="w-full p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white"
              />
              <ul className="mt-2 space-y-1">
                {pdfFiles.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="flex items-center justify-between text-sm dark:text-gray-200">
                    <span className="truncate mr-2">{file.name}</span>
                    <button type="button" onClick={() => removePendingFile('pdf', index)} aria-label={`Remove ${file.name}`}>
                      <FaTimes className="text-red-500" />
                    </button>
                  </li>
                ))}
              </ul>
            </label>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supported audio: MP3, WAV, M4A, AAC, OGG. PDFs only. Max 25MB per file.
          </p>

          {status && <p className="text-sm text-[#BC3612] dark:text-[#F47930]">{status}</p>}

          <button
            onClick={handleAddResource}
            disabled={uploading}
            className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : 'Create Resource Folder'}
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4 dark:text-white">Existing Resources</h3>
        {loading ? (
          <p className="text-center dark:text-white">Loading resources...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : resources.length === 0 ? (
          <p className="text-center dark:text-white">No resource folders yet.</p>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <div key={resource._id} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold dark:text-white">{resource.title}</p>
                    {resource.description && (
                      <p className="text-sm dark:text-gray-300 mb-2">{resource.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm dark:text-gray-200">
                      <span className="inline-flex items-center gap-1">
                        <FaFileAudio /> {resource.audioCount ?? resource.audioFiles?.length ?? 0} audio
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <FaFilePdf /> {resource.pdfCount ?? resource.pdfFiles?.length ?? 0} PDF
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveResource(resource._id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageResources;
