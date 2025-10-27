import { Upload, Zap, MapPin, DollarSign, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function LandingPage({ onGetStarted, heroImage }) {
  const features = [
    {
      icon: Upload,
      title: "CSV Upload for Daily Orders",
      description: "Simply upload your CSV file with daily orders and let RouteOptima handle the rest."
    },
    {
      icon: Zap,
      title: "Automatic Route Optimization",
      description: "Advanced algorithms optimize routes in seconds, saving time and fuel costs."
    },
    {
      icon: MapPin,
      title: "Cluster-wise Delivery Overview",
      description: "View organized delivery clusters per vehicle with clear route visualization."
    },
    {
      icon: DollarSign,
      title: "Cost & Distance Metrics",
      description: "Get detailed insights on delivery costs and distances for each optimized route."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F2F2F2]">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="inline-block px-4 py-2 bg-[#1E90FF]/10 rounded-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="text-[#0B3D91]">Smart Courier Optimization</span>
            </motion.div>
            <motion.h1 
              className="text-[#0B3D91]" 
              style={{ fontSize: '48px', fontWeight: '700', lineHeight: '1.2' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Optimize Your Daily Courier Routes Instantly
            </motion.h1>
            <motion.p 
              className="text-gray-600" 
              style={{ fontSize: '18px' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              RouteOptima uses advanced algorithms to transform your daily orders into 
              efficient, cost-effective delivery routes. Save time, reduce costs, and 
              improve customer satisfaction.
            </motion.p>
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Button 
                onClick={onGetStarted}
                className="bg-[#1E90FF] hover:bg-[#0B3D91] text-white transition-all hover:scale-105"
                size="lg"
              >
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button 
                variant="outline"
                className="border-[#1E90FF] text-[#1E90FF] hover:bg-[#1E90FF]/10 transition-all hover:scale-105"
                size="lg"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-[#1E90FF]/20 to-[#0B3D91]/20 rounded-3xl blur-3xl"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <ImageWithFallback
                src={heroImage}
                alt="Delivery route optimization"
                className="relative rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-[#0B3D91] mb-4" style={{ fontSize: '36px', fontWeight: '700' }}>
            Key Features
          </h2>
          <p className="text-gray-600" style={{ fontSize: '18px' }}>
            Everything you need to optimize your courier operations
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card 
                  className="p-6 border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white h-full"
                >
                  <motion.div 
                    className="bg-gradient-to-br from-[#1E90FF] to-[#0B3D91] w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-[#0B3D91] mb-2" style={{ fontSize: '18px', fontWeight: '600' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-[#1E90FF] to-[#0B3D91] border-none p-12 text-center overflow-hidden relative">
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)',
                backgroundSize: '50px 50px',
              }}
            />
            <motion.h2 
              className="text-white mb-4 relative" 
              style={{ fontSize: '32px', fontWeight: '700' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Ready to Optimize Your Routes?
            </motion.h2>
            <motion.p 
              className="text-white/90 mb-6 relative" 
              style={{ fontSize: '18px' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Start saving time and money today with RouteOptima
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <Button 
                onClick={onGetStarted}
                size="lg"
                className="bg-white text-[#1E90FF] hover:bg-gray-100 relative"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.div>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}