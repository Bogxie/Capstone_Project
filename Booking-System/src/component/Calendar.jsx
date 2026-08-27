import { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/useAuth.js";
import { BookingOptions } from "./Modals/BookingOptions.jsx";
import { BookingSuccess } from "./BookingSuccess.jsx";
import { months } from "../assets/Utils/months.js";
import { socket } from "../services/socket.js";
import { useService } from "../context/useService.js";
import { useBooking } from "../context/useBooking.js";
import '../assets/css/Calendar.css'

const Service_colors = {
    "Golden Hour": "#F59E0B",
    "Snoop Dough": "#EA580C",
    "Rental Projector": "#06B6D4",
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
        return `${base} bg-zinc-700 text-white cursor-not-allowed border border-red-500/50`;
    }
    if (hasConflict) {
        return `${base} bg-yellow-500/20 text-white cursor-wait border-2 border-yellow-400 animate-pulse`;
    }
    if (bookedServiceList.length > 0) {
        const isFullyBooked = bookedServiceList.length === ALL_SERVICES.length;
        if (isPast) {
            return `${base} day-cell-booked opacity-50 cursor-default`;
        }
        return `${base} day-cell-booked ${isFullyBooked ? "cursor-default" : "cursor-pointer"}`;
    }
    if (isToday) {
        return `${base} bg-lime-500 text-zinc-950 font-black border-2 border-white`;
    }
    if (isPast) {
        return `${base} bg-zinc-800 text-zinc-500 opacity-50 cursor-default border border-zinc-700`;
    }

    return `${base} day-cell-standard hover:z-10`;
};

export const Calendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const maxAllowedDate = new Date(today);
    maxAllowedDate.setMonth(today.getMonth() + 2);
    maxAllowedDate.setDate(1);
    maxAllowedDate.setHours(0, 0, 0, 0);
    
    const { serviceConfig = {}, disableServices = [], blackoutDates = []} = useService();
    console.log('📋 blackoutDates from context:', blackoutDates);
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

        const onSlotReserved = ({ date, service }) => {
            const key = `${date}-${service}`;
            setActiveConflicts(prev => ({ ...prev, [key]: true }));
        };

        const onSlotReleased = ({ date, service }) => {
            const key = `${date}-${service}`;
            setActiveConflicts(prev => {
                const newConflicts = { ...prev };
                delete newConflicts[key];
                return newConflicts;
            });
        };

        const onSlotConfirmed = ({ date, service }) => {
            const key = `${date}-${service}`;
            setActiveConflicts(prev => {
                const newConflicts = { ...prev };
                delete newConflicts[key];
                return newConflicts;
            });
        };

        const onBookingCreated = ({ date, service }) => {
            console.log(`📅 New permanent booking: ${service} on ${date}`);
            const key = `${date}-${service}`;
            setActiveConflicts(prev => ({ ...prev, [key]: true }));
        };

        const onBookingConflict = ({ message }) => {
            alert(`⚠️ ${message}\n\nSomeone is trying to book the same slot. Please complete your booking quickly!`);
        };

        socket.on('slot-reserved', onSlotReserved);
        socket.on('slot-released', onSlotReleased);
        socket.on('slot-confirmed', onSlotConfirmed);
        socket.on('booking-created', onBookingCreated);
        socket.on('booking-conflict', onBookingConflict);

        return () => {
            socket.off('slot-reserved', onSlotReserved);
            socket.off('slot-released', onSlotReleased);
            socket.off('slot-confirmed', onSlotConfirmed);
            socket.off('booking-created', onBookingCreated);
            socket.off('booking-conflict', onBookingConflict);
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
        setCurrentDate(prev);
    };

    const nextMonth = () => {
        const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        const nextMonthStart = new Date(next.getFullYear(), next.getMonth(), 1);

        if (nextMonthStart.getTime() <= maxAllowedDate.getTime()) {
            setCurrentDate(next);
        }
    };

    const isPrevDisabled = () => {
        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const currentMonthStartView = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        return currentMonthStartView.getTime() <= currentMonthStart.getTime();
    };

    const isNextDisabled = () => {
        const nextMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        return nextMonthStart.getTime() > maxAllowedDate.getTime();
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
            const isDisabled = disableServices.includes(svc);
            return !isBooked && !hasConflict && !isDisabled;
        });

        const allDisabled = ALL_SERVICES.every(svc => disableServices.includes(svc));
        if (allDisabled) {
            alert('All services are currently unavailable. Please check back later.');
            return;
        }

        if (availableServices.length === 0) {
            alert('All services are currently booked or unavailable for this date. Please choose another date.');
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
            userId: currentUser?.user_id || currentUser?.id || currentUser?.username
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

            const disabledForDate = ALL_SERVICES.filter(svc => disableServices.includes(svc));

            let titleText = "";
            if (isBlocked) {
                titleText = "Blocked by Admin";
            } else if (hasDateConflict) {
                titleText = "Some services are being booked by another user";
            } else if (bookedServiceList.length > 0 && disabledForDate.length > 0) {
                titleText = `Booked: ${bookedServiceList.join(", ")} | Unavailable: ${disabledForDate.join(", ")}`;
            } else if (bookedServiceList.length > 0) {
                titleText = `Booked: ${bookedServiceList.join(", ")}`;
            } else if (disabledForDate.length > 0) {
                titleText = `Unavailable: ${disabledForDate.join(", ")}`;
            }

            cells.push(
                <div
                    key={dayNumber}
                    onClick={() => handleDayClick(dayNumber, isPast, isFullyBooked, bookedServices, isBlocked, dateString)}
                    className={getDayClasses(bookedServiceList, isToday, isPast, isBlocked, hasDateConflict)}
                    style={!isBlocked ? (stripGradient ? { background: stripGradient } : undefined) : undefined}
                    title={titleText}
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
                    {isPast && bookedServiceList.length > 0 && (
                        <span className="absolute -top-0.5 -left-0.5 text-[8px] opacity-70">
                            📅
                        </span>
                    )}
                </div>
            );
        }
        return cells;
    };

    const prevDisabled = isPrevDisabled();
    const nextDisabled = isNextDisabled();

    return (
        <>
            <h3 className="text-center pt-2 font-bold text-xl text-text-primary">Select Your Date</h3>

            <div className="flex justify-center gap-3 flex-wrap py-2">
                {ALL_SERVICES.map((svc) => {
                    const isDisabled = disableServices.includes(svc);
                    return (
                        <div key={svc} className="flex items-center gap-1 text-xs font-semibold text-text-secondary">
                            <div
                                className={`w-3 h-3 rounded-full flex-shrink-0 border border-border ${isDisabled ? 'opacity-40 grayscale' : ''}`}
                                style={{ background: isDisabled ? '#6b7280' : Service_colors[svc] }}
                            />
                            <span className={isDisabled ? 'line-through text-zinc-500' : ''}>
                                {svc}
                                {isDisabled && <span className="text-red-400 ml-1 text-[8px]">(disabled)</span>}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center px-2 mt-4" id="calendar">
                <div className="w-full max-w-[34.375rem] bg-bg-card rounded-[10px] m-2 shadow-lg p-2 sm:p-2 border border-border">
                    <div className="flex justify-between items-center mb-4 gap-2 p-2">
                        <button
                            onClick={prevMonth}
                            disabled={prevDisabled}
                            className="bg-bg-secondary text-text-primary border border-border px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-base font-bold transition-all duration-200 hover:bg-lime-500 hover:text-black hover:border-lime-400 disabled:opacity-30 disabled:cursor-not-allowed"
                            title={prevDisabled ? "You are at current month" : "Previous month"}
                        >
                            &lt;
                        </button>
                        <h2 className="mb-0 text-2xl sm:text-3xl font-extrabold text-text-primary calendar-month-title text-center flex items-center justify-center gap-1.5 tracking-wide">
                            {months[currentDate.getMonth()]}
                            <span className="inline-block bg-bg-secondary text-lime-400 border border-border text-xs sm:text-sm font-bold px-2 py-0.5 rounded shadow-sm">
                                {currentDate.getFullYear()}
                            </span>
                        </h2>
                        <button
                            onClick={nextMonth}
                            disabled={nextDisabled}
                            className="bg-bg-secondary text-text-primary border border-border px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-base font-bold transition-all duration-200 hover:bg-lime-500 hover:text-black hover:border-lime-400 disabled:opacity-30 disabled:cursor-not-allowed"
                            title={nextDisabled ? "Cannot go beyond 3 months" : "Next month"}
                        >
                            &gt;
                        </button>
                    </div>

                    <div className="grid grid-cols-7 text-center mb-2 px-1">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                            <div key={d} className="flex justify-center items-center font-bold text-text-muted text-xs sm:text-sm opacity-90">
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5 p-1 bg-bg-card rounded-[10px]">
                        {renderDays()}
                    </div>

                    <div className="text-center text-[10px] text-text-muted mt-2 border-t border-border pt-2">
                        📅 Can view from current month up to 3 months ahead
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
                    serviceConfig={serviceConfig}
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