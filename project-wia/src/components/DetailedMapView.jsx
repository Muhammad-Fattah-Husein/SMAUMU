import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Crosshair, School, Navigation, Sparkles, MapPin, ZoomIn, ZoomOut } from 'lucide-react';
import { formatDistance } from '@/utils/formatters';

// Konfigurasi Lapisan Peta Detail (Google Maps & Voyager)
const TILE_LAYERS = {
  'google-road': {
    name: 'Google Jalan',
    icon: '🗺️',
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    options: {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    }
  },
  'google-hybrid': {
    name: 'Google Satelit',
    icon: '🛰️',
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    options: {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    }
  },
  'carto-voyager': {
    name: 'Voyager Detail',
    icon: '🧭',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    options: {
      maxZoom: 20,
      subdomains: 'abcd',
      attribution: '&copy; CARTO'
    }
  }
};

export default function DetailedMapView({
  studentHouse,
  onStudentHouseChange,
  schools,
  selectedSchoolId,
  onSelectSchool,
  bestSchool
}) {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const tileLayerRef = useRef(null);
  const studentMarkerRef = useRef(null);
  const schoolMarkersRef = useRef({});
  const schoolCirclesRef = useRef({});
  const polylineRef = useRef(null);
  const [activeTileType, setActiveTileType] = useState('google-road');

  // 1. Inisialisasi Peta Leaflet (Hanya di Client Browser)
  useEffect(() => {
    if (!mapContainerRef.current || map) return;

    const initialCenter = [studentHouse.lat || -6.188, studentHouse.lng || 106.845];

    const mapInstance = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      minZoom: 10,
      maxZoom: 19,
      zoomControl: false
    });

    // Pasang Tile Layer awal (Google Maps Roads)
    const initialConfig = TILE_LAYERS['google-road'];
    const tileLayer = L.tileLayer(initialConfig.url, initialConfig.options).addTo(mapInstance);
    tileLayerRef.current = tileLayer;

    // Handler klik di mana saja pada peta untuk pindahkan rumah siswa
    mapInstance.on('click', (e) => {
      const { lat, lng } = e.latlng;
      const formattedLat = Number(lat.toFixed(6));
      const formattedLng = Number(lng.toFixed(6));
      onStudentHouseChange({
        lat: formattedLat,
        lng: formattedLng,
        label: `Titik Peta (${formattedLat}, ${formattedLng})`
      });
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
      setMap(null);
    };
  }, []);

  // 2. Ganti Tipe Peta saat dipilih (Google Jalan, Google Satelit, Voyager)
  useEffect(() => {
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const layerConfig = TILE_LAYERS[activeTileType] || TILE_LAYERS['google-road'];
    const newTileLayer = L.tileLayer(layerConfig.url, layerConfig.options).addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [map, activeTileType]);

  // 3. Render / Update Marker Rumah Siswa
  useEffect(() => {
    if (!map) return;

    const houseIcon = L.divIcon({
      className: 'student-marker-wrapper',
      html: `
        <div style="position: relative; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; cursor: grab;">
          <!-- Radar Pulse -->
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(236, 72, 153, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <!-- Pin Circle -->
          <div style="position: relative; width: 36px; height: 36px; border-radius: 9999px; background: #EC4899; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 17px;">
            🏠
          </div>
          <!-- Label Floating -->
          <div style="position: absolute; top: 40px; white-space: nowrap; background: #0F172A; color: #FFFFFF; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.3); box-shadow: 0 2px 6px rgba(0,0,0,0.5); pointer-events: none;">
            Rumah Siswa
          </div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24]
    });

    if (!studentMarkerRef.current) {
      const marker = L.marker([studentHouse.lat, studentHouse.lng], {
        icon: houseIcon,
        draggable: true,
        zIndexOffset: 1000
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        const lat = Number(pos.lat.toFixed(6));
        const lng = Number(pos.lng.toFixed(6));
        onStudentHouseChange({
          lat,
          lng,
          label: `Titik Peta (${lat}, ${lng})`
        });
      });

      studentMarkerRef.current = marker;
    } else {
      studentMarkerRef.current.setLatLng([studentHouse.lat, studentHouse.lng]);
      map.panTo([studentHouse.lat, studentHouse.lng], { animate: true, duration: 0.6 });
    }
  }, [map, studentHouse.lat, studentHouse.lng]);

  // 4. Render / Update Seluruh 6 SMAN Markers & Radius Circles
  useEffect(() => {
    if (!map || !schools || schools.length === 0) return;

    schools.forEach((item) => {
      const school = item.school;
      const isBest = bestSchool && bestSchool.school.id === school.id;
      const isSelected = selectedSchoolId === school.id;

      const badgeBg = isBest ? '#10B981' : isSelected ? '#2563EB' : '#1E293B';
      const badgeBorder = isBest ? '#34D399' : isSelected ? '#60A5FA' : '#FFFFFF';
      const labelColor = isBest ? '#34D399' : '#FFFFFF';

      const schoolIcon = L.divIcon({
        className: `school-marker-${school.id}`,
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
            <!-- Badge Icon SMAN -->
            <div style="
              width: 34px; 
              height: 34px; 
              border-radius: 9999px; 
              background: ${badgeBg}; 
              border: 2px solid ${badgeBorder}; 
              box-shadow: 0 4px 10px rgba(0,0,0,0.4); 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: 900; 
              font-size: 11px;
            ">
              ${school.id}
            </div>
            <!-- Nama SMAN -->
            <div style="
              margin-top: 3px;
              white-space: nowrap; 
              background: #0F172A; 
              color: ${labelColor}; 
              font-size: 10px; 
              font-weight: 800; 
              padding: 2px 6px; 
              border-radius: 6px; 
              border: 1px solid ${isBest ? '#10B981' : 'rgba(255,255,255,0.2)'}; 
              box-shadow: 0 2px 6px rgba(0,0,0,0.5);
            ">
              SMAN ${school.nama_sekolah.match(/SMAN\s+(\d+)/)?.[1] || school.id}
            </div>
          </div>
        `,
        iconSize: [44, 54],
        iconAnchor: [22, 17]
      });

      // Marker
      if (!schoolMarkersRef.current[school.id]) {
        const marker = L.marker([school.lat, school.lng], { icon: schoolIcon }).addTo(map);
        marker.on('click', () => onSelectSchool(school.id));

        marker.bindPopup(`
          <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 190px;">
            <div style="font-weight: 800; font-size: 13px; color: #1E3A8A; margin-bottom: 2px;">
              ${school.nama_sekolah}
            </div>
            <div style="color: #64748B; font-size: 11px; margin-bottom: 6px;">
              ${school.alamat || 'DKI Jakarta'}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="font-weight: 600;">Jarak dari Rumah:</span>
              <strong style="color: #0F172A;">${formatDistance(item.distanceMeters)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 600;">Peluang Zonasi:</span>
              <strong style="color: ${item.probability >= 70 ? '#10B981' : item.probability >= 40 ? '#D97706' : '#EF4444'};">
                ${item.probability}% (${item.statusLabel})
              </strong>
            </div>
            <div style="font-size: 10px; color: #475569; background: #F1F5F9; padding: 4px 6px; border-radius: 4px;">
              Kuota Zonasi: <strong>${item.quotaZonasi} kursi</strong> • Radius Maks: <strong>${(school.radius_max / 1000).toFixed(1)} km</strong>
            </div>
          </div>
        `);

        schoolMarkersRef.current[school.id] = marker;
      } else {
        schoolMarkersRef.current[school.id].setIcon(schoolIcon);
      }

      // Zonasi Radius Circle
      const circleRadius = school.radius_max || 3500;
      if (!schoolCirclesRef.current[school.id]) {
        const circle = L.circle([school.lat, school.lng], {
          radius: circleRadius,
          color: isBest ? '#10B981' : isSelected ? '#38BDF8' : '#64748B',
          weight: isBest || isSelected ? 2 : 1,
          dashArray: isBest ? null : '4, 4',
          fillColor: isBest ? '#10B981' : isSelected ? '#38BDF8' : '#94A3B8',
          fillOpacity: isBest ? 0.08 : isSelected ? 0.06 : 0.02
        }).addTo(map);

        schoolCirclesRef.current[school.id] = circle;
      } else {
        schoolCirclesRef.current[school.id].setStyle({
          color: isBest ? '#10B981' : isSelected ? '#38BDF8' : '#64748B',
          weight: isBest || isSelected ? 2 : 1,
          dashArray: isBest ? null : '4, 4',
          fillColor: isBest ? '#10B981' : isSelected ? '#38BDF8' : '#94A3B8',
          fillOpacity: isBest ? 0.08 : isSelected ? 0.06 : 0.02
        });
      }
    });
  }, [map, schools, selectedSchoolId, bestSchool]);

  // 5. Render Polyline Penghubung ke Sekolah Terdekat / Terpilih
  useEffect(() => {
    if (!map || !schools || schools.length === 0) return;

    const targetSchoolItem = selectedSchoolId
      ? schools.find((s) => s.school.id === selectedSchoolId)
      : bestSchool;

    if (!targetSchoolItem) return;

    const latlngs = [
      [studentHouse.lat, studentHouse.lng],
      [targetSchoolItem.school.lat, targetSchoolItem.school.lng]
    ];

    if (!polylineRef.current) {
      const line = L.polyline(latlngs, {
        color: targetSchoolItem.school.id === bestSchool?.school.id ? '#10B981' : '#2563EB',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 6'
      }).addTo(map);
      polylineRef.current = line;
    } else {
      polylineRef.current.setLatLngs(latlngs);
      polylineRef.current.setStyle({
        color: targetSchoolItem.school.id === bestSchool?.school.id ? '#10B981' : '#2563EB',
        dashArray: '6, 6'
      });
    }
  }, [map, studentHouse.lat, studentHouse.lng, selectedSchoolId, bestSchool]);

  // Handler Kontrol Navigasi
  const handleZoomIn = () => map && map.zoomIn();
  const handleZoomOut = () => map && map.zoomOut();

  const handleCenterHouse = () => {
    if (!map) return;
    map.flyTo([studentHouse.lat, studentHouse.lng], 14, { duration: 0.8 });
  };

  const handleFitAll = () => {
    if (!map || !schools || schools.length === 0) return;
    const points = [[studentHouse.lat, studentHouse.lng], ...schools.map((s) => [s.school.lat, s.school.lng])];
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
  };

  return (
    <div className="relative w-full h-[470px] sm:h-[500px] rounded-2xl overflow-hidden shadow-inner border border-slate-700 bg-slate-900">
      {/* Container DOM tempat Leaflet me-render peta */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Toolbar Atas: Tipe Peta & Navigasi Cepat */}
      <div className="absolute top-3 inset-x-3 z-[400] flex items-center justify-between pointer-events-none gap-2">
        {/* Layer Switcher */}
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
          {Object.entries(TILE_LAYERS).map(([key, config]) => {
            const isActive = activeTileType === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTileType(key)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
                title={`Ganti ke ${config.name}`}
              >
                <span>{config.icon}</span>
                <span className="hidden sm:inline">{config.name}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons: Fokus Rumah & Lihat Semua */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={handleCenterHouse}
            className="px-2.5 py-1 bg-slate-950/85 hover:bg-slate-800 text-pink-400 hover:text-pink-300 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg text-[11px] font-bold flex items-center gap-1 transition"
            title="Pusatkan ke Rumah Siswa"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rumah</span>
          </button>

          <button
            onClick={handleFitAll}
            className="px-2.5 py-1 bg-slate-950/85 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg text-[11px] font-bold flex items-center gap-1 transition"
            title="Lihat seluruh sekolah dan rumah"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Semua</span>
          </button>
        </div>
      </div>

      {/* Zoom Controls di Kanan Bawah */}
      <div className="absolute bottom-3 right-3 z-[400] flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 bg-slate-950/85 hover:bg-slate-800 text-white backdrop-blur-md rounded-lg border border-slate-700/80 shadow-lg flex items-center justify-center transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 bg-slate-950/85 hover:bg-slate-800 text-white backdrop-blur-md rounded-lg border border-slate-700/80 shadow-lg flex items-center justify-center transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Petunjuk Interaksi di Kiri Bawah */}
      <div className="absolute bottom-3 left-3 z-[400] pointer-events-none">
        <div className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-700/80 shadow-lg text-[10px] text-slate-300 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
          <span>Klik peta atau geser pin 🏠</span>
        </div>
      </div>
    </div>
  );
}
