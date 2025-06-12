// pages/index.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Camera,
  Upload,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info,
  BarChart3,
  Download,
  Share2
} from 'lucide-react';

const outcomes = [
  {
    class: "No DR",
    confidence: 0.95,
    severity: 0,
    recommendation: "Continue routine eye exams annually.",
    description: "No signs of diabetic retinopathy detected.",
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    class: "Mild DR",
    confidence: 0.88,
    severity: 1,
    recommendation: "Recheck in 6-12 months and manage blood sugar levels.",
    description: "Early microaneurysms noted, minimal impact.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    class: "Moderate DR",
    confidence: 0.91,
    severity: 2,
    recommendation: "Schedule ophthalmologist visit in 3-6 months.",
    description: "Signs of hemorrhages and exudates detected.",
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    class: "Severe DR",
    confidence: 0.85,
    severity: 3,
    recommendation: "Consult a retinal specialist within 1-3 months.",
    description: "Large hemorrhages, cotton wool spots present.",
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  {
    class: "Proliferative DR",
    confidence: 0.93,
    severity: 4,
    recommendation: "Immediate referral to retina specialist and laser treatment.",
    description: "Abnormal blood vessels and retinal damage noted.",
    color: "text-red-700",
    bgColor: "bg-red-100"
  }
];

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef(null);

  const simulateModelPrediction = useCallback((imageData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
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
      }, 2000);
    });
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file?.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage({ file, url: reader.result, name: file.name });
      reader.readAsDataURL(file);
      setPrediction(null);
    } else {
      alert("Please select a valid image under 5MB.");
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const result = await simulateModelPrediction(selectedImage.url);
      setPrediction(result);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const severityBg = (s) => ["bg-green-500", "bg-yellow-500", "bg-orange-500", "bg-red-500", "bg-red-700"][s];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <header className="flex justify-between items-center max-w-4xl mx-auto mb-6">
        <div className="flex items-center space-x-3">
          <Eye className="h-6 w-6 text-blue-600"/>
          <h1 className="text-xl font-bold">DR Detect</h1>
        </div>
        <div className="text-gray-600 flex items-center space-x-2">
          <BarChart3/><span>Medical AI Tool</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto bg-white p-6 rounded shadow space-y-6">
        <div className="text-center border-dashed border-2 border-gray-300 p-8 rounded-lg">
          <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload}/>
          {!selectedImage ? (
            <>
              <Upload className="mx-auto text-gray-400" size={48}/>
              <p className="mt-2">Upload a retina image</p>
              <button onClick={() => fileInputRef.current?.click()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center">
                <Camera className="mr-2"/>Choose Image
              </button>
            </>
          ) : (
            <>
              <img src={selectedImage.url} alt="Preview" className="mx-auto max-h-64 rounded mb-2"/>
              <p className="text-gray-600 mb-4">{selectedImage.name}</p>
              <button onClick={analyzeImage} disabled={isAnalyzing} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
                {isAnalyzing ? "Analyzing..." : "Analyze"}
              </button>
            </>
          )}
        </div>

        {prediction && (
          <div className={`p-6 rounded shadow ${prediction.bgColor}`}>
            <div className="flex items-center mb-4">
              {prediction.severity === 0 ? <CheckCircle className={prediction.color}/> : <AlertTriangle className={prediction.color}/>}
              <h3 className="ml-3 text-xl">Results</h3>
            </div>
            <p className={`text-lg font-bold ${prediction.color}`}>{prediction.class} ({(prediction.confidence * 100).toFixed(1)}%)</p>
            <p className="mb-2 text-gray-700">{prediction.description}</p>
            <div className="text-sm space-y-1">
              <p>Severity Level: {prediction.severity}</p>
              {Object.entries(prediction.features).map(([k, v]) => (
                <p key={k} className={v ? "text-red-600" : "text-gray-500"}>{k}: {v ? "Detected" : "Not Detected"}</p>
              ))}
            </div>
            <div className="mt-4 bg-white p-3 rounded border-l-4 border-blue-500">
              <p className="text-sm text-gray-700">{prediction.recommendation}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
