import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/useAuth.js";
import { BookingOptions } from "./Modals/BookingOptions.jsx";
import { BookingSuccess } from "./BookingSuccess.jsx";
import { months } from "../assets/Utils/months.js";
import { socket } from "../services/socket.js";
import '../assets/css/Calendar.css'
import { useBooking } from "../context/useBooking.js";

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

const getDayClasses = (bookedServiceList, isToday, isPast, isBlocked, hasConflict) => {
    const base = "relative w-full aspect-square flex justify-center items-center text-center transition-all duration-300 font-extrabold text-sm sm:text-base rounded-[10px] select-none group";

    if (isBlocked) {
        return `${base} bg-red-700 text-white cursor-not-allowed border border-red-400`;
    }
    if (hasConflict) {
        return `${base} bg-yellow-500 text-white cursor-wait border-2 border-yellow-300 animate-pulse`;
    }
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

export const Calendar = ({ disableServices, blackoutDates = [] }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { bookings } = useBooking();
    const { currentUser, setShowSignIn } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReceipt, setShowReceipt] = useState(false);
    const [lastBook, setLastBook] = useState(null);
    const [activeConflicts, setActiveConflicts] = useState({});

    useEffect(() => {
        socket.emit('get-active-bookings', (activeBookings) => {
            const conflicts = {};
            activeBookings.forEach(({ key }) => {
                conflicts[key] = true;
            });
            setActiveConflicts(conflicts);
        });

        socket.on('slot-reserved', ({ date, service }) => {
            const key = `${date}-${service}`;
            setActiveConflicts(prev => ({ ...prev, [key]: true }));
        });

        socket.on('slot-released', ({ date, service }) => {
            const key = `${date}-${service}`;
            setActiveConflicts(prev => {
                const newConflicts = { ...prev };
                delete newConflicts[key];
                return newConflicts;
            });
        });

        socket.on('slot-confirmed', ({ date, service }) => {
            const key = `${date}-${service}`;
            setActiveConflicts(prev => {
                const newConflicts = { ...prev };
                delete newConflicts[key];
                return newConflicts;
            });
        });

        socket.on('booking-conflict', ({ message }) => {
            alert(`⚠️ ${message}\n\nSomeone is trying to book the same slot. Please complete your booking quickly!`);
        });

        return () => {
            socket.off('slot-reserved');
            socket.off('slot-released');
            socket.off('slot-confirmed');
            socket.off('booking-conflict');
        };
    }, []);

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

    const handleDayClick = (dayNumber, isPast, isFullyBooked, bookedServices = [], isBlocked, dateString) => {
        if (isPast || isFullyBooked || isBlocked) return;
        if (!currentUser) {
            setShowSignIn(true);
            return;
        }

        const bookedSet = bookedServices || new Set();
        const availableServices = ALL_SERVICES.filter(svc => {
            const isBooked = bookedSet.has(svc);
            const hasConflict = activeConflicts[`${dateString}-${svc}`];
            return !isBooked && !hasConflict;
        });

        if (availableServices.length === 0) {
            alert('All services are currently booked or pending for this date. Please choose another date.');
            return;
        }

        setSelectedDate({
            date: dayNumber,
            month: months[currentDate.getMonth()],
            year: currentDate.getFullYear(),
            bookedServices,
            availableServices,
            dateString
        });
        setShowModal(true);
    };

    const handleBookingSuccess = (details) => {
        setShowModal(false);
        setLastBook(details);
        setShowReceipt(true);
        
        const { service, year, month, date } = details;
        const dateString = `${year}-${String(months.indexOf(month) + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
        
        socket.emit('booking-confirmed', { 
            date: dateString, 
            service, 
            userId: currentUser.id || currentUser.username 
        });
    };

    const handleCloseModal = () => {
        setShowModal(false);
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

            const hasDateConflict = ALL_SERVICES.some(svc => {
                const isBooked = bookedServices.has(svc);
                const hasConflict = activeConflicts[`${dateString}-${svc}`];
                return !isBooked && hasConflict;
            });

            const isBlocked = blackoutDates.includes(dateString);
            const isToday = thisDay.getTime() === today.getTime();
            const isPast = thisDay < today;
            const bookedServiceList = ALL_SERVICES.filter((svc) => bookedServices.has(svc));
            const isFullyBooked = bookedServiceList.length === ALL_SERVICES.length;
            const stripGradient = buildStripGradient(bookedServiceList);

            cells.push(
                <div
                    key={dayNumber}
                    onClick={() => handleDayClick(dayNumber, isPast, isFullyBooked, bookedServices, isBlocked, dateString)}
                    className={getDayClasses(bookedServiceList, isToday, isPast, isBlocked, hasDateConflict)}
                    style={!isBlocked ? (stripGradient ? { background: stripGradient } : undefined) : undefined}
                    title={isBlocked ? "Blocked by Admin" : 
                          hasDateConflict ? "Some services are being booked by another user" :
                          bookedServiceList.length > 0 ? `Booked: ${bookedServiceList.join(", ")}` : undefined}
                >
                    <span>{dayNumber}</span>
                    {hasDateConflict && (
                        <span className="absolute -top-0.5 -right-0.5 text-[10px]">
                            ⏳
                        </span>
                    )}
                    {isBlocked && (
                        <span className="absolute bottom-0.5 text-[10px]">
                            🚫
                        </span>
                    )}
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
                    onClose={handleCloseModal}
                    showReceipt={handleBookingSuccess}
                    bookedServices={selectedDate.bookedServices}
                    disableServices={disableServices}
                    availableServices={selectedDate.availableServices}
                    socket={socket}
                    currentUser={currentUser}
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