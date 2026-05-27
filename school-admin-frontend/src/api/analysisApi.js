import api from './axios'

export const getAcademicAnalysis = (year) => api.get(`/analysis/academic?academicYear=${year}`)
export const getFinancialAnalysis = (year) => api.get(`/analysis/financial?academicYear=${year}`)
export const getDashboardSummary = (year) => api.get(`/analysis/dashboard?academicYear=${year}`)
