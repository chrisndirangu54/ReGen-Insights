import React, { useState, useEffect } from 'react';
import { MapPin, Leaf, Cloud, Upload, TrendingUp, Database, AlertTriangle, CheckCircle } from 'lucide-react';

const ReGenInsight = () => {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [carbonData, setCarbonData] = useState([]);

  // Simulated land classification data
  const regions = [
    { id: 1, name: 'Region A - Nairobi East', lat: -1.286, lng: 36.817, type: 'degraded', health: 35, carbon: 12, water: 'moderate' },
    { id: 2, name: 'Region B - Machakos', lat: -1.517, lng: 37.263, type: 'barren', health: 20, carbon: 5, water: 'severe' },
    { id: 3, name: 'Region C - Kiambu', lat: -1.171, lng: 36.835, type: 'forest', health: 78, carbon: 45, water: 'good' },
    { id: 4, name: 'Region D - Kajiado', lat: -1.852, lng: 36.777, type: 'cropland', health: 55, carbon: 22, water: 'moderate' },
  ];

  // Simulated species recommendations
  const speciesRecommendations = {
    degraded: ['Acacia tortilis', 'Grevillea robusta', 'Croton megalocarpus'],
    barren: ['Prosopis juliflora', 'Acacia senegal', 'Commiphora africana'],
    cropland: ['Calliandra calothyrsus', 'Leucaena leucocephala', 'Sesbania sesban']
  };

  useEffect(() => {
    // Simulate blockchain carbon ledger data
    const mockCarbonData = regions.map(r => ({
      region: r.name,
      verified: r.carbon,
      timestamp: new Date().toISOString(),
      txHash: `0x${Math.random().toString(16).substr(2, 8)}`
    }));
    setCarbonData(mockCarbonData);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        // Simulate AI analysis
        setTimeout(() => {
          setAnalysisResult({
            landType: ['Degraded Land', 'Sparse Vegetation', 'Cropland'][Math.floor(Math.random() * 3)],
            health: Math.floor(Math.random() * 40) + 30,
            confidence: Math.floor(Math.random() * 20) + 80,
            recommendation: 'Reforestation with native species recommended'
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const getHealthColor = (health) => {
    if (health < 30) return 'text-red-500';
    if (health < 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getTypeColor = (type) => {
    const colors = {
      forest: 'bg-green-100 text-green-800',
      degraded: 'bg-yellow-100 text-yellow-800',
      barren: 'bg-red-100 text-red-800',
      cropland: 'bg-blue-100 text-blue-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const MapView = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border-2 border-green-200">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-green-600" />
          <h3 className="text-lg font-semibold">Interactive Land Health Map</h3>
        </div>
        <div className="bg-white rounded-lg p-4 mb-4 h-64 flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <MapPin className="mx-auto text-gray-400 mb-2" size={48} />
            <p className="text-gray-500">Map visualization placeholder</p>
            <p className="text-sm text-gray-400 mt-1">Click regions below to view details</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {regions.map(region => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region)}
              className="bg-white p-4 rounded-lg border-2 hover:border-green-500 transition-all text-left"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-medium text-sm">{region.name}</span>
                <span className={`px-2 py-1 rounded text-xs ${getTypeColor(region.type)}`}>
                  {region.type}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Health:</span>
                  <span className={`font-semibold ${getHealthColor(region.health)}`}>
                    {region.health}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbon:</span>
                  <span className="font-semibold">{region.carbon} tCO₂</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedRegion && (
        <div className="bg-white rounded-lg p-6 border-2 border-blue-200">
          <h4 className="font-semibold mb-4 text-lg">{selectedRegion.name} - Detailed Analysis</h4>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Land Health</div>
              <div className={`text-2xl font-bold ${getHealthColor(selectedRegion.health)}`}>
                {selectedRegion.health}%
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Carbon Stock</div>
              <div className="text-2xl font-bold text-blue-600">{selectedRegion.carbon} tCO₂</div>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600 mb-1">Water Stress</div>
              <div className="text-2xl font-bold text-purple-600 capitalize">{selectedRegion.water}</div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="text-green-600" size={20} />
              <span className="font-semibold">AI Recommendation</span>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {selectedRegion.type === 'forest' 
                ? 'Maintain current forest cover with periodic monitoring.' 
                : 'Reforestation recommended with native species.'}
            </p>
            {selectedRegion.type !== 'forest' && (
              <div>
                <div className="text-xs font-semibold text-gray-600 mb-2">Recommended Species:</div>
                <div className="flex flex-wrap gap-2">
                  {speciesRecommendations[selectedRegion.type]?.map(species => (
                    <span key={species} className="bg-white px-3 py-1 rounded-full text-xs border border-green-200">
                      {species}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const CarbonDashboard = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-blue-600" />
          <h3 className="text-lg font-semibold">Carbon Credit Dashboard</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg border-2 border-green-200">
            <div className="text-sm text-gray-600 mb-1">Total Carbon Sequestered</div>
            <div className="text-3xl font-bold text-green-600">
              {regions.reduce((sum, r) => sum + r.carbon, 0)} tCO₂
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
            <div className="text-sm text-gray-600 mb-1">Verified Credits</div>
            <div className="text-3xl font-bold text-blue-600">
              {carbonData.length}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-sm">Regional Carbon Distribution</h4>
          <div className="space-y-2">
            {regions.map(region => (
              <div key={region.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{region.name.split(' - ')[1]}</span>
                    <span className="font-semibold">{region.carbon} tCO₂</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                      style={{ width: `${(region.carbon / 50) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border-2 border-purple-200">
        <div className="flex items-center gap-2 mb-4">
          <Database className="text-purple-600" />
          <h3 className="text-lg font-semibold">Blockchain Carbon Ledger</h3>
        </div>
        
        <div className="space-y-2">
          {carbonData.slice(0, 3).map((entry, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg border border-purple-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-green-500" size={16} />
                  <span className="text-sm font-medium">{entry.region.split(' - ')[1]}</span>
                </div>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Credits: <span className="font-semibold">{entry.verified} tCO₂</span></div>
                <div className="flex items-center gap-1">
                  <span>TX:</span>
                  <code className="bg-gray-100 px-1 rounded">{entry.txHash}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CitizenPortal = () => (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 border-2 border-orange-200">
        <div className="flex items-center gap-2 mb-4">
          <Upload className="text-orange-600" />
          <h3 className="text-lg font-semibold">LandGuard - Citizen Science Portal</h3>
        </div>

        <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="imageUpload"
          />
          <label
            htmlFor="imageUpload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="text-gray-400 mb-3" size={48} />
            <p className="text-sm font-medium text-gray-700 mb-1">
              Upload Geotagged Land Photo
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG up to 10MB
            </p>
          </label>
        </div>

        {uploadedImage && (
          <div className="mt-4 bg-white rounded-lg p-4 border-2 border-green-200">
            <img src={uploadedImage} alt="Uploaded land" className="w-full h-48 object-cover rounded-lg mb-4" />
            
            {!analysisResult && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                <span className="text-sm">Analyzing with AI...</span>
              </div>
            )}

            {analysisResult && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Analysis Complete</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Classified As</div>
                    <div className="font-semibold text-sm">{analysisResult.landType}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-xs text-gray-600">Confidence</div>
                    <div className="font-semibold text-sm">{analysisResult.confidence}%</div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
                    <div className="text-xs">
                      <div className="font-semibold mb-1">Land Health: {analysisResult.health}%</div>
                      <div className="text-gray-600">{analysisResult.recommendation}</div>
                    </div>
                  </div>
                </div>

                <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Submit to Database
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
        <h4 className="font-semibold mb-3">Recent Community Contributions</h4>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-green-200 rounded flex items-center justify-center">
                <Leaf className="text-green-600" size={20} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">Contributor {i}</div>
                <div className="text-xs text-gray-600">Uploaded land photo • 2 hrs ago</div>
              </div>
              <CheckCircle className="text-green-500" size={20} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const WaterStress = () => (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200">
      <div className="flex items-center gap-2 mb-4">
        <Cloud className="text-blue-600" />
        <h3 className="text-lg font-semibold">Water Stress Mapper</h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {regions.map(region => (
          <div key={region.id} className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">{region.name}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                region.water === 'severe' ? 'bg-red-100 text-red-800' :
                region.water === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {region.water.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">NDVI Index:</span>
                <span className="font-semibold">{(region.health / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Rainfall (mm):</span>
                <span className="font-semibold">{Math.floor(region.health * 8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Soil Moisture:</span>
                <span className="font-semibold">{region.health > 60 ? 'Good' : region.health > 40 ? 'Fair' : 'Poor'}</span>
              </div>
            </div>

            {region.water === 'severe' && (
              <div className="mt-3 p-2 bg-red-50 rounded text-xs text-red-800 border border-red-200">
                <AlertTriangle className="inline mr-1" size={14} />
                Immediate intervention required - drought conditions detected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🌍 ReGen Insight
              </h1>
              <p className="text-gray-600">AI-Powered Environmental Intelligence Platform</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {regions.reduce((sum, r) => sum + r.carbon, 0)} tCO₂
              </div>
              <div className="text-sm text-gray-600">Total Carbon Tracked</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-2">
          <div className="flex gap-2">
            {[
              { id: 'map', label: 'Land Monitor', icon: MapPin },
              { id: 'carbon', label: 'Carbon Credits', icon: TrendingUp },
              { id: 'water', label: 'Water Stress', icon: Cloud },
              { id: 'citizen', label: 'Citizen Portal', icon: Upload }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {activeTab === 'map' && <MapView />}
          {activeTab === 'carbon' && <CarbonDashboard />}
          {activeTab === 'citizen' && <CitizenPortal />}
          {activeTab === 'water' && <WaterStress />}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Powered by AI, GIS & Blockchain | Built for Hackathon MVP</p>
        </div>
      </div>
    </div>
  );
};

export default ReGenInsight;
