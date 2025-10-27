import { useState, useEffect, useRef } from "react";
import { X, Play, Pause, RotateCcw, Navigation2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";

export function RouteMapModal({ isOpen, onClose, clusterNumber, orders }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const canvasRef = useRef(null);

  // Calculate bounds for visualization
  const lats = orders.map(o => o.Latitude);
  const lngs = orders.map(o => o.Longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const centerLat = (maxLat + minLat) / 2;
  const centerLng = (maxLng + minLng) / 2;

  // Draw map visualization
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#e0e7ff';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo((width / 10) * i, 0);
      ctx.lineTo((width / 10) * i, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, (height / 10) * i);
      ctx.lineTo(width, (height / 10) * i);
      ctx.stroke();
    }

    // Function to convert lat/lng to canvas coordinates
    const toCanvasCoords = (lat, lng) => {
      const padding = 50;
      const latRange = maxLat - minLat || 0.01;
      const lngRange = maxLng - minLng || 0.01;
      
      const x = padding + ((lng - minLng) / lngRange) * (width - 2 * padding);
      const y = height - (padding + ((lat - minLat) / latRange) * (height - 2 * padding));
      
      return { x, y };
    };

    // Draw route lines
    ctx.strokeStyle = '#1E90FF';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 5]);
    
    ctx.beginPath();
    orders.forEach((order, index) => {
      const { x, y } = toCanvasCoords(order.Latitude, order.Longitude);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw markers
    orders.forEach((order, index) => {
      const { x, y } = toCanvasCoords(order.Latitude, order.Longitude);
      
      // Determine color
      let color = '#1E90FF';
      if (index === 0) color = '#10b981'; // Start - green
      if (index === orders.length - 1) color = '#ef4444'; // End - red
      if (index === currentStep) color = '#f59e0b'; // Current - orange

      // Draw marker shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(x, y + 22, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw marker
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y - 10, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw marker point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 8, y - 18);
      ctx.lineTo(x + 8, y - 18);
      ctx.closePath();
      ctx.fill();

      // Draw inner circle
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(x, y - 10, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw number
      ctx.fillStyle = color;
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(index + 1, x, y - 10);

      // Highlight current step
      if (index === currentStep && isPlaying) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y - 10, 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

  }, [isOpen, orders, currentStep, isPlaying, minLat, maxLat, minLng, maxLng]);

  // Animation playback
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= orders.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [isPlaying, orders.length]);

  const handlePlay = () => {
    if (currentStep >= orders.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const progress = (currentStep / (orders.length - 1)) * 100;
  const currentOrder = orders[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#0B3D91] flex items-center gap-2">
            <Navigation2 className="w-6 h-6 text-[#1E90FF]" />
            Vehicle {clusterNumber} Route Map
          </DialogTitle>
          <p className="text-gray-500 mt-1">
            {orders.length} delivery stops • Interactive route visualization
          </p>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Canvas Map */}
          <div className="relative w-full h-[500px] bg-white rounded-lg overflow-hidden border-2 border-gray-200">
            <canvas
              ref={canvasRef}
              width={1000}
              height={500}
              className="w-full h-full"
            />
          </div>

          {/* Current Order Info Card */}
          <Card className="p-4 bg-gradient-to-r from-[#1E90FF]/5 to-[#0B3D91]/5">
            <div className="flex items-start gap-4">
              <div className="bg-[#1E90FF] p-3 rounded-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#0B3D91] font-semibold text-lg mb-2">
                  Stop {currentStep + 1}: {currentOrder.CustomerName}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Order ID:</span>
                    <span className="ml-2 font-medium">{currentOrder.OrderID}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <span className="ml-2 font-medium">{currentOrder.OrderStatus}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Latitude:</span>
                    <span className="ml-2 font-medium">{currentOrder.Latitude.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Longitude:</span>
                    <span className="ml-2 font-medium">{currentOrder.Longitude.toFixed(4)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Delivery Type:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      currentOrder.IsPaidDelivery ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {currentOrder.IsPaidDelivery ? 'Paid' : 'Standard'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Animation Controls */}
          <div className="space-y-4">
            <div className="bg-[#F2F2F2] rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[#0B3D91] font-medium">
                    Stop {currentStep + 1} of {orders.length}
                  </span>
                  <AnimatePresence>
                    {isPlaying && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex items-center gap-1 text-green-600"
                      >
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        <span className="text-sm">Playing</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <span className="text-gray-600">{orders[currentStep].CustomerName}</span>
              </div>
              
              <Progress value={progress} className="h-2 mb-4" />
              
              <div className="flex items-center gap-2">
                {!isPlaying ? (
                  <Button
                    onClick={handlePlay}
                    className="bg-[#1E90FF] hover:bg-[#0B3D91] text-white"
                    size="sm"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Play Route
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    variant="outline"
                    className="border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF]/10"
                    size="sm"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                )}
                
                <Button
                  onClick={handleReset}
                  variant="outline"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 p-4 bg-[#F2F2F2] rounded-lg flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-gray-700 text-sm">Start Point</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#1E90FF] rounded-full"></div>
                <span className="text-gray-700 text-sm">Delivery Stop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-gray-700 text-sm">End Point</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700 text-sm">Current Stop</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 border-t-2 border-dashed border-[#1E90FF]"></div>
                <span className="text-gray-700 text-sm">Route Path</span>
              </div>
            </div>

            {/* Google Maps Link */}
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/${orders.map(o => `${o.Latitude},${o.Longitude}`).join('/')}`;
                  window.open(url, '_blank');
                }}
                variant="outline"
                className="border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF]/10"
              >
                <Navigation2 className="w-4 h-4 mr-2" />
                Open in Google Maps
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}