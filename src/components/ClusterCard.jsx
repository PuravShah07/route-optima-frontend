import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, DollarSign, Navigation } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function ClusterCard({ 
  clusterNumber, 
  orders, 
  totalCost, 
  totalDistance,
  onViewMap 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
      {/* Card Header */}
      <div 
        className="p-6 cursor-pointer bg-gradient-to-r from-[#1E90FF]/5 to-[#0B3D91]/5 hover:from-[#1E90FF]/10 hover:to-[#0B3D91]/10 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#1E90FF] to-[#0B3D91] w-12 h-12 rounded-full flex items-center justify-center">
              <span className="text-white" style={{ fontSize: '18px', fontWeight: '700' }}>
                {clusterNumber}
              </span>
            </div>
            <div>
              <h3 className="text-[#0B3D91]" style={{ fontSize: '20px', fontWeight: '600' }}>
                Vehicle {clusterNumber} Route
              </h3>
              <p className="text-gray-500">
                {orders.length} deliveries
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-[#0B3D91]" style={{ fontSize: '20px', fontWeight: '700' }}>
                  ₹{totalCost.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Navigation className="w-4 h-4 text-[#1E90FF]" />
                <span className="text-gray-600">
                  {totalDistance.toFixed(1)} km
                </span>
              </div>
            </div>
            
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-[#1E90FF]" />
            ) : (
              <ChevronDown className="w-6 h-6 text-[#1E90FF]" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 border-t border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-[#0B3D91]" style={{ fontSize: '18px', fontWeight: '600' }}>
              Route Details
            </h4>
            <Button
              onClick={onViewMap}
              variant="outline"
              className="border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF]/10"
            >
              <MapPin className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Paid Delivery</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell>{order.OrderID}</TableCell>
                    <TableCell>{order.CustomerName}</TableCell>
                    <TableCell>{order.Latitude.toFixed(4)}</TableCell>
                    <TableCell>{order.Longitude.toFixed(4)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={order.IsPaidDelivery ? "default" : "secondary"}
                        className={order.IsPaidDelivery ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {order.IsPaidDelivery ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-[#1E90FF] text-[#1E90FF]">
                        {order.OrderStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </Card>
  );
}