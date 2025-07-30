import { lazy } from 'react';


import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PagesLayout from 'layout/Pages';
import ProtectedRoute from './ProtectedRoute';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const DashboardAnalytics = Loadable(lazy(() => import('pages/dashboard/analytics')));



// render - applications
const AppChat = Loadable(lazy(() => import('pages/apps/chat')));
const AppSession = Loadable(lazy(() => import('pages/apps/session')));
const AppCustomerList = Loadable(lazy(() => import('pages/apps/customer/list')));
const AppProgramList = Loadable(lazy(() => import('pages/apps/program')));
const AppProgramUserList = Loadable(lazy(() => import('pages/apps/program/users')));

const UserProfileView = Loadable(lazy(() => import('sections/apps/profiles/ViewProfile')));
const UserProfile = Loadable(lazy(() => import('pages/apps/profiles/user')));
const UserProfileEdit = Loadable(lazy(() => import('sections/apps/profiles/EditProfile')));
const UserPasswordEdit = Loadable(lazy(() => import('sections/apps/profiles/TabPassword')));



// pages routing
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));
const AuthRegister = Loadable(lazy(() => import('pages/auth/register')));
const AuthForgotPassword = Loadable(lazy(() => import('pages/auth/forgot-password')));
const AuthResetPassword = Loadable(lazy(() => import('pages/auth/reset-password')));
const AuthCheckMail = Loadable(lazy(() => import('pages/auth/check-mail')));
const AuthCodeVerification = Loadable(lazy(() => import('pages/auth/code-verification')));


// ==============================|| MAIN ROUTING ||============================== //
const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          children: [
            {
              path: 'default',
              element: <DashboardDefault />
            },
            {
              path: 'analytics',
              element: <DashboardAnalytics />
            }
          ]
        },
        {
          path: '/chat',
          element: <ProtectedRoute element={<AppChat />} path="/chat" />
        },
        {
          path: '/chat/login',
          element: <ProtectedRoute element={<AppChat />} path="/chat/login" />
        },
        {
          path: '/sessions',
          element: <ProtectedRoute element={<AppSession />} path="/sessions" />
        },

        {
          path: '/',
          children: [
            {
              path: "users",
              children: [
                {
                  path: '',
                  element: <ProtectedRoute element={<AppCustomerList />} path="/users" />
                }
              ],
            },
            {
              path: "profile",
              children: [
                {
                  path: "view",
                  element: <ProtectedRoute element={<UserProfileView />} path="/profile" />,
                },
                {
                  path: "edit",
                  element: <ProtectedRoute element={<UserProfile />} path="/profile" />,
                  children: [
                    {
                      path: "personal",
                      element: <ProtectedRoute element={<UserProfileEdit />} path="/profile" />,
                    },
                    {
                      path: "password",
                      element: <ProtectedRoute element={<UserPasswordEdit />} path="/profile" />,
                    }
                  ]
                },
              ],
            },
          ]
        },

        {
          path: '/',
          children: [
            {
              path: "/programs",
              element: <ProtectedRoute element={<AppProgramList />} path="/programs" />,
            },
            {
              path: "programs/:id/users",
              element: <ProtectedRoute element={<AppProgramUserList />} path="/programs" />,
            }
          ]
        },
      ],
    },
    {
      path: '/auth',
      element: <PagesLayout />,
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
        {
          path: 'register',
          element: <AuthRegister />
        },
        {
          path: 'forgot-password',
          element: <AuthForgotPassword />
        },
        {
          path: 'reset-password',
          element: <AuthResetPassword />
        },
        {
          path: 'check-mail',
          element: <AuthCheckMail />
        },
        {
          path: 'code-verification',
          element: <AuthCodeVerification />
        }
      ]
    },
  ]

};

export default MainRoutes;