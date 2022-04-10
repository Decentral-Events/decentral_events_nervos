import { useState } from "react";
import { Link } from "react-router-dom";
import Calender from "../../../components/Calender";
import FutureEvents from "./FutureEvents";
import OngoingEvents from "./OngoingEvents";
import PastEvents from "./PastEvents";

function Dashboard() {
    const [selectedTab, setSelectedTab] = useState(2);

    return <main className="admdash-main">
        <div className="flex-mdf-cont">
            <div className="adm-dash-cont">
                <span className="dash-head">Dashboard</span>
                <div className="adm-dash-btn-cont">
                    <Link
                        to="/admin/draft"
                        className="btn adm-dash-btn btn-for-events eve-stake-btn">
                        <span className="btn-event adm-dash-btn-text btn-visible stake-btn">
                            Check Draft Events
                        </span>
                    </Link>
                    <Link
                        to="/admin/create"
                        className="btn adm-dash-btn pop-stake-btn btn-for-events eve-stake-btn"
                    >
                        <span className="btn-event adm-dash-btn-text btn-visible stake-btn">
                            Create New Event
                        </span>
                    </Link>
                </div>
            </div>
            <div className="eve-log-cont">
                <div className="eve-log-btn-cont">
                    <button
                        onClick={() => setSelectedTab(0)}
                        className={(selectedTab === 0 ? "dash-og-eve " : "adm-dash-gry-btn ") + "btn adm-dash-btn btn-for-events eve-stake-btn"}
                    >
                        <span className="btn-event adm-dash-btn-text btn-visible stake-btn">
                            View Past Events
                        </span>
                    </button>
                    <button
                        onClick={() => setSelectedTab(1)}
                        className={(selectedTab === 1 ? "dash-og-eve " : "adm-dash-gry-btn ") + "btn adm-dash-btn btn-for-events eve-stake-btn"}
                    >
                        <span className="btn-event adm-dash-btn-text btn-visible stake-btn">
                            View Ongoing Events
                        </span>
                    </button>
                    <button
                        onClick={() => setSelectedTab(2)}
                        className={(selectedTab === 2 ? "dash-og-eve " : "adm-dash-gry-btn ") + "btn adm-dash-btn btn-for-events eve-stake-btn"}
                    >
                        <span className="btn-event adm-dash-btn-text btn-visible stake-btn">
                            Edit Upcoming Events
                        </span>
                    </button>
                </div>
                <div className="eve-log-cal-cont">
                    {selectedTab === 0 && <PastEvents />}
                    {selectedTab === 1 && <OngoingEvents />}
                    {selectedTab === 2 && <FutureEvents />}
                </div>
            </div>
        </div>
    </main>;
}

export default Dashboard;