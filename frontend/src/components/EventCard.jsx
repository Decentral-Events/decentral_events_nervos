import { Link } from 'react-router-dom';
import { getDateTimeString, getUrl } from '../helpers';

function EventCard({ event, actionButtonText, onActionButtonClick }) {
    return <div className="event-display-cont">
        <div className="event-img-cont">
            <img src={getUrl(event.images[0].path)} className="event-img" alt="" />
        </div>
        <div className="event-details-cont" style={actionButtonText ? {} : { justifyContent: "start", gap: "1rem" }}>
            <span className="event-name">{event.name}</span>
            <span className="event-date">
                Start: {getDateTimeString(event.startTime)}<br /><br />End: {getDateTimeString(event.endTime)}
            </span>
            {actionButtonText && <button onClick={onActionButtonClick} className="btn btn-for-events">
                <span className="btn-event btn-visible"> {actionButtonText} </span>
            </button>}
        </div>
    </div>;
}

export default EventCard;