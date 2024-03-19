import React, { useState, useEffect, useCallback, useRef } from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { useSharePostMutation } from '../../routes/reducers/apireducers';
import './DialogModal.scss'

export default function DialogModal(props) {
	const [shareNotes, setShareNotes] = useState('');
	const [openModal, setOpenModal] = useState(false);
	const [sendSharePost, { isLoading }] = useSharePostMutation();
	useEffect(() => {
		setOpenModal(props.open);
	}, [props.open])

	return (
		<Dialog
			className="shared-modal"
			open={openModal}
			onClose={props.onClose}
		  sx={{
		    '& .MuiDialog-paper': {
		      borderRadius: '1px',
		      height: '250px',
		      width: '550px',
		      display: 'flex',
		      alignItems: 'center',
		      border: '2px solid purple',
		    },
		  }}
		 >
			<textarea name="sharenotes" type="textarea" className="notes" value={shareNotes} onChange={(e) => setShareNotes(e.target.value)} maxLength="250" placeholder="Why do you wish to share this match?: "/>
			<div className="footerbuttons"><button className="shareMatch" disabled={isLoading} onClick={() => {setOpenModal(false); sendSharePost({ ...props.mediaShareInfo, notes: shareNotes })}}>Share</button><button className="shareMatch cancel" onClick={() => setOpenModal(false)}>Cancel</button></div>
		</Dialog>
	)
}