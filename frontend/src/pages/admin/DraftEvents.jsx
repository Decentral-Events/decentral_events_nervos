import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDateTimeString } from "../../helpers";

function DraftEvents() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        (async () => {
            const { data: { events } } = await axios.get(`${window.server}/event?draft=true`);
            setEvents(events);
        })()
    }, []);

    return <div className="event-manage">
        <Link to="/admin" className="btn eve-back-btn btn-for-events eve-stake-btn">
            <span className="btn-event btn-visible back-btn stake-btn">
                <span>&larr; &nbsp; Back</span>
            </span>
        </Link>
        <div className="center-title">

            <h1 className="features-head">Draft Events</h1>
        </div>
        {events.length === 0 && <div style={{ color: "red", fontSize: '1.5rem', padding: '10px 0', textAlign: 'center' }}>No Draft Events Found!!!</div>}
        <div className="grid grid-cols-3 gap-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', marginTop: '25px' }}>
            {events.map(event => (
                <div key={event.id} className="border-2 p-3 rounded" style={{ fontSize: '1.5rem', border: '2px gray solid', borderRadius: '1rem', padding: '2rem' }}>
                    <div className="text-lg font-semibold" style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{event.name}</div>
                    <div>Start: {getDateTimeString(event.startTime)}</div>
                    <div>End: {getDateTimeString(event.endTime)}</div>
                    <div className="mt-2"><Link to={`/admin/create/${event.id}`} className="bg-indigo-600 hover:bg-indigo-700 px-2 py-1 text-white rounded" style={{ color: 'white', textDecoration: 'none', background: 'indigo', padding: '1rem 1.5rem', display: 'inline-block', borderRadius: '1rem', marginTop: '10px' }}>Update</Link></div>
                </div>
            ))}
        </div>
    </div>;
}

export default DraftEvents;