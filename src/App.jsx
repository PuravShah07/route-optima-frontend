import { useState } from "react";
import { AnimatedBackground } from "./components/AnimatedBackground";
import { Header } from "./components/Header";
import { LandingPage } from "./components/LandingPage";
import { CSVUploadPage } from "./components/CSVUploadPage";
import { RoutesOverviewPage } from "./components/RoutesOverviewPage";
import { ContactPage } from "./components/ContactPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [orders, setOrders] = useState([]);
  
  const handleRoutesGenerated = (generatedOrders) => {
    setOrders(generatedOrders);
    setCurrentPage('routes');
  };
  
  return (
    <div className="min-h-screen bg-white relative">
      <AnimatedBackground />
      <div className="relative z-10">
        <Header 
          onNavigate={setCurrentPage}
          currentPage={currentPage}
        />
        
        {currentPage === 'landing' && (
          <LandingPage 
            onGetStarted={() => setCurrentPage('upload')}
            heroImage="https://images.unsplash.com/photo-1668652164517-c760a97e6fc3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpdmVyeSUyMHRydWNrJTIwbWFwJTIwcm91dGV8ZW58MXx8fHwxNzYxMzEyMTMyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          />
        )}
        
        {currentPage === 'upload' && (
          <CSVUploadPage onRoutesGenerated={handleRoutesGenerated} />
        )}
        
        {currentPage === 'routes' && orders.length > 0 && (
          <RoutesOverviewPage orders={orders} />
        )}
        
        {currentPage === 'contact' && (
          <ContactPage />
        )}
      </div>
    </div>
  );
}