import React, { useState, useEffect } from 'react'
import { Outlet, useNavigate, redirect } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import util from '../util';
import { setToken } from './reducers/authSlice';
import { useLazyCurrentUserQuery } from './reducers/apireducers';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Rootlayout() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [showHome, setShowHome] = useState(false);
	const sendNotif = useSelector(state => state.notif.sendNotif);
	const [getUser] = useLazyCurrentUserQuery();
	useEffect(() => {
    if(sendNotif.context === 'success') {
      toast.success(sendNotif.text, {
        position: "top-center"
      });
    }
    if(sendNotif.context === 'danger') {
      toast.error(sendNotif.text, {
        position: "top-center"
      }); 
    }
	}, [sendNotif.text])
	useEffect(() => {
		// see if cookie token exists. if it does, try to login with token. if fail, delete token from auth slice.
	  // outlet will render all routes, default route is home, which will check if a token exists in redux, if not, will navigate to login., null.
		// get cookie token once. Later on if expires and causes unauthorized error, redirect to login page through reusable error handler.
		const cookietoken = util.getCookie('authtntoken');
		if (cookietoken) {
			dispatch(setToken(cookietoken));
			getUser().unwrap().catch(rejected => {
				dispatch(setToken(null));
			});
		};
		setShowHome(true);
	}, []); 
	//render home screen only if token is found.
	return (
		<>
			{showHome ? <Outlet /> : null}
			<ToastContainer
				position="top-center"
				autoClose={sendNotif?.msToClose}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
		</>
	)
}