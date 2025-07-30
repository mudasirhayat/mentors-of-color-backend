import { createBrowserRouter } from 'react-router-dom';

// project import
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import SimpleLayout from 'layout/Simple';
import { SimpleLayoutType } from 'config';
import GuestGuard from 'utils/route-guard/GuestGuard';


// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/',
      // element: <SimpleLayout layout={SimpleLayoutType.SIMPLE} />,
      element: <GuestGuard />
      // children: [
      //   {
      //     index: true,
      //     element: <AuthLogin />
      //   }
      // ]
    },
    LoginRoutes,
    MainRoutes
  ],
  { basename: process.env.REACT_APP_BASE_NAME }
);

export default router;
