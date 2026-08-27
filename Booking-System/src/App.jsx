import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AppProviders } from './context/AppProviders'
import { ProtectedRoute } from './component/ProtectedRoute'
import { Navbar } from './component/Navbar'
import { HeroSection } from './component/HeroSection'
import { Calendar } from './component/Calendar'
import { ReviewContainer } from './component/ReviewContainer'
import { Footer } from './component/Footer'
import { DashboardLayout } from './component/DashboardLayout'
import { AdminPage } from './component/AdminPage'
import { UserPage } from './component/UserPage'
import { AdminProfile } from './component/AdminProfile'
import { UserProfile } from './component/UserProfile'
import { ManageUsers } from './component/ManageUser'
import { HelpSupport } from './component/HelpSupport'
import { Settings } from './component/Settings'
import { Chat } from './component/Chat'
import { socket } from './services/socket'
import './App.css'

function App() {
  const location = useLocation();

  const hideFooterRoutes = [
    '/AdminPage',
    '/AdminProfile',
    '/ManageUsers',
    '/UserPage',
    '/UserProfile',
    '/HelpSupport',
    '/Settings',
  ];
  const hideFooter = hideFooterRoutes.includes(location.pathname);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    socket.off("receive-message");
    socket.on("receive-message", (data) => {
      if (data.sender === "user") {
        setShowChat(true);
      }
    });

    return () => {
      socket.off("receive-message");
    };

  }, []);

  const handleChat = () => {
    setShowChat(prev => !prev)
  }


  return (
    <>
      <AppProviders>
        <Navbar />
        <button
          onClick={handleChat}
          className="bg-[#b6ff2e] text-[#23262f] px-4 py-2 rounded-lg font-bold fixed bottom-10 right-6 z-[200] hover:bg-[#a3e829] transition-colors shadow-lg shadow-[#b6ff2e]/20"
        >
          {showChat ? "Close Chat 💬" : "Message Us 💬"}
        </button>

        <Chat
          socket={socket}
          isVisible={showChat}
          setIsVisible={setShowChat}
        />
        <Routes>
          <Route index element={
            <>
              <HeroSection />
              <Calendar />
              <ReviewContainer />
            </>
          } />
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path='/AdminPage' element={
                <AdminPage />
              } />
              <Route path="/AdminProfile" element={<AdminProfile />} />
              <Route path="/ManageUsers" element={<ManageUsers />} />
            </Route>
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path='UserPage' element={<UserPage />
              } />
              <Route path='/UserProfile' element={<UserProfile />} />
              <Route path='/HelpSupport' element={<HelpSupport />} />
              <Route path='/Settings' element={<Settings />} />
            </Route>
          </Route>
        </Routes>
        {!hideFooter && <Footer />}
      </AppProviders>
    </>
  )
}

export default App