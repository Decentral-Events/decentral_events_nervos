import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calender from "../../../components/Calender";
import EventCard from "../../../components/EventCard";
import Paginator from "../../../components/Paginator";

function PastEvents() {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);
    const [selectedDate, setSelectedDate] = useState({ date: now.getDate(), month: now.getMonth(), year: now.getFullYear() });
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const { date, month, year } = selectedDate;
            const d = new Date(year, month, date).getTime() / 1000 | 0;
            const { data: { events, totalPages } } = await axios.get(`${window.server}/event?date=${d}&past=true&page=${currentPage}&limit=10`);
            setTotalPages(totalPages);
            setEvents(events);
        })();
    }, [selectedDate, currentPage]);

    return <div className="container-modifier">
        <Calender
            maxToday
            selectedDate={selectedDate}
            setSelectedDate={(date) => {
                setSelectedDate(date);
                setCurrentPage(1);
            }} />
        <div className="all-events-cont">
            {events.length === 0 && <div className="no-events-error">No Events Found</div>}
            {events.map(event => <EventCard
                key={event.id}
                event={event} />)}
            <Paginator
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage} />
        </div>
    </div>;
}

export default PastEvents;