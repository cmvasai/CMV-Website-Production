import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

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
    const fileBase64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

    const response = await axios.post(
      `${API_BASE_URL}/api/upload-file`,
      {
        fileBase64,
        filename: file.name,
        fileType,
      },
      { timeout: 120000 }
    );

    return {
      name: file.name,
      url: response.data.url,
      publicId: response.data.publicId,
      format: response.data.format,
      bytes: response.data.bytes,
    };
  },
};

export default resourcesService;
