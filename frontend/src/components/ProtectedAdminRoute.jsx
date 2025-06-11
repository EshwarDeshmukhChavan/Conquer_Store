import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedAdminRoute = ({ user, children }) => {
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }
  return children
}

export default ProtectedAdminRoute
