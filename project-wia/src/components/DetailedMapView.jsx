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
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: rgba(244, 63, 94, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <!-- Pin Circle -->
          <div style="position: relative; width: 36px; height: 36px; border-radius: 9999px; background: #F43F5E; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 12px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; font-size: 17px;">
            🏠
          </div>
          <!-- Label Floating -->
          <div style="position: absolute; top: 40px; white-space: nowrap; background: #18181B; color: #E2E8F0; font-size: 10px; font-weight: 800; padding: 2px 7px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 2px 6px rgba(0,0,0,0.5); pointer-events: none;">
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

      const badgeBg = isBest ? '#10B981' : isSelected ? '#F97316' : '#18181B';
      const badgeBorder = isBest ? '#34D399' : isSelected ? '#FDBA74' : '#E2E8F0';
      const labelColor = isBest ? '#34D399' : '#E2E8F0';

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
              box-shadow: 0 4px 10px rgba(0,0,0,0.45); 
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
              background: #18181B; 
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
          <div style="font-family: inherit; font-size: 12px; padding: 4px; min-width: 190px; color: #E2E8F0;">
            <div style="font-weight: 800; font-size: 13px; color: #F97316; margin-bottom: 2px;">
              ${school.nama_sekolah}
            </div>
            <div style="color: #94A3B8; font-size: 11px; margin-bottom: 6px;">
              ${school.alamat || 'DKI Jakarta'}
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span style="font-weight: 600; color: #CBD5E1;">Jarak dari Rumah:</span>
              <strong style="color: #FFFFFF;">${formatDistance(item.distanceMeters)}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-weight: 600; color: #CBD5E1;">Peluang Zonasi:</span>
              <strong style="color: ${item.probability >= 70 ? '#34D399' : item.probability >= 40 ? '#FBBF24' : '#FB7185'};">
                ${item.probability}% (${item.statusLabel})
              </strong>
            </div>
            <div style="font-size: 10px; color: #CBD5E1; background: #222227; border: 1px solid rgba(255,255,255,0.1); padding: 4px 6px; border-radius: 4px;">
              Kuota Zonasi: <strong style="color:#FFFFFF;">${item.quotaZonasi} kursi</strong> • Radius Maks: <strong style="color:#F97316;">${(school.radius_max / 1000).toFixed(1)} km</strong>
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
          color: isBest ? '#10B981' : isSelected ? '#F97316' : '#64748B',
          weight: isBest || isSelected ? 2 : 1,
          dashArray: isBest ? null : '4, 4',
          fillColor: isBest ? '#10B981' : isSelected ? '#F97316' : '#94A3B8',
          fillOpacity: isBest ? 0.08 : isSelected ? 0.08 : 0.02
        }).addTo(map);

        schoolCirclesRef.current[school.id] = circle;
      } else {
        schoolCirclesRef.current[school.id].setStyle({
          color: isBest ? '#10B981' : isSelected ? '#F97316' : '#64748B',
          weight: isBest || isSelected ? 2 : 1,
          dashArray: isBest ? null : '4, 4',
          fillColor: isBest ? '#10B981' : isSelected ? '#F97316' : '#94A3B8',
          fillOpacity: isBest ? 0.08 : isSelected ? 0.08 : 0.02
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
        color: targetSchoolItem.school.id === bestSchool?.school.id ? '#10B981' : '#F97316',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '6, 6'
      }).addTo(map);
      polylineRef.current = line;
    } else {
      polylineRef.current.setLatLngs(latlngs);
      polylineRef.current.setStyle({
        color: targetSchoolItem.school.id === bestSchool?.school.id ? '#10B981' : '#F97316',
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
    <div className="relative isolate z-0 w-full h-[470px] sm:h-[500px] rounded-2xl overflow-hidden shadow-inner border border-white/10 bg-[#18181B]">
      {/* Container DOM tempat Leaflet me-render peta */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Toolbar Atas: Tipe Peta & Navigasi Cepat */}
      <div className="absolute top-3 inset-x-3 z-[400] flex items-center justify-between pointer-events-none gap-2">
        {/* Layer Switcher */}
        <div className="pointer-events-auto flex items-center gap-1 bg-[#18181B]/95 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-lg">
          {Object.entries(TILE_LAYERS).map(([key, config]) => {
            const isActive = activeTileType === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTileType(key)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition ${
                  isActive
                    ? 'bg-[#F97316] text-white shadow'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
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
            className="px-2.5 py-1 bg-[#18181B]/95 hover:bg-[#222227] text-[#F43F5E] hover:text-rose-300 backdrop-blur-md rounded-xl border border-white/15 shadow-lg text-[11px] font-bold flex items-center gap-1 transition"
            title="Pusatkan ke Rumah Siswa"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rumah</span>
          </button>

          <button
            onClick={handleFitAll}
            className="px-2.5 py-1 bg-[#18181B]/95 hover:bg-[#222227] text-[#F97316] hover:text-orange-300 backdrop-blur-md rounded-xl border border-white/15 shadow-lg text-[11px] font-bold flex items-center gap-1 transition"
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
          className="w-7 h-7 bg-[#18181B]/95 hover:bg-[#222227] text-[#E2E8F0] backdrop-blur-md rounded-lg border border-white/15 shadow-lg flex items-center justify-center transition"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 bg-[#18181B]/95 hover:bg-[#222227] text-[#E2E8F0] backdrop-blur-md rounded-lg border border-white/15 shadow-lg flex items-center justify-center transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Petunjuk Interaksi di Kiri Bawah */}
      <div className="absolute bottom-3 left-3 z-[400] pointer-events-none">
        <div className="bg-[#18181B]/95 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 shadow-lg text-[10px] text-[#E2E8F0] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F43F5E] animate-pulse"></span>
          <span>Klik peta atau geser pin 🏠</span>
        </div>
      </div>
    </div>
  );
}
