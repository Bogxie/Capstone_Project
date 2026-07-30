import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import axios from 'axios'
import { ThemeProvider } from './context/ThemeProvider'
import { AuthProvider } from './context/AuthProvider'
import { FeedbackProvider } from './context/FeedbackProvider'
import { BookingProvider } from './context/BookingProvider'
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
import { service_config } from './assets/utils/ServiceConfig'
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
  const [serviceConfig, setServiceConfig] = useState(service_config);
  const [blackoutDates, setBlackoutDates] = useState([]);
  const [disableServices, setDisableServices] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMunicipalities = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/municipalities');
      setMunicipalities(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching municipalities:', err);
      setMunicipalities([]);
      return [];
    }
  }

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/services');
      console.log('📦 Service Config from DB:', response.data);
      setServiceConfig(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching services:', err);
      setServiceConfig(service_config);
      return service_config;
    }
  }

  // ✅ FETCH DISABLED SERVICES FROM DATABASE
  const fetchDisabledServices = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/services/disabled');
      const disabled = response.data.disabledServices || [];
      console.log('🚫 Disabled services from DB:', disabled);
      setDisableServices(disabled);
      return disabled;
    } catch (err) {
      console.error('Error fetching disabled services:', err);
      setDisableServices([]);
      return [];
    }
  };

  // ✅ LOAD ALL DATA
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchMunicipalities(), 
        fetchServices(),
        fetchDisabledServices()  // ✅ Add this
      ]);
      setLoading(false);
    };
    loadData();
  }, [])

  // ✅ LISTEN FOR REAL-TIME SERVICES STATUS CHANGE
  useEffect(() => {
    const onServicesStatusChanged = (data) => {
      console.log('🔄 Services status changed (real-time):', data.disabledServices);
      setDisableServices(data.disabledServices);
    };

    socket.on('services-status-changed', onServicesStatusChanged);

    return () => {
      socket.off('services-status-changed', onServicesStatusChanged);
    };
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-lime-400 text-xl font-bold animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <BookingProvider>
            <FeedbackProvider>
              <Navbar />
              <button
                onClick={handleChat}
                className="bg-lime-500 text-black px-4 py-2 rounded-lg font-bold fixed bottom-10 right-6 z-[200] hover:bg-lime-400 transition-colors shadow-lg shadow-lime-500/20"
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
                      serviceConfig={serviceConfig}
                      municipalities={municipalities}
                    />
                    <Calendar
                      blackoutDates={blackoutDates}
                      disableServices={disableServices}
                      serviceConfig={serviceConfig}
                    />
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
                    <Route path='/Settings' element={<Settings
                      municipalities={municipalities}
                      setMunicipalities={setMunicipalities}
                      refreshMunicipalities={fetchMunicipalities}
                      serviceConfig={serviceConfig}
                      setServiceConfig={setServiceConfig}
                      refreshServices={fetchServices}
                      blackoutDates={blackoutDates}
                      setBlackoutDates={setBlackoutDates}
                      disableServices={disableServices}
                      setDisableServices={setDisableServices}
                    />} />
                  </Route>
                </Route>
              </Routes>
              {!hideFooter && <Footer />}
            </FeedbackProvider>
          </BookingProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  )
}

export default App