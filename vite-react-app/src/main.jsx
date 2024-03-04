import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Home, { loader as homeLoader } from './routes/Home';
import Rootlayout from './routes/Rootlayout';
import Login from './routes/Login';
import SignUp from './routes/Signup';
import SharedPosts from './routes/SharedPosts';
import Profile from './routes/Profile';
import Medias from './routes/Medias';
import UsersList from './routes/UsersList';
import { store } from './routes/reducers/store';
import { Provider } from 'react-redux';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Rootlayout />, //shared by all separate pages.
    children: [{
      path:"*",
      element: <div>3214d6e9-553a-449d-8639-4d914a367963</div>
      },
      {
      path: "/", //can use same path as rootlayout
      element: <Home />,
      loader: homeLoader,
      children: [{
        path:"/sharedposts",
        element: <SharedPosts />
      },
      {
        path:"/userslist",
        element: <UsersList />
      },
      {
        path:"/profile",
        element: <Profile />
      },
      {
        index: true,
        element: <Medias />
      }
      ]
    },
    {
      path:"/login",
      element: <Login />
    },
    {
      path:"/signup",
      element: <SignUp />
    },
  ]},
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)
