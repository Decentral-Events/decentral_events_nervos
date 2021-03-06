import { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { AuthContext } from "../context";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import TokenContract from "../abi/Token.json";
import EventPlannerContract from "../abi/EventPlanner.json";
import { getDateTimeString, getUrl } from '../helpers';
import Loading from "../components/Loading";

function EventDetailPage() {
    const [showModal, setShowModal] = useState(false);
    const [event, setEvent] = useState(null);
    const { id: eventId } = useParams();
    const auth = useContext(AuthContext);
    const { signer } = auth;
    const [approvedTokens, setApprovedTokens] = useState(ethers.BigNumber.from("0"));
    const [tokenContract, setTokenContract] = useState(null);
    const [eventPlannerContract, setEventPlannerContract] = useState(null);
    const [isReserved, setIsReserved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            try {
                const { data: { event } } = await axios.get(`${window.server}/event/${eventId}`);
                setEvent(event);
            } catch (err) {
                console.log("event");
                setError("Event not found");
            }
        })();
    }, [eventId]);

    useEffect(() => {
        (async () => {
            if (!signer) return;
            const address = await signer.getAddress();
            const tokenContract = new ethers.Contract(TokenContract.address, TokenContract.abi, signer);
            const eventPlannerContract = new ethers.Contract(EventPlannerContract.address, EventPlannerContract.abi, signer);
            const approvalFilter = tokenContract.filters.Approval(address, EventPlannerContract.address);
            console.log(await tokenContract.allowance(address, EventPlannerContract.address));
            setApprovedTokens(await tokenContract.allowance(address, EventPlannerContract.address));
            tokenContract.on(approvalFilter, (owner, spender, amount, event) => {
                console.log(amount);
                setApprovedTokens(amount);
            });
            setTokenContract(tokenContract);
            setEventPlannerContract(eventPlannerContract);
        })();
    }, [signer]);

    useEffect(() => {
        if (!event) return;
        if (!auth.isLoggedIn) {
            setIsReserved(false);
            return;
        }
        (async () => {
            console.log("Hello")
            const { data: { isReserved } } = await axios.get(`${window.server}/reservation/event/${event.id}`, { headers: { 'Authorization': `Bearer ${auth.token}` } });
            setIsReserved(isReserved);

        })();
    }, [event, auth.token, auth.isLoggedIn]);

    async function stake() {
        if (!signer) return;
        const tx = await eventPlannerContract.bookTicket(event.id);
        setIsReserved(true);
        setShowModal(false);
        setLoading(true);
        await tx.wait();
        setLoading(false);
    }

    const enoughApproved = event && ethers.BigNumber.from(event.tokensRequired).lte(approvedTokens);
    // const enoughApproved = true;

    async function openModal() {
        if (!signer) return alert("Connect with metamask first");
        const address = await signer.getAddress();
        const tokens = await tokenContract.balanceOf(address);
        if (ethers.BigNumber.from(event.tokensRequired).gt(tokens))
            return alert("You dont have enough balance");
        setShowModal(true);
    }

    async function approve() {
        if (!signer) return;
        const tx = await tokenContract.approve(EventPlannerContract.address, event.tokensRequired);
        setLoading(true);
        await tx.wait();
        setLoading(false);
    }

    if (error) return <main>
        <div class="err-display-cont no-eve-cont">
            <span class="err-1">Event not found</span>
        </div>
    </main>;

    if (!event) return <>Loading...</>;

    return <>
        {loading && <Loading />}
        <main className="event-display-main">
            <Link to="/events" className="btn eve-back-btn btn-for-events eve-stake-btn">
                <span className="btn-event btn-visible back-btn stake-btn">
                    <span>&larr; &nbsp; Back</span>
                </span>
            </Link>
            <div className="curr-event-display-cont">
                <div className="curr-eve-img-cont">
                    <img src={getUrl(event.images[0].path)} className="curr-eve-img" alt="" />
                </div>
                <div className="current-event-cont">
                    <div className="curr-event-details-cont event-details-cont">
                        <span className="event-name">{event.name}</span>
                        <span className="event-date event-date-start">
                            <strong>STARTS: </strong> {getDateTimeString(event.startTime)}.
                        </span>
                        <span className="event-date event-date-end">
                            <strong>ENDS: </strong> {getDateTimeString(event.endTime)}
                        </span>
                        {isReserved
                            ? <div style={{ fontSize: '1.8rem' }}>You have made a reservation. Check in <Link to="/reservations">your reservations page</Link>.</div>
                            : <button className="btn btn-for-events eve-stake-btn" onClick={openModal}>
                                <span className="btn-event btn-visible stake-btn">
                                    <i>Reserve By staking {ethers.utils.formatEther(event.tokensRequired)} USTD</i>
                                </span>
                            </button>
                        }
                    </div>
                </div>
            </div>
            <div className="curr-eve-des">
                <span className="event-name eve-des">Event Description </span>
                <p className="curr-eve-about">
                    {event.description}
                </p>
            </div>
            <div className={(signer && showModal ? "popup-active " : "") + "popup"}>
                <div className="overlay" onClick={() => setShowModal(false)}></div>
                <div className="popup-cont">
                    <span className="popup-text">Reserve Your Spot</span>
                    <div className="popup-btn-cont">
                        <button
                            className={(!enoughApproved ? "" : "pop-btn-disable ") + "popup-btn pop-app-btn btn btn-for-events eve-stake-btn"}
                            disabled={enoughApproved}
                            onClick={approve}
                        >
                            <span className="btn-event btn-visible popup-btn-text stake-btn">
                                Approve Tokens
                            </span>
                        </button>
                        <button
                            className={(enoughApproved ? "" : "pop-btn-disable ") + "btn pop-stake-btn btn-for-events popup-btn eve-stake-btn"}
                            disabled={!enoughApproved}
                            onClick={stake}
                        >
                            <span className="btn-event popup-btn-text btn-visible stake-btn">
                                Stake Tokens
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </main>
    </>
}

export default EventDetailPage;