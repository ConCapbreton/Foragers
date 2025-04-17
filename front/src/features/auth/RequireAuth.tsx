import { useState, useEffect } from 'react'
import { useNavigate, Outlet} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentToken, setCredentials } from './authSlice'
import { useRefreshQuery } from '../../app/api/authApiSlice'
import LoadingSpinner from '../../components/loadingspinner/LoadingSpinner'

const RequireAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(selectCurrentToken)
  const [authChecked, setAuthChecked] = useState(false)

  const { 
    data,  
    isSuccess,
    isError, 
  }  = useRefreshQuery(undefined, { 
    skip: !!token
  })

  useEffect(() => {    
    if (isSuccess && data?.success) {
      dispatch(setCredentials({accessToken: data.accessToken, user: data.user }))
    }
    if (isError) {
      setAuthChecked(true)
    }
  }, [data, isSuccess, isError, dispatch])
  
  useEffect(() => {
    if (token) {
      setAuthChecked(true)
    }
  }, [token])

  useEffect(() => {
    if (authChecked && !token) {
      navigate('/you-need-to-login'); 
    }
  }, [authChecked, token, navigate]);

  if (!authChecked && !token) {
    return <div className="page homepage">
      <LoadingSpinner />
    </div>
  }
  
  if (token) {
    return <Outlet />  
  }

  return null
}

export default RequireAuth