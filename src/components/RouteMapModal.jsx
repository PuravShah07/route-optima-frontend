import { useState, useEffect } from "react";
import { X, Play, Pause, RotateCcw, Navigation2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { Card } from "./ui/card";
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Auto-zoom helper component
function FitMapBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 1) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
}

export function RouteMapModal({ isOpen, onClose, clusterNumber, orders }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  if (!orders || orders.length === 0) return null;

  const positions = orders.map((o) => [parseFloat(o.Latitude), parseFloat(o.Longitude)]);
  const progress = (currentStep / (orders.length - 1)) * 100;
  const currentOrder = orders[currentStep];

  // Animation playback logic (unchanged)
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
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
    if (currentStep >= orders.length - 1) setCurrentStep(0);
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

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
          {/* 🗺️ Real OpenStreetMap */}
          <div className="relative w-full h-[500px] bg-white rounded-lg overflow-hidden border-2 border-gray-200">
            <MapContainer
              center={positions[0]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              />
              <FitMapBounds positions={positions} />

              {/* Route Line */}
              <Polyline positions={positions} color="blue" weight={4} opacity={0.7} />

              {/* Markers */}
              {positions.map((pos, i) => (
                <Marker key={i} position={pos}>
                  <Popup>
                    Stop {i + 1}: {orders[i].CustomerName}
                    <br />
                    {orders[i].Latitude}, {orders[i].Longitude}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Current Stop Info */}
          <Card className="p-4 bg-linear-to-r from-[#1E90FF]/5 to-[#0B3D91]/5">
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
                    <span
                      className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                        currentOrder.IsPaidDelivery
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {currentOrder.IsPaidDelivery ? "Paid" : "Standard"}
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

                <Button onClick={handleReset} variant="outline" size="sm">
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

            {/* External Google Maps link (kept same for convenience) */}
            <div className="flex justify-center">
              <Button
                onClick={() => {
                  const url = `https://www.google.com/maps/dir/${orders
                    .map((o) => `${o.Latitude},${o.Longitude}`)
                    .join("/")}`;
                  window.open(url, "_blank");
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
