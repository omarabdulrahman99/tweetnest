import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCirclePlus, faArrowRight, faCircleXmark, faCircleLeft, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useLazyMediasQuery, useAddMediaMutation, useDeleteMediaMutation } from '../routes/reducers/apireducers';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Select from './Select';
import Loader from './Loader';
import './carousel.scss';
//onClick radio button input.
// absolute position remove.
// switch class when selected 'selected'. auto select first one by default.
// show edit icon when hover over already added list items.
// if you click on plus, show empty input. if hit enter, if input has something, call api to search for league user, green arrow hit to call. red X to exit.
// to remove edit mode. green arrow available to be clicked on only if input has something. both icons replaced by loading 
// if no input, return to plus sign.
const initialMediasArrRef = []; // to avoid reinstantiation
const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: '1620px !important',
    border: '1px solid blue',
    fontSize: '15px',
    opacity: 1,
    backgroundColor: 'white',
    zIndex: 20000970987098708908,
  },
}));
export default function Carousel() {
	const [selectedMedia, setSelectedMedia] = useState(1);
	const [editables, setEditables] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false });
	const [getMedias, { data = initialMediasArrRef, isLoading, error, refetch }] = useLazyMediasQuery(); //using 'lazy' wont trigger 'load' if invalidation tag
	const [addMedia, { data: addMediaData = [], isLoading: isAddMediaLoading }] = useAddMediaMutation();
	const [deleteMedia] = useDeleteMediaMutation();
	const [mediaType, setMediaType] = useState('league');
	const [activeMatch, setActiveMatch] = useState(1);
	const [inputValues, setInputValues] = useState({ input1: '', input2: '', input3: '', input4: '', input5: '' });
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [afteredit, setAfterEdit] = useState({ 1: false, 2: false, 3: false, 4: false, 5: false });
	const [toolTipId, setToolTipId] = useState(null);
	useEffect(() => {
		getMedias({ sortBy: 'name', sortOrder: 'asc', media_type: mediaType }).unwrap().then((fulfilled) => {
		});
	}, [])

	useEffect(() => {
		setIsRefreshing(false);
		setAfterEdit({ 1: false, 2: false, 3: false, 4: false, 5: false });
	}, [data]);
	const participantTooltipData = (participant) => (
    <React.Fragment>
      <Typography color="inherit">Tooltip with HTML</Typography>
      <em>{"And here's"}</em> <b>{'some'}</b> <u>{'amazing content'}</u>.{' '}
      {"It's very engaging. Right?"}
    </React.Fragment>
	)
	const checkSelectMedia = (medianame, noMediaClass = '') => {
		const classmedia = selectedMedia === medianame ? `${medianame} selected ${noMediaClass}` : `${medianame} ${noMediaClass}`;
		return classmedia;
	}
	const checkAfterEdit = (deleteindex) => {
		return afteredit[deleteindex] ? ' item isDeleting' : 'item';
	}
  const inputCallback = useCallback(inputElement => {
    if (inputElement) {
      inputElement.focus();
    }
  }, []);
  const rightZoneDisplay = (mediatype = 'league', data) => {
  	let contents = '';
  	switch(mediatype) {
  	case 'league':
  		if (data.matchinfo.length < 1) {
  			return 'No Recent Match Data'
  		}
  		contents = (
  			<div>
  				<h2>{data.matchinfo[activeMatch - 1].gameType.description}</h2>
  				<h3>{data.matchinfo[activeMatch - 1].gameType.map}</h3>
  				<div className="teamstats">
  					<div className="participants1">
  						{data.matchinfo[activeMatch - 1].team1.participants.map(p => 
  							<HtmlTooltip
  								title={
					          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
					          	<p>Champion: {p.championName}</p>
					          	<p>Position: {p.teamPosition}</p>
					          	<p>Vision Score: {p.visionScore}</p>
					          	<p>Turrets taken: {p.turretKills}</p>
					          	<p>Champion kills: {p.kills}</p>
					          	<p>Assists: {p.assists}</p>
					          	<p>Deaths: {p.deaths}</p>
					          	<p>Time spent dead: {p.totalTimeSpentDead}</p>
					          	<p>Time CC dealt to enemy: {p.totalTimeCCDealt}</p>
					          	<p>Minions: {p.totalMinionsKilled}</p>
					          	<p>Damage taken: {p.totalDamageTaken}</p>
					          	<p>Damage dealt to enemy champions: {p.totalDamageDealtToChampions}</p>
					          	<p>Active play time: {p.timePlayed}</p>
					          	<p>Gold earned: {p.goldEarned}</p>
					          </div>
  								}
  								arrow placement="top"
  								open={p.summonerName === toolTipId}>
  								<p className="participantsblue" onMouseLeave={(e) => setToolTipId(null)} onClick={(e) => setToolTipId(e.target.innerText)}>{p.summonerName}</p>
  							</HtmlTooltip>)
  						}
  					</div>
  					<div style={{ color: 'blue', fontWeight: 'bold', textDecoration: 'underline' }}>Team Blue</div>
  					<div></div>
  					<div style={{ color: 'red', fontWeight: 'bold', textDecoration: 'underline' }}>Team Red</div>
  					<div className="participants2">
  						{data.matchinfo[activeMatch - 1].team2.participants.map(p => 
  							<HtmlTooltip
  								title={
					          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr'}}>
					          	<p>Champion: {p.championName}</p>
					          	<p>Position: {p.teamPosition}</p>
					          	<p>Vision Score: {p.visionScore}</p>
					          	<p>Turrets taken: {p.turretKills}</p>
					          	<p>Champion kills: {p.kills}</p>
					          	<p>Assists: {p.assists}</p>
					          	<p>Deaths: {p.deaths}</p>
					          	<p>Time spent dead: {p.totalTimeSpentDead}</p>
					          	<p>Time CC dealt to enemy: {p.totalTimeCCDealt}</p>
					          	<p>Minions: {p.totalMinionsKilled}</p>
					          	<p>Damage taken: {p.totalDamageTaken}</p>
					          	<p>Damage dealt to enemy champions: {p.totalDamageDealtToChampions}</p>
					          	<p>Active play time: {p.timePlayed}</p>
					          	<p>Gold earned: {p.goldEarned}</p>
					          </div>
  								}
  								arrow placement="top"
  								open={p.summonerName === toolTipId}>
  								<p className="participantsred" onMouseLeave={(e) => setToolTipId(null) } onClick={(e) => setToolTipId(e.target.innerText)}>{p.summonerName}</p>
  							</HtmlTooltip>)
  						}
  						</div>
  					<p>{data.matchinfo[activeMatch - 1].team1.baron.kills}</p><p>Baron</p><p>{data.matchinfo[activeMatch - 1].team2.baron.kills}</p>
  					<p>{data.matchinfo[activeMatch - 1].team1.champion.kills}</p><p>Champion Kills</p><p>{data.matchinfo[activeMatch - 1].team2.champion.kills}</p>
  					<p>{data.matchinfo[activeMatch - 1].team1.dragon.kills}</p><p>Dragons</p><p>{data.matchinfo[activeMatch - 1].team2.dragon.kills}</p>
  					<p>{data.matchinfo[activeMatch - 1].team1.inhibitor.kills}</p><p>Inhibitors</p><p>{data.matchinfo[activeMatch - 1].team2.inhibitor.kills}</p>
  					<p>{data.matchinfo[activeMatch - 1].team1.tower.kills}</p><p>Towers</p><p>{data.matchinfo[activeMatch - 1].team2.tower.kills}</p>
  				</div>
  			</div>
  		)
  		break;
  	default: contents = '';
  	}
  	return contents;
  }
	const listLabels = () => {
		const listArr = [];
		const contentArr = [];
		const matchLabelsArr = [];
		for (let i=0;i <5; i++){
			if (data[i]) {
				listArr.push(
	        editables[i+1] ? (
		        	<li className="itemedit" key={i} data-mediaid={data[i].mediauserinfo.puuid}>
		        		<FontAwesomeIcon icon={faCircleLeft} onClick={() => setEditables({ ...editables, [i+1]: false })}/>
			        	<input id="lol" ref={inputCallback} className="medialabelinput" type="text" placeholder="Edit media name" onChange={e => setInputValues({ ...inputValues, [`input${i+1}`]: e.target.value })}></input>
			        	<FontAwesomeIcon icon={faArrowRight} onClick={async (e) => {
			        		setEditables({ ...editables, [i+1]: false });
			        		setAfterEdit({ ...afteredit, [i+1]: true });
			        		deleteMedia({ media_type: mediaType, media_id: e.currentTarget.parentNode.dataset.mediaid });
			        		addMedia({ media_type: mediaType, media_name: inputValues[`input${i+1}`] }).unwrap().then(fulfilled => {
			        			setIsRefreshing(true);
			        			getMedias({ sortBy: 'name', sortOrder: 'asc', media_type: mediaType, i }); // i to force refetch
			        		});
			        	}}/>
		        	</li>
	        	)
	        	: (
	        		<li className={checkAfterEdit(i+1)} key={i} data-mediaid={data[i].mediauserinfo.puuid}>
				        <input type="radio" id={i}/>
				        {data[i].notifCount > 0 ? <div className="notifCount">{data[i].notifCount}</div> : null}
				        <img className={data[i].notifCount > 0 ? `mediaicon notifborder` : 'mediaicon'} src={data[i].mediauserinfo.profilelink}></img>
			        	<label
			        		className={checkSelectMedia(i+1)}
			        		onClick={() => {
			        			setSelectedMedia(i+1);
			        			setActiveMatch(1);
			        		}}
			      	 	>
			      	 		{data[i].mediauserinfo.name}
			      	 	</label>
			      	 	<FontAwesomeIcon icon={faPencil} onClick={() => setEditables({ ...editables, [i+1]: true })}/>
			      	 	<FontAwesomeIcon icon={faTrashCan} onClick={(e) => {
			      	 		setAfterEdit({ ...afteredit, [i+1]: true });
			      	 		deleteMedia({ media_type: mediaType, media_id: e.currentTarget.parentNode.dataset.mediaid });
			      	 		setIsRefreshing(true);
			      	 		getMedias({ sortBy: 'name', sortOrder: 'asc', media_type: mediaType, i }); // i to force refetch
			      	 	}
			      	 	}/>
			      	</li>
	      	 	)
				);
				contentArr.push(
		    	<div className={`content ${selectedMedia === (i+1) ? 'animate' : ''}`}>
		    		{rightZoneDisplay(mediaType, data[i])}
	        </div>
				);
			} else {
				listArr.push(
	        editables[i+1] ? (
	        	<li className="itemedit" key={i}>
		        		<FontAwesomeIcon icon={faCircleLeft} onClick={() => setEditables({ ...editables, [i+1]: false })}/>
			        	<input id="lol" placeholder="Add Media" ref={inputCallback} className="medialabelinput" type="text" onChange={e => setInputValues({ ...inputValues, [`input${i+1}`]: e.target.value })}></input>
				        { isAddMediaLoading ? <div className="addmedialoading">'loading'</div> :
				        	<FontAwesomeIcon icon={faArrowRight} onClick={() => {
				        		setEditables({ ...editables, [i+1]: false });
				        		setAfterEdit({ ...afteredit, [i+1]: true });
				        		addMedia({ media_type: mediaType, media_name: inputValues[`input${i+1}`] });
				        		setIsRefreshing(true);
				        	}
					        }/>
					      }
		        	</li>
		       ) :
	         (
			      <li className={checkAfterEdit(i+1)} key={i}>
			        <input type="radio" id=""/>
			        <label className={checkSelectMedia(i+1, 'noMedia')} onClick={() => {setEditables({ ...editables, [i+1]: true }); setActiveMatch(1); setSelectedMedia(i+1); matchLabelsArr.length = 0;}}>
			        	<FontAwesomeIcon icon={faCirclePlus} />
			        </label>
			      </li>
			    )
			  );
				contentArr.push(
		    	<div className={`content ${selectedMedia === (i+1) ? 'animate' : ''}`}>
	        	<span className="picto"></span>
	          <h1>No data</h1>
	        </div>
				);
			}
		}
		if (data[selectedMedia - 1]) {
			for (let i = 0; i < data[selectedMedia - 1].matchinfo.length; i++) {
				matchLabelsArr.push(
					<div className="section-navigate__item" onClick={(e) => setActiveMatch(i+1)}>
		        <span id={i+1} className={`section-navigate__link js--navigate-link ${activeMatch == (i+1) && 'is--active'}`}>
		        </span>
		        <span className="section-navigate__name">Match {i+1}</span>
		      </div>
				);
			}
		} else {
			matchLabelsArr.length = 0;
		}
		const checkLoading = !isLoading
		 ? (<>
			    <div id="left-zone">
			    	{isRefreshing && <div className="refreshing-data"><Loader titleFontSize="20px" dotsWidth="70px" message="Refreshing medias"/></div>}
			      <ul className="list">
			      	{listArr}
			      </ul>
			    </div>
			    <div id="right-zone">
						<nav className="section-navigate js--navigate">
					    <div className="section-navigate__items js--navigate-items">
					    	{matchLabelsArr}
					    </div>
						</nav>
			    	{contentArr}
			    </div></>) : <Loader />
		return (
		  <div id="scene">
		  	{checkLoading}
		  </div>

		)
	}
	return (
		<div className="carousel-layout">
			<Select setMediaType={setMediaType}/>
			{listLabels()}
		</div>
	);
}
