import { useState } from "react";
import Paginator from "../../components/Paginator";
import CancelledEventReservations from "./CancelledEventReservations";
import CompletedEventReservations from "./CompletedEventReservations";
import FutureEventReservations from "./FutureEventReservations";
import OngoingEventReservations from "./OngoingEventReservations";

function ReservationPage() {
    const [selectedTab, setSelectedTab] = useState(0);

    return <main className="event-status-main">
        <div className="seperator-modifier">&nbsp;</div>
        <div className="flex-container-modifier">
            <div className="event-status-navbar-cont">
                <nav className="event-status-navbar">
                    <ul className="eve-status-nav-list">
                        <button onClick={() => setSelectedTab(0)} className={(selectedTab === 0 ? "event-link-active " : "") + "eve-status-list-item nav-list-item"}>
                            <ion-icon
                                name="checkmark-done"
                                class="eve-sts-icon nav-icon"
                            ></ion-icon>
                            <span>completed events</span>
                        </button>
                        <button onClick={() => setSelectedTab(1)} className={(selectedTab === 1 ? "event-link-active " : "") + "eve-status-list-item nav-list-item"}>
                            <ion-icon
                                name="checkmark"
                                class="eve-sts-icon nav-icon"
                            ></ion-icon>
                            <span>ongoing events</span>
                        </button>
                        <button onClick={() => setSelectedTab(2)} className={(selectedTab === 2 ? "event-link-active " : "") + "eve-status-list-item nav-list-item"}>
                            <ion-icon
                                name="refresh-circle"
                                class="eve-sts-icon nav-icon"
                            ></ion-icon>
                            <span>pending events</span>
                        </button>
                        <button onClick={() => setSelectedTab(3)} className={(selectedTab === 3 ? "event-link-active " : "") + "eve-status-list-item nav-list-item"}>
                            <ion-icon
                                name="close-circle"
                                class="eve-sts-icon nav-icon"
                            ></ion-icon>
                            <span>cancelled events</span>
                        </button>
                    </ul>
                </nav>
            </div>
            <div className="event-status-display">
                <div className="event-head-cont">
                    <h2 className="features-head eve-sts-head event-head">
                        Your Reservations
                    </h2>
                </div>
                {selectedTab === 0 && <CompletedEventReservations />}
                {selectedTab === 1 && <OngoingEventReservations />}
                {selectedTab === 2 && <FutureEventReservations />}
                {selectedTab === 3 && <CancelledEventReservations />}
            </div>
        </div>
        <div className="seperator-modifier">&nbsp;</div>
    </main>;
}

export default ReservationPage;