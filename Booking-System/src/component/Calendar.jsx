import { useState, useMemo } from "react";
import { useAuth } from "../context/useAuth.js";
import { BookingOptions } from "./Modals/BookingOptions.jsx";
import { BookingSuccess } from "./BookingSuccess.jsx";
import { months } from "../assets/Utils/months.js";
import '../assets/css/Calendar.css'

const Service_colors = {
    "Golden Hour": "#F59E0B",
    "Snoop Dough": "#92400E",
    "Rental Projector": "#1E293B",
};

const ALL_SERVICES = Object.keys(Service_colors);

const buildStripGradient = (services) => {
    const count = services.length;
    if (count === 0) return null;
    if (count === 1) return Service_colors[services[0]];
    const segmentSize = 100 / count;
    const stops = [];
    services.forEach((svc, i) => {
        const start = i * segmentSize;
        const end = start + segmentSize;
        stops.push(`${Service_colors[svc]} ${start}% ${end}%`);
    });
    return `linear-gradient(to bottom, ${stops.join(", ")})`;
};

const getDayClasses = (bookedServiceList, isToday, isPast) => {

    const base = "relative w-full aspect-square flex justify-center items-center text-center transition-all duration-300 font-extrabold text-sm sm:text-base rounded-[10px] select-none group";

    if (bookedServiceList.length > 0) {
        const isFullyBooked = bookedServiceList.length === ALL_SERVICES.length;
        return `${base} day-cell-booked ${isFullyBooked ? "cursor-default" : "cursor-pointer"}`;
    }
    if (isToday) {
        return `${base} bg-white border border-[#1e1e1e] text-[#1e1e1e] font-black`;
    }
    if (isPast) {
        return `${base} bg-[#1e1e1e] text-white opacity-40 cursor-default border border-white/20`;
    }

    return `${base} day-cell-standard hover:z-10`;
};

export const Calendar = ({ bookings, addBooking }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { currentUser, setShowSignIn } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastBook, setLastBook] = useState(null);

    const bookedDateMap = useMemo(() => {
        const map = new Map();
        bookings.forEach((b) => {
            const key = b.booking_date || `${b.year}-${String(months.indexOf(b.month) + 1).padStart(2, "0")}-${String(b.date).padStart(2, "0")}`;

            if (!map.has(key)) map.set(key, new Set());
            map.get(key).add(b.service);
        });
        return map;
    }, [bookings]);

    const prevMonth = () => {
        const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        if (
            prev.getFullYear() > today.getFullYear() ||
            (prev.getFullYear() === today.getFullYear() && prev.getMonth() >= today.getMonth())
        ) {
            setCurrentDate(prev);
        }
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDayClick = (dayNumber, isPast, isFullyBooked, bookedServices) => {
        if (isPast || isFullyBooked) return;
        if (!currentUser) {
            setShowSignIn(true);
            return;
        }
        setSelectedDate({
            date: dayNumber,
            month: months[currentDate.getMonth()],
            year: currentDate.getFullYear(),
            bookedServices,
        });
        setShowModal(true);
    };

    const handleBookingSuccess = (details) => {
        setShowModal(false);
        setLastBook(details);
        setShowReceipt(true);
    };

    const renderDays = () => {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells = [];

        for (let i = 0; i < firstDay; i++) {
            cells.push(<div key={`empty-${i}`} className="w-full aspect-square" />);
        }

        for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
            const thisDay = new Date(year, month, dayNumber);
            const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNumber).padStart(2, "0")}`;
            const bookedServices = bookedDateMap.get(dateString) || new Set();
            const isToday = thisDay.getTime() === today.getTime();
            const isPast = thisDay < today;
            const bookedServiceList = ALL_SERVICES.filter((svc) => bookedServices.has(svc));
            const isFullyBooked = bookedServiceList.length === ALL_SERVICES.length;
            const stripGradient = buildStripGradient(bookedServiceList);

            cells.push(
                <div
                    key={dayNumber}
                    onClick={() => handleDayClick(dayNumber, isPast, isFullyBooked, bookedServices)}
                    className={getDayClasses(bookedServiceList, isToday, isPast)}
                    style={stripGradient ? { background: stripGradient } : undefined}
                    title={bookedServiceList.length > 0 ? `Booked: ${bookedServiceList.join(", ")}` : undefined}
                >
                    {dayNumber}
                </div>
            );
        }
        return cells;
    };

    const isAtMinMonth =
        currentDate.getFullYear() === today.getFullYear() &&
        currentDate.getMonth() === today.getMonth();

    return (
        <>
            <h3 className="text-center pt-2 font-bold text-xl">Select Your Date</h3>
            <div className="flex justify-center gap-3 flex-wrap py-2">
                {ALL_SERVICES.map((svc) => (
                    <div key={svc} className="flex items-center gap-1 text-xs font-semibold">
                        <div
                            className="w-3 h-3 rounded-full flex-shrink-0 border border-black/10"
                            style={{ background: Service_colors[svc] }}
                        />
                        <span>{svc}</span>
                    </div>
                ))}
            </div>

            <div className="flex justify-center px-2 mt-4" id="calendar">
                <div className="w-full max-w-[34.375rem] bg-[#6184D8] rounded-[10px] m-2 shadow-lg p-2 sm:p-2" >
                    <div className="flex justify-between items-center mb-4 gap-2 p-2">
                        <button
                            onClick={prevMonth}
                            disabled={isAtMinMonth}
                            className="bg-[#1e1e1e] text-[#f5f5f5] border border-[#f5f5f5] px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-base font-bold transition-all duration-200 hover:bg-[#f5f5f5] hover:text-[#6184D8] hover:border-[#6184D8] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            &lt;
                        </button>
                        <h2 className="mb-0 text-2xl sm:text-3xl font-extrabold text-[#1e1e1e] calendar-month-title text-center flex items-center justify-center gap-1.5 tracking-wide">
                            {months[currentDate.getMonth()]}
                            <span className="inline-block bg-[#1e1e1e] text-[#6184D8] border border-white text-xs sm:text-sm font-bold px-2 py-0.5 rounded shadow-sm">
                                {currentDate.getFullYear()}
                            </span>
                        </h2>
                        <button
                            onClick={nextMonth}
                            className="bg-[#1e1e1e] text-[#f5f5f5] border border-[#f5f5f5] px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-base font-bold transition-all duration-200 hover:bg-[#f5f5f5] hover:text-[#6184D8] hover:border-[#6184D8]"
                        >
                            &gt;
                        </button>
                    </div>

                    <div className="grid grid-cols-7 text-center mb-2 px-1">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d} className="flex justify-center items-center font-bold text-[#1e1e1e] text-xs sm:text-sm opacity-90">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5 p-1 bg-[#6184D8] rounded-[10px]">
                        {renderDays()}
                    </div>
                </div>
            </div>

            {showModal && selectedDate && (
                <BookingOptions
                    selectedDate={selectedDate}
                    addBooking={addBooking}
                    onClose={() => setShowModal(false)}
                    showReceipt={handleBookingSuccess}
                    bookedServices={selectedDate.bookedServices}
                />
            )}

            {showReceipt && (
                <BookingSuccess
                    bookingDetails={lastBook}
                    onClose={() => setShowReceipt(false)}
                />
            )}
        </>
    );
};