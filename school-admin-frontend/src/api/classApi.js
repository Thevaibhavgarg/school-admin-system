import api from './axios'

export const getClasses = () => api.get('/students/classes')
export const addClass = (data) => api.post('/students/classes', data)
export const updateClass = (id, data) => api.put(`/students/classes/${id}`, data)
export const deleteClass = (id) => api.delete(`/students/classes/${id}`)
