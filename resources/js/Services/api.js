import axios from './axios';

export const api = {
    // Stats
    getStats: () => axios.get('/stats'),
    
    // Documents
    getDocuments: (params = {}) => axios.get('/documents', { params }),
    getDocument: (id) => axios.get(`/documents/${id}`),
    createDocument: (data) => axios.post('/documents', data),
    updateDocument: (id, data) => axios.put(`/documents/${id}`, data),
    deleteDocument: (id) => axios.delete(`/documents/${id}`),
    downloadDocument: (id) => axios.get(`/documents/${id}/download`),
    
    // Catégories
    getCategories: () => axios.get('/categories'),
    createCategory: (data) => axios.post('/categories', data),
    updateCategory: (id, data) => axios.put(`/categories/${id}`, data),
    deleteCategory: (id) => axios.delete(`/categories/${id}`),
    
    // Tags
    getTags: () => axios.get('/tags'),
    getPopularTags: () => axios.get('/popular-tags'),
    createTag: (data) => axios.post('/tags', data),
    updateTag: (id, data) => axios.put(`/tags/${id}`, data),
    deleteTag: (id) => axios.delete(`/tags/${id}`),
};

export default api;