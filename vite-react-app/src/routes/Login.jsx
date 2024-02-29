import React, { useState, useEffect } from 'react';
import { Outlet, redirect, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import util from '../util';
import { useLoginMutation } from './reducers/apireducers';
import { setToken } from './reducers/authSlice';

export default function Login() {
	const [isAnimate, setIsAnimate] = useState(false);
	const [isPass, setIsPass] = useState(false);
	const navigate = useNavigate();
	const [passValue, setPassValue] = useState('');
	const [emailValue, setEmailValue] = useState('');
	const [login, { error }] = useLoginMutation();
	const token = useSelector(state => state.auth.token);
	const dispatch = useDispatch();

	useEffect(() => {
		if (token) {
			navigate('/');
		}
	}, [])

	// login with email/password. call useLoginMutation.
	const logindisplay = () => {
		return (
			<div className="loginlayout">
				<iframe
					className="starnestbackground"
					src="https://streamable.com/e/hbi5w1?autoplay=1&nocontrols=1&muted=1" 
					width="100%" 
					height="100%" 
					frameBorder="0" 
					></iframe>
				<form>
				  <div className="login-form">
				    <h1>Welcome Back <br/>to <br/>StarNest</h1>
				    {(error && error.data && error.data.message) ?
					    <div className="login-error-alert">
					    	<FontAwesomeIcon icon={faThumbsDown} />
					    	{error && <strong>{error.data.message}</strong>}
					    </div> : null
				  	}
				    <div className="login-input-container">
				      <input className="input-content" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} type="email" name="email" placeholder="" maxLength="20" required />
				      <label>Email</label>
				    </div>
				    <div className="login-input-container">
							<div
								className={isAnimate ? 'ripple animate' : 'ripple'} 
								onAnimationEnd={() => setIsAnimate(!isAnimate)}
							></div>
							<div 
								className="toggle"
								onClick={() => {
									setIsAnimate(!isAnimate);
									setIsPass(!isPass);
								}} 
								data-state={isPass ? 'hidden' : 'visible'}
							>
								<svg className="eye" width="32" height="32"><circle cx="16" cy="15" r="3"/><path d="M30 16s-6.268 7-14 7-14-7-14-7 6.268-7 14-7 14 7 14 7zM22.772 10.739a8 8 0 1 1-13.66.189"/></svg>
							</div>
				      <input value={passValue} onChange={(e) => setPassValue(e.target.value)} id="password" className={isAnimate ? 'input-content password': 'input-content'} type={isPass ? 'password' : 'text'} name="password" placeholder="" maxLength="20" required />
				      <label>Password</label>
				    </div>
				    <div className="login-sub">
				      <div className="remember">
				        <button id="checkbox" type="button">;
				          <i className="iconoir-check" id="checkbox-ico"></i>
				        </button>
				        <p>Remember me</p>
				      </div>
				      <div>
				        <p>Forgot password?</p>
				      </div>
				    </div>
				    <button className="login-btn" type="submit" onClick={(e) => {
				    	e.preventDefault();
				    	login({ password: passValue, email: emailValue }).unwrap().then(fulfilled => {
				    		dispatch(setToken(fulfilled.accessToken));
								util.setCookie('authtntoken', fulfilled.accessToken);
								navigate('/');
				    	}).catch(rejected => {
				    	});
				    }}>
				      <p>Log In</p>
				    </button>
				    <div className="sign-up" onClick={() => navigate('/signup')}>
				      <p>Don't have an account? <b>Sign up!</b></p>
				    </div>
				  </div>
				</form>
				<div className="wrapper">
				  <div className="slides">
				    <div className="slide">
				    	<img loading="lazy" src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png'/>
				    </div>
				    <div className="slide">
				    	<img loading="lazy" src='https://banner2.cleanpng.com/20180513/xie/kisspng-twitch-computer-icons-logo-5af8037d689af0.0981376915262032614285.jpg' />
				    </div>
				    <div className="slide">
				    	<img loading="lazy" src='https://upload.wikimedia.org/wikipedia/commons/7/72/YouTube_social_white_square_%282017%29.svg' />
				    </div>
				    <div className="slide">
				    	<img loading="lazy" src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/2048px-LinkedIn_icon.svg.png' />
				    </div>
				    <div className="slide">
				    	<img loading="lazy" src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBClhhDYCWNDpwnxoarfzFUgzBxQKD8Ky0xdwJ-bc&s' />
				    </div>
				    <div className="slide">
				    	<img loading="lazy" src='https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg' />
				    </div>
				  </div>
				</div>
			</div>
		)
	}

	return (
		<div>
			{token ? null : logindisplay()}
		</div>
	)
}
