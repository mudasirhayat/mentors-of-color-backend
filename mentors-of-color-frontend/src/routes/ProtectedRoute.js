import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';
import useAuth from 'hooks/useAuth';
import { Stack } from '@mui/system';
import CircularWithPath from 'components/@extended/progress/CircularWithPath';
import routePermissions from 'utils/RoutePremission';


const ProtectedRoute = ({ element, path, ...rest }) => {
  const [loading, setLoading] = useState(true)
  const { user } = useAuth();
  const accessibleRoute = routePermissions[user?.user_type]

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading || !user) return <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
    <CircularWithPath />
  </Stack>

  const redirectToPage = () => {

    switch (user?.user_type) {
      case "account_user":
        return <Navigate to="/users" replace={true} />
      case "mentee":
      case "moderator":
      case "mentor":
        return <Navigate to="/chat" replace={true} />
      default:
        return <></>
    }
  }


  return (
    accessibleRoute?.includes(path) ? (
      <div {...rest}>
        {element}
      </div>
    ) : (
      redirectToPage()
    )
  )
}

export default ProtectedRoute;