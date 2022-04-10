import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Calender from "../components/Calender";
import EventCard from "../components/EventCard";
import Paginator from "../components/Paginator";

function EventListPage() {
    const now = new Date();
    const [selectedDate, setSelectedDate] = useState({ date: now.getDate(), month: now.getMonth(), year: now.getFullYear() });
    const [events, setEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { search } = useLocation();
    const navigate = useNavigate();

    let searchValue = "";
    if (search.includes("?search=")) {
        searchValue = search.split("?search=")[1].split('&')[0];
    } else if (search.includes("&search=")) {
        searchValue = search.split("&search=")[1].split('&')[0];
    }

    useEffect(() => {
        (async () => {
            const { date, month, year } = selectedDate;
            const d = new Date(year, month, date).getTime() / 1000 | 0;
            const { data: { events, totalPages } } = await axios.get(`${window.server}/event?date=${d}&search=${searchValue}&page=${currentPage}&limit=10&future=true`);
            setTotalPages(totalPages);
            setEvents(events);
        })();
    }, [selectedDate, search, currentPage, searchValue]);

    return <main className="event-main">
        <section className="event-manage">
            <div className="event-head-cont">
                <h2 className="features-head event-head">Upcoming Events</h2>
            </div>
            <div className="container-modifier">
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
                        onActionButtonClick={() => navigate(`/events/${event.id}`)}
                        actionButtonText="Explore" />)}
                    <Paginator
                        totalPages={totalPages}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage} />
                </div>
            </div>
        </section>
    </main>;
}

export default EventListPage;