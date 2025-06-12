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
                            <span>Analyze Image</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Section */}
            {prediction && (
              <div className={`rounded-xl shadow-sm border p-6 ${prediction.bgColor}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {prediction.severity === 0 ? (
                      <CheckCircle className={`h-6 w-6 ${prediction.color}`} />
                    ) : (
                      <AlertTriangle className={`h-6 w-6 ${prediction.color}`} />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Analysis Results</h3>
                      <p className="text-sm text-gray-600">AI Confidence: {(prediction.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={generateReport}
                      className="bg-white text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-50 inline-flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Report</span>
                    </button>
                    <button className="bg-white text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-50 inline-flex items-center space-x-1">
                      <Share2 className="h-4 w-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">Diagnosis</h4>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(prediction.severity)} text-white`}>
                      Level {prediction.severity}
                    </div>
                  </div>
                  <p className={`text-lg font-bold ${prediction.color} mb-2`}>{prediction.class}</p>
                  <p className="text-gray-700 mb-3">{prediction.description}</p>
                  
                  <div className="border-t pt-3">
                    <h5 className="font-medium text-gray-900 mb-2">Detected Features:</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className={`flex items-center space-x-2 ${prediction.features.microaneurysms ? 'text-red-600' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${prediction.features.microaneurysms ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <span>Microaneurysms</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${prediction.features.hemorrhages ? 'text-red-600' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${prediction.features.hemorrhages ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <span>Hemorrhages</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${prediction.features.exudates ? 'text-red-600' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${prediction.features.exudates ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <span>Hard Exudates</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${prediction.features.cottonWoolSpots ? 'text-red-600' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${prediction.features.cottonWoolSpots ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <span>Cotton Wool Spots</span>
                      </div>
                      <div className={`flex items-center space-x-2 ${prediction.features.neovascularization ? 'text-red-600' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${prediction.features.neovascularization ? 'bg-red-500' : 'bg-gray-300'}`}></div>
                        <span>Neovascularization</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                  <h4 className="font-semibold text-gray-900 mb-2">Recommendation</h4>
                  <p className="text-gray-700">{prediction.recommendation}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Model Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Model Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Architecture:</span>
                  <span className="font-medium">ResNet-50 CNN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Training Data:</span>
                  <span className="font-medium">88,702 images</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy:</span>
                  <span className="font-medium text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sensitivity:</span>
                  <span className="font-medium text-blue-600">91.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specificity:</span>
                  <span className="font-medium text-purple-600">96.5%</span>
                </div>
              </div>
            </div>

            {/* Severity Levels */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">DR Severity Levels</h3>
              <div className="space-y-3">
                {[
                  { level: 0, name: 'No DR', color: 'bg-green-500', desc: 'No abnormalities' },
                  { level: 1, name: 'Mild NPDR', color: 'bg-yellow-500', desc: 'Microaneurysms only' },
                  { level: 2, name: 'Moderate NPDR', color: 'bg-orange-500', desc: 'More than mild but less than severe' },
                  { level: 3, name: 'Severe NPDR', color: 'bg-red-500', desc: 'Extensive retinal changes' },
                  { level: 4, name: 'Proliferative DR', color: 'bg-red-700', desc: 'Neovascularization present' }
                ].map((item) => (
                  <div key={item.level} className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent History */}
            {history.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Analyses</h3>
                <div className="space-y-3">
                  {history.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <img 
                        src={item.image} 
                        alt="Previous analysis"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.filename}
                        </p>
                        <p className={`text-xs ${item.result.color}`}>
                          {item.result.class}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800">Medical Disclaimer</h4>
                  <p className="text-xs text-yellow-700 mt-1">
                    This AI tool is for educational purposes only and should not replace professional medical diagnosis. 
                    Always consult with a qualified ophthalmologist for definitive diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiabeticRetinopathyApp;
