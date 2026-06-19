import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { colorStatus } from '../assets/utils/colorStatus';
import { formatCurrency } from '../assets/Utils/formatCurrency';

export const AdminProfile = ({ bookings }) => {
    const { currentUser } = useAuth();
    if (!currentUser) return null;

    const stats = [
        { label: "Total", count: bookings.length },
        { label: "Pending", count: bookings.filter(b => b.status === "Pending").length },
        { label: "Confirmed", count: bookings.filter(b => b.status === "Confirmed").length },
        { label: "Completed", count: bookings.filter(b => b.status === "Complete").length },
        { label: "Cancelled", count: bookings.filter(b => b.status === "Cancelled").length }
    ];

    const totalRevenue = bookings
        .filter(b => b.status === "Complete")
        .reduce((sum, b) => sum + Number(b.total || 0), 0);

    const recentBookings = [...bookings]
        .sort((a, b) => parseInt(b.bookID.split('-')[1]) - parseInt(a.bookID.split('-')[1]))
        .slice(0, 5);

    return (
        <>
            <title>Admin Profile</title>

            {/* Profile Card */}
            {/* Profile Card */}
            <div className="bg-black border border-yellow-500 rounded-lg p-6">
                <div className="flex items-center gap-4">
                    <img
                        src={currentUser.profile}
                        alt="Admin Profile"
                        className="w-20 h-20 rounded-full border-2 border-yellow-500 object-cover"
                    />

                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-yellow-400">
                                {currentUser.username}
                            </h2>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-500 text-black">
                                {currentUser.role}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            {currentUser.email}
                        </p>
                    </div>
                </div>
            </div>
            {/* Revenue Highlight */}
            <div className="mt-6 bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/40 rounded-lg p-4 flex items-center justify-between">
                <div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">Total Revenue (Completed)</div>
                    <div className="text-2xl font-bold text-yellow-400 mt-1">₱{formatCurrency(totalRevenue)}</div>
                </div>
                <div className="text-4xl">💰</div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-3 mt-6">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="bg-black border border-gray-700 rounded-lg py-6 text-center"
                    >
                        <div className="text-2xl font-bold text-yellow-400">
                            {stat.count}
                        </div>
                        <div className="text-gray-400 text-sm mt-1">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Bookings */}
            <div className="mt-6 bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden">
                <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">
                    Recent Bookings
                </div>
                {recentBookings.length === 0 ? (
                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                        No bookings yet.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {recentBookings.map((b) => (
                            <div key={b.bookID} className="flex justify-between items-center px-4 py-3 text-sm">
                                <div>
                                    <div className="font-semibold text-white">{b.bookID} — {b.service}</div>
                                    <div className="text-gray-400 text-xs">{b.month} {b.date}, {b.year} · {b.venue}</div>
                                </div>
                                <span className={`text-xs font-bold px-3 py-0.5 rounded-full text-black ${colorStatus(b.status)}`}>
                                    {b.status}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Details Card */}
            <div className="mt-6 bg-gray-900 border border-yellow-500 rounded-lg overflow-hidden">
                <div className="bg-black text-yellow-400 px-4 py-3 font-semibold">
                    Admin Details
                </div>

                <div className="divide-y divide-gray-700">
                    {[
                        ["Role", currentUser.role],
                        ["Username", currentUser.username],
                        ["Email", currentUser.email],
                        ["Phone Number", currentUser.phone || "Not set"],
                        ["Address", currentUser.address || "Not set"]
                    ].map(([key, val]) => (
                        <div
                            key={key}
                            className="flex justify-between px-4 py-3 text-sm"
                        >
                            <span className="text-gray-400">{key}</span>
                            <span className="font-semibold text-white">
                                {val}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-6">
                <NavLink to="/AdminPage">
                    <button className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition">
                        ← Back to Dashboard
                    </button>
                </NavLink>
            </div>
        </>
    );
};