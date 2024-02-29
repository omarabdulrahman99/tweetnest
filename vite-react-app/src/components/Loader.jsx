import React from 'react';
import './loader.css';

export default function Loader(props) {
	return (
		<div className="loader-container">
			<div className="loader-title" style={{ fontSize: props.titleFontSize }}>{props.message || 'Gathering your medias' }</div>
			<div className="loader-dots" style={{ width: props.dotsWidth }}></div>
		</div>
	);
}