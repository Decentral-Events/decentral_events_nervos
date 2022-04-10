// import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import EventPlannerContract from '../../../abi/EventPlanner.json';
import { AuthContext } from '../../../context';
import DateTimePicker from 'react-datetime-picker';

function Step1({ done }) {
    const [name, setName] = useState("");
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [tokensRequired, setTokensRequired] = useState(0);
    const [validationsRequired, setValidationsRequired] = useState(0);
    const [maxBookings, setMaxBookings] = useState(0);
    const auth = useContext(AuthContext);
    const [eventPlannerContract, setEventPlannerContract] = useState(null);
    const { signer } = auth;

    useEffect(() => {
        setEventPlannerContract(new ethers.Contract(EventPlannerContract.address, EventPlannerContract.abi, signer));
        console.log(eventPlannerContract);
    }, [signer]);

    function validate() {
        return name !== '' && startTime != null && endTime != null && tokensRequired > 0 && validationsRequired >= 1 && maxBookings >= 1;
    }

    const isValid = validate();

    async function submit(e) {
        e.preventDefault();
        if (!isValid) return;
        console.log("Submitted");
        console.log(await eventPlannerContract.signer.getAddress())
        const event = await eventPlannerContract.createEvent(name,
            startTime.getTime() / 1000 | 0,
            endTime.getTime() / 1000 | 0,
            ethers.utils.parseEther(tokensRequired),
            validationsRequired,
            maxBookings
        );
        console.log(event);
        const { events } = await event.wait(1);
        done(parseInt(events[0].args.eventId));
    }

    return <form onSubmit={submit}>
        <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="" style={{ justifyItems: 'center', display: 'flex', flexDirection: 'column', background: 'white', padding: '20px', borderRadius: '20px', marginTop: '30px' }}>
                <div className="col-span-6 form-group">
                    <label htmlFor="first-name" className="form-label block text-sm font-medium text-gray-700">
                        Event Name
                    </label>
                    <input
                        type="text"
                        name="first-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        id="first-name"
                        required
                        className="form-input mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                </div>
                <div className="grid-2 grid-cols-6 gap-6">

                    <div className="col-span-6 sm:col-span-3 form-group">
                        <label htmlFor="first-name" className="form-label block text-sm font-medium text-gray-700">
                            Start Time
                        </label>
                        <DateTimePicker onChange={setStartTime} value={startTime} />
                        {/* <DateTimePickerComponent onChange={(e) => setStartTime(e.value)} /> */}
                    </div>

                    <div className="col-span-6 sm:col-span-3 form-group">
                        <label htmlFor="last-name" className="form-label block text-sm font-medium text-gray-700">
                            End Time
                        </label>
                        <DateTimePicker onChange={setEndTime} value={endTime} />
                        {/* <DateTimePickerComponent onChange={(e) => setEndTime(e.value)} /> */}
                    </div>
                </div>
                <div className="grid-3 grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-6 lg:col-span-2 form-group">
                        <label htmlFor="tokensRequired" className="form-label block text-sm font-medium text-gray-700">
                            Tokens Required
                        </label>
                        <input
                            type="number"
                            name="tokensRequired"
                            id="tokensRequired"
                            required
                            value={tokensRequired}
                            onChange={(e) => setTokensRequired(e.target.value || 0)}
                            className="form-input mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2 form-group">
                        <label htmlFor="validationsRequired" className="form-label block text-sm font-medium text-gray-700">
                            Validations Required
                        </label>
                        <input
                            type="number"
                            name="validationsRequired"
                            id="validationsRequired"
                            required
                            value={validationsRequired}
                            onChange={(e) => setValidationsRequired(parseInt(e.target.value || 0))}
                            className="form-input mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2 form-group">
                        <label htmlFor="maxBookings" className="form-label block text-sm font-medium text-gray-700">
                            Max Bookings
                        </label>
                        <input
                            type="text"
                            name="maxBookings"
                            required
                            id="maxBookings"
                            value={maxBookings}
                            onChange={(e) => setMaxBookings(parseInt(e.target.value || 0))}
                            className="form-input mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <div className="" style={{ justifyContent: 'center', display: 'flex', background: 'white', padding: '20px', borderRadius: '20px' }}>

                    <button
                        style={{ display: 'inline-block' }}
                        type="submit"
                        disabled={!isValid}
                        className={(isValid ? "" : "pop-btn-disable") + " btn eve-sts-btn create-acc-btn btn-for-events"}
                    >
                        <span className='btn-event cre-acc-btn-txt btn-visible'>

                            Create
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </form>;
}

export default Step1;