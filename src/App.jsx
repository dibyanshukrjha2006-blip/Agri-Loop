import React, { useState, useEffect, useMemo, useRef } from 'react';
import './index.css'
import { 
  User, MapPin, Truck, FileText, ChevronDown, ChevronUp, 
  CheckCircle2, Wallet, Coins, MessageSquare, Leaf, LogOut, 
  Scale, Sprout, ShoppingBag, Plus, Sparkles, Navigation, 
  Shield, HelpCircle, Phone, ArrowRight, Check, Bot, Send,
  Factory, Activity, Zap, Droplets, LineChart, Cpu, Battery, Gauge
} from 'lucide-react';

// ==========================================
// KISAN PORTAL CONFIGURATION DATA
// ==========================================
const INITIAL_WASTE_TYPES = [
  { name: 'Coconut shell', rate: 4.5, desc: 'High lignin content, ideal for activated carbon.', humidityLimit: '12%', icon: '🥥' },
  { name: 'Groundnut shell', rate: 3.8, desc: 'Crushed organic matrix, useful for boiler feeding.', humidityLimit: '10%', icon: '🥜' },
  { name: 'Sugarcane bagasse', rate: 5.2, desc: 'Fibers from sugar extraction, high-yield biofuel.', humidityLimit: '15%', icon: '🪵' },
  { name: 'Bamboo waste', rate: 6.0, desc: 'Rapidly renewable structural scrap, outstanding energy content.', humidityLimit: '11%', icon: '🎋' },
  { name: 'Rice husk', rate: 4.0, desc: 'Silica-rich protective hulls, clean biomass combustion fuel.', humidityLimit: '14%', icon: '🌾' },
  { name: 'Wheat straw', rate: 4.2, desc: 'Golden stalks left over from crop harvest, excellent compost substrate.', humidityLimit: '13%', icon: '🌾' },
  { name: 'Soyabean stalk', rate: 5.8, desc: 'Leguminous fibrous stalks, excellent slow-smoldering pyrolysis properties.', humidityLimit: '13%', icon: '🌱' }
];

const INITIAL_BIOCHAR_PRODUCTS = [
  { id: 'bc-1', name: 'Standard Eco-Biochar', price: 450, desc: 'Raw pyrolyzed bio-carbon. Maximizes soil water holding capacity.', rating: 4.7, impact: '+25% Water Retention', pointsReward: 45, icon: '🪵' },
  { id: 'bc-2', name: 'NPK Microbial-Infused Biochar', price: 650, desc: 'Pre-charged with live nitrogen-fixing bacteria and compost minerals.', rating: 4.9, impact: '+35% Yield Boost', pointsReward: 65, icon: '🦠' },
  { id: 'bc-3', name: 'Vermicompost-Blended Soil Biochar', price: 580, desc: 'Enriched with premium worm castings and organic micro-growth hormones.', rating: 4.8, impact: '+40% Root Strength', pointsReward: 58, icon: '🪱' },
  { id: 'bc-4', name: 'Root-Booster Mycorrhizae Biochar', price: 720, desc: 'Inoculated with symbiotic fungal spores for maximum drought proofing.', rating: 4.9, impact: '+50% Water Efficiency', pointsReward: 72, icon: '🍄' },
  { id: 'bc-5', name: 'Calcium & Gypsum Alkaline Biochar', price: 520, desc: 'Specifically formulated and buffered to neutralize highly acidic soil.', rating: 4.6, impact: 'Soil pH Balancer', pointsReward: 52, icon: '🪨' },
  { id: 'bc-6', name: 'Micronutrient Charged Biochar', price: 690, desc: 'Slow-release mineral infusion of active Zinc, Iron, and Boron to prevent chlorosis.', rating: 4.8, impact: 'Chlorophyll Maximizer', pointsReward: 69, icon: '🧪' }
];

const DRIVER_FLEET = [
  { name: 'Harpreet Singh', phone: '+91 98765-43210', vehicle: 'Swaraj 855 FE', plate: 'PB-12-X-4921', rating: 4.9 },
  { name: 'Rajender Prasad', phone: '+91 94120-88371', vehicle: 'Mahindra Arjun Novo', plate: 'HR-26-AG-1823', rating: 4.8 },
  { name: 'Manpreet Sandhu', phone: '+91 99144-55091', vehicle: 'John Deere 5310', plate: 'PB-02-Y-7730', rating: 4.95 },
  { name: 'Sohan Lal', phone: '+91 95011-32988', vehicle: 'Sonalika Tiger 50', plate: 'UP-15-CH-9041', rating: 4.75 }
];

const TRAILER_TYPES = [
  { id: 'trolley', name: 'Standard Farm Trolley', capacity: 1500, desc: 'Single-axle layout. Best for narrow lanes.', icon: '🚜' },
  { id: 'dual', name: 'Dual-Axle High-Volume Trailer', capacity: 3000, desc: 'Double-axle frame. Ideal for straw bales.', icon: '🚛' },
  { id: 'hydraulic', name: 'Hydraulic Tipping Trailer', capacity: 5000, desc: 'Heavy-duty layout. Features swift un-loading.', icon: '⚡' }
];

const INITIAL_SUPPLIES = [
  { id: 'TX-1004', date: '2026-06-25', time: '10:15 AM', type: 'Wheat straw', weight: 1450, rate: 4.2, value: 6090, points: 145, hash: '000abf7e81cc4291', prevHash: '000f01b3392a884e', status: 'Verified & Credited' },
  { id: 'TX-1003', date: '2026-06-18', time: '02:30 PM', type: 'Rice husk', weight: 2200, rate: 4.0, value: 8800, points: 220, hash: '000f01b3392a884e', prevHash: '000219aa2081cb9f', status: 'Verified & Credited' }
];

const KRISHI_WEATHER_ALERTS = [
  { type: 'warning', title: 'Monsoon Rain Expected in 36 hrs', msg: 'Please keep straw piles tightly covered to prevent exceeding 15% moisture limits.' },
  { type: 'tip', title: 'Carbon Bonus Multiplier Active', msg: 'Soyabean stalk and Bamboo wastes are pulling a 1.2x Agri-Loop points premium this week!' },
  { type: 'info', title: 'Panchayat Electronic Scale Calibrated', msg: 'Scale #3 has undergone bi-weekly ISO weight precision audits and is certified ready.' }
];

const COMPANY_POLICIES = [
  { title: 'Fair Price Guarantee & Mandi Price Parity', desc: 'Agri-Loop guarantees prices tied to verified local Mandi baselines. Rates are locked upon booking. No middleman cuts, no manual price adjustments.' },
  { title: 'Electronic Scale & Calibration Transparency', desc: 'All tractor units are outfitted with wireless digital load cells linked directly to our ledger. We support local verification checks. Scales undergo third-party ISO calibration every 14 days.' },
  { title: 'Data Immutability Policy (Earth Ledger)', desc: 'Transaction histories are written with linked cryptographic hashes. Neither corporate managers nor third parties can modify weight indices or credit receipts retrospectively.' },
  { title: 'Clean Air Compliance Certification', desc: 'Supplying crop residues generates certified Carbon Credits. Farmers receive official environmental compliance certificates, making them eligible for additional Panchayat green-subsidies.' },
  { title: 'Bio-Char Production Transparency', desc: 'The bio-char sold in our catalog is produced using certified zero-emission pyrolysis chambers, returning carbon back to agricultural fields for up to 100 years.' }
];

const getDeterministicOffset = (str, seed) => {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs((hash + seed) % 100);
};

const generateMockHash = (prev) => {
  let h = 0;
  const combined = prev + Math.random().toString();
  for (let i = 0; i < combined.length; i++) {
    h = combined.charCodeAt(i) + ((h << 5) - h);
  }
  return Math.abs(h).toString(16).substring(0, 16);
};

const getNextTransactionId = (suppliesList) => {
  if (!suppliesList || suppliesList.length === 0) return 'TX-1001';
  const numericIds = suppliesList.map(item => {
    const parsed = parseInt(item.id.replace('TX-', ''), 10);
    return isNaN(parsed) ? 1000 : parsed;
  });
  const maxId = Math.max(...numericIds);
  return `TX-${maxId + 1}`;
};

const getNextDeliveryId = (deliveriesList) => {
  if (!deliveriesList || deliveriesList.length === 0) return 'DEL-801';
  const numericIds = deliveriesList.map(item => {
    const parsed = parseInt(item.id.replace('DEL-', ''), 10);
    return isNaN(parsed) ? 800 : parsed;
  });
  const maxId = Math.max(...numericIds);
  return `DEL-${maxId + 1}`;
};

// Map Route Polyline Generator (A* Pathfinding Simulation based on OpenStreetMap logic)
const generateOrganicRoute = (startCoord, endCoord, complexity = 8) => {
    const points = [startCoord];
    const dx = endCoord.lng - startCoord.lng;
    const dy = endCoord.lat - startCoord.lat;
    
    let currentX = startCoord.lng;
    let currentY = startCoord.lat;
    
    for (let i = 1; i < complexity; i++) {
        const progress = i / complexity;
        // Randomly zig-zag simulating rural roads
        const randomWobbleX = (Math.random() - 0.5) * 0.008; 
        const randomWobbleY = (Math.random() - 0.5) * 0.008;
        
        currentX = startCoord.lng + (dx * progress) + randomWobbleX;
        currentY = startCoord.lat + (dy * progress) + randomWobbleY;
        
        points.push({ lat: currentY, lng: currentX });
    }
    points.push(endCoord);
    return points;
};


// ==========================================
// INDUSTRIAL BIO-OIL CONFIGURATION DATA
// ==========================================
const BIO_OIL_TYPES = [
  {
    id: 'pyrolysis',
    name: 'Fast-Pyrolysis Heavy Crude',
    basePricePerLiter: 1.20,
    defaultDensity: 1200,
    minDensity: 1100,
    maxDensity: 1250,
    defaultConcentration: 85,
    minConcentration: 75,
    maxConcentration: 90,
    viscosity: 'High (40-100 cSt)',
    flashPoint: '110°C',
    color: 'bg-amber-950 border-amber-800',
    accentColor: '#451a03',
    description: 'Perfect for heavy industrial boilers, steel manufacturing, and district heating plants.'
  },
  {
    id: 'algal-biodiesel',
    name: 'Refined Algal Bio-Diesel (B100)',
    basePricePerLiter: 1.85,
    defaultDensity: 860,
    minDensity: 840,
    maxDensity: 880,
    defaultConcentration: 99,
    minConcentration: 95,
    maxConcentration: 100,
    viscosity: 'Low (4-6 cSt)',
    flashPoint: '130°C',
    color: 'bg-emerald-950 border-emerald-800',
    accentColor: '#064e3b',
    description: 'Ultra-low viscosity bio-fuel optimized for modern transport fleets and backup power generators.'
  },
  {
    id: 'cellulosic-wood',
    name: 'Cellulosic Wood-Derived Distillate',
    basePricePerLiter: 1.45,
    defaultDensity: 980,
    minDensity: 950,
    maxDensity: 1050,
    defaultConcentration: 92,
    minConcentration: 85,
    maxConcentration: 96,
    viscosity: 'Medium (15-30 cSt)',
    flashPoint: '95°C',
    color: 'bg-yellow-950 border-yellow-800',
    accentColor: '#713f12',
    description: 'Versatile, medium-density oil synthesized from forest residues. Optimal for thermal power plants.'
  },
  {
    id: 'agri-waste',
    name: 'Agricultural Waste Extract Oil',
    basePricePerLiter: 1.10,
    defaultDensity: 910,
    minDensity: 890,
    maxDensity: 940,
    defaultConcentration: 90,
    minConcentration: 80,
    maxConcentration: 95,
    viscosity: 'Medium-Low (10-25 cSt)',
    flashPoint: '105°C',
    color: 'bg-teal-950 border-teal-800',
    accentColor: '#115e59',
    description: 'Cost-efficient bio-oil recycled from crop stalks and residues. Excellent carbon profile.'
  }
];

const INDUSTRIAL_VEHICLES = [
  { id: 'standard-tanker', name: 'Standard Chemical Tanker', capacity: 20000, speed: '65 km/h', code: 'TNK' },
  { id: 'heavy-hauler', name: 'Titan Quad-Axle Hauler', capacity: 40000, speed: '55 km/h', code: 'TTH' },
  { id: 'eco-e-tanker', name: 'Volt-Eco Electric Tanker', capacity: 15000, speed: '75 km/h', code: 'EVT' }
];

const getPathPoints = (city) => {
  const normalized = (city || '').trim().toLowerCase();
  
  if (normalized.includes('haldia')) {
    return [
      { name: 'Agri Loop Refinery, Haldia', x: 60, y: 180, description: 'Fuel Quality Check Complete' },
      { name: 'Haldia-Mecheda Toll (NH-116)', x: 220, y: 120, description: 'Interstate Transport Clearance' },
      { name: 'Kolaghat Bypass Checkpost', x: 380, y: 220, description: 'Eco-Tax & Weight Registry' },
      { name: 'Dhulagarh Toll Plaza (NH-16)', x: 540, y: 100, description: 'Final Safety Audit' },
      { name: 'Your Factory Hub (Destination)', x: 700, y: 160, description: 'Offloading Terminal Area' }
    ];
  } else if (normalized.includes('siliguri')) {
    return [
      { name: 'Agri Loop Refinery, Siliguri', x: 50, y: 240, description: 'Fuel Quality Check Complete' },
      { name: 'Ghoshpukur Toll Plaza (NH-27)', x: 200, y: 190, description: 'Interstate Transport Clearance' },
      { name: 'Farakka Barrage Checkpost', x: 370, y: 130, description: 'Eco-Tax & Weight Registry' },
      { name: 'Kona Expressway Junction', x: 550, y: 70, description: 'Final Safety Audit' },
      { name: 'Your Factory Hub (Destination)', x: 720, y: 110, description: 'Offloading Terminal Area' }
    ];
  } else if (normalized.includes('kolkata')) {
    return [
      { name: 'Agri Loop Refinery, Kolkata', x: 70, y: 140, description: 'Fuel Quality Check Complete' },
      { name: 'Dankuni Toll Plaza (NH-19)', x: 230, y: 90, description: 'Interstate Transport Clearance' },
      { name: 'Durgapur Expressway Checkpost', x: 410, y: 150, description: 'Eco-Tax & Weight Registry' },
      { name: 'Panagarh Bypass Terminal', x: 560, y: 210, description: 'Final Safety Audit' },
      { name: 'Your Factory Hub (Destination)', x: 710, y: 130, description: 'Offloading Terminal Area' }
    ];
  } else {
    const capitalized = city ? (city.charAt(0).toUpperCase() + city.slice(1)) : 'Haldia';
    const hash = (str, seed) => {
      let h = seed;
      for (let i = 0; i < str.length; i++) {
        h = (h * 33) ^ str.charCodeAt(i);
      }
      return Math.abs(h);
    };

    const seed1 = hash(capitalized, 1);
    const seed2 = hash(capitalized, 2);
    const seed3 = hash(capitalized, 3);
    const seed4 = hash(capitalized, 4);

    const pt0_y = 110 + (seed1 % 80);
    const pt1_y = 60 + (seed2 % 120);
    const pt2_y = 140 + (seed3 % 100);
    const pt3_y = 70 + (seed4 % 130);
    const pt4_y = 120 + ((seed1 + seed2) % 100);

    return [
      { name: `Agri Loop Refinery, ${capitalized}`, x: 60, y: pt0_y, description: 'Fuel Quality Check Complete' },
      { name: `${capitalized} Toll Outpost`, x: 220, y: pt1_y, description: 'Interstate Transport Clearance' },
      { name: 'Regional State-Border Crossing', x: 380, y: pt2_y, description: 'Eco-Tax & Weight Registry' },
      { name: 'Industrial Belt Intersect', x: 540, y: pt3_y, description: 'Final Safety Audit' },
      { name: 'Your Factory Hub (Destination)', x: 700, y: pt4_y, description: 'Offloading Terminal Area' }
    ];
  }
};


// ==========================================
// DYNAMIC LEAFLET MAPVIEW COMPONENT
// ==========================================
// This component safely mounts Leaflet natively into the browser without bundle crashing.
const MapView = ({ center, zoom, bounds, polylineCoords, markerPos, onMapLoad, themeMode }) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const polylineInstance = useRef(null);
    const markerInstance = useRef(null);
    const startMarkerInstance = useRef(null);
    const endMarkerInstance = useRef(null);

    // Initialize Leaflet Map
    useEffect(() => {
        if (!window.L || !mapRef.current) return;
        
        if (!mapInstance.current) {
            mapInstance.current = window.L.map(mapRef.current, {
                zoomControl: false,
                attributionControl: false
            }).setView([center.lat, center.lng], zoom);

            // Add standard OpenStreetMap tiles
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
            }).addTo(mapInstance.current);
            
            if (onMapLoad) onMapLoad(mapInstance.current);
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, []);

    // Handle Theme Filtering for Dark Mode
    useEffect(() => {
        if (mapRef.current) {
             if (themeMode === 'dark') {
                 mapRef.current.style.filter = 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)';
             } else {
                 mapRef.current.style.filter = 'none';
             }
        }
    }, [themeMode]);

    // Handle Polyline and Bounds Updates (Runs only when the route changes)
    useEffect(() => {
        if (!window.L || !mapInstance.current) return;
        const L = window.L;
        const map = mapInstance.current;

        // Draw/Update Polyline Route
        if (polylineCoords && polylineCoords.length > 0) {
            if (!polylineInstance.current) {
                polylineInstance.current = L.polyline(polylineCoords, {
                    color: '#10b981', // Emerald green
                    weight: 5,
                    opacity: 0.8,
                    dashArray: '10, 10'
                }).addTo(map);
            } else {
                polylineInstance.current.setLatLngs(polylineCoords);
            }

            // Draw Start / End Nodes
            if (!startMarkerInstance.current) {
                 startMarkerInstance.current = L.circleMarker(polylineCoords[0], {
                    radius: 8, fillColor: '#3b82f6', color: '#fff', weight: 2, fillOpacity: 1
                }).addTo(map).bindPopup('<b>Start Depot</b>');
            } else {
                 startMarkerInstance.current.setLatLng(polylineCoords[0]);
            }

            if (!endMarkerInstance.current) {
                 endMarkerInstance.current = L.circleMarker(polylineCoords[polylineCoords.length - 1], {
                    radius: 8, fillColor: '#ef4444', color: '#fff', weight: 2, fillOpacity: 1
                }).addTo(map).bindPopup('<b>Destination Farm</b>');
            } else {
                 endMarkerInstance.current.setLatLng(polylineCoords[polylineCoords.length - 1]);
            }

            if (bounds) {
                map.fitBounds(polylineCoords, { padding: [30, 30], animate: true });
            }
        }
    }, [polylineCoords, bounds]);

    // Handle Moving Tractor Marker (Runs frequently without re-centering map)
    useEffect(() => {
        if (!window.L || !mapInstance.current) return;
        const L = window.L;
        const map = mapInstance.current;

        if (markerPos) {
            if (!markerInstance.current) {
                const tractorIcon = L.divIcon({
                    html: '<div style="font-size: 24px; text-shadow: 1px 1px 2px rgba(0,0,0,0.5); filter: none !important;">🚜</div>',
                    className: 'custom-tractor-icon',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });
                markerInstance.current = L.marker([markerPos.lat, markerPos.lng], { icon: tractorIcon, zIndexOffset: 1000 }).addTo(map);
            } else {
                markerInstance.current.setLatLng([markerPos.lat, markerPos.lng]);
            }
        }
    }, [markerPos]);

    return <div ref={mapRef} style={{ width: '100%', height: '100%' }} className="relative z-10" />;
};


// ==========================================
// MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  // Theme Management (Light, Dark, System)
  const [themeMode, setThemeMode] = useState('system');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const handleThemeChange = () => {
      if (themeMode === 'system') {
        setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
      } else {
        setIsDark(themeMode === 'dark');
      }
    };
    handleThemeChange();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleThemeChange);
    return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleThemeChange);
  }, [themeMode]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Global Navigation State
  const [activeGlobalTab, setActiveGlobalTab] = useState('kisan'); // kisan, b2b

  // ==========================================
  // KISAN PORTAL STATES
  // ==========================================
  const [user, setUser] = useState(null);
  const [authTab, setAuthTab] = useState('signin');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authVillage, setAuthVillage] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authStep, setAuthStep] = useState('form'); 
  const [otpCode, setOtpCode] = useState('');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileVillage, setProfileVillage] = useState('');
  const [profileLandSize, setProfileLandSize] = useState('12');
  const [profilePrimaryCrop, setProfilePrimaryCrop] = useState('Wheat');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState(false);

  const [walletBalance, setWalletBalance] = useState(23500.00);
  const [rewardPoints, setRewardPoints] = useState(580);
  const [totalWasteSupplied, setTotalWasteSupplied] = useState(3650);

  const [wasteTypes, setWasteTypes] = useState(INITIAL_WASTE_TYPES);
  const [supplies, setSupplies] = useState(INITIAL_SUPPLIES);
  const [barnInventory, setBarnInventory] = useState([
    { type: 'Coconut shell', weight: 4500, dateAdded: '2026-08-01' },
    { type: 'Wheat straw', weight: 2100, dateAdded: '2026-08-15' }
  ]);
  
  const [newBarnType, setNewBarnType] = useState('Coconut shell');
  const [newBarnWeight, setNewBarnWeight] = useState('');
  
  const [isCustomBiomassModalOpen, setIsCustomBiomassModalOpen] = useState(false);
  const [customBioName, setCustomBioName] = useState('');
  const [customBioRate, setCustomBioRate] = useState('5.5');
  const [customBioDesc, setCustomBioDesc] = useState('');
  const [customBioLimit, setCustomBioLimit] = useState('14%');
  const [customBioIcon, setCustomBioIcon] = useState('🌾');
  const [customBioError, setCustomBioError] = useState('');

  const [calcType, setCalcType] = useState('Coconut shell');
  const [calcWeight, setCalcWeight] = useState('1000');

  // GPS Location Engine
  const [userLocation, setUserLocation] = useState(null); 
  const [isLocating, setIsLocating] = useState(false);
  const defaultBaseLat = 31.6340;
  const defaultBaseLng = 74.8723;
  
  // Script Loading for Leaflet
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  
  useEffect(() => {
    if (!window.L) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => setLeafletLoaded(true);
        document.body.appendChild(script);
        
        // Add custom styles for white text popups in dark mode
        const style = document.createElement('style');
        style.innerHTML = `
            .dark .leaflet-popup-content-wrapper,
            .dark .leaflet-popup-tip {
                background: #1c1917;
                color: #ffffff;
                border: 1px solid #44403c;
            }
            .dark .leaflet-popup-content b { color: #10b981; }
        `;
        document.head.appendChild(style);
    } else {
        setLeafletLoaded(true);
    }
  }, []);

  const handleDetectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`);
            const data = await response.json();
            const locationName = data.address.city || data.address.town || data.address.village || data.address.county || "Detected Area";
            
            setUserLocation({ lat, lng, name: locationName });
            if (!user) {
              setAuthVillage(locationName);
            } else {
              setProfileVillage(locationName);
              setUser(prev => ({...prev, village: locationName}));
            }
          } catch (error) {
            console.error("Geocoding failed:", error);
            setUserLocation({ lat, lng, name: "GPS Coordinates" });
            if (!user) setAuthVillage("GPS Coordinates");
            else setProfileVillage("GPS Coordinates");
          }
          setIsLocating(false);
        },
        (error) => {
          console.error("GPS Error:", error);
          alert("Could not access GPS. Please ensure location permissions are granted.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleForwardGeocode = async (cityName) => {
    if (!cityName.trim()) return;
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`);
        const data = await response.json();
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            setUserLocation({ lat, lng, name: cityName });
        }
    } catch(err) {
        console.error("Forward geocode failed:", err);
    }
  };

  useEffect(() => {
      if (user && profileVillage && profileVillage !== (userLocation?.name)) {
          const timer = setTimeout(() => {
              handleForwardGeocode(profileVillage);
          }, 1000);
          return () => clearTimeout(timer);
      }
  }, [profileVillage, user]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      setProfileVillage(user.village || '');
      setProfilePhone(user.phone || '+91 98000-12345');
    }
  }, [user]);

  // Tractor Pickup States
  const [pickupBiomassType, setPickupBiomassType] = useState(barnInventory.length > 0 ? barnInventory[0].type : '');
  const [pickupEstWeight, setPickupEstWeight] = useState('');
  const [selectedTrailerType, setSelectedTrailerType] = useState('trolley');
  const [trailerCapacityError, setTrailerCapacityError] = useState('');
  
  const [pickupStatus, setPickupStatus] = useState('idle'); 
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [simulatedEta, setSimulatedEta] = useState(15);
  const [simulatedProgress, setSimulatedProgress] = useState(0); 
  const [tractorCreditNotice, setTractorCreditNotice] = useState({ show: false, amount: 0, weight: 0, type: '' });
  const [activeRouteCoords, setActiveRouteCoords] = useState([]);

  // Bio-char Delivery States
  const [charDeliveries, setCharDeliveries] = useState([{ id: 'DEL-801', date: '2026-06-28', product: 'Standard Eco-Biochar', bags: 5, totalPaid: 2250, driver: 'Gurdip Singh', phone: '+91 92110-38491', tractor: 'John Deere 5105 (PB-10-M-3329)', progress: 100, status: 'Arrived at Farm' }]);
  const [selectedCharId, setSelectedCharId] = useState('bc-1');
  const [charBagsCount, setCharBagsCount] = useState(10);
  const [charPaymentMethod, setCharPaymentMethod] = useState('wallet');
  const [biocharError, setBiocharError] = useState('');
  const [biocharStep, setBiocharStep] = useState('catalog'); 
  const [activeCharDeliveryId, setActiveCharDeliveryId] = useState('DEL-801');
  const [biocharRouteCoords, setBiocharRouteCoords] = useState({});

  // AI Assistant States
  const [aiChatHistory, setAiChatHistory] = useState([
    { role: 'model', parts: [{ text: 'Sat Sri Akal! I am Krishi Mitra, your AI farming assistant. How can I help you with crop residue, biochar, or farming today?' }] }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);


  // Tractor Logistics Engine
  useEffect(() => {
    let timer;
    if (pickupStatus === 'en_route') {
      timer = setInterval(() => {
        setSimulatedProgress((prev) => {
          const nextVal = prev + 2; 
          if (nextVal >= 100) {
            setPickupStatus('loading');
            setSimulatedEta(0);
            clearInterval(timer);
            return 100;
          }
          setSimulatedEta(Math.max(1, Math.round(15 * (1 - nextVal / 100))));
          return nextVal;
        });
      }, 200);
    } else if (pickupStatus === 'loading') {
      timer = setTimeout(() => {
        setPickupStatus('returning');
      }, 3000);
    } else if (pickupStatus === 'returning') {
      timer = setInterval(() => {
        setSimulatedProgress((prev) => {
          const nextVal = prev - 2; 
          if (nextVal <= 0) {
            setPickupStatus('completed');
            
            // EXECUTE FINANCIAL PAYOUT ONLY WHEN JOURNEY IS 100% COMPLETE
            const matchedResidue = wasteTypes.find(w => w.name === pickupBiomassType);
            const rate = matchedResidue ? matchedResidue.rate : 5.0;
            const weight = parseFloat(pickupEstWeight) || 1000;
            const value = weight * rate;
            const pointsEarned = Math.floor(weight / 10);
            
            const prevLatestHash = supplies[0]?.hash || '0000000000000000';
            const newHash = '000' + generateMockHash(prevLatestHash);
            
            setSupplies(prevSupplies => {
              const nextId = getNextTransactionId(prevSupplies);
              return [{
                id: nextId,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: pickupBiomassType,
                weight: weight,
                rate: rate,
                value: value,
                points: pointsEarned,
                hash: newHash,
                prevHash: prevLatestHash,
                status: 'Verified & Credited'
              }, ...prevSupplies];
            });

            setWalletBalance(prevBal => prevBal + value);
            setRewardPoints(prevPoints => prevPoints + pointsEarned);
            setTotalWasteSupplied(prevTotal => prevTotal + weight);
            
            // Remove from barn inventory
            setBarnInventory(prev => {
                const itemIndex = prev.findIndex(item => item.type === pickupBiomassType);
                if (itemIndex > -1) {
                    const newInv = [...prev];
                    newInv[itemIndex].weight -= weight;
                    if (newInv[itemIndex].weight <= 0) {
                        newInv.splice(itemIndex, 1);
                    }
                    return newInv;
                }
                return prev;
            });
            
            setTractorCreditNotice({
              show: true,
              amount: value,
              weight: weight,
              type: pickupBiomassType
            });
            
            clearInterval(timer);
            return 0;
          }
          return nextVal;
        });
      }, 200);
    }
    return () => {
      clearInterval(timer);
      clearTimeout(timer);
    };
  }, [pickupStatus, pickupBiomassType, pickupEstWeight, wasteTypes, supplies]);

  // Interpolate Position along Polyline array
  const getPositionOnPolyline = (coordsArray, progressPercentage) => {
      if (!coordsArray || coordsArray.length === 0) return null;
      if (coordsArray.length === 1) return coordsArray[0];
      
      const t = progressPercentage / 100;
      if (t <= 0) return coordsArray[0];
      if (t >= 1) return coordsArray[coordsArray.length - 1];

      const segmentIndexFloat = t * (coordsArray.length - 1);
      const segmentIndex = Math.floor(segmentIndexFloat);
      const segmentT = segmentIndexFloat - segmentIndex;

      const p1 = coordsArray[segmentIndex];
      const p2 = coordsArray[segmentIndex + 1];

      const lat = p1.lat + (p2.lat - p1.lat) * segmentT;
      const lng = p1.lng + (p2.lng - p1.lng) * segmentT;

      return { lat, lng };
  };

  const currentTractorPos = useMemo(() => getPositionOnPolyline(activeRouteCoords, simulatedProgress), [activeRouteCoords, simulatedProgress]);


  const startPickupDispatch = (e) => {
    e.preventDefault();
    if (!pickupBiomassType) {
        setTrailerCapacityError('Please select a residue from your barn inventory.');
        return;
    }
    
    const chosenTrailer = TRAILER_TYPES.find(t => t.id === selectedTrailerType);
    const weight = parseFloat(pickupEstWeight);
    const barnItem = barnInventory.find(item => item.type === pickupBiomassType);

    if (isNaN(weight) || weight <= 0) {
      setTrailerCapacityError('Please enter a valid estimated weight.');
      return;
    }

    if (!barnItem || weight > barnItem.weight) {
      setTrailerCapacityError(`You only have ${barnItem ? barnItem.weight : 0} kg of ${pickupBiomassType} in your barn.`);
      return;
    }

    if (weight > chosenTrailer.capacity) {
      setTrailerCapacityError(`Trailer capacity restricted to ${chosenTrailer.capacity.toLocaleString()} kg.`);
      return;
    }

    setTrailerCapacityError('');
    setTractorCreditNotice({ show: false, amount: 0, weight: 0, type: '' });
    setPickupStatus('searching');

    // Generate New Unique Route ONLY on dispatch
    const farmLat = userLocation?.lat || defaultBaseLat;
    const farmLng = userLocation?.lng || defaultBaseLng;
    const randLatOffset = (Math.random() - 0.5) * 0.08;
    const randLngOffset = (Math.random() - 0.5) * 0.08;
    const depotLat = farmLat + randLatOffset;
    const depotLng = farmLng + randLngOffset;
    
    const generatedRoute = generateOrganicRoute(
        { lat: depotLat, lng: depotLng }, 
        { lat: farmLat, lng: farmLng }, 
        10
    );
    setActiveRouteCoords(generatedRoute);

    setTimeout(() => {
      setSelectedDriver(DRIVER_FLEET[Math.floor(Math.random() * DRIVER_FLEET.length)]);
      setPickupStatus('en_route'); 
      setSimulatedProgress(0);
      setSimulatedEta(12 + Math.floor(Math.random() * 8));
    }, 1500);
  };

  const handlePurchaseBiochar = (e) => {
    e.preventDefault();
    setBiocharError('');
    const productObj = INITIAL_BIOCHAR_PRODUCTS.find(p => p.id === selectedCharId);
    const quantity = parseInt(charBagsCount, 10);
    if (isNaN(quantity) || quantity <= 0) return;
    const totalCost = productObj.price * quantity;

    if (charPaymentMethod === 'wallet' && totalCost > walletBalance) {
      setBiocharError('Insufficient balance in your Mandi Pouch.');
      return;
    }

    setBiocharStep('processing');

    setTimeout(() => {
      const matchDriver = DRIVER_FLEET[Math.floor(Math.random() * DRIVER_FLEET.length)];
      const newDelId = getNextDeliveryId(charDeliveries);

      const newDelivery = {
        id: newDelId,
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        product: productObj.name,
        bags: quantity,
        totalPaid: totalCost,
        driver: matchDriver.name,
        phone: matchDriver.phone,
        tractor: `${matchDriver.vehicle}`,
        progress: 0,
        status: 'Preparing Order at Pyrolysis Plant'
      };

      // Generate Delivery Route
      const farmLat = userLocation?.lat || defaultBaseLat;
      const farmLng = userLocation?.lng || defaultBaseLng;
      const plantLat = farmLat - (Math.random() * 0.05 + 0.02);
      const plantLng = farmLng + (Math.random() * 0.05 + 0.02);
      
      const newRoute = generateOrganicRoute(
          { lat: plantLat, lng: plantLng },
          { lat: farmLat, lng: farmLng },
          8
      );

      setBiocharRouteCoords(prev => ({ ...prev, [newDelId]: newRoute }));
      setCharDeliveries(prev => [newDelivery, ...prev]);
      setActiveCharDeliveryId(newDelivery.id);
      setBiocharStep('success');
    }, 2000);
  };

  useEffect(() => {
    const activeDelivery = charDeliveries.find(d => d.id === activeCharDeliveryId);
    if (!activeDelivery || activeDelivery.progress >= 100) return;

    const timer = setInterval(() => {
      setCharDeliveries(prevDeliveries => {
        return prevDeliveries.map(d => {
          if (d.id === activeCharDeliveryId) {
            const nextProgress = Math.min(100, d.progress + 2);
            const statusMessage = nextProgress === 100 ? 'Arrived at Farm' : `En Route (${nextProgress}% Coordinates)`;
            
            // DEDUCT WALLET BALANCE ONLY WHEN DELIVERY REACHES 100%
            if (nextProgress === 100 && d.progress !== 100) {
                 if (charPaymentMethod === 'wallet') {
                     setWalletBalance(prev => prev - d.totalPaid);
                 }
                 setRewardPoints(prev => prev + (INITIAL_BIOCHAR_PRODUCTS.find(p=>p.name === d.product).pointsReward * d.bags));
            }
            return { ...d, progress: nextProgress, status: statusMessage };
          }
          return d;
        });
      });
    }, 500);

    return () => clearInterval(timer);
  }, [charDeliveries, activeCharDeliveryId, charPaymentMethod]);

  const handleAiChatSubmit = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const newUserMessage = { role: 'user', parts: [{ text: aiInput }] };
    const updatedHistory = [...aiChatHistory, newUserMessage];
    setAiChatHistory(updatedHistory);
    setAiInput('');
    setIsAiLoading(true);

    try {
      const systemPrompt = "You are Krishi Mitra, an expert agricultural AI assistant for the Agri-Loop platform in India. Help farmers with crop residue recycling, biochar benefits, weather impacts, and general agronomy. Keep answers concise, practical, respectful, and as plain text without complex markdown formatting.";
      const payload = {
        contents: updatedHistory,
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };
      const apiKey = ""; // Will be injected by Canvas secure environment
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text) {
        setAiChatHistory([...updatedHistory, { role: 'model', parts: [{ text }] }]);
      } else {
        setAiChatHistory([...updatedHistory, { role: 'model', parts: [{ text: "Network congestion at the moment. Please try again." }] }]);
      }
    } catch (error) {
      setAiChatHistory([...updatedHistory, { role: 'model', parts: [{ text: "Network error. Please check your connection." }] }]);
    } finally {
      setIsAiLoading(false);
    }
  };


  // ==========================================
  // B2B INDUSTRIAL PORTAL STATES (Prototype Code)
  // ==========================================
  const [b2bTab, setB2bTab] = useState('dashboard');
  const [selectedProduct, setSelectedProduct] = useState(BIO_OIL_TYPES[0]);
  const [density, setDensity] = useState(BIO_OIL_TYPES[0].defaultDensity);
  const [concentration, setConcentration] = useState(BIO_OIL_TYPES[0].defaultConcentration);
  const [quantity, setQuantity] = useState(5000); 
  const [corpName, setCorpName] = useState('Nexa BioMaterials Corp');
  const [corpPhone, setCorpPhone] = useState('+91 98765 43210');
  const [corpCity, setCorpCity] = useState('Haldia'); 
  const [b2bSelectedVehicle, setB2bSelectedVehicle] = useState(INDUSTRIAL_VEHICLES[0]);
  const [b2bVehicleName, setB2bVehicleName] = useState('Scania Bio-Hauler X2');
  const [b2bVehicleNo, setB2bVehicleNo] = useState('WB-74-AK-5012');
  
  const [orderStage, setOrderStage] = useState('configure'); // configure, checkout, processing, success
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [activeB2bOrder, setActiveB2bOrder] = useState(null);
  const [b2bExpandedOrderId, setB2bExpandedOrderId] = useState(null);
  
  const [b2bTrackingProgress, setB2bTrackingProgress] = useState(0); 
  const [isB2bTrackerActive, setIsB2bTrackerActive] = useState(false);
  const [b2bSpeed, setB2bSpeed] = useState(65);
  const [b2bTemp, setB2bTemp] = useState(38.2);
  const [b2bCheckpointIndex, setB2bCheckpointIndex] = useState(0);

  const b2bPathPoints = useMemo(() => getPathPoints(corpCity), [corpCity]);
  const b2bDynamicPathD = useMemo(() => b2bPathPoints.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`).join(' '), [b2bPathPoints]);

  const [b2bOrdersHistory, setB2bOrdersHistory] = useState([
    {
      id: 'BO-2026-9812', buyer: 'GreenSteel Foundry', phone: '+91 88877 66554', productName: 'Fast-Pyrolysis Heavy Crude',
      quantity: 12000, density: 1180, concentration: 88, paymentMethod: 'Corporate Line (RTGS)',
      pricingDetails: { perLiter: '1.24', subtotal: '14880.00', rebate: '744.00', logistics: '1440.00', tax: '2804.80' },
      totalPaid: 18380.80, status: 'Delivered', date: 'June 28, 2026', vehicleNo: 'KA-03-MK-7119'
    }
  ]);

  const calculatePricing = () => {
    const base = selectedProduct.basePricePerLiter;
    const densityRatio = density / selectedProduct.defaultDensity;
    const densityPremium = (densityRatio - 1) * 0.4; 
    const concentrationRatio = concentration / selectedProduct.defaultConcentration;
    const concentrationPremium = (concentrationRatio - 1) * 0.8; 
    const finalPerLiter = base * (1 + densityPremium + concentrationPremium);
    const subtotal = finalPerLiter * quantity;
    const carbonTaxRebate = subtotal * 0.05; 
    const logisticsFee = quantity * 0.12; 
    const tax = (subtotal + logisticsFee) * 0.18; 
    const grandTotal = subtotal - carbonTaxRebate + logisticsFee + tax;
    return {
      perLiter: finalPerLiter.toFixed(2), subtotal: subtotal.toFixed(2), rebate: carbonTaxRebate.toFixed(2),
      logistics: logisticsFee.toFixed(2), tax: tax.toFixed(2), total: grandTotal.toFixed(2)
    };
  };
  const pricing = calculatePricing();

  const handleB2bCheckoutSubmit = (e) => { e.preventDefault(); setOrderStage('checkout'); };

  const processB2bPayment = () => {
    setOrderStage('processing');
    setTimeout(() => {
      const cleanPaymentMethod = paymentMethod === 'upi' ? 'UPI / QR Transfer' : paymentMethod === 'card' ? 'Corporate Card Line' : 'Direct Net Banking (RTGS)';
      const newOrder = {
        id: `BO-2026-${Math.floor(1000 + Math.random() * 8999)}`, buyer: corpName, phone: corpPhone, productName: selectedProduct.name,
        quantity: quantity, density: density, concentration: concentration, paymentMethod: cleanPaymentMethod,
        pricingDetails: { perLiter: pricing.perLiter, subtotal: pricing.subtotal, rebate: pricing.rebate, logistics: pricing.logistics, tax: pricing.tax },
        totalPaid: parseFloat(pricing.total), status: 'In Transit', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        vehicleName: b2bVehicleName, vehicleNo: b2bVehicleNo, driverName: 'Sanjay Sharma', driverContact: '+91 90123 45678'
      };
      setActiveB2bOrder(newOrder);
      setB2bOrdersHistory([newOrder, ...b2bOrdersHistory]);
      setOrderStage('success');
      setTimeout(() => {
        setB2bTab('tracker');
        setIsB2bTrackerActive(true);
        setB2bTrackingProgress(0);
      }, 1500);
    }, 2000);
  };

  useEffect(() => {
    let interval = null;
    if (isB2bTrackerActive && b2bTrackingProgress < 100) {
      interval = setInterval(() => {
        setB2bTrackingProgress(prev => {
          const nextVal = prev + 1;
          if (nextVal >= 100) {
            setIsB2bTrackerActive(false);
            if (activeB2bOrder) {
              setB2bOrdersHistory(prevHistory => prevHistory.map(o => o.id === activeB2bOrder.id ? { ...o, status: 'Delivered' } : o));
              setActiveB2bOrder(prevOrder => ({ ...prevOrder, status: 'Delivered' }));
            }
            return 100;
          }
          setB2bSpeed(Math.floor(60 + Math.random() * 15 - (nextVal % 10 === 0 ? 10 : 0)));
          setB2bTemp(parseFloat((37.5 + Math.sin(nextVal) * 1.5).toFixed(1)));
          const segIdx = Math.min(Math.floor(nextVal / (100 / (b2bPathPoints.length - 1))), b2bPathPoints.length - 1);
          setB2bCheckpointIndex(segIdx);
          return nextVal;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isB2bTrackerActive, b2bTrackingProgress, activeB2bOrder, b2bPathPoints.length]);

  const getB2bTruckPosition = () => {
    if (b2bPathPoints.length === 0) return { x: 0, y: 0 };
    const totalSegments = b2bPathPoints.length - 1;
    const progressPerSegment = 100 / totalSegments;
    const segmentIndex = Math.min(Math.floor(b2bTrackingProgress / progressPerSegment), totalSegments - 1);
    const segmentProgress = (b2bTrackingProgress % progressPerSegment) / progressPerSegment;
    const startPoint = b2bPathPoints[segmentIndex];
    const endPoint = b2bPathPoints[segmentIndex + 1];
    return {
        x: startPoint.x + (endPoint.x - startPoint.x) * segmentProgress,
        y: startPoint.y + (endPoint.y - startPoint.y) * segmentProgress
    };
  };
  const b2bTruckPos = getB2bTruckPosition();


  // ==========================================
  // RENDER LOGIC
  // ==========================================
  if (!user && activeGlobalTab === 'kisan') {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-950 flex flex-col items-center justify-center p-4 font-sans transition-colors duration-300">
        <div className="max-w-4xl w-full bg-white dark:bg-stone-900 rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-12 border border-stone-200 dark:border-stone-800 transition-colors">
          {/* Info Sidebar */}
          <div className="md:col-span-5 bg-gradient-to-br from-emerald-800 to-teal-950 p-8 text-emerald-100 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-black text-white">Agri-Loop Network</h1>
              <p className="text-sm text-emerald-200 mt-2 font-medium">Rural Biomass Ledger & Industrial Trading.</p>
            </div>
            <div className="space-y-4 py-8">
              <div className="flex gap-3"><Scale className="text-emerald-400" /><div><h4 className="font-bold text-white text-sm">Transparent Scale Calibration</h4></div></div>
              <div className="flex gap-3"><Truck className="text-emerald-400" /><div><h4 className="font-bold text-white text-sm">Dynamic Tractor Logistics</h4></div></div>
              <div className="flex gap-3"><Coins className="text-emerald-400" /><div><h4 className="font-bold text-white text-sm">Instant Ledger Payouts</h4></div></div>
            </div>
            <button onClick={() => setActiveGlobalTab('b2b')} className="bg-emerald-900/50 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 font-bold py-3 px-4 rounded-xl text-xs transition">
              Switch to Industrial B2B Portal →
            </button>
          </div>

          {/* Login Form */}
          <div className="md:col-span-7 p-8 bg-stone-50 dark:bg-stone-950/50 flex flex-col justify-center">
            <h2 className="text-2xl font-black text-stone-900 dark:text-white mb-6">Farmer Login</h2>
            <form onSubmit={(e) => { e.preventDefault(); setUser({name: 'Sardar Jagdeep Singh', village: authVillage || 'Kiri Afghana', email: authEmail}); }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400">Mobile or Email</label>
                <input type="text" required value={authEmail} onChange={e=>setAuthEmail(e.target.value)} className="w-full mt-1 p-3 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white rounded-xl focus:outline-emerald-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-500 dark:text-stone-400">Village Hub</label>
                <div className="flex gap-2 mt-1">
                  <input type="text" required value={authVillage} onChange={e=>setAuthVillage(e.target.value)} className="flex-1 p-3 border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-white rounded-xl focus:outline-emerald-600" />
                  <button type="button" onClick={handleDetectLocation} disabled={isLocating} className="bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 px-4 rounded-xl font-bold flex items-center gap-2 hover:bg-stone-300 transition">
                    <Navigation className={`h-4 w-4 ${isLocating ? 'animate-spin text-emerald-600' : ''}`} /> GPS
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold p-3 rounded-xl transition mt-4">Access Mandi Pouch</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: INDUSTRIAL B2B PORTAL
  // ==========================================
  if (activeGlobalTab === 'b2b') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-50 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md">
                <Factory className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">AGRILOOP BIO-OIL</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Industrial B2B Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={() => setActiveGlobalTab('kisan')} className="text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition hidden sm:block">← Back to Kisan Portal</button>
               <nav className="flex space-x-1 bg-slate-100 dark:bg-slate-950/80 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  <button onClick={() => setB2bTab('dashboard')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${b2bTab === 'dashboard' ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Hub</button>
                  <button onClick={() => setB2bTab('order')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${b2bTab === 'order' ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Procure</button>
                  <button onClick={() => setB2bTab('tracker')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${b2bTab === 'tracker' ? 'bg-white dark:bg-emerald-500 text-slate-900 dark:text-slate-950 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                    Tracker {isB2bTrackerActive && <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping ml-1"></span>}
                  </button>
               </nav>
               {/* Theme Toggle */}
               <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                  <button onClick={() => setThemeMode('light')} className={`p-1.5 rounded-md text-xs font-bold transition ${themeMode === 'light' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>☀️</button>
                  <button onClick={() => setThemeMode('dark')} className={`p-1.5 rounded-md text-xs font-bold transition ${themeMode === 'dark' ? 'bg-slate-950 text-emerald-400 shadow-sm' : 'text-slate-400'}`}>🌙</button>
               </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
          {/* B2B Dashboard */}
          {b2bTab === 'dashboard' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="bg-gradient-to-r from-slate-100 to-emerald-50 dark:from-slate-900 dark:to-emerald-950/40 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Sustainable Energy Logistics</h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-2xl font-medium">Procure premium bio-oils derived from rural agricultural waste. Monitor custom physical properties, securely settle bulk payments, and track temperature-monitored tankers live.</p>
                </div>
                <button onClick={() => setB2bTab('order')} className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg transition-transform active:scale-95 whitespace-nowrap">
                  Initiate Procurement →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Carbon Offsets</h3><span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-xs font-bold px-2 py-1 rounded">A+ RATING</span></div>
                  <div className="text-4xl font-black text-slate-900 dark:text-white">{(b2bOrdersHistory.reduce((acc, curr) => acc + (curr.quantity * 0.0024), 0)).toFixed(2)} MT</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Greenhouse Gas reduction relative to mineral heavy fuel oils based on your collective orders.</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">Market Purity Index</h3><span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 text-xs font-bold px-2 py-1 rounded">LIVE</span></div>
                  <div className="text-4xl font-black text-slate-900 dark:text-white">94.8%</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Average distillation purity currently maintained across all refineries (ASTM D7544).</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4"><h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">Supply Chain Link</h3><span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded">SECURE</span></div>
                  <div className="text-xl font-black text-slate-900 dark:text-white font-mono break-all">NODE_OK_902</div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">100% of bio-oil feedstock is traced back to verified rural farmers using Earth Ledger technology.</p>
                </div>
              </div>

              {/* B2B Consignment Ledger */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                 <div className="p-6 border-b border-slate-200 dark:border-slate-800"><h3 className="text-lg font-bold text-slate-900 dark:text-white">Consignment Ledger</h3></div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300">
                      <thead className="bg-slate-50 dark:bg-slate-950/40 text-xs uppercase font-bold text-slate-500 dark:text-slate-400">
                        <tr><th className="px-6 py-4">Contract ID</th><th className="px-6 py-4">Bio-Oil Specification</th><th className="px-6 py-4">Total Value</th><th className="px-6 py-4">Status</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium">
                         {b2bOrdersHistory.map((order, idx) => (
                           <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition">
                             <td className="px-6 py-4"><span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block">{order.id}</span><span className="text-xs text-slate-400">{order.date}</span></td>
                             <td className="px-6 py-4"><span className="font-bold block">{order.productName}</span><span className="text-xs">{order.quantity.toLocaleString()} L | {order.density} kg/m³</span></td>
                             <td className="px-6 py-4 font-mono font-bold">₹{order.totalPaid.toLocaleString()}</td>
                             <td className="px-6 py-4">
                               <span className={`px-2 py-1 rounded text-[10px] font-bold ${order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 animate-pulse'}`}>{order.status}</span>
                             </td>
                           </tr>
                         ))}
                      </tbody>
                    </table>
                 </div>
              </div>
            </div>
          )}

          {/* B2B Procurement Form */}
          {b2bTab === 'order' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
              <div className="lg:col-span-7 space-y-6">
                {orderStage === 'configure' && (
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Configure Energy Feedstock</h3>
                    <form onSubmit={handleB2bCheckoutSubmit} className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Corporate Client</label><input type="text" required value={corpName} onChange={e=>setCorpName(e.target.value)} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-bold" /></div>
                        <div><label className="text-xs font-bold text-slate-500 uppercase">Destination City</label><input type="text" required value={corpCity} onChange={e=>setCorpCity(e.target.value)} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-bold" /></div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-500 uppercase">Select Distillate Family</label>
                        <div className="grid grid-cols-2 gap-3">
                           {BIO_OIL_TYPES.map(type => (
                             <div key={type.id} onClick={() => setSelectedProduct(type)} className={`cursor-pointer p-4 rounded-xl border transition ${selectedProduct.id === type.id ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950'}`}>
                               <h4 className="font-bold text-sm text-slate-900 dark:text-white">{type.name}</h4>
                               <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{type.description}</p>
                             </div>
                           ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase">Required Volume (Liters)</label>
                           <input type="number" min="1000" step="500" value={quantity} onChange={e=>setQuantity(Number(e.target.value))} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-mono font-bold text-slate-900 dark:text-white" />
                        </div>
                        <div>
                           <label className="text-xs font-bold text-slate-500 uppercase">Logistics Vehicle</label>
                           <select onChange={e=>setB2bSelectedVehicle(INDUSTRIAL_VEHICLES.find(v=>v.id===e.target.value))} className="w-full mt-1 p-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg font-bold text-slate-900 dark:text-white">
                             {INDUSTRIAL_VEHICLES.map(v => <option key={v.id} value={v.id}>{v.name} (Max {v.capacity.toLocaleString()})</option>)}
                           </select>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold py-3.5 rounded-xl transition shadow-md">Proceed to Secure Checkout</button>
                    </form>
                  </div>
                )}
                
                {orderStage === 'checkout' && (
                   <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                      <button onClick={()=>setOrderStage('configure')} className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white">← Back</button>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select Industrial Gateway</h3>
                      <div className="grid grid-cols-3 gap-3">
                         <div onClick={()=>setPaymentMethod('upi')} className={`p-4 rounded-xl border cursor-pointer font-bold text-center ${paymentMethod === 'upi' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'}`}>UPI / QR</div>
                         <div onClick={()=>setPaymentMethod('card')} className={`p-4 rounded-xl border cursor-pointer font-bold text-center ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'}`}>Corporate Card</div>
                         <div onClick={()=>setPaymentMethod('netbanking')} className={`p-4 rounded-xl border cursor-pointer font-bold text-center ${paymentMethod === 'netbanking' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950'}`}>RTGS Bank</div>
                      </div>
                      <button onClick={processB2bPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold py-3.5 rounded-xl transition shadow-md">Authorize ₹{parseFloat(pricing.total).toLocaleString()} Settle</button>
                   </div>
                )}

                {orderStage === 'processing' && <div className="bg-white dark:bg-slate-900 p-16 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm"><div className="h-16 w-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div><h3 className="font-bold text-lg">Clearing Corporate Node...</h3></div>}
                
                {orderStage === 'success' && (
                  <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-slate-200 dark:border-slate-800 text-center shadow-sm space-y-4">
                    <div className="h-20 w-20 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-4xl mx-auto">✓</div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Payment Settled</h3>
                    <p className="text-slate-500 font-medium">Logistics tracker is now active.</p>
                  </div>
                )}
              </div>

              {/* B2B Quotation Sidebar */}
              <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                 <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Live Quotation</h3>
                 <div className="space-y-2 text-sm font-medium text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between"><span>Distillate</span><span className="text-slate-900 dark:text-white font-bold">{selectedProduct.name}</span></div>
                    <div className="flex justify-between"><span>Volume</span><span className="font-mono">{quantity.toLocaleString()} L</span></div>
                    <div className="flex justify-between"><span>Density</span><span className="font-mono">{density} kg/m³</span></div>
                 </div>
                 <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2 text-sm font-medium">
                    <div className="flex justify-between text-slate-500"><span>Base Price</span><span className="font-mono">₹{pricing.subtotal}</span></div>
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400"><span>Green Tax Rebate</span><span className="font-mono">-₹{pricing.rebate}</span></div>
                    <div className="flex justify-between text-slate-500"><span>Transport & GST</span><span className="font-mono">₹{(parseFloat(pricing.logistics) + parseFloat(pricing.tax)).toFixed(2)}</span></div>
                    <div className="flex justify-between text-lg font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                      <span>Total Invoice</span><span className="text-emerald-600 dark:text-emerald-400 font-mono">₹{pricing.total}</span>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {/* B2B Tracker */}
          {b2bTab === 'tracker' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
               <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span> Live Logistics Mapping
                    </h3>
                    <button onClick={() => setIsB2bTrackerActive(!isB2bTrackerActive)} className={`px-4 py-2 rounded-lg text-xs font-bold ${isB2bTrackerActive ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'}`}>
                      {isB2bTrackerActive ? 'Pause Tracker' : b2bTrackingProgress >= 100 ? 'Arrived' : 'Resume Tracker'}
                    </button>
                  </div>
                  
                  {/* Custom Interstate SVG Route Simulator */}
                  <div className="relative bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 h-80 overflow-hidden">
                     <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="none">
                       <path d={b2bDynamicPathD} fill="none" stroke={themeMode === 'dark' ? '#334155' : '#cbd5e1'} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                       <path d={b2bDynamicPathD} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1000" strokeDashoffset={1000 - (b2bTrackingProgress * 10)} />
                       {b2bPathPoints.map((pt, idx) => (
                         <g key={idx}>
                           <circle cx={pt.x} cy={pt.y} r={idx === 0 || idx === b2bPathPoints.length - 1 ? 8 : 5} fill={b2bTrackingProgress >= (idx * (100 / (b2bPathPoints.length - 1))) ? '#10b981' : (themeMode === 'dark' ? '#1e293b' : '#fff')} stroke="#10b981" strokeWidth="2" />
                           <text x={pt.x} y={pt.y - 15} textAnchor="middle" fill={themeMode === 'dark' ? '#cbd5e1' : '#475569'} fontSize="10" fontWeight="bold">{pt.name}</text>
                         </g>
                       ))}
                       {b2bTrackingProgress > 0 && b2bTrackingProgress < 100 && (
                          <g transform={`translate(${b2bTruckPos.x - 14}, ${b2bTruckPos.y - 14})`}>
                             <circle cx="14" cy="14" r="18" fill="none" stroke="#f59e0b" strokeWidth="2" className="animate-pulse" />
                             <rect x="4" y="8" width="20" height="12" rx="3" fill="#f59e0b" />
                          </g>
                       )}
                     </svg>
                     <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 px-3 py-2 rounded-lg shadow font-mono text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
                        Progress: {b2bTrackingProgress}%
                     </div>
                  </div>
               </div>

               <div className="lg:col-span-4 space-y-6">
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">Active Telemetry</h4>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                          <span className="block text-xs font-bold text-slate-500 mb-1">Temp (Thermal Lock)</span>
                          <span className="text-xl font-black font-mono text-amber-500">{b2bTemp}°C</span>
                       </div>
                       <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
                          <span className="block text-xs font-bold text-slate-500 mb-1">Speed</span>
                          <span className="text-xl font-black font-mono text-blue-500">{b2bSpeed} km/h</span>
                       </div>
                    </div>
                 </div>
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">Contract Info</h4>
                    <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                       <div className="flex justify-between"><span>Vehicle</span><span className="font-bold">{activeB2bOrder?.vehicleName || b2bVehicleName}</span></div>
                       <div className="flex justify-between"><span>Plate</span><span className="font-mono text-amber-600 dark:text-amber-400">{activeB2bOrder?.vehicleNo || b2bVehicleNo}</span></div>
                       <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2"><span>Destination</span><span className="font-bold">{activeB2bOrder?.buyer || corpName}</span></div>
                    </div>
                 </div>
               </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ==========================================
  // RENDER: MAIN KISAN PORTAL (DEFAULT)
  // ==========================================
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 font-sans text-stone-900 dark:text-stone-100 transition-colors duration-300">
      
      {/* Top Banner */}
      <header className="bg-gradient-to-r from-emerald-700 to-teal-800 dark:from-emerald-900 dark:to-teal-950 px-4 py-2 text-[11px] flex justify-between items-center font-bold tracking-wide shadow-sm text-white">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-ping" /> LIVE MANDI RATES</span>
          <span className="hidden md:inline text-white/80">• Node: {userLocation?.name || "Punjab Sector"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Theme:</span>
          <div className="bg-black/20 p-0.5 rounded-lg flex gap-1">
            <button onClick={() => setThemeMode('light')} className={`px-2 py-0.5 rounded text-[10px] uppercase transition ${themeMode === 'light' ? 'bg-white text-emerald-900' : 'text-white/70 hover:text-white'}`}>☀️ Light</button>
            <button onClick={() => setThemeMode('dark')} className={`px-2 py-0.5 rounded text-[10px] uppercase transition ${themeMode === 'dark' ? 'bg-stone-800 text-emerald-400' : 'text-white/70 hover:text-white'}`}>🌙 Dark</button>
            <button onClick={() => setThemeMode('system')} className={`px-2 py-0.5 rounded text-[10px] uppercase transition ${themeMode === 'system' ? 'bg-white/20 text-white' : 'text-white/70 hover:text-white'}`}>💻 Auto</button>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-40 shadow-xs px-4 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white text-lg font-black shadow-md">🚜</div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black leading-tight">Agri-Loop Wallet</h1>
                <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 text-[9px] px-1.5 py-0.5 rounded font-bold border border-stone-200 dark:border-stone-700">Kisan Portal</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                <User className="h-3.5 w-3.5" /> <span className="font-bold">{user.name}</span>
                <span>•</span>
                <MapPin className="h-3 w-3 text-emerald-600 dark:text-emerald-400" /> <span className="font-semibold underline cursor-pointer hover:text-emerald-600" onClick={handleDetectLocation}>{userLocation?.name || user.village}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1 bg-stone-100 dark:bg-stone-950 p-1 rounded-xl border border-stone-200 dark:border-stone-800">
            {['dashboard', 'pickup', 'calculator', 'biochar', 'ai_advisor', 'policies', 'profile'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 capitalize ${activeTab === tab ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm border border-stone-200 dark:border-stone-700' : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'}`}>
                {tab === 'dashboard' && <Wallet className="h-3.5 w-3.5 text-emerald-600" />}
                {tab === 'pickup' && <Truck className="h-3.5 w-3.5 text-blue-500" />}
                {tab === 'calculator' && <LineChart className="h-3.5 w-3.5 text-indigo-500" />}
                {tab === 'biochar' && <ShoppingBag className="h-3.5 w-3.5 text-orange-500" />}
                {tab === 'ai_advisor' && <Bot className="h-3.5 w-3.5 text-teal-500" />}
                {tab === 'policies' && <Shield className="h-3.5 w-3.5 text-stone-500" />}
                {tab === 'profile' && <User className="h-3.5 w-3.5 text-rose-500" />}
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button onClick={() => setActiveGlobalTab('b2b')} className="flex items-center gap-1.5 text-xs font-bold bg-stone-900 text-white dark:bg-white dark:text-stone-900 px-4 py-2 rounded-xl transition hover:opacity-90">
             <Factory className="h-3.5 w-3.5" /> B2B Portal
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Stats Banner */}
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col lg:flex-row justify-between gap-6 transition-colors">
              <div className="space-y-2">
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 font-bold tracking-widest uppercase px-2 py-0.5 rounded-full">Active Account</span>
                <h2 className="text-2xl font-black">Hi, {user.name}! 👨‍🌾</h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xl font-medium leading-relaxed">
                  Your carbon offset loop is synced with the <strong className="text-stone-800 dark:text-stone-200">{userLocation?.name || user.village}</strong> node. Recycle agricultural waste to boost your balance.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 min-w-[140px]">
                  <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase">Mandi Pouch</span>
                  <div className="text-lg font-black text-emerald-800 dark:text-emerald-400 mt-1 font-mono">₹{walletBalance.toLocaleString()}.00</div>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/50 min-w-[140px]">
                  <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase">Reward Points</span>
                  <div className="text-lg font-black text-amber-800 dark:text-amber-400 mt-1 font-mono flex items-center gap-1"><Coins className="h-4 w-4" /> {rewardPoints}</div>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 min-w-[140px]">
                  <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase">Yield Recycled</span>
                  <div className="text-lg font-black text-stone-800 dark:text-stone-200 mt-1 font-mono">{totalWasteSupplied.toLocaleString()} kg</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/50 min-w-[140px]">
                  <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase">Carbon Saved</span>
                  <div className="text-lg font-black text-blue-800 dark:text-blue-400 mt-1 font-mono">{(totalWasteSupplied * 0.4).toLocaleString()} kg</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-6">
                
                {/* On-Farm Barn Inventory */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4 transition-colors">
                   <div className="flex justify-between items-center">
                     <div>
                       <h3 className="font-bold text-sm flex items-center gap-1.5"><Factory className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> On-Farm Barn Stockpile</h3>
                       <p className="text-[11px] text-stone-500 dark:text-stone-400">Log your available agricultural waste ready for pickup</p>
                     </div>
                   </div>
                   
                   <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-3">
                      <select value={newBarnType} onChange={e=>setNewBarnType(e.target.value)} className="flex-1 text-xs p-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg font-bold outline-none text-stone-900 dark:text-white">
                         {wasteTypes.map(w => <option key={w.name} value={w.name} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">{w.icon} {w.name}</option>)}
                      </select>
                      <div className="flex gap-2">
                        <input type="number" placeholder="Weight (kg)" value={newBarnWeight} onChange={e=>setNewBarnWeight(e.target.value)} className="w-32 text-xs p-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-lg font-bold font-mono outline-none" />
                        <button onClick={()=>{
                           if(newBarnWeight && Number(newBarnWeight)>0) {
                              setBarnInventory(prev => {
                                 const existing = prev.find(i=>i.type === newBarnType);
                                 if(existing) {
                                     return prev.map(i => i.type === newBarnType ? {...i, weight: i.weight + Number(newBarnWeight)} : i);
                                 }
                                 return [...prev, {type: newBarnType, weight: Number(newBarnWeight), dateAdded: new Date().toISOString().split('T')[0]}];
                              });
                              setNewBarnWeight('');
                           }
                        }} className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-lg font-bold text-xs shadow-sm transition">Add Stock</button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {barnInventory.length === 0 ? <div className="col-span-2 text-center text-xs text-stone-500 py-4">Barn is currently empty.</div> : barnInventory.map((item, idx) => {
                         const info = wasteTypes.find(w => w.name === item.type);
                         return (
                            <div key={idx} className="border border-stone-200 dark:border-stone-800 rounded-xl p-3 flex justify-between items-center bg-white dark:bg-stone-900">
                               <div className="flex items-center gap-2">
                                  <span className="text-xl">{info?.icon || '🌾'}</span>
                                  <div>
                                     <h4 className="font-bold text-xs">{item.type}</h4>
                                     <span className="text-[10px] text-stone-500">Stored: {item.dateAdded}</span>
                                  </div>
                               </div>
                               <div className="text-right">
                                  <div className="font-mono font-black text-sm text-stone-800 dark:text-stone-200">{item.weight.toLocaleString()} kg</div>
                                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Est. ₹{(item.weight * (info?.rate || 0)).toLocaleString()}</div>
                               </div>
                            </div>
                         )
                      })}
                   </div>
                </div>

                {/* Mandi Index */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-sm">Residue Feedstock Mandi Index</h3>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400">Government baseline pricing linked to dynamic biological carbon offsets</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {wasteTypes.map((waste) => (
                      <div key={waste.name} className="bg-stone-50 dark:bg-stone-950 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{waste.icon}</span>
                          <div>
                            <h4 className="font-bold text-xs leading-tight">{waste.name}</h4>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">{waste.desc}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black font-mono">₹{waste.rate.toFixed(2)} / kg</div>
                          <div className="text-[9px] text-stone-400 mt-0.5">Hum: &lt;{waste.humidityLimit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Earth Ledger */}
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-1.5"><Shield className="h-4 w-4 text-emerald-600" /> Earth Ledger Receipts</h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">Cryptographically chained payment receipts.</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-stone-200 dark:border-stone-800 text-[10px] text-stone-400 font-bold uppercase">
                          <th className="py-2">Receipt / Time</th><th className="py-2">Feedstock</th><th className="py-2">Settled Value</th><th className="py-2 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                        {supplies.map((supply) => (
                          <tr key={supply.id} className="hover:bg-stone-50 dark:hover:bg-stone-950">
                            <td className="py-3"><span className="font-bold block">{supply.id}</span><span className="text-[10px] text-stone-400">{supply.date}</span></td>
                            <td className="py-3"><span className="font-semibold block">{supply.type}</span><span className="text-[10px] text-stone-500 font-mono">{supply.weight.toLocaleString()} kg</span></td>
                            <td className="py-3"><span className="font-black text-emerald-600 dark:text-emerald-400 font-mono block">₹{supply.value.toLocaleString()}</span><span className="text-[10px] text-amber-600">+{supply.points} pts</span></td>
                            <td className="py-3 text-right"><span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800"><CheckCircle2 className="h-3 w-3" /> {supply.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Col: Call to action */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-6 text-center space-y-4">
                  <div className="inline-flex h-12 w-12 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 rounded-full items-center justify-center mb-2"><Truck className="h-6 w-6" /></div>
                  <h3 className="font-bold text-emerald-950 dark:text-emerald-300">Ready to clear your barn?</h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-500 font-medium leading-relaxed">Book a calibrated community tractor to pick up your stockpiled biomass. Payments hit your wallet once the tractor returns to depot.</p>
                  <button onClick={() => { setTractorCreditNotice({show:false,amount:0,weight:0,type:''}); setActiveTab('pickup'); }} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition active:scale-95 text-sm">
                    Book Tractor Pickup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: HARVEST YIELD CALCULATOR */}
        {activeTab === 'calculator' && (
           <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
              <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
                 <div className="text-center border-b border-stone-200 dark:border-stone-800 pb-6">
                    <div className="inline-flex h-16 w-16 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full items-center justify-center mb-4"><LineChart className="h-8 w-8" /></div>
                    <h2 className="text-2xl font-black">Harvest Yield Estimator</h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 font-medium">Calculate expected financial payouts and environmental carbon offsets before committing to a dispatch.</p>
                 </div>

                 <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">Crop Residue Type</label>
                      <select value={calcType} onChange={(e) => setCalcType(e.target.value)} className="w-full p-3.5 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-950 focus:outline-emerald-600 font-bold text-stone-900 dark:text-white">
                        {wasteTypes.map((w) => <option key={w.name} value={w.name}>{w.icon} {w.name} (₹{w.rate.toFixed(2)}/kg)</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">Estimated Weight (kg)</label>
                      <input type="number" value={calcWeight} onChange={(e) => setCalcWeight(e.target.value)} className="w-full p-3.5 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-950 focus:outline-emerald-600 font-black font-mono text-xl text-stone-900 dark:text-white" />
                    </div>
                 </div>

                 {(() => {
                    const wt = parseFloat(calcWeight) || 0;
                    const r = wasteTypes.find(w => w.name === calcType)?.rate || 0.0;
                    const immediatePayout = wt * r;
                    const points = Math.floor(wt / 10);
                    const co2Saved = wt * 0.4; 

                    return (
                      <div className="bg-stone-900 dark:bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-4 text-white">
                        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                          <span className="text-sm font-bold text-stone-400">Total Financial Payout</span>
                          <span className="font-black text-2xl text-emerald-400 font-mono">₹{immediatePayout.toLocaleString()}.00</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                          <span className="text-sm font-bold text-stone-400">Ecosystem Reward Points</span>
                          <span className="font-black text-xl text-amber-400 font-mono">+{points.toLocaleString()} pts</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-stone-400">Environmental Impact</span>
                          <span className="font-black text-xl text-blue-400 font-mono">{co2Saved.toLocaleString()} kg CO₂e</span>
                        </div>
                      </div>
                    );
                 })()}
              </div>
           </div>
        )}

        {/* TAB 2: TRACTOR PICKUP */}
        {activeTab === 'pickup' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fadeIn">
            
            {/* Booking Column */}
            <div className="lg:col-span-4 bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
              <div>
                <h3 className="font-bold text-lg">Book Tractor Pickup</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">Assign a calibrated community tractor to your GPS coordinates</p>
              </div>

              <form onSubmit={startPickupDispatch} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase">Select From Barn Inventory</label>
                  <select 
                    value={pickupBiomassType} 
                    onChange={(e) => {
                        const newType = e.target.value;
                        setPickupBiomassType(newType);
                        // Auto-fill max available weight from barn
                        const invItem = barnInventory.find(i => i.type === newType);
                        if (invItem) setPickupEstWeight(invItem.weight.toString());
                    }}
                    disabled={pickupStatus !== 'idle' && pickupStatus !== 'completed'}
                    className="w-full text-xs p-3 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-950 focus:outline-emerald-600 font-bold text-stone-900 dark:text-white"
                  >
                    {barnInventory.length === 0 ? <option value="">Barn Empty</option> : barnInventory.map((w) => (
                      <option key={w.type} value={w.type} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">{w.type} (Avail: {w.weight}kg)</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase">Dispatch Weight (kg)</label>
                  <input 
                    type="number" 
                    value={pickupEstWeight}
                    onChange={(e) => setPickupEstWeight(e.target.value)}
                    disabled={pickupStatus !== 'idle' && pickupStatus !== 'completed'}
                    className="w-full text-sm p-3 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-950 focus:outline-emerald-600 font-black font-mono text-stone-900 dark:text-white"
                  />
                </div>
                
                {/* Dynamic Bio-Char Yield Estimation Alert */}
                {pickupBiomassType && pickupEstWeight && Number(pickupEstWeight) > 0 && (
                   <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg border border-orange-200 dark:border-orange-900/50 text-xs font-medium text-orange-900 dark:text-orange-400 space-y-1">
                      <div className="flex justify-between font-bold">
                         <span>Estimated Bio-Char Yield:</span>
                         <span className="font-mono">
                            {(() => {
                               const wt = Number(pickupEstWeight);
                               const type = pickupBiomassType.toLowerCase();
                               let yieldRate = 0.20; // Default 20%
                               if(type.includes('coconut')) yieldRate = 0.30;
                               else if(type.includes('groundnut')) yieldRate = 0.35;
                               else if(type.includes('bamboo')) yieldRate = 0.25;
                               else if(type.includes('bagasse')) yieldRate = 0.22;
                               
                               return (wt * yieldRate).toFixed(1);
                            })()} kg
                         </span>
                      </div>
                      <p className="text-[10px] opacity-80 leading-tight">This rural biomass payload will generate certified organic bio-char for the cooperative network.</p>
                   </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-stone-500 dark:text-stone-400 uppercase block">Trailer Class</label>
                  <div className="space-y-2">
                    {TRAILER_TYPES.map((t) => (
                      <div key={t.id} onClick={() => { if (pickupStatus === 'idle' || pickupStatus === 'completed') setSelectedTrailerType(t.id); }} className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${selectedTrailerType === t.id ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm' : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950'}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{t.icon}</span>
                          <div><h4 className="text-xs font-bold">{t.name}</h4><p className="text-[10px] text-stone-500 dark:text-stone-400">{t.desc}</p></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {trailerCapacityError && <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-400 text-[10px] font-bold">⚠️ {trailerCapacityError}</div>}

                <button type="submit" disabled={barnInventory.length === 0 || (pickupStatus !== 'idle' && pickupStatus !== 'completed')} className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold p-3 rounded-xl text-sm transition active:scale-95 shadow-md">
                  Dispatch Tractor Unit
                </button>
              </form>
            </div>

            {/* Map Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2"><span className="w-2.5 h-2.5 bg-emerald-600 rounded-full animate-ping" /> Real-World GPS Tracker</h3>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">Powered by Leaflet & OpenStreetMap</p>
                  </div>
                  <span className="text-[10px] bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full font-bold font-mono">Target: {pickupBiomassType || 'None'}</span>
                </div>

                {/* THE REAL LEAFLET MAP */}
                <div className="relative w-full aspect-[4/3] bg-stone-100 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-inner isolate">
                    {leafletLoaded ? (
                         <MapView 
                             center={{ lat: userLocation?.lat || defaultBaseLat, lng: userLocation?.lng || defaultBaseLng }} 
                             zoom={12}
                             polylineCoords={activeRouteCoords}
                             markerPos={currentTractorPos}
                             bounds={pickupStatus !== 'idle' && pickupStatus !== 'completed'}
                             themeMode={themeMode === 'system' ? (isDark ? 'dark' : 'light') : themeMode}
                         />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-stone-500 text-sm font-bold animate-pulse">Loading Map Engine...</div>
                    )}
                    
                    {pickupStatus === 'idle' && (
                        <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-20">
                            <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 text-center space-y-2">
                               <span className="text-3xl">📡</span>
                               <h4 className="font-bold text-sm">System Waiting</h4>
                               <p className="text-[11px] text-stone-500 dark:text-stone-400">Book a dispatch to establish GPS connection.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Tracking Telemetry Overlay */}
                {selectedDriver && pickupStatus !== 'idle' && (
                    <div className="bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center animate-fadeIn">
                       <div className="sm:col-span-4 flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full flex items-center justify-center text-lg shadow-sm">👨‍🌾</div>
                          <div><h4 className="font-bold text-xs">{selectedDriver.name}</h4><p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">{selectedDriver.vehicle} • {selectedDriver.plate}</p></div>
                       </div>
                       <div className="sm:col-span-5 grid grid-cols-2 gap-2 text-[10px] font-bold">
                          <div>
                             <span className="text-stone-500 dark:text-stone-400 block">Status:</span>
                             <span className="text-blue-600 dark:text-blue-400 font-black text-xs">
                                {pickupStatus === 'en_route' ? `Inbound (${simulatedEta}m)` : pickupStatus === 'loading' ? 'Loading Payload' : pickupStatus === 'returning' ? 'Hauling to Depot' : 'Completed'}
                             </span>
                          </div>
                          <div>
                             <span className="text-stone-500 dark:text-stone-400 block">Progress:</span>
                             <span className="text-stone-900 dark:text-white font-mono font-black text-xs">{simulatedProgress}%</span>
                          </div>
                       </div>
                       <div className="sm:col-span-3 text-right">
                          <button className="bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold py-2 px-4 rounded-lg text-[10px] shadow-sm hover:bg-stone-300 dark:hover:bg-stone-700 transition">📞 Call Driver</button>
                       </div>
                    </div>
                )}
                
                {pickupStatus === 'returning' && tractorCreditNotice.show && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 p-4 rounded-xl space-y-2 animate-fadeIn">
                       <p className="font-black text-emerald-800 dark:text-emerald-400 text-sm flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4" /> Settlement Confirmed & Credited!</p>
                       <div className="flex justify-between text-xs font-bold font-mono text-stone-800 dark:text-stone-300">
                           <span>{tractorCreditNotice.weight}kg {tractorCreditNotice.type}</span>
                           <span className="text-emerald-600 dark:text-emerald-400 text-sm">₹{tractorCreditNotice.amount.toLocaleString()}</span>
                       </div>
                    </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: BIO-CHAR STORE */}
        {activeTab === 'biochar' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Generation Impact Dashboard */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-6 rounded-3xl border border-orange-200 dark:border-orange-900/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
               <div className="space-y-2 w-full md:w-1/2">
                  <h2 className="text-xl font-black text-orange-900 dark:text-orange-400 flex items-center gap-2"><Factory className="h-5 w-5" /> Bio-Char Generation Impact</h2>
                  <p className="text-xs text-orange-800/80 dark:text-orange-500/80 font-medium leading-relaxed">
                    Based on your verified Earth Ledger supply history, your raw biomass has directly contributed to creating high-quality organic soil carbon for the cooperative network.
                  </p>
               </div>
               
               <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-orange-100 dark:border-orange-900 w-full md:w-1/2 space-y-3">
                  <div className="flex justify-between items-end border-b border-stone-100 dark:border-stone-800 pb-2">
                     <span className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">Your Total Bio-Char Output</span>
                     <span className="text-2xl font-black font-mono text-orange-600 dark:text-orange-400">
                        {Math.floor(supplies.reduce((acc, curr) => {
                           const type = curr.type.toLowerCase();
                           let yieldRate = 0.20;
                           if(type.includes('coconut')) yieldRate = 0.30;
                           else if(type.includes('groundnut')) yieldRate = 0.35;
                           else if(type.includes('bamboo')) yieldRate = 0.25;
                           else if(type.includes('bagasse')) yieldRate = 0.22;
                           return acc + (curr.weight * yieldRate);
                        }, 0)).toLocaleString()} kg
                     </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-stone-500 dark:text-stone-400 pt-1">
                     <div className="flex justify-between"><span>Coconut Yield:</span><span className="text-stone-800 dark:text-stone-200">~300g / kg</span></div>
                     <div className="flex justify-between"><span>Groundnut Yield:</span><span className="text-stone-800 dark:text-stone-200">~350g / kg</span></div>
                     <div className="flex justify-between"><span>Bamboo Yield:</span><span className="text-stone-800 dark:text-stone-200">~250g / kg</span></div>
                     <div className="flex justify-between"><span>Bagasse Yield:</span><span className="text-stone-800 dark:text-stone-200">~220g / kg</span></div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                  <h3 className="font-bold text-sm">Pyrolysis Soil Marketplace</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {INITIAL_BIOCHAR_PRODUCTS.map((prod) => (
                      <div key={prod.id} onClick={() => { if(biocharStep === 'catalog' || biocharStep === 'success') { setSelectedCharId(prod.id); setBiocharStep('catalog'); }}} className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between h-40 ${selectedCharId === prod.id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-sm' : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950'}`}>
                        <div className="flex justify-between"><span className="text-2xl">{prod.icon}</span><span className="text-[9px] bg-stone-100 dark:bg-stone-800 font-bold px-1.5 rounded">⭐ {prod.rating}</span></div>
                        <h4 className="font-bold text-xs">{prod.name}</h4>
                        <div className="flex justify-between items-end border-t border-stone-100 dark:border-stone-800 pt-2"><span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">{prod.impact}</span><span className="font-black text-xs font-mono">₹{prod.price}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                <h3 className="font-bold text-sm">Ecosystem Purchase</h3>
                {biocharStep === 'catalog' && (() => {
                  const selectedProduct = INITIAL_BIOCHAR_PRODUCTS.find(p => p.id === selectedCharId);
                  const totalCost = selectedProduct ? selectedProduct.price * charBagsCount : 0;
                  return (
                    <form onSubmit={handlePurchaseBiochar} className="space-y-4">
                      <div className="p-3 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 flex justify-between font-bold text-xs">
                         <span className="flex items-center gap-2 text-stone-900 dark:text-white"><span className="text-lg">{selectedProduct.icon}</span>{selectedProduct.name}</span>
                         <span className="font-mono text-stone-900 dark:text-white">₹{selectedProduct.price}/bag</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <div className="space-y-1"><label className="text-[10px] font-bold text-stone-500 uppercase">Bags (50kg)</label><input type="number" min="1" value={charBagsCount} onChange={e=>setCharBagsCount(Number(e.target.value))} className="w-full text-xs p-2.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 font-mono font-bold rounded-lg outline-none text-stone-900 dark:text-white" /></div>
                         <div className="space-y-1"><label className="text-[10px] font-bold text-stone-500 uppercase">Payment</label><select value={charPaymentMethod} onChange={e=>setCharPaymentMethod(e.target.value)} className="w-full text-xs p-2.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 font-bold rounded-lg outline-none text-stone-900 dark:text-white"><option value="wallet">Wallet (₹{walletBalance.toLocaleString()})</option><option value="upi">UPI</option></select></div>
                      </div>
                      <div className="bg-stone-50 dark:bg-stone-950 p-4 rounded-xl border border-stone-200 dark:border-stone-800 text-xs font-bold flex justify-between">
                         <span className="text-stone-600 dark:text-stone-400">Total Payable:</span><span className="font-black text-sm text-orange-600 dark:text-orange-400 font-mono">₹{totalCost.toLocaleString()}</span>
                      </div>
                      {biocharError && <div className="p-2 text-[10px] bg-rose-50 text-rose-800 font-bold rounded-lg">⚠️ {biocharError}</div>}
                      <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold p-3 rounded-xl text-sm transition">Confirm Purchase</button>
                    </form>
                  );
                })()}

                {biocharStep === 'processing' && <div className="text-center py-10"><div className="h-10 w-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div><p className="font-bold text-sm">Locking Ledger...</p></div>}
                
                {biocharStep === 'success' && (
                   <div className="text-center p-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl space-y-3">
                      <span className="text-3xl">🎉</span>
                      <h4 className="font-bold text-orange-900 dark:text-orange-400">Order Confirmed!</h4>
                      <p className="text-xs font-medium text-orange-800/70 dark:text-orange-300/70">Payment will be deducted automatically when the delivery reaches your farm.</p>
                      <button onClick={()=>setBiocharStep('catalog')} className="w-full bg-orange-600 text-white font-bold p-2.5 rounded-xl text-xs mt-2">Buy More</button>
                   </div>
                )}
              </div>

            </div>
            
            {/* Biochar Delivery Tracking Map */}
            <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
                 <div className="flex justify-between items-center border-b border-stone-100 dark:border-stone-800 pb-3">
                    <h3 className="font-bold text-sm flex items-center gap-2"><Truck className="h-4 w-4 text-orange-500" /> Active Shipments Tracking</h3>
                    <select value={activeCharDeliveryId} onChange={e=>setActiveCharDeliveryId(e.target.value)} className="text-xs p-1.5 border border-stone-200 dark:border-stone-700 rounded-lg bg-stone-50 dark:bg-stone-950 font-bold outline-none text-stone-900 dark:text-white">
                        {charDeliveries.map(d => <option key={d.id} value={d.id}>{d.id}</option>)}
                    </select>
                 </div>

                 {(() => {
                     const currentDelivery = charDeliveries.find(d => d.id === activeCharDeliveryId);
                     if(!currentDelivery) return null;
                     const activeCoords = biocharRouteCoords[currentDelivery.id] || [];
                     const currentPos = getPositionOnPolyline(activeCoords, currentDelivery.progress);

                     return (
                         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-8 relative w-full aspect-[4/3] bg-stone-100 dark:bg-stone-950 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-inner isolate">
                                 {leafletLoaded && activeCoords.length > 0 ? (
                                     <MapView 
                                         center={activeCoords[0]} 
                                         zoom={11}
                                         polylineCoords={activeCoords}
                                         markerPos={currentPos}
                                         bounds={true}
                                         themeMode={themeMode === 'system' ? (isDark ? 'dark' : 'light') : themeMode}
                                     />
                                 ) : (
                                     <div className="absolute inset-0 flex items-center justify-center text-stone-500 text-sm font-bold animate-pulse">Waiting for dispatch data...</div>
                                 )}
                                 <div className="absolute top-4 right-4 bg-white/90 dark:bg-stone-900/90 p-2.5 rounded-lg border border-stone-200 dark:border-stone-700 text-[10px] font-bold shadow-sm z-20 text-stone-900 dark:text-white">
                                     Status: <span className="text-orange-600 dark:text-orange-400">{currentDelivery.status}</span>
                                 </div>
                            </div>
                            <div className="lg:col-span-4 bg-stone-50 dark:bg-stone-950 p-5 rounded-xl border border-stone-200 dark:border-stone-800 space-y-4">
                                <div><span className="text-[10px] bg-orange-100 dark:bg-orange-900/50 text-orange-900 dark:text-orange-400 font-bold px-2 py-0.5 rounded-full uppercase">Delivery Info</span><h4 className="font-bold text-sm mt-2">{currentDelivery.product}</h4></div>
                                <div className="space-y-2 text-xs font-semibold text-stone-600 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800 pt-3">
                                   <div className="flex justify-between"><span>Driver:</span><span className="text-stone-900 dark:text-white">{currentDelivery.driver}</span></div>
                                   <div className="flex justify-between"><span>Tractor:</span><span className="text-stone-900 dark:text-white">{currentDelivery.tractor}</span></div>
                                   <div className="flex justify-between"><span>Total Bags:</span><span className="text-stone-900 dark:text-white">{currentDelivery.bags} ({(currentDelivery.bags*50).toLocaleString()} kg)</span></div>
                                   <div className="flex justify-between font-mono font-black pt-2"><span>Payment Due:</span><span className="text-orange-600 dark:text-orange-400">₹{currentDelivery.totalPaid.toLocaleString()}</span></div>
                                </div>
                            </div>
                         </div>
                     );
                 })()}
            </div>

          </div>
        )}

        {/* TAB 4: KRISHI AI ADVISOR */}
        {activeTab === 'ai_advisor' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
             <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden flex flex-col h-[700px]">
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-700 to-emerald-800 dark:from-teal-900 dark:to-emerald-950 p-6 text-white flex items-center gap-4 shrink-0">
                   <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center text-white shadow-inner backdrop-blur-sm border border-white/30">
                      <Bot className="h-7 w-7" />
                   </div>
                   <div>
                      <h3 className="font-black text-xl flex items-center gap-2">Krishi Mitra <span className="bg-emerald-500 text-emerald-950 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-widest font-black shadow-xs">AI Active</span></h3>
                      <p className="text-teal-100 text-xs font-medium mt-1">Your 24/7 personal agricultural intelligence and agronomy advisor.</p>
                   </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-stone-50 dark:bg-stone-950/50 space-y-6 flex flex-col">
                   {aiChatHistory.map((msg, idx) => (
                      <div key={idx} className={`max-w-[85%] flex flex-col ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                         <span className="text-[10px] font-bold text-stone-400 mb-1 px-1">{msg.role === 'user' ? user.name : 'Krishi Mitra'}</span>
                         <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-tr-sm' : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 rounded-tl-sm'}`}>
                            {msg.parts[0].text}
                         </div>
                      </div>
                   ))}
                   {isAiLoading && (
                      <div className="self-start items-start flex flex-col max-w-[80%]">
                         <span className="text-[10px] font-bold text-stone-400 mb-1 px-1">Krishi Mitra</span>
                         <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl rounded-tl-sm flex gap-1.5 items-center shadow-sm h-12">
                            <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce"></div>
                            <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></div>
                            <div className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></div>
                         </div>
                      </div>
                   )}
                </div>

                {/* Input Area */}
                <form onSubmit={handleAiChatSubmit} className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex gap-3 shrink-0">
                   <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)} placeholder="Ask about crop diseases, mandi rates, or bio-char yields..." disabled={isAiLoading} className="flex-1 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-700 rounded-xl px-4 py-3 text-sm focus:outline-teal-600 font-medium text-stone-900 dark:text-white" />
                   <button type="submit" disabled={isAiLoading || !aiInput.trim()} className="bg-teal-700 hover:bg-teal-800 disabled:bg-stone-300 disabled:dark:bg-stone-800 text-white rounded-xl px-6 flex items-center justify-center transition active:scale-95 shadow-sm">
                      <Send className="h-5 w-5" />
                   </button>
                </form>
             </div>
          </div>
        )}

        {/* TAB 5: POLICIES */}
        {activeTab === 'policies' && (
           <div className="max-w-4xl mx-auto bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black text-stone-900 dark:text-white">Panchayat Fair-Trade Policies</h2>
              <div className="space-y-4">
                 {COMPANY_POLICIES.map((p, i) => (
                    <div key={i} className="p-5 border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-stone-950">
                       <h4 className="font-bold text-sm text-emerald-700 dark:text-emerald-400 mb-2">{i+1}. {p.title}</h4>
                       <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">{p.desc}</p>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* TAB 6: PROFILE */}
        {activeTab === 'profile' && (
           <div className="max-w-2xl mx-auto bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6 animate-fadeIn">
              <h2 className="text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2"><User className="h-6 w-6 text-rose-500" /> Kisan Profile</h2>
              <form onSubmit={e=>{e.preventDefault(); setUser(prev=>({...prev, name:profileName, village:profileVillage})); setProfileSuccessMsg(true); setTimeout(()=>setProfileSuccessMsg(false),3000);}} className="space-y-4">
                 <div className="space-y-1.5"><label className="text-xs font-bold text-stone-500 uppercase">Full Name</label><input type="text" value={profileName} onChange={e=>setProfileName(e.target.value)} className="w-full p-3 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-950 font-bold text-stone-900 dark:text-white outline-none" /></div>
                 <div className="space-y-1.5"><label className="text-xs font-bold text-stone-500 uppercase">Village Hub (Updates Map)</label><div className="flex gap-2"><input type="text" value={profileVillage} onChange={e=>setProfileVillage(e.target.value)} className="flex-1 p-3 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-950 font-bold text-stone-900 dark:text-white outline-none" /><button type="button" onClick={handleDetectLocation} className="px-4 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-400 font-bold rounded-xl text-xs flex items-center gap-1"><Navigation className="h-3.5 w-3.5"/> GPS</button></div></div>
                 <div className="space-y-1.5"><label className="text-xs font-bold text-stone-500 uppercase">Acreage</label><input type="number" value={profileLandSize} onChange={e=>setProfileLandSize(e.target.value)} className="w-full p-3 border border-stone-200 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-950 font-bold text-stone-900 dark:text-white font-mono outline-none" /></div>
                 {profileSuccessMsg && <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold rounded-xl">✓ Profile Synced with Earth Ledger</div>}
                 <button type="submit" className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold p-3.5 rounded-xl shadow-md transition active:scale-95 mt-4">Save Configuration</button>
              </form>
           </div>
        )}

      </main>
    </div>
  );
}
