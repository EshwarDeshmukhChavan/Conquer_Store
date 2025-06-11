import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const useRoleRedirect = (user) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (!user) return
    if (user.role === 'admin') navigate('/admin')
    else if (user.role === 'EPP') navigate('/dashboard/epp')
    else if (user.role === 'SPP') navigate('/dashboard/spp')
    else if (user.role === 'SEPP') navigate('/dashboard/sepp')
  }, [user, navigate])
}

export default useRoleRedirect
