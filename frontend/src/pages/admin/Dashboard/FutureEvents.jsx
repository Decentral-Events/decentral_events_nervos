import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Calender from "../../../components/Calender";
import EventCard from "../../../components/EventCard";
import Paginator from "../../../components/Paginator";

function FutureEvents() {
    const now = new Date();
    const [selectedDate, setSelectedDate] = useState({ date: now.getDate(), month: now.getMonth(), year: now.getFullYear() });
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const { date, month, year } = selectedDate;
            const d = new Date(year, month, date).getTime() / 1000 | 0;
            const { data: { events, totalPages } } = await axios.get(`${window.server}/event?date=${d}&future=true&page=${currentPage}&limit=10`);
            setTotalPages(totalPages);
            setEvents(events);
        })();
    }, [selectedDate, currentPage]);

    return <div className="container-modifier">
        <Calender
            minToday
            selectedDate={selectedDate}
            setSelectedDate={(date) => {
                setSelectedDate(date);
                setCurrentPage(1);
            }} />
        <div className="all-events-cont">
            {events.length === 0 && <div className="no-events-error">No Events Found</div>}
            {events.map(event => <EventCard
                key={event.id}
                event={event}
                onActionButtonClick={() => navigate(`/admin/edit/${event.id}`)}
                actionButtonText="Edit" />)}
            <Paginator
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage} />
        </div>
    </div>;
}

export default FutureEvents;