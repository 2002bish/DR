import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Eye, AlertTriangle, CheckCircle, Info, BarChart3, Download, Share2 } from 'lucide-react';

const DiabeticRetinopathyApp = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Simulate ML model prediction (replace with actual model inference)
  const simulateModelPrediction = useCallback((imageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate different severity levels
        const outcomes = [
          { 
            class: 'No DR', 
            confidence: 0.92, 
            severity: 0,
            description: 'No signs of diabetic retinopathy detected',
            recommendation: 'Continue regular eye exams annually',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
          },
          { 
            class: 'Mild NPDR', 
            confidence: 0.87, 
            severity: 1,
            description: 'Mild non-proliferative diabetic retinopathy',
            recommendation: 'Schedule follow-up in 6-12 months',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
          },
          { 
            class: 'Moderate NPDR', 
            confidence: 0.83, 
            severity: 2,
            description: 'Moderate non-proliferative diabetic retinopathy',
            recommendation: 'Schedule follow-up in 3-6 months',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
          },
          { 
            class: 'Severe NPDR', 
            confidence: 0.89, 
            severity: 3,
            description: 'Severe non-proliferative diabetic retinopathy',
            recommendation: 'Urgent ophthalmologist consultation required',
            color: 'text-red-600',
            bgColor: 'bg-red-50'
          },
          { 
            class: 'Proliferative DR', 
            confidence: 0.94, 
            severity: 4,
            description: 'Proliferative diabetic retinopathy detected',
            recommendation: 'Immediate ophthalmologist consultation required',
            color: 'text-red-800',
            bgColor: 'bg-red-100'
          }
        ];
        
        const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
        resolve({
          ...randomOutcome,
          timestamp: new Date().toISOString(),
          features: {
            microaneurysms: Math.random() > 0.6,
            hemorrhages: Math.random() > 0.7,
            exudates: Math.random() > 0.8,
            cottonWoolSpots: Math.random() > 0.9,
            neovascularization: randomOutcome.severity >= 4
          }
        });
      }, 3000); // Simulate processing time
    });
  }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage({
          file: file,
          url: e.target.result,
          name: file.name
        });
        setPrediction(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    try {
      const result = await simulateModelPrediction(selectedImage.url);
      setPrediction(result);
      
      // Add to history
      const historyEntry = {
        id: Date.now(),
        image: selectedImage.url,
        result: result,
        filename: selectedImage.name
      };
      setHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
      
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      0: 'bg-green-500',
      1: 'bg-yellow-500', 
      2: 'bg-orange-500',
      3: 'bg-red-500',
      4: 'bg-red-700'
    };
    return colors[severity] || 'bg-gray-500';
  };

  const generateReport = () => {
    if (!prediction) return;
    
    const reportData = {
      patient: 'Patient ID: ' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleString(),
      diagnosis: prediction.class,
      confidence: (prediction.confidence * 100).toFixed(1) + '%',
      severity: prediction.severity,
      features: prediction.features,
      recommendation: prediction.recommendation
    };
    
    const reportText = `
DIABETIC RETINOPATHY SCREENING REPORT
=====================================

Patient: ${reportData.patient}
Date: ${reportData.timestamp}
Analysis: AI-Assisted Screening

RESULTS:
--------
Diagnosis: ${reportData.diagnosis}
Confidence: ${reportData.confidence}
Severity Level: ${reportData.severity}/4

DETECTED FEATURES:
-----------------
• Microaneurysms: ${reportData.features.microaneurysms ? 'Present' : 'Not detected'}
• Hemorrhages: ${reportData.features.hemorrhages ? 'Present' : 'Not detected'}
• Hard Exudates: ${reportData.features.exudates ? 'Present' : 'Not detected'}
• Cotton Wool Spots: ${reportData.features.cottonWoolSpots ? 'Present' : 'Not detected'}
• Neovascularization: ${reportData.features.neovascularization ? 'Present' : 'Not detected'}

RECOMMENDATION:
---------------
${reportData.recommendation}

DISCLAIMER:
-----------
This AI screening tool is for educational purposes and should not replace professional medical diagnosis. Please consult with a qualified ophthalmologist for definitive diagnosis and treatment.
    `;
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DR_Report_${reportData.patient.split(' ')[2]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DR Detect</h1>
                <p className="text-sm text-gray-500">AI-Powered Diabetic Retinopathy Screening</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BarChart3 className="h-4 w-4" />
              <span>Medical AI Tool</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Analysis Panel */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Upload Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Upload Retinal Image</h2>
                <Info className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                
                {!selectedImage ? (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Select a retinal fundus image
                    </p>
                    <p className="text-gray-500 mb-4">
                      Upload a high-quality retinal photograph for AI analysis
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                    >
                      <Camera className="h-4 w-4" />
                      <span>Choose Image</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <img 
                      src={selectedImage.url} 
                      alt="Selected retinal image"
                      className="max-h-64 mx-auto rounded-lg shadow-sm mb-4"
                    />
                    <p className="text-sm text-gray-600 mb-4">{selectedImage.name}</p>
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Change Image
                      </button>
                      <button
                        onClick={analyzeImage}
                        disabled={isAnalyzing}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 inline-flex items-center space-x-2"
                      >
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4" />
                                                       <span>Analyze</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prediction Result */}
            {prediction && (
              <div className={`rounded-xl shadow-sm border p-6 ${prediction.bgColor}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className={`h-6 w-6 ${prediction.color}`} />
                  <h2 className={`text-lg font-semibold ${prediction.color}`}>Analysis Result</h2>
                </div>
                <p className="text-gray-700 mb-2"><strong>Diagnosis:</strong> {prediction.class}</p>
                <p className="text-gray-700 mb-2"><strong>Confidence:</strong> {(prediction.confidence * 100).toFixed(1)}%</p>
                <p className="text-gray-700 mb-2"><strong>Description:</strong> {prediction.description}</p>
                <p className="text-gray-700 mb-4"><strong>Recommendation:</strong> {prediction.recommendation}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {Object.entries(prediction.features).map(([feature, value]) => (
                    <div key={feature} className="text-sm text-gray-700">
                      • {feature.charAt(0).toUpperCase() + feature.slice(1)}: <strong>{value ? 'Present' : 'Not detected'}</strong>
                    </div>
                  ))}
                </div>

                <button
                  onClick={generateReport}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Report</span>
                </button>
              </div>
            )}
          </div>

          {/* History Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Scan History</h2>
                <Info className="h-5 w-5 text-gray-400" />
              </div>
              {history.length === 0 ? (
                <p className="text-sm text-gray-500">No scans yet. Upload an image to get started.</p>
              ) : (
                <ul className="space-y-4 max-h-96 overflow-y-auto">
                  {history.map((entry) => (
                    <li key={entry.id} className="flex items-start space-x-4 border-b pb-2">
                      <img src={entry.image} alt="History thumbnail" className="h-16 w-16 rounded object-cover border" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{entry.filename}</p>
                        <p className="text-sm text-gray-500">{new Date(entry.result.timestamp).toLocaleString()}</p>
                        <p className={`text-sm font-semibold ${entry.result.color}`}>{entry.result.class}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DiabeticRetinopathyApp;
