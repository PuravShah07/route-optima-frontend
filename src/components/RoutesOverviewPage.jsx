import { useState } from "react";
import { TrendingDown, TrendingUp, Package, Truck } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "./ui/card";
import { ClusterCard } from "./ClusterCard";
import { RouteMapModal } from "./RouteMapModal";

export function RoutesOverviewPage({ orders }) {
  const [selectedCluster, setSelectedCluster] = useState(null);

  console.log('RoutesOverviewPage received orders:', orders); // Debug log

  // Check if orders is empty or undefined
  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-linear-to-b from-white to-[#F2F2F2] py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-[#0B3D91] mb-4" style={{ fontSize: '36px', fontWeight: '700' }}>
            No Orders Found
          </h1>
          <p className="text-gray-600">Please upload a CSV file with orders to view routes.</p>
        </div>
      </div>
    );
  }

  let clusters = [];
  let totalOrders = 0;
  
  // Check if data is already in clusters format from backend
  if (orders[0] && orders[0].route && orders[0].metrics) {
    console.log('Using backend-provided clusters with metrics');
    
    // Backend provided clusters with route and metrics
    clusters = orders.map((cluster, index) => ({
      clusterNumber: index + 1,
      orders: cluster.route.map(order => ({
        ...order,
        IsPaidDelivery: order.IsPaidDelivery === 1 || order.IsPaidDelivery === true
      })),
      totalCost: cluster.metrics.total_cost_inr || 0,
      totalDistance: cluster.metrics.total_distance_km || 0
    }));
    
    totalOrders = clusters.reduce((sum, c) => sum + c.orders.length, 0);
  } 
  // Check if backend provided orders with cluster field
  else if (orders[0] && orders[0].cluster !== undefined) {
    console.log('Grouping orders by cluster field');
    
    // Group by cluster
    const clusterMap = {};
    orders.forEach(order => {
      const clusterNum = order.cluster || 1;
      if (!clusterMap[clusterNum]) {
        clusterMap[clusterNum] = [];
      }
      clusterMap[clusterNum].push(order);
    });
    
    clusters = Object.keys(clusterMap).map((key) => ({
      clusterNumber: parseInt(key),
      orders: clusterMap[key],
      totalCost: clusterMap[key].reduce((sum, o) => sum + (o.cost || 0), 0) || (800 + Math.random() * 400),
      totalDistance: clusterMap[key].reduce((sum, o) => sum + (o.distance || 0), 0) || (15 + Math.random() * 20)
    }));
    
    totalOrders = orders.length;
  } 
  // Fallback: Split orders into 4 clusters (frontend logic)
  else {
    console.log('Creating clusters from flat order list');
    
    const ordersPerCluster = Math.ceil(orders.length / 4);
    
    for (let i = 0; i < 4; i++) {
      const clusterOrders = orders.slice(i * ordersPerCluster, (i + 1) * ordersPerCluster);
      if (clusterOrders.length > 0) {
        clusters.push({
          clusterNumber: i + 1,
          orders: clusterOrders,
          totalCost: clusterOrders.reduce((sum, o) => sum + (o.cost || 0), 0) || (800 + Math.random() * 400),
          totalDistance: clusterOrders.reduce((sum, o) => sum + (o.distance || 0), 0) || (15 + Math.random() * 20)
        });
      }
    }
    
    totalOrders = orders.length;
  }

  console.log('Generated clusters:', clusters); // Debug log

  const totalCost = clusters.reduce((sum, c) => sum + c.totalCost, 0);
  const totalDistance = clusters.reduce((sum, c) => sum + c.totalDistance, 0);
  const avgCostPerOrder = totalCost / totalOrders;

  const summaryCards = [
    { label: "Total Orders", value: totalOrders, icon: Package, color: "bg-[#1E90FF]/10", iconColor: "text-[#1E90FF]" },
    { label: "Total Vehicles", value: clusters.length, icon: Truck, color: "bg-[#0B3D91]/10", iconColor: "text-[#0B3D91]" },
    { label: "Total Cost", value: `₹${totalCost.toFixed(0)}`, icon: TrendingDown, color: "bg-green-100", iconColor: "text-green-600"},
    { label: "Total Distance", value: `${totalDistance.toFixed(0)} km`, icon: TrendingUp, color: "bg-blue-100", iconColor: "text-blue-600" }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-[#F2F2F2] py-12 relative z-10">
      <div className="container mx-auto px-6">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[#0B3D91] mb-2" style={{ fontSize: '36px', fontWeight: '700' }}>
            Optimized Routes Overview
          </h1>
          <p className="text-gray-600">
            Your daily orders have been organized into efficient delivery clusters
          </p>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
          <Card className="p-6 bg-white border-none shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 mb-1">{card.label}</p>
                <motion.p 
                  className="text-[#0B3D91]" 
                  style={{ fontSize: '28px', fontWeight: '700' }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring", duration: 0.6 }}
                >
                  {card.value}
                </motion.p>
                {card.extra && (
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">{card.extra}</span>
                  </div>
                )}
              </div>
              <motion.div 
                className={`p-3 ${card.color} rounded-lg`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className={`w-6 h-6 ${card.iconColor}`} />
              </motion.div>
            </div>
          </Card>
          </motion.div>
            );
          })}
        </div>

        {/* Cluster Cards */}
        <div className="space-y-6">
          <motion.h2 
            className="text-[#0B3D91]" 
            style={{ fontSize: '24px', fontWeight: '600' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Vehicle Routes
          </motion.h2>
          
          {clusters.map((cluster, index) => (
            <motion.div
              key={cluster.clusterNumber}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
            >
            <ClusterCard
              clusterNumber={cluster.clusterNumber}
              orders={cluster.orders}
              totalCost={cluster.totalCost}
              totalDistance={cluster.totalDistance}
              onViewMap={() => setSelectedCluster(cluster)}
            />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Map Modal */}
      {selectedCluster && (
        <RouteMapModal
          isOpen={!!selectedCluster}
          onClose={() => setSelectedCluster(null)}
          clusterNumber={selectedCluster.clusterNumber}
          orders={selectedCluster.orders}
        />
      )}
    </div>
  );
}