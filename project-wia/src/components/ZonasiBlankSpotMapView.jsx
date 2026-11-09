import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  School, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Info,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_SEKOLAH, INITIAL_BLANK_SPOTS } from '@/utils/constants';
import { formatDistance } from '@/utils/formatters';

// Konfigurasi Lapisan Peta
const TILE_LAYERS = {
  'google-road': {
    name: 'Peta Jalan',
    icon: '🗺️',
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    options: {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    }
  },
  'google-hybrid': {
    name: 'Satelit',
    icon: '🛰️',
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    options: {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    }
  },
  'carto-voyager': {
    name: 'Voyager',
    icon: '🧭',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    options: {
      maxZoom: 20,
      subdomains: 'abcd',
      attribution: '&copy; CARTO'
    }
  }
};

const JAKARTA_CENTER = [-6.220000, 106.835000];
const JAKARTA_BOUNDS = [
  [-6.370000, 106.670000], // Barat Daya (Kalideres - Cilandak)
  [-6.080000, 106.980000]  // Timur Laut (Koja - Cilincing)
];

export default function ZonasiBlankSpotMapView() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);
  
  // Layer groups to manage toggling visibility
  const schoolLayerGroupRef = useRef(null);
  const blankSpotLayerGroupRef = useRef(null);
  const markersRef = useRef({});

  const [activeTile, setActiveTile] = useState('google-road');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'zonasi', 'blankspot'
  const [activeItem, setActiveItem] = useState(null); // Selected item for detail overlay or flyTo

  // 1. Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: JAKARTA_CENTER,
      zoom: 11.5,
      minZoom: 10,
      maxZoom: 19,
      zoomControl: false,
      maxBounds: [
        [-6.45, 106.55],
        [-6.00, 107.10]
      ],
      maxBoundsViscosity: 0.8
    });

    // Pasang Tile Layer Default
    const defaultTile = TILE_LAYERS['google-road'];
    tileLayerRef.current = L.tileLayer(defaultTile.url, defaultTile.options).addTo(map);

    // Inisialisasi Layer Groups
    schoolLayerGroupRef.current = L.layerGroup().addTo(map);
    blankSpotLayerGroupRef.current = L.layerGroup().addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2. Ganti Tipe Peta saat dipilih
  useEffect(() => {
    if (!mapRef.current || !tileLayerRef.current) return;
    mapRef.current.removeLayer(tileLayerRef.current);
    const tileConfig = TILE_LAYERS[activeTile];
    tileLayerRef.current = L.tileLayer(tileConfig.url, tileConfig.options).addTo(mapRef.current);
  }, [activeTile]);

  // 3. Render Marker & Lingkaran Radius Sekolah dan Blank-Spot
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !schoolLayerGroupRef.current || !blankSpotLayerGroupRef.current) return;

    schoolLayerGroupRef.current.clearLayers();
    blankSpotLayerGroupRef.current.clearLayers();
    markersRef.current = {};

    // ==========================================
    // A. SEBARAN SEKOLAH & RADIUS ZONASI (SMAN)
    // ==========================================
    INITIAL_SEKOLAH.forEach((sch) => {
      // 1. Lingkaran Radius Zonasi SMAN
      const circle = L.circle([sch.lat, sch.lng], {
        radius: sch.radius_max,
        color: '#2563EB',
        fillColor: '#3B82F6',
        fillOpacity: 0.12,
        weight: 1.5,
        dashArray: '5, 5'
      });
      circle.addTo(schoolLayerGroupRef.current);

      // 2. Custom Marker SMAN (Navy Pin dengan Badge)
      const schoolIcon = L.divIcon({
        className: 'custom-school-marker',
        html: `
          <div style="position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;">
            <div style="background:#1E3A8A; color:white; padding:4px 8px; border-radius:12px; font-weight:800; font-size:10px; box-shadow:0 4px 10px rgba(0,0,0,0.3); border:2px solid #60A5FA; display:flex; align-items:center; gap:4px; white-space:nowrap;">
              <span>🏛️</span>
              <span>${sch.nama_sekolah.split(' ')[0]} ${sch.nama_sekolah.split(' ')[1]}</span>
            </div>
            <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #1E3A8A; margin-top:-1px;"></div>
          </div>
        `,
        iconSize: [110, 36],
        iconAnchor: [55, 36]
      });

      const marker = L.marker([sch.lat, sch.lng], { icon: schoolIcon });

      const popupContent = `
        <div style="font-family: inherit; min-width: 240px; padding: 2px;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom: 6px;">
            <span style="font-size:10px; font-weight:800; color:#1E3A8A; background:#DBEAFE; padding: 2px 8px; border-radius: 9999px;">NPSN ${sch.npsn}</span>
            <span style="font-size:10px; font-weight:800; color:#065F46; background:#D1FAE5; padding: 2px 8px; border-radius: 9999px;">Akreditasi ${sch.akreditasi.split(' ')[0]}</span>
          </div>
          <h4 style="font-size:14px; font-weight:800; color:#0F172A; margin: 0 0 2px 0;">${sch.nama_sekolah}</h4>
          <p style="font-size:11px; color:#64748B; margin: 0 0 10px 0;">${sch.alamat}, ${sch.kecamatan}</p>
          
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius: 10px; padding: 8px 10px; font-size:11.5px;">
            <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
              <span style="color:#64748B;">Radius Zonasi:</span>
              <strong style="color:#2563EB;">${(sch.radius_max / 1000).toFixed(1)} km</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
              <span style="color:#64748B;">Total Kursi:</span>
              <strong style="color:#0F172A;">${sch.kuota_total} Kursi</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
              <span style="color:#64748B;">Jalur Zonasi:</span>
              <strong style="color:#059669;">50% Kuota Sah</strong>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { offset: [0, -28] });
      marker.addTo(schoolLayerGroupRef.current);
      markersRef.current[`school-${sch.id}`] = { marker, lat: sch.lat, lng: sch.lng };
    });

    // ==========================================
    // B. WILAYAH BLANK-SPOT / KURANG SMA
    // ==========================================
    INITIAL_BLANK_SPOTS.forEach((bs) => {
      // 1. Lingkaran Shading Zona Defisit (Merah Pulsing / Peringatan)
      const circle = L.circle([bs.lat, bs.lng], {
        radius: bs.radius_impact || 2600,
        color: '#DC2626',
        fillColor: '#EF4444',
        fillOpacity: 0.20,
        weight: 2,
        dashArray: '6, 6'
      });
      circle.addTo(blankSpotLayerGroupRef.current);

      // 2. Custom Marker Blank Spot (Red Alert Badge)
      const blankSpotIcon = L.divIcon({
        className: 'custom-blankspot-marker',
        html: `
          <div style="position:relative; display:flex; flex-direction:column; align-items:center; cursor:pointer;">
            <div style="background:#DC2626; color:white; padding:4px 9px; border-radius:12px; font-weight:800; font-size:10.5px; box-shadow:0 4px 12px rgba(220,38,38,0.4); border:2px solid #FCA5A5; display:flex; align-items:center; gap:4px; white-space:nowrap;">
              <span style="font-size:12px;">⚠️</span>
              <span>Blank-Spot ${bs.kecamatan.split(' ')[0]}</span>
            </div>
            <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:7px solid #DC2626; margin-top:-1px;"></div>
          </div>
        `,
        iconSize: [130, 38],
        iconAnchor: [65, 38]
      });

      const marker = L.marker([bs.lat, bs.lng], { icon: blankSpotIcon });

      const popupContent = `
        <div style="font-family: inherit; min-width: 260px; padding: 2px;">
          <div style="display:flex; align-items:center; gap: 6px; margin-bottom: 6px;">
            <span style="font-size:10px; font-weight:800; color:#991B1B; background:#FEE2E2; padding: 2px 8px; border-radius: 9999px;">⚠️ BLANK-SPOT ZONASI</span>
            <span style="font-size:10px; font-weight:800; color:#B91C1C; background:#FEE2E2; padding: 2px 8px; border-radius: 9999px;">Defisit ${bs.defisit_kursi} Kursi</span>
          </div>
          <h4 style="font-size:14px; font-weight:800; color:#0F172A; margin: 0 0 2px 0;">${bs.kecamatan}</h4>
          <p style="font-size:11px; color:#64748B; margin: 0 0 10px 0;">Kelurahan ${bs.kelurahan}</p>

          <div style="background:#FEF2F2; border:1px solid #FECACA; border-radius: 10px; padding: 8px 10px; font-size:11.5px; margin-bottom: 8px;">
            <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
              <span style="color:#991B1B;">Lulusan SMP:</span>
              <strong style="color:#7F1D1D;">${bs.lulusan_smp} Anak</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom: 4px;">
              <span style="color:#991B1B;">Sedia Kursi SMAN:</span>
              <strong style="color:#7F1D1D;">${bs.kuota_sman_tersedia} Kursi</strong>
            </div>
            <div style="display:flex; justify-content:space-between; border-top:1px dashed #FCA5A5; padding-top:4px; margin-top:4px;">
              <span style="color:#991B1B; font-weight:bold;">Defisit / Kurang:</span>
              <strong style="color:#DC2626; font-size:12px;">-${bs.defisit_kursi} Kursi</strong>
            </div>
          </div>

          <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:8px 10px; border-radius:8px; font-size:11px; line-height:1.45;">
            <strong style="color:#0F172A; display:block; margin-bottom:2px;">Rekomendasi Dinas Pendidikan:</strong>
            <span style="color:#475569;">${bs.rekomendasi}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { offset: [0, -30] });
      marker.addTo(blankSpotLayerGroupRef.current);
      markersRef.current[`blankspot-${bs.id}`] = { marker, lat: bs.lat, lng: bs.lng };
    });

  }, []);

  // 4. Filter Layer Visibilitas (Semua / Zonasi SMAN / Blank-Spot)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !schoolLayerGroupRef.current || !blankSpotLayerGroupRef.current) return;

    if (activeFilter === 'all') {
      if (!map.hasLayer(schoolLayerGroupRef.current)) map.addLayer(schoolLayerGroupRef.current);
      if (!map.hasLayer(blankSpotLayerGroupRef.current)) map.addLayer(blankSpotLayerGroupRef.current);
    } else if (activeFilter === 'zonasi') {
      if (!map.hasLayer(schoolLayerGroupRef.current)) map.addLayer(schoolLayerGroupRef.current);
      if (map.hasLayer(blankSpotLayerGroupRef.current)) map.removeLayer(blankSpotLayerGroupRef.current);
    } else if (activeFilter === 'blankspot') {
      if (map.hasLayer(schoolLayerGroupRef.current)) map.removeLayer(schoolLayerGroupRef.current);
      if (!map.hasLayer(blankSpotLayerGroupRef.current)) map.addLayer(blankSpotLayerGroupRef.current);
    }
  }, [activeFilter]);

  // Handler Zoom Controls
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetJakarta = () => {
    mapRef.current?.flyTo(JAKARTA_CENTER, 11.5, { duration: 1.2 });
  };

  // Handler Klik Quick-Focus Titik
  const handleFocusPoint = (key) => {
    const item = markersRef.current[key];
    if (item && mapRef.current) {
      mapRef.current.flyTo([item.lat, item.lng], 13.5, { duration: 1 });
      setTimeout(() => {
        item.marker.openPopup();
      }, 1000);
    }
  };

  return (
    <div className="relative w-full h-[520px] sm:h-[600px] rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-slate-900">
      {/* Container Leaflet DOM */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* ============================================================== */}
      {/* OVERLAY HEADER: KONTROL FILTER & TIPE PETA */}
      {/* ============================================================== */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Status Badge & Filter Lapisan */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-2xl shadow-xl pointer-events-auto">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Semua Lapisan
          </button>
          <button
            onClick={() => setActiveFilter('zonasi')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeFilter === 'zonasi'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            Radius Zonasi SMAN
          </button>
          <button
            onClick={() => setActiveFilter('blankspot')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              activeFilter === 'blankspot'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            Blank-Spot Defisit
          </button>
        </div>

        {/* Tipe Basemap (Jalan / Satelit / Voyager) */}
        <div className="flex items-center gap-1 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-2xl shadow-xl pointer-events-auto">
          {Object.entries(TILE_LAYERS).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setActiveTile(key)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                activeTile === key
                  ? 'bg-white text-slate-900 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>{config.icon}</span>
              <span className="hidden sm:inline">{config.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* OVERLAY KIRI BAWAH: QUICK FOCUS PILLS */}
      {/* ============================================================== */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-20 pointer-events-auto max-w-[calc(100%-120px)] sm:max-w-md">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 sm:p-2.5 rounded-2xl shadow-2xl space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
            <span className="flex items-center gap-1">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              Fokus Titik Cepat di Peta:
            </span>
            <span className="text-[10px] text-slate-400">Klik untuk Sorot</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {/* Blank-spots */}
            {INITIAL_BLANK_SPOTS.map((bs) => (
              <button
                key={bs.id}
                onClick={() => handleFocusPoint(`blankspot-${bs.id}`)}
                className="px-2.5 py-1 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/70 text-[10.5px] font-bold whitespace-nowrap transition flex items-center gap-1 shrink-0"
              >
                <span>⚠️</span>
                <span>{bs.kecamatan.split(' ')[0]}</span>
              </button>
            ))}

            {/* SMAN */}
            {INITIAL_SEKOLAH.slice(0, 4).map((sch) => (
              <button
                key={sch.id}
                onClick={() => handleFocusPoint(`school-${sch.id}`)}
                className="px-2.5 py-1 rounded-xl bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-700/70 text-[10.5px] font-bold whitespace-nowrap transition flex items-center gap-1 shrink-0"
              >
                <span>🏛️</span>
                <span>{sch.nama_sekolah.split(' ')[0]} {sch.nama_sekolah.split(' ')[1]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* OVERLAY KANAN BAWAH: LEGENDA & ZOOM CONTROLS */}
      {/* ============================================================== */}
      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Kontrol Navigasi Peta */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-xl p-1 flex flex-col gap-1">
          <button
            onClick={handleZoomIn}
            title="Perbesar Peta"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Perkecil Peta"
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetJakarta}
            title="Pusatkan ke Seluruh DKI Jakarta"
            className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>

        {/* Legenda Ringkas */}
        <div className="hidden sm:block bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2.5 rounded-2xl shadow-xl text-[10.5px] space-y-1 text-slate-300">
          <div className="font-extrabold text-white text-[11px] mb-1">Legenda Peta:</div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-blue-400 bg-blue-500/30"></span>
            <span>Radius Zonasi SMAN (3,2 - 3,8 km)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-rose-400 bg-rose-500/40 animate-pulse"></span>
            <span>Zona Blank-Spot (Defisit Kursi)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[12px]">🏛️</span>
            <span>Lokasi Fisik SMAN Negeri</span>
          </div>
        </div>
      </div>
    </div>
  );
}
