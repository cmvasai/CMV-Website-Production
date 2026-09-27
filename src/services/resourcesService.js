import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
const CLOUDINARY_CLOUD_NAME = 'dnqi49qyr';
const CLOUDINARY_UPLOAD_PRESET = 'ml_default';

const resourcesService = {
  async getAll(params = {}) {
    const response = await axios.get(`${API_BASE_URL}/api/resources`, { params });
    return response.data;
  },

  async getById(id) {
    const response = await axios.get(`${API_BASE_URL}/api/resources/${id}`);
    return response.data;
  },

  async create(resourceData) {
    const response = await axios.post(`${API_BASE_URL}/api/resources`, resourceData);
    return response.data;
  },

  async update(id, resourceData) {
    const response = await axios.put(`${API_BASE_URL}/api/resources/${id}`, resourceData);
    return response.data;
  },

  async delete(id) {
    const response = await axios.delete(`${API_BASE_URL}/api/resources/${id}`);
    return response.data;
  },

  getPdfViewerUrl(file, { download = false } = {}) {
    const params = new URLSearchParams({
      url: file.url,
      name: file.name || 'resource.pdf',
    });
    if (download) {
      params.set('download', '1');
    }
    return `${API_BASE_URL}/api/resources/view-pdf?${params.toString()}`;
  },

  async uploadFile(file, fileType) {
    const resourceType = fileType === 'audio' ? 'video' : fileType === 'pdf' ? 'raw' : 'auto';
    const publicId = file.name.replace(/\.[^/.]+$/, '').replace(/[^\w-]+/g, '_');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('public_id', publicId);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      formData,
      { timeout: 180000 }
    );

    return {
      name: file.name,
      url: response.data.secure_url,
      publicId: response.data.public_id,
      format: response.data.format,
      bytes: response.data.bytes,
    };
  },
};

export default resourcesService;
