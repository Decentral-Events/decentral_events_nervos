import eventPlannerContractABI from "./abi/EventPlanner.json" assert { type: 'json' };
import ethers from "ethers";
import sequelize from "./database.js";
console.log(sequelize.models);
const { Event, User, Reservation } = sequelize.models;

const rpcEndpoint = process.env.WEB3_RPC;
const eventPlannerContractAddress = process.env.EVENT_PLANNER_CONTRACT_ADDRESS;

const provider = new ethers.providers.WebSocketProvider(rpcEndpoint);
console.log(provider.blockNumber)
const eventPlannerContract = new ethers.Contract(eventPlannerContractAddress, eventPlannerContractABI, provider);

async function eventCreated(eventEmited) {
    console.log("eventCreated");
    const { transactionHash, blockNumber } = eventEmited;
    const { eventId, name, startTime, endTime, tokensRequired, validationRequired, maxBookings } = eventEmited.args;
    let event = await Event.findOne({
        where: {
            id: parseInt(eventId)
        }
    });
    if (event) return;
    event = await Event.create({
        id: parseInt(eventId),
        name,
        startTime: parseInt(startTime),
        endTime: parseInt(endTime),
        tokensRequired: tokensRequired.toString(),
        validationRequired: parseInt(validationRequired),
        maxBookings: parseInt(maxBookings),
        lastBlock: parseInt(blockNumber),
        transactionHash
    });
}

async function adminStatusChanged(eventEmited) {
    console.log("adminStatusChanged");
    const { transactionHash, blockNumber } = eventEmited;
    const { user: address, status } = eventEmited.args;
    console.log(address)
    const [user] = await User.getOrCreate(address);
    user.isAdmin = status;
    user.lastBlock = parseInt(blockNumber);
    user.save();
}

async function reservationMade(eventEmited) {
    console.log("reservationMade");
    const { transactionHash, blockNumber } = eventEmited;
    const { eventId, bookingId, user: address, totalBookings } = eventEmited.args;
    let reservation = await Reservation.findOne({
        where: {
            id: parseInt(bookingId)
        }
    });
    if (reservation) return;
    reservation = await Reservation.create({
        id: parseInt(bookingId),
        lastBlock: parseInt(blockNumber)
    });
    const event = await Event.findOne({
        where: {
            id: parseInt(eventId)
        }
    });
    event.totalBookings = parseInt(totalBookings);
    event.save();
    const [user] = await User.getOrCreate(address);
    user.addReservation(reservation);
    event.addReservation(reservation);
}

async function reservationCancelled(eventEmited) {
    console.log("reservationCancelled");
    const { transactionHash, blockNumber } = eventEmited;
    const { eventId, bookingId, user: address, totalBookings } = eventEmited.args;
    let reservation = await Reservation.findOne({ where: { id: parseInt(bookingId) } });
    if (!reservation || reservation.cancelled) return;
    reservation.lastBlock = parseInt(blockNumber);
    reservation.cancelled = true;
    await reservation.save();
    const event = await Event.findOne({ where: { id: parseInt(eventId) } });
    event.totalBookings = parseInt(totalBookings);
    event.save();
}

async function attendanceMarked(eventEmited) {
    console.log("attendanceMarked");
    const { transactionHash, blockNumber } = eventEmited;
    const { eventId, bookingId, user: address } = eventEmited.args;
    const reservation = await Reservation.findOne({ where: { id: parseInt(bookingId) } });
    if (!reservation || reservation.attended) return;
    reservation.lastBlock = parseInt(blockNumber);
    reservation.attended = true;
    reservation.save();
}

async function unstaked(eventEmited) {
    console.log("unstaked");
    const { transactionHash, blockNumber } = eventEmited;
    const { eventId, bookingId, user: address } = eventEmited.args;
    const reservation = await Reservation.findOne({ where: { id: parseInt(bookingId) } });
    if (!reservation || reservation.unstaked) return;
    reservation.lastBlock = parseInt(blockNumber);
    reservation.unstaked = true;
    reservation.save();
}

async function main() {
    const EventCreatedFilter = eventPlannerContract.filters.EventCreated();
    const AdminStatusChangeFilter = eventPlannerContract.filters.AdminStatusChange();
    const ReservationMadeFilter = eventPlannerContract.filters.ReservationMade();
    const ReservationCancelledFilter = eventPlannerContract.filters.ReservationCancelled();
    const AttendanceMarkedFilter = eventPlannerContract.filters.AttendanceMarked();
    const UnstakedFilter = eventPlannerContract.filters.Unstaked();

    eventPlannerContract.on(EventCreatedFilter, (eventId, name, startTime, endTime, tokensRequired, validationRequired, maxBookings, event) => {
        eventCreated(event);
    });

    let event = await Event.findOne({
        order: [
            ['lastBlock', 'DESC']
        ]
    });
    let lastBlock = event ? event.lastBlock : 0;
    let eventCreatedEvents = await eventPlannerContract.queryFilter(EventCreatedFilter, lastBlock, "latest");
    for (const eventEmited of eventCreatedEvents) {
        await eventCreated(eventEmited);
    }

    eventPlannerContract.on(AdminStatusChangeFilter, (user, status, event) => {
        adminStatusChanged(event);
    });

    let user = await User.findOne({
        order: [
            ['lastBlock', 'DESC']
        ]
    });
    lastBlock = user ? user.lastBlock : 0;
    const adminStatusChangeEvents = await eventPlannerContract.queryFilter(AdminStatusChangeFilter, lastBlock, "latest");
    for (const eventEmited of adminStatusChangeEvents) {
        await adminStatusChanged(eventEmited);
    }

    eventPlannerContract.on(ReservationMadeFilter, (eventId, bookingId, user, totalBookings, event) => {
        reservationMade(event);
    });

    eventPlannerContract.on(ReservationCancelledFilter, (eventId, bookingId, user, totalBookings, event) => {
        reservationCancelled(event);
    });

    eventPlannerContract.on(AttendanceMarkedFilter, (eventId, bookingId, user, event) => {
        attendanceMarked(event);
    });

    eventPlannerContract.on(UnstakedFilter, (eventId, bookingId, user, event) => {
        unstaked(event);
    });

    let reservation = await Reservation.findOne({
        order: [
            ['lastBlock', 'DESC']
        ]
    });
    lastBlock = reservation ? reservation.lastBlock : 0;

    const reservationMadeEvents = await eventPlannerContract.queryFilter(ReservationMadeFilter, lastBlock, "latest");
    for (const eventEmited of reservationMadeEvents) {
        await reservationMade(eventEmited);
    }

    const reservationCancelledEvents = await eventPlannerContract.queryFilter(ReservationCancelledFilter, lastBlock, "latest");
    for (const eventEmited of reservationCancelledEvents) {
        await reservationCancelled(eventEmited);
    }

    const attendanceMarkedEvents = await eventPlannerContract.queryFilter(AttendanceMarkedFilter, lastBlock, "latest");
    for (const eventEmited of attendanceMarkedEvents) {
        await attendanceMarked(eventEmited);
    }

    const unstakedEvents = await eventPlannerContract.queryFilter(UnstakedFilter, lastBlock, "latest");
    for (const eventEmited of unstakedEvents) {
        await unstaked(eventEmited);
    }

    // contract
    //     .events
    //     .EventCreated({ fromBlock: lastBlock })
    //     .on('data', async ({ returnValues, transactionHash, blockNumber }) => {
    //         const { eventId, name, startTime, endTime, tokensRequired, validationRequired, maxBookings } = returnValues;
    //         let event = await Event.findOne({
    //             where: {
    //                 id: parseInt(eventId)
    //             }
    //         });
    //         if (event) return;
    //         event = new Event({
    //             id: parseInt(eventId),
    //             name,
    //             startTime,
    //             endTime,
    //             tokensRequired,
    //             validationRequired: parseInt(validationRequired),
    //             maxBookings: parseInt(maxBookings),
    //             lastBlock: parseInt(blockNumber)
    //         });
    //         await event.save();
    //     });

    // let user = await User.findOne({
    //     order: [
    //         ['lastBlock', 'DESC']
    //     ]
    // });
    // lastBlock = user ? user.lastBlock : 0;
    // contract.events.AdminStatusChange({ fromBlock: lastBlock }).on('data', async ({ returnValues, transactionHash, blockNumber }) => {
    //     let { user: address, status } = returnValues;
    //     address = web3.utils.toChecksumAddress(address);
    //     let user = await User.findOne({
    //         where: {
    //             address
    //         }
    //     });
    //     if (!user) {
    //         user = new User({
    //             address,
    //             nonce: generateNonce(),
    //         });
    //     }
    //     user.isAdmin = status;
    //     user.lastBlock = parseInt(blockNumber);
    //     await user.save();
    // });

    // let reservation = await Reservation.findOne({
    //     order: [
    //         ['lastBlock', 'DESC']
    //     ]
    // });
    // lastBlock = reservation ? reservation.lastBlock : 0;
    // contract.events.ReservationMade({ fromBlock: lastBlock }).on('data', async ({ returnValues, transactionHash, blockNumber }) => {
    //     let { eventId, user: address, bookingId, totalBookings } = returnValues;
    //     let reservation = await Reservation.findOne({
    //         where: {
    //             id: parseInt(bookingId)
    //         }
    //     });
    //     if (reservation) return;
    //     reservation = await Reservation.create({
    //         id: parseInt(bookingId),
    //         lastBlock: parseInt(blockNumber)
    //     });
    //     const event = await Event.findOne({
    //         where: {
    //             id: parseInt(eventId)
    //         }
    //     });
    //     event.totalBookings++;
    //     event.save();
    //     let [user] = await User.findOrNew(address);
    //     user.addReservation(reservation);
    //     event.addReservation(reservation);
    // });
    // contract.events.ReservationCancelled({ fromBlock: lastBlock }).on('data', async ({ returnValues, transactionHash, blockNumber }) => {
    //     let { eventId, user: address, bookingId, totalBookings } = returnValues;
    //     let reservation = await Reservation.findOne({
    //         where: {
    //             id: parseInt(bookingId)
    //         }
    //     });
    //     if (!reservation) return;
    //     reservation.cancelled = true;
    //     reservation.fromBlock = blockNumber;
    //     await reservation.save();
    //     const event = await Event.findOne({
    //         where: {
    //             id: parseInt(eventId)
    //         }
    //     });
    //     event.totalBookings--;
    //     event.fromBlock = blockNumber;
    //     await event.save();
    // });
    // console.log(contract.events);
    // contract.events.AttendanceMarked({ fromBlock: lastBlock }).on('data', async ({ returnValues, transactionHash, blockNumber }) => {
    //     let { eventId, user: address, bookingId } = returnValues;
    //     let reservation = await Reservation.findOne({
    //         where: {
    //             id: parseInt(bookingId)
    //         }
    //     });
    //     if (!reservation) return;
    //     reservation.attended = true;
    //     reservation.fromBlock = blockNumber;
    //     reservation.save();
    //     const event = await Event.findOne({
    //         where: {
    //             id: parseInt(eventId)
    //         }
    //     });
    //     event.fromBlock = blockNumber;
    //     event.save();
    // });
    // contract.events.PresenceMarked({ fromBlock: lastBlock }).on('data', async ({ returnValues, transactionHash, blockNumber }) => {
    //     let { eventId, user: address, bookingId, validator, validationsRequired } = returnValues;
    //     let reservation = await Reservation.findOne({
    //         where: {
    //             id: parseInt(bookingId)
    //         }
    //     });
    //     if (!reservation) return;
    //     // reservation.attended = true;
    //     // reservation.fromBlock = blockNumber;
    //     // reservation.save();
    //     // const event = await Event.findOne({
    //     //     where: {
    //     //         id: parseInt(eventId)
    //     //     }
    //     // });
    //     // event.fromBlock = blockNumber;
    //     // event.save();
    // });
    // contract.events.Unstaked({ fromBlock: lastBlock }).on('data', async ({ returnValues, transactionHash, blockNumber }) => {
    //     let { eventId, user: address, bookingId } = returnValues;
    //     let reservation = await Reservation.findOne({
    //         where: {
    //             id: parseInt(bookingId)
    //         }
    //     });
    //     if (!reservation) return;
    //     reservation.Unstaked = true;
    //     reservation.fromBlock = blockNumber;
    //     reservation.save();
    //     const event = await Event.findOne({
    //         where: {
    //             id: parseInt(eventId)
    //         }
    //     });
    //     event.fromBlock = blockNumber;
    //     event.save();
    // });
}

export default main;