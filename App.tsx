
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import FeatureGrid from './components/FeatureGrid.tsx';
import NavHub from './components/NavHub.tsx';
import ARView from './components/ARView.tsx';
import AdminPanel from './components/AdminPanel.tsx';
import AdminLogin from './components/AdminLogin.tsx';
import LocationPrompt from './components/LocationPrompt.tsx';
import CampusMap from './components/CampusMap.tsx';
import SmartAssistant from './components/SmartAssistant.tsx';
import { CampusLocation } from './types.ts';
import { INITIAL_LOCATIONS } from './constants.ts';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'navigation' | 'ar' | 'admin' | 'full_map' | 'admin_login'>('home');
  const [selectedLocation, setSelectedLocation] = useState<CampusLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem('campus_admin_active') === 'true';
  });

  const [locations, setLocations] = useState<CampusLocation[]>(() => {
    const stored = localStorage.getItem('campus_locations');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Failed to parse locations from storage", e);
      }
    }
    return INITIAL_LOCATIONS;
  });

  const startLocationTracking = useCallback(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLoading(false);
          setShowLocationPrompt(false);
        },
        (error) => {
          console.error("Location error:", error);
          setLoading(false);
          setShowLocationPrompt(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
      return watchId;
    }
    setLoading(false);
    return null;
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          startLocationTracking();
        } else if (result.state === 'prompt') {
          setLoading(false);
          setShowLocationPrompt(true);
        } else {
          setLoading(false);
        }
      });
    } else {
      setShowLocationPrompt(true);
      setLoading(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [startLocationTracking]);

  useEffect(() => {
    localStorage.setItem('campus_locations', JSON.stringify(locations));
  }, [locations]);

  const handleStartNavigation = (loc?: CampusLocation) => {
    if (loc) setSelectedLocation(loc);
    setView('ar');
  };

  const handleAdminAuth = (pin: string) => {
    if (pin === "8121") {
      setIsAdmin(true);
      sessionStorage.setItem('campus_admin_active', 'true');
      setView('admin');
    }
  };

  const handleLogout = () => {
    if (window.confirm("Logout from Admin mode?")) {
      setIsAdmin(false);
      sessionStorage.removeItem('campus_admin_active');
      setView('home');
    }
  };

  const handleHeaderNav = (newView: any) => {
    if (newView === 'admin' && !isAdmin) {
      setView('admin_login');
    } else {
      setView(newView);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-blue-900 flex flex-col items-center justify-center z-[2000] text-white animate-fade-in">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold tracking-widest animate-pulse uppercase text-center px-6">
          Avanthi's St Theressa
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-x-hidden">
      {showLocationPrompt && (
        <LocationPrompt 
          onAccept={startLocationTracking} 
          onDecline={() => setShowLocationPrompt(false)} 
        />
      )}

      {isOffline && (
        <div className="bg-slate-800 text-white py-1.5 px-6 text-center text-[10px] font-black uppercase tracking-widest sticky top-0 z-[101]">
          <i className="fas fa-wifi-slash mr-2 text-amber-400"></i> Offline Mode
        </div>
      )}

      <Header 
        setView={handleHeaderNav} 
        currentView={view} 
        isAdmin={isAdmin} 
        onAdminClick={() => setView('admin_login')}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow relative">
        {/* AR View is rendered outside the transition container to prevent transform-related fixed position issues */}
        {view === 'ar' && (
          <div className="animate-fade-in fixed inset-0 z-[2000]">
            <ARView destination={selectedLocation} userLocation={userLocation} onClose={() => setView('navigation')} />
          </div>
        )}

        <div key={view} className={view === 'ar' ? 'hidden' : 'view-transition'}>
          {view === 'home' && (
            <>
              <Hero onStart={() => setView('navigation')} />
              <FeatureGrid />
              
              <div className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                  <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-2/5">
                      <div className="inline-block px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6">Campus Navigation</div>
                      <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-slate-900">Discover Our <br/>Interactive Campus</h2>
                      <p className="text-slate-600 mb-10 leading-relaxed text-lg">Navigate through Avanthi's St Theressa Institute with our state-of-the-art AR system. Find laboratories, administrative offices, and general facilities with real-time turn-by-turn guidance.</p>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => setView('navigation')} className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-600 transition-all shadow-2xl flex items-center justify-center group">
                          Launch Explorer <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                        </button>
                      </div>
                    </div>
                    <div className="lg:w-3/5 w-full h-[500px] relative">
                      <div className="absolute inset-0 bg-blue-600/5 rounded-[48px] -rotate-1 scale-105"></div>
                      <CampusMap 
                        locations={locations} 
                        userLocation={userLocation} 
                        destination={selectedLocation} 
                        onSelectLocation={handleStartNavigation} 
                        className="h-full border-white border-[16px] shadow-[0_32px_80px_rgba(0,0,0,0.15)] rounded-[48px]" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {view === 'navigation' && (
            <div className="max-w-7xl mx-auto py-12 px-6 h-[calc(100vh-80px)] min-h-[600px]">
               <NavHub locations={locations} userLocation={userLocation} onSelect={(loc) => handleStartNavigation(loc)} />
            </div>
          )}
          
          {view === 'admin_login' && (
            <div className="py-24">
              <AdminLogin onLogin={handleAdminAuth} onCancel={() => setView('home')} />
            </div>
          )}

          {view === 'admin' && isAdmin && (
            <div className="max-w-7xl mx-auto py-12 px-6 min-h-[calc(100vh-80px)]">
              <AdminPanel locations={locations} setLocations={setLocations} />
            </div>
          )}
        </div>
      </main>

      {view !== 'ar' && <SmartAssistant />}

      <footer className="bg-slate-900 text-white py-20 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-8">
                 <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-900/40"><i className="fas fa-university text-2xl"></i></div>
                 <h3 className="text-2xl font-black uppercase tracking-tight">Avanthi's St Theressa</h3>
              </div>
              <p className="text-slate-400 text-base leading-relaxed max-w-md">The future of campus orientation. Empowering students and visitors with precision AR wayfinding and live intelligent assistance.</p>
            </div>
            
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-8">Connect</h3>
              <ul className="space-y-5 text-slate-300 text-sm font-bold">
                <li className="flex items-center group cursor-pointer hover:text-white transition-colors">
                  <i className="fas fa-envelope mr-4 text-blue-500 w-5 text-center group-hover:scale-110 transition-transform"></i> sttheressa99@gmail.com
                </li>
                <li className="flex items-center group cursor-pointer hover:text-white transition-colors">
                  <i className="fas fa-phone mr-4 text-blue-500 w-5 text-center group-hover:scale-110 transition-transform"></i> +91-9704755549
                </li>
                <li className="flex items-center group cursor-pointer hover:text-white transition-colors">
                  <i className="fas fa-map-marker-alt mr-4 text-blue-500 w-5 text-center group-hover:scale-110 transition-transform"></i> Garividi, Andhra Pradesh
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-500 mb-8">Social Media</h3>
              <div className="flex space-x-4">
                <a href="#" className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-all hover:-translate-y-1"><i className="fab fa-facebook-f text-lg"></i></a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-pink-600 transition-all hover:-translate-y-1"><i className="fab fa-instagram text-lg"></i></a>
                <a href="#" className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center hover:bg-sky-500 transition-all hover:-translate-y-1"><i className="fab fa-twitter text-lg"></i></a>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">&copy; 2025 Avanthi Group of Institutions • Research & Innovation Cell</p>
            <div className="flex space-x-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-500 transition-colors">Guidelines</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
