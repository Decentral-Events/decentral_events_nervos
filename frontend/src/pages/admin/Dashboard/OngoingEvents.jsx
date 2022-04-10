import axios from "axios";
import { useContext, useEffect, useState } from "react";
import EventCard from "../../../components/EventCard";
import Paginator from "../../../components/Paginator";
import { AuthContext } from "../../../context";
import EventPlannerContract from "../../../abi/EventPlanner.json";
import { ethers } from 'ethers';
import Loading from "../../../components/Loading";

function OngoingEvents() {
    const now = new Date();
    const [selectedDate] = useState({ date: now.getDate(), month: now.getMonth(), year: now.getFullYear() });
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedEvent, setSelectedEvent] = useState(-1);
    const [username, setUsername] = useState("");
    const [eventPlannerContract, setEventPlannerContract] = useState(null);
    const auth = useContext(AuthContext);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { date, month, year } = selectedDate;
            const d = new Date(year, month, date).getTime() / 1000 | 0;
            const { data: { events, totalPages } } = await axios.get(`${window.server}/event?date=${d}&ongoing=true&limit=10&page=${currentPage}`);
            setTotalPages(totalPages);
            setEvents(events);
        })();
    }, [selectedDate, currentPage]);

    useEffect(() => {
        (async () => {
            if (!auth.signer) return;
            const eventPlannerContract = new ethers.Contract(EventPlannerContract.address, EventPlannerContract.abi, auth.signer);
            setEventPlannerContract(eventPlannerContract);
        })();
    }, [auth.signer]);

    async function markAttendance(e) {
        e.preventDefault();
        if (selectedEvent === -1) return;
        let user;
        try {
            const { data } = await axios.get(`${window.server}/user/username/${username}`);
            user = data.user;
        } catch (err) {
            alert("User Not found");
            return;
        }
        try {
            const tx = await eventPlannerContract.markAttendance(selectedEvent, user.address);
            setLoading(true);
            await tx.wait();
        } catch (err) {
            console.log(err);
            alert("Error in marking attendence");
            return;
        }
        setLoading(false);
        setUsername("");
        setSelectedEvent(-1);
    }

    return <>
        <div className="container-modifier">
            {loading && <Loading />}
            <div className="all-events-cont all-events-cont-full">
                {events.map(event => <EventCard
                    key={event.id}
                    event={event}
                    onActionButtonClick={() => setSelectedEvent(event.id)}
                    actionButtonText="Mark Attendance" />)}
                {events.length === 0 && <div className="no-events-error">No Events Found</div>}
                <Paginator
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage} />
            </div>
        </div>
        {selectedEvent !== -1 && <div className="popup popup-2">
            <div
                className="overlay"
                onClick={() => {
                    setSelectedEvent(-1);
                    setUsername("");
                }}>
            </div>
            <div className="popup-cont popup-cont-2">
                <form className="form form-popup" onSubmit={markAttendance}>
                    <div className="form-ele-cont">
                        <label className="form-label form-label-popup" for="user-name">
                            User Name
                        </label>
                        <input
                            type="text"
                            name="User Name"
                            placeholder="Arvi_Acker"
                            id="user-name"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-input form-input-popup"
                        />
                    </div>
                    <div className="popup-btn-cont">
                        <button
                            type="submit"
                            className="popup-btn pop-app-btn btn btn-for-events eve-stake-btn"
                        >
                            <span className="btn-event btn-visible popup-btn-text stake-btn">
                                Mark Attendence
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>}

    </>;
}

export default OngoingEvents;