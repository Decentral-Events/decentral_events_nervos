import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import Step1 from './Step1';
import Step2 from './Step2';

function CreateEvent() {
    const { id } = useParams();
    const [step, setStep] = useState(id ? 2 : 1);
    const [eventId, setEventId] = useState(id ? parseInt(id) : -1);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            if (id) {
                try {
                    const { data: { event } } = await axios.get(`${window.server}/event/${id}`);
                    if (!event.draft)
                        navigate("/admin");
                } catch (err) {
                    navigate("/admin");
                }
            }
        })()
    }, []);

    return <div className="container mx-auto px-5 py-12 event-manage">
        <Link to="/admin" className="btn eve-back-btn btn-for-events eve-stake-btn">
            <span className="btn-event btn-visible back-btn stake-btn">
                <span>&larr; &nbsp; Back</span>
            </span>
        </Link>
        <div className="center-title">

            <h1 className="text-2xl flex-1 font-bold mb-10 features-head">Create Event</h1>
        </div>
        <div className="w-2/3 mx-auto">
            <div className='tab-header'>
                <span className={step == 1 ? 'tab tab-active' : 'tab'}>Step 1</span>
                <span className={step == 2 ? 'tab tab-active' : 'tab'}>Step 2</span>
            </div>
            {step == 1 ? <Step1 done={(eventId) => { setStep(2); setEventId(eventId) }} /> : <Step2 eventId={eventId} />}
        </div>

    </div>;
}

export default CreateEvent;