import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons'
import { useRegisterMutation, useLoginMutation } from './reducers/apireducers';
import { setToken } from './reducers/authSlice';
import util from '../util';
import validateFields from '../validateFields.js';

export default function Signup() {
	// include login link.
	// can you access signup page if you're logged in? no, need to log out first, so redirect to home if logged in already, like gmail.
	// input form validation, error under field onBlur.
	// show requirements under each field when clicked on. hide others
	// label clickable to focus field.
	// thumbs up symbol for validation. only if validation error, then put thumbs down. once error is fixed, green thumbs up.
	// indicate caps lock in password field if hidden password.
	// autofocus email field.
	const dispatch = useDispatch();
	const [isAnimate, setIsAnimate] = useState(false);
	const [isPass, setIsPass] = useState(false);
	const navigate = useNavigate();
	const [passValue, setPassValue] = useState('');
	const [emailValue, setEmailValue] = useState('');
	const [displayNameValue, setDisplayNameValue] = useState('');
	const [register, { data: registerData, isLoading, error }] = useRegisterMutation();
	const [login] = useLoginMutation();
	const token = useSelector(state => state.auth.token);
	const [loadingLogin, setLoadingLogin] = useState(false);
	const [fieldErrors, setFieldErrors] = useState({ email:[], display_name:[], password:[] });

	useEffect(() => {
		if (token) {
			navigate('/');
		}
	}, [])

	useEffect(() => {
		if (registerData && registerData._id) {
			setLoadingLogin(true);
			login({ password: passValue, email: emailValue }).unwrap().then((fulfilled) => {
				 dispatch(setToken(fulfilled.accessToken));
				 util.setCookie('authtntoken', fulfilled.accessToken);
				 setTimeout(() => navigate('/'), 5000);
			})
		};
	}, [registerData])
  // need ui validation per field (email, display name, and password) and automatic api validation check.
  // so check ui validation first, then pass it on to api check.
  // onBlur, call validateField.
  // need 'email already exists' and 'dsiplay name already exists'
	const registerDisplay = () => {
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
				    <h1>Create an account <br/>for <br/>StarNest</h1>
				    <div className="login-input-container">
				      <input className="input-content" value={emailValue} onBlur={(e) => checkExistingField(e.target.name, e.target.value)} onChange={(e) => setEmailValue(e.target.value)} type="email" name="email" placeholder="" maxLength="30" required />
				      <label>Email</label>
				    </div>
				    {fieldErrors.email.length > 0 ? <div className="signup-error-alert">
				    	<FontAwesomeIcon icon={faThumbsDown} />
				    	{<strong>{fieldErrors.email}</strong>}
				    </div> : null}
				    <div className="login-input-container">
				      <input className="input-content" value={displayNameValue} onBlur={(e) => checkExistingField(e.target.name, e.target.value)}  onChange={(e) => setDisplayNameValue(e.target.value)} type="text" name="display_name" placeholder="" maxLength="20" required />
				      <label>Display name</label>
				    </div>
				    {fieldErrors.display_name.length > 0 ? <div className="signup-error-alert">
				    	<FontAwesomeIcon icon={faThumbsDown} />
				    	{<strong>{fieldErrors.display_name}</strong>}
				    </div> : null}
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
				      <input value={passValue} onBlur={(e) => checkExistingField(e.target.name, e.target.value)} onChange={(e) => setPassValue(e.target.value)} id="password" className={isAnimate ? 'input-content password': 'input-content'} type={isPass ? 'password' : 'text'} name="password" placeholder="" maxLength="20" required />
				      <label>Password</label>
				    </div>
				    {fieldErrors.password.length > 0 ? <div className="signup-error-alert">
				    	<FontAwesomeIcon icon={faThumbsDown} />
				    {<strong>{fieldErrors.password}</strong>}
				    </div> : null}
				    <div className="login-sub">
				      <div className="remember">
				        <button id="checkbox" type="button">;
				          <i className="iconoir-check" id="checkbox-ico"></i>
				        </button>
				        <p>Remeber me</p>
				      </div>
				      <div>
				        <p>Forgot password?</p>
				      </div>
				    </div>
				    <button className="login-btn" type="submit" onClick={(e) => {e.preventDefault(); register({ display_name: displayNameValue, password: passValue, email: emailValue });}}>
				      <p>Create account</p>
				    </button>
				    <div className="sign-up" onClick={() => navigate('/login')}>
				      <p>Already have an account? <b>Login in here!</b></p>
				    </div>
				  </div>
				</form>
				<div className="wrapper">
				  <div className="slides">
				    <div className="slide">
				    	<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/600px-Instagram_icon.png'/>
				    </div>
				    <div className="slide">
				    	<img src='https://banner2.cleanpng.com/20180513/xie/kisspng-twitch-computer-icons-logo-5af8037d689af0.0981376915262032614285.jpg' />
				    </div>
				    <div className="slide">
				    	<img src='https://upload.wikimedia.org/wikipedia/commons/7/72/YouTube_social_white_square_%282017%29.svg' />
				    </div>
				    <div className="slide">
				    	<img src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/LinkedIn_icon.svg/2048px-LinkedIn_icon.svg.png' />
				    </div>
				    <div className="slide">
				    	<img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBClhhDYCWNDpwnxoarfzFUgzBxQKD8Ky0xdwJ-bc&s' />
				    </div>
				    <div className="slide">
				    	<img src='https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg' />
				    </div>
				  </div>
				</div>
			</div>
			)
		}

	const checkExistingField = async (field, value) => {
		const uicheck = validateFields(field, value);
    const res = await fetch(`${process.env.NODE_ENV === 'production' ? 'https://tweetnest.onrender.com': 'http://localhost:5000'}/api/users/checkExistingField?field=${field}&value=${value}`, {
      headers: {
        "Content-Type": "application/json", //need this or it wont show object props in nodejs console
      },
      method: "GET",
    });
    // returns true or false.
    if (field === 'display_name' || field === 'email') {
	    const apicheckexist = await res.json();
	    if (apicheckexist) {
	    	setFieldErrors({ ...fieldErrors, [field]: uicheck.concat(`${field} already exists`) })
	    } else {
	    	setFieldErrors({ ...fieldErrors, [field]: uicheck })
	    }
	  } else {
	  	setFieldErrors({ ...fieldErrors, [field]: uicheck });
	  }
	}

	return (
		<>{loadingLogin ? 'Succesfully registered, now logging you in 5 ' : <div>{registerDisplay()}</div>}</>
	)
}