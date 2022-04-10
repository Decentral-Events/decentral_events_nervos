import { useState } from "react";

function Calender({ selectedDate, setSelectedDate, maxToday, minToday }) {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 3600 * 1000);
    const MONTHS = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const [monthAndYear, setMonthAndYear] = useState([now.getMonth(), now.getFullYear()]);

    function decreaseMonth() {
        const [oldMonth, oldYear] = monthAndYear;
        const newMonth = oldMonth ? oldMonth - 1 : 11;
        const newYear = oldYear - ((oldMonth - 1) === -1 ? 1 : 0)
        setMonthAndYear([newMonth, newYear]);
    }

    function increaseMonth() {
        const [oldMonth, oldYear] = monthAndYear;
        const newMonth = (oldMonth + 1) % 12;
        const newYear = oldYear + ((oldMonth + 1) === 12 ? 1 : 0)
        setMonthAndYear([newMonth, newYear]);
    }

    function calculateMonthStart() {
        const [month, year] = monthAndYear;
        const m = (month + 10) % 12 + 1;
        const C = 20;
        const Y = (month < 2 ? year - 1 : year) - 2000;
        const w = (((1 + Math.floor(2.6 * m - 0.2) - 2 * C + Y + Math.floor(Y / 4) + Math.floor(C / 4)) % 7) + 7) % 7;
        return w;
    }

    function getTotalDays() {
        const [month] = monthAndYear;
        return month === 1 ? 28 : 31 - (month % 2);
    }

    function clicked(date) {
        const [month, year] = monthAndYear;
        setSelectedDate({ date, month, year });
    }

    const start = calculateMonthStart();
    const totalDays = getTotalDays();

    const [month, year] = monthAndYear;

    return <div className="calender-cont">
        <div className="al-mt">
            <span className="month-name">{MONTHS[monthAndYear[0]]} &nbsp; {monthAndYear[1]}</span>
        </div>
        {(!minToday || month !== yesterday.getMonth() || year !== yesterday.getFullYear()) && <button onClick={decreaseMonth} style={{ border: 'none', background: 'none' }}>
            <ion-icon
                class="chevron-icon chevron-icon-left"
                name="chevron-back-outline"
            ></ion-icon>
        </button>}
        {(!maxToday || month !== yesterday.getMonth() || year !== yesterday.getFullYear()) && <button onClick={increaseMonth} style={{ border: 'none', background: 'none' }}>
            <ion-icon
                class="chevron-icon chevron-icon-right"
                name="chevron-forward-outline"
            ></ion-icon>
        </button>}
        <table className="calender-table">
            <thead className="table-head-cont">
                <tr>
                    <th className="table-head">Su</th>
                    <th className="table-head">Mo</th>
                    <th className="table-head">Tu</th>
                    <th className="table-head">We</th>
                    <th className="table-head">Th</th>
                    <th className="table-head">Fr</th>
                    <th className="table-head">Sa</th>
                </tr>
            </thead>
            <tbody className="table-body-cont">
                {[...Array(Math.ceil((totalDays + start) / 7)).keys()].map((i) => (
                    <tr key={i}>
                        {[...Array(7).keys()].map(j => {
                            const day = 7 * i + j + 1 - start;
                            const display = day >= 1 && day <= totalDays;
                            const selected = day === selectedDate.date && month === selectedDate.month && year === selectedDate.year;
                            const isInactive = display && ((maxToday && month === yesterday.getMonth() && year === yesterday.getFullYear() && day > now.getDate()) || (minToday && month === now.getMonth() && year === now.getFullYear() && day < now.getDate()));

                            return <td
                                key={j}
                                className={"table-input" + (display ? "" : " blank") + (selected ? " date-active" : "") + (isInactive ? " next-month" : "")}
                                onClick={() => display && !isInactive && clicked(day)}>
                                {display && <>{day}</>}
                            </td>;
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>;
}

export default Calender;