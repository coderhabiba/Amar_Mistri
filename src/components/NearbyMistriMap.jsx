'use client';
import { useEffect, useRef } from 'react';

// Leaflet must be dynamically imported (ssr: false) — this component is only used via dynamic import
const NearbyMistriMap = ({ mechanics, userLat, userLng, onSelectMistri }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!mapRef.current) return;

      // Destroy existing map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const centerLat = userLat || 23.8103;
      const centerLng = userLng || 90.4125;

      const map = L.map(mapRef.current, {
        center: [centerLat, centerLng],
        zoom: 12,
        zoomControl: true,
      });

      mapInstanceRef.current = map;

      // Dark tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 19,
      }).addTo(map);

      // User marker
      if (userLat && userLng) {
        const userIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:18px; height:18px; background:#3b82f6;
            border:3px solid #fff; border-radius:50%;
            box-shadow: 0 0 0 4px rgba(59,130,246,0.3);
          "></div>`,
          iconSize: [18, 18],
          iconAnchor: [9, 9],
        });
        L.marker([userLat, userLng], { icon: userIcon })
          .addTo(map)
          .bindPopup('<strong style="color:#fff">আপনার অবস্থান</strong>', {
            className: 'dark-popup',
          });
      }

      // Mistri markers with photo avatars
      markersRef.current = [];
      (mechanics || []).forEach((m) => {
        const coords = m.liveLocation?.coordinates;
        if (!coords || coords.length < 2) return;
        const [lng, lat] = coords;

        const photoUrl = m.faceImageUrl
          ? m.faceImageUrl
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullName || 'M')}&background=f59e0b&color=000&size=80`;

        const mistriIcon = L.divIcon({
          className: '',
          html: `<div style="
            width:48px; height:48px; border-radius:50%;
            border:3px solid #f59e0b;
            overflow:hidden;
            box-shadow: 0 4px 15px rgba(245,158,11,0.5);
            cursor:pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
            <img src="${photoUrl}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=M&background=334155&color=f59e0b&size=80'" />
          </div>`,
          iconSize: [48, 48],
          iconAnchor: [24, 24],
          popupAnchor: [0, -28],
        });

        const distanceText = m.distance < 9999 ? `${m.distance} km দূরে` : '';

        const popup = L.popup({
          maxWidth: 220,
          className: 'mistri-popup',
        }).setContent(`
          <div style="font-family:'Hind Siliguri',sans-serif; padding:8px; min-width:180px;">
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
              <img src="${photoUrl}" style="width:44px;height:44px;border-radius:10px;object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=M&background=334155&color=f59e0b'" />
              <div>
                <p style="font-weight:bold;font-size:13px;color:#f1f5f9;margin:0">${m.fullName || 'মিস্ত্রি'}</p>
                <p style="font-size:10px;color:#f59e0b;margin:0">${m.mistriId}</p>
              </div>
            </div>
            <p style="font-size:10px;color:#94a3b8;margin:2px 0">📞 ${m.phone}</p>
            <p style="font-size:10px;color:#94a3b8;margin:2px 0">💰 ৳${m.charge}/সার্ভিস</p>
            ${distanceText ? `<p style="font-size:10px;color:#10b981;margin:2px 0">📍 ${distanceText}</p>` : ''}
            <button
              onclick="window._selectMistri && window._selectMistri('${m._id}')"
              style="margin-top:8px;width:100%;padding:6px;background:#f59e0b;color:#000;border:none;border-radius:8px;font-size:11px;font-weight:bold;cursor:pointer"
            >প্রোফাইল দেখুন</button>
          </div>
        `);

        const marker = L.marker([lat, lng], { icon: mistriIcon }).addTo(map);
        marker.bindPopup(popup);
        markersRef.current.push(marker);
      });

      // Expose global callback for popup button
      window._selectMistri = (id) => {
        const m = (mechanics || []).find(m => m._id?.toString() === id);
        if (m && onSelectMistri) onSelectMistri(m);
      };
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (window._selectMistri) delete window._selectMistri;
    };
  }, [mechanics, userLat, userLng]);

  return (
    <div
      ref={mapRef}
      style={{ height: '420px', width: '100%', borderRadius: '16px', overflow: 'hidden' }}
    />
  );
};

export default NearbyMistriMap;
