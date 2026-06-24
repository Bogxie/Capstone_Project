import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { FeedbackProvider } from './context/FeedbackProvider'
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
import { HelpSupport } from './component/HelpSupport'
import { Settings } from './component/Settings'
import { Chat } from './component/Chat'
import { deliveryOption } from './assets/utils/deliveryOptions'
import { service_config } from './assets/utils/ServiceConfig'
import io from 'socket.io-client'
import './App.css'

const socket = io.connect("http://localhost:3001");

function App() {

  const [bookings, setBookings] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [serviceConfig, setServiceConfig] = useState(service_config);
  const [deliveryFee, setDeliveryFee] = useState(deliveryOption);
  const [blackoutDates, setBlackoutDates] = useState([]);
  const [disableServices, setDisableServices] = useState([])

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

  const addBooking = (newBooking) => {
    const lastID = bookings.length ? Number(bookings[bookings.length - 1].bookID.split('-')[1]) : 1000;
    const withID = { ...newBooking, bookID: `BK-${lastID + 1}` };
    setBookings(prev => [...prev, withID]);
    return withID;
  };

  const updateBooking = (id, updateBookings) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.bookID === id ? { ...booking, ...updateBookings } : booking
      )
    );
  };

  return (
    <>
      <AuthProvider>
        <FeedbackProvider bookings={bookings}>
          <Navbar />
          <button
            onClick={handleChat}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold fixed bottom-6 right-6 z-[200]"
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
                <HeroSection
                  deliveryFee={deliveryFee}
                  serviceConfig={serviceConfig}
                  setServiceConfig={setServiceConfig}
                />
                <Calendar
                  bookings={bookings}
                  addBooking={addBooking}
                  blackoutDates={blackoutDates}
                  disableServices={disableServices}
                />
                <ReviewContainer />
              </>
            } />
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path='/AdminPage' element={
                  <AdminPage bookings={bookings} updateBooking={updateBooking} />
                } />
                <Route path="/AdminProfile" element={<AdminProfile bookings={bookings} />} />
              </Route>
            </Route>
            <Route element={<ProtectedRoute allowedRoles={['User', 'Admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path='UserPage' element={<UserPage bookings={bookings} updateBooking={updateBooking} />
                } />
                <Route path='/HelpSupport' element={<HelpSupport />} />
                <Route path='/Settings' element={<Settings
                  deliveryFee={deliveryFee}
                  setDeliveryFee={setDeliveryFee}
                  serviceConfig={serviceConfig}
                  setServiceConfig={setServiceConfig}
                  blackoutDates={blackoutDates}
                  setBlackoutDates={setBlackoutDates}
                  disableServices={disableServices}
                  setDisableServices={setDisableServices}
                />} />
              </Route>
            </Route>
          </Routes>
          <Footer />
        </FeedbackProvider>
      </AuthProvider>
    </>
  )
}

export default App
