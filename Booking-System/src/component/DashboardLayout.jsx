import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.jsx';

export const DashboardLayout = () => {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
            <Sidebar showSidebar={showSidebar} onClose={() => setShowSidebar(false)} />

            {/* Mobile overlay */}
            {showSidebar && (
                <div
                    className="fixed inset-0 bg-black/50 z-[200] lg:hidden"
                    onClick={() => setShowSidebar(false)}
                />
            )}

            <div className="lg:ml-[12.5rem] mt-16 p-4 min-h-screen">

                {/* Mobile sidebar toggle */}
                <button
                    className="lg:hidden mb-3 px-3 py-2 bg-[#212529] text-white rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
                    onClick={() => setShowSidebar(true)}
                >
                    ☰
                </button>
                <Outlet />
            </div>
        </>
    );
};