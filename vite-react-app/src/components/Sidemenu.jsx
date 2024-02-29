import React, { useState, useEffect } from 'react';
import './sidemenu.css'

export default function Sidemenu() {
	const [toggled, setToggled] = useState(false);
	return (
		<div id="wrapper" className={toggled ? 'toggled' : ''}>
		  <nav className="navbar" id="sidebar-wrapper" role="navigation">
		    <ul className="nav sidebar-nav">
		    	<li className="sidebar-name">
		    		<a href="#">
		          Star Nest
		        </a>
		      </li>
		      <li className="sidebar-brand">
		      </li>
		      <li>
		        <a href="#">Profile</a>
		      </li>
		      <li>
		        <a href="#">Users List</a>
		      </li>
		      <li>
		        <a href="#">Shared Posts</a>
		      </li>
		      <li>
		      	<a href="#">Log out</a>
		      </li>
		    </ul>
		  </nav>
	    <button type="button" className={`hamburger ${toggled ? 'is-open' : 'is-closed'}`} data-toggle="offcanvas" onClick={() => {
	    	setToggled(!toggled)
	    }}>
	      <span className="hamb-top"></span>
	      <span className="hamb-middle"></span>
	      <span className="hamb-bottom"></span>
	    </button>
		</div>
	)
}