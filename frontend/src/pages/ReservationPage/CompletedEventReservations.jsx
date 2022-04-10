import axios from "axios";
import { useContext, useEffect, useState } from "react";
import EventCard from "../../components/EventCard";
import Paginator from "../../components/Paginator";
import { AuthContext } from "../../context";
import EventPlannerContract from "../../abi/EventPlanner.json";
import { ethers } from "ethers";
import Loading from "../../components/Loading";

function CompletedEventReservations() {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const auth = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [eventPlannerContract, setEventPlannerContract] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!auth.isLoggedIn) return;
        (async () => {
            const { data: { reservations, totalPages } } = await axios(`${window.server}/reservation/past?page=${currentPage}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            console.log(reservations);
            setReservations(reservations);
            setTotalPages(totalPages);
        })();
    }, [currentPage, auth.token, auth.isLoggedIn]);

    useEffect(() => {
        (async () => {
            if (!auth.signer) return;
            const eventPlannerContract = new ethers.Contract(EventPlannerContract.address, EventPlannerContract.abi, auth.signer);
            setEventPlannerContract(eventPlannerContract);
        })();
    }, [auth.signer]);

    async function unstake(eventId) {
        const tx = await eventPlannerContract.unstake(eventId);
        setLoading(true);
        await tx.wait();
        setLoading(false);
        setReservations(reservations.map(reservation => reservation.Event.id === eventId ? { ...reservation, unstaked: true } : reservation));
    }

    return <>
        {loading && <Loading />}
        <div className="all-events-status-cont">
            {reservations.map(reservation => (
                reservation.unstaked
                    ? <EventCard event={reservation.Event} />
                    : <EventCard event={reservation.Event} actionButtonText="Unstake" onActionButtonClick={() => unstake(reservation.Event.id)} />
            ))}
            {reservations.length === 0 && <div className="no-events-error">No Reservation Found</div>}

            {/* <div className="event-display-sts-cont">
                <div className="event-img-cont">
                <img src="/Images/2.jpg" className="event-img" alt="" />
                </div>
                <div className="event-details-cont">
                <span className="event-name">Event-1</span>
                <span className="event-date">
                06/04/2022, 05:00:00 - 07/04/2022, 00:00:00
                </span>
                <button className="btn eve-sts-btn btn-for-events">
                <span className="btn-event btn-visible"> Unstake </span>
                </button>
                </div>
                </div>
                <div className="event-display-sts-cont">
                <div className="event-img-cont">
                <img src="/Images/3.jpg" className="event-img" alt="" />
                </div>
                <div className="event-details-cont">
                <span className="event-name">Event-2</span>
                <span className="event-date">
                06/04/2022, 07:00:00 - 07/04/2022, 01:00:00
                </span>
                <button className="btn eve-sts-btn btn-for-events">
                <span className="btn-event btn-visible"> Unstake </span>
                </button>
                </div>
                </div>
                <div className="event-display-sts-cont">
                <div className="event-img-cont">
                <img src="/Images/4.jpg" className="event-img" alt="" />
                </div>
                <div className="event-details-cont">
                <span className="event-name">Event-3</span>
                <span className="event-date">
                06/04/2022, 09:00:00 - 07/04/2022, 00:00:00
                </span>
                <button className="btn eve-sts-btn btn-for-events">
                <span className="btn-event btn-visible"> Unstake </span>
                </button>
                </div>
            </div> */}
            <Paginator
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage} />
        </div>
    </>;
}

export default CompletedEventReservations;