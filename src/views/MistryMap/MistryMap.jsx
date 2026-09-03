import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from 'react-leaflet';
import { FiMapPin, FiUser, FiNavigation } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerShadowPng from 'leaflet/dist/images/marker-shadow.png';

// Custom User Live Location Icon
const userIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: markerShadowPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/**
 * Creates custom round avatar icons using faceImageUrl safely mapped from backend query parameters
 */
const createMistryIcon = imageUrl => {
  return L.divIcon({
    html: `
      <div class="relative w-12 h-12 rounded-full border-2 border-primary bg-slate-900 shadow-xl overflow-hidden">
        <img src="${imageUrl || 'https://via.placeholder.com/150'}" class="w-full h-full object-cover" alt="mistry-face" />
        <span class="absolute bottom-0 right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></span>
      </div>
    `,
    className: 'custom-mistry-marker',
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -45],
  });
};

const ChangeView = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
};

// Accept shared master data payload vector directly from parent node
const MistryMap = ({ mistriesData = [] }) => {
  const [searchParams] = useSearchParams();
  const specificService = searchParams.get('specificService');

  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([24.7577, 90.4024]); // Default fallback location (Mymensingh)
  const [radius, setRadius] = useState(5); // Default nearby threshold filter range in KM

  // Fetch and track physical coordinate position of the client browser
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]); // Focus initial view viewport on user
        },
        error => {
          console.error('Error getting browser location coordinates:', error);
        },
      );
    }
  }, []);

  /**
   * Calculates Haversine gap metric between two GPS target coordinates
   */
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return Infinity;
    const R = 6371; // Earth's Radius in KM
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Run dynamic filter context seamlessly over the shared component data props
  const nearbyMistries = mistriesData.filter(mistry => {
    if (!userLocation || !mistry.liveLocation?.coordinates) return true;

    // MongoDB stores coordinates in [longitude, latitude] or [latitude, longitude].
    // Double check your array indexing structure sequence
    const [mistryLng, mistryLat] = mistry.liveLocation.coordinates;

    const distance = calculateDistance(
      userLocation[0],
      userLocation[1],
      mistryLat,
      mistryLng,
    );
    return distance <= radius;
  });

  return (
    <div className="bg-slate-950 text-slate-100 mt-5 p-4 rounded-2xl border border-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Radius Range Selection Control Strip Layer */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800 gap-4">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-primary">
              <FiNavigation /> মিস্ট্রি লাইভ ট্র্যাক (
              {specificService || 'সব এক্সপার্ট'})
            </h2>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">
              আশেপাশের দূরত্ব:
            </span>
            <input
              type="range"
              min="1"
              max="30"
              value={radius}
              onChange={e => setRadius(Number(e.target.value))}
              className="accent-primary cursor-pointer"
            />
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">
              {radius} কিমি
            </span>
          </div>
        </div>

        {/* Master Map Display Layout Canvas */}
        <div className="w-full h-[450px] rounded-xl overflow-hidden border border-slate-800 relative z-0">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <ChangeView center={mapCenter} />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* User Pointer */}
            {userLocation && (
              <>
                <Marker position={userLocation} icon={userIcon}>
                  <Popup>
                    <span className="font-bold text-slate-900">
                      আপনার বর্তমান অবস্থান
                    </span>
                  </Popup>
                </Marker>
                <Circle
                  center={userLocation}
                  radius={radius * 1000} // KM converted to meters
                  pathOptions={{
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.08,
                  }}
                />
              </>
            )}

            {/* Nearby Mistries Pin Iteration Loop */}
            {nearbyMistries.map(mistry => {
              if (!mistry.liveLocation?.coordinates) return null;

              // Reading coords structure matching MongoDB point standards
              const [mistryLng, mistryLat] = mistry.liveLocation.coordinates;

              return (
                <Marker
                  key={mistry._id}
                  position={[mistryLat, mistryLng]}
                  icon={createMistryIcon(mistry.faceImageUrl)} // FIXED: Reading exact matching response image field
                >
                  <Popup>
                    <div className="text-slate-900 p-1 min-w-[150px]">
                      <h4 className="font-bold text-sm border-b pb-1 mb-1 flex items-center gap-1">
                        <FiUser /> {mistry.fullName}
                      </h4>
                      <p className="text-xs text-slate-600 font-semibold">
                        {mistry.specificService}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <FiMapPin /> {mistry.address}
                      </p>
                      <p className="text-xs font-bold text-primary mt-1">
                        ভিজিট: ${mistry.charge}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MistryMap;
