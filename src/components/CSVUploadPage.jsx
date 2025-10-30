import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Zap } from "lucide-react";
import { motion } from "motion/react";
import axios from "axios";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Alert, AlertDescription } from "./ui/alert";

export function CSVUploadPage({ onRoutesGenerated }) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setShowSuccess(false);
    setError(null);
    
    // Parse CSV and show preview (first 5 rows)
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',');
      
    const parsedOrders = lines.slice(1, 6).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      return {
        OrderID: values[0],
        CustomerName: values[1],
        Latitude: parseFloat(values[3]),
        Longitude: parseFloat(values[4]),
        IsPaidDelivery: values[2] === '1' || values[4]?.toLowerCase() === 'true',
        OrderStatus: values[5]
      };
    });

      
      setOrders(parsedOrders);
    };
    reader.readAsText(selectedFile);
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleGenerateRoutes = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Create FormData and append the CSV file
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      // Make API call to upload CSV using axios
      const response = await axios.post('https://route-optima-backend-nk77.onrender.com/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Axios automatically parses JSON responses
      const data = response.data;
      
      console.log('API Response:', data); // Debug log
      
      // Set success state
      setShowSuccess(true);
      
      // Pass the orders data to parent component
      // Handle different possible response formats
      setTimeout(() => {
        let ordersData = data;
        
        console.log('Orders to pass:', ordersData); // Debug log
        
        // Check if backend returns clusters format
        if (data.clusters && Array.isArray(data.clusters)) {
          console.log('Backend returned clustered data');
          // Pass the entire clusters structure
          onRoutesGenerated(data.clusters);
          return;
        }
        
        // Check various other possible response structures
        if (data.orders) {
          ordersData = data.orders;
        } else if (data.data) {
          ordersData = data.data;
        } else if (Array.isArray(data)) {
          ordersData = data;
        }
        
        console.log('Final orders to pass:', ordersData);
        
        // Fallback: if no valid data from API, parse the entire CSV
        if (!ordersData || ordersData.length === 0) {
          console.warn('No orders from API, parsing full CSV...');
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target?.result;
            const lines = text.split('\n').filter(line => line.trim());
            
            const parsedOrders = lines.slice(1).map((line, index) => {
              const values = line.split(',');
              return {
                OrderID: values[0] || `ORD-${1000 + index}`,
                CustomerName: values[1] || `Customer ${index + 1}`,
                Latitude: parseFloat(values[2]) || 28.6 + Math.random() * 0.1,
                Longitude: parseFloat(values[3]) || 77.2 + Math.random() * 0.1,
                IsPaidDelivery: values[4]?.toLowerCase() === 'true' || Math.random() > 0.5,
                OrderStatus: values[5] || 'Pending'
              };
            });
            
            console.log('Parsed orders from CSV:', parsedOrders);
            onRoutesGenerated(parsedOrders);
          };
          reader.readAsText(file);
          return;
        }
        
        onRoutesGenerated(ordersData);
      }, 1500);

    } catch (err) {
      console.error('Error uploading CSV:', err);
      
      // Handle axios error
      const errorMessage = err.response?.data?.message 
        || err.message 
        || 'Failed to upload CSV. Please try again.';
      
      setError(errorMessage);
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-[#F2F2F2] py-12">
      <div className="container mx-auto px-6">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[#0B3D91] mb-2" style={{ fontSize: '36px', fontWeight: '700' }}>
            Upload Daily Orders
          </h1>
          <p className="text-gray-600">
            Upload your CSV file to generate optimized delivery routes
          </p>
        </motion.div>

        {/* Upload Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="p-8 mb-8 border-2 border-dashed border-gray-300 bg-white">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`text-center py-12 transition-colors ${
                isDragging ? 'bg-[#1E90FF]/5' : ''
              }`}
            >
              <div className="flex flex-col items-center gap-4">
                <motion.div 
                  className={`p-4 rounded-full ${
                    file ? 'bg-green-100' : 'bg-[#1E90FF]/10'
                  }`}
                  animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
                >
                  {file ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", duration: 0.6 }}
                    >
                      <FileText className="w-12 h-12 text-green-600" />
                    </motion.div>
                  ) : (
                    <Upload className="w-12 h-12 text-[#1E90FF]" />
                  )}
                </motion.div>
                
                {file ? (
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <p className="text-[#0B3D91]" style={{ fontSize: '18px', fontWeight: '600' }}>
                      {file.name}
                    </p>
                    <p className="text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <p className="text-[#0B3D91] mb-2" style={{ fontSize: '18px', fontWeight: '600' }}>
                        Drag and drop your CSV file here
                      </p>
                      <p className="text-gray-500">or</p>
                    </div>
                    
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#1E90FF] hover:bg-[#0B3D91] text-white"
                    >
                      Browse Files
                    </Button>
                    
                    <p className="text-gray-400">Supported format: CSV only</p>
                  </>
                )}
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Alert className="mb-8 border-red-500 bg-red-50">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <AlertCircle className="h-5 w-5 text-red-600" />
              </motion.div>
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Preview Table */}
        {orders.length > 0 && !showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 mb-8 bg-white">
              <h2 className="text-[#0B3D91] mb-4" style={{ fontSize: '24px', fontWeight: '600' }}>
                Preview: First 5 Orders
              </h2>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Latitude</TableHead>
                      <TableHead>Longitude</TableHead>
                      <TableHead>Paid Delivery</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order, index) => (
                      <motion.tr 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <TableCell>{order.OrderID}</TableCell>
                        <TableCell>{order.CustomerName}</TableCell>
                        <TableCell>{order.Latitude.toFixed(4)}</TableCell>
                        <TableCell>{order.Longitude.toFixed(4)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            order.IsPaidDelivery 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {order.IsPaidDelivery ? 'Yes' : 'No'}
                          </span>
                        </TableCell>
                        <TableCell>{order.OrderStatus}</TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Processing */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 mb-8 bg-white">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1E90FF]"></div>
                  <motion.span 
                    className="text-[#0B3D91]"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Processing your orders...
                  </motion.span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-gray-500">
                  Uploading and optimizing routes...
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Alert className="mb-8 border-green-500 bg-green-50">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <CheckCircle className="h-5 w-5 text-green-600" />
              </motion.div>
              <AlertDescription className="text-green-700">
                Routes generated successfully! Redirecting to overview...
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {/* Generate Button */}
        {orders.length > 0 && !isProcessing && !showSuccess && (
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleGenerateRoutes}
              size="lg"
              className="bg-[#1E90FF] hover:bg-[#0B3D91] text-white"
            >
              <Zap className="mr-2 w-5 h-5" />
              Upload & Generate Routes
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}