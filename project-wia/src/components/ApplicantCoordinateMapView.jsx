import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  School, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Layers,
  Zap
} from 'lucide-react';
import { 
  calculateHaversineDistance, 
  isInsideDkiJakarta, 
  findClosestDukcapilCentroid, 
  OFFICIAL_DUKCAPIL_CENTROIDS 
} from '@/services/geoService';
import { formatDistance } from '@/utils/formatters';

// Konfigurasi Lapisan Peta
const MAP_TILES = {
  'google-road': {
    name: 'Peta Jalan',
    icon: '🗺️',
    url: 'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
  },
  'google-hybrid': {
    name: 'Satelit',
    icon: '🛰️',
    url: 'https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
  },
  'carto-voyager': {
    name: 'Voyager',
    icon: '🧭',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    attribution: '&copy; CARTO'
  }
};

export default function ApplicantCoordinateMapView({
  lat,
  lng,
  school,
  onCoordinateChange,
  isAutoSnapped = true,
  selectedCentroidId = 'sawah_besar'
}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Layer & Element Refs
  const homeMarkerRef = useRef(null);
  const schoolMarkerRef = useRef(null);
  const schoolRadiusCircleRef = useRef(null);
  const distancePolylineRef = useRef(null);
  const centroidsLayerGroupRef = useRef(null);

  const [activeTile, setActiveTile] = useState('google-road');
  const [showCentroids, setShowCentroids] = useState(true);

  const applicantLat = parseFloat(lat) || -6.162500;
  const applicantLng = parseFloat(lng) || 106.833500;
  const schoolLat = school ? parseFloat(school.lat) : -6.166881;
  const schoolLng = school ? parseFloat(school.lng) : 106.837319;
  const schoolRadius = school ? (school.radius_max || 3200) : 3200;

  const currentDistance = calculateHaversineDistance(
    applicantLat,
    applicantLng,
    schoolLat,
    schoolLng
  );
  const isWithinRadius = currentDistance <= schoolRadius;

  // 1. Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialCenter = [
      (applicantLat + schoolLat) / 2,
      (applicantLng + schoolLng) / 2
    ];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 14,
      minZoom: 11,
      maxZoom: 19,
      zoomControl: false,
      maxBounds: [
        [-6.45, 106.60],
        [-6.00, 107.05]
      ],
      maxBoundsViscosity: 0.8
    });

    const tileConf = MAP_TILES['google-road'];
    tileLayerRef.current = L.tileLayer(tileConf.url, {
      maxZoom: 20,
      subdomains: tileConf.subdomains,
      attribution: tileConf.attribution
    }).addTo(map);

    centroidsLayerGroupRef.current = L.layerGroup().addTo(map);

    // Event Klik pada Peta untuk Memilih Titik Rumah
    map.on('click', (e) => {
      const clickLat = parseFloat(e.latlng.lat.toFixed(6));
      const clickLng = parseFloat(e.latlng.lng.toFixed(6));

      if (!isInsideDkiJakarta(clickLat, clickLng)) {
        alert('Titik yang dipilih berada di luar wilayah administratif DKI Jakarta. Pilih titik di dalam batas wilayah.');
        return;
      }

      const closestCentroid = findClosestDukcapilCentroid(clickLat, clickLng);
      if (onCoordinateChange) {
        onCoordinateChange(clickLat, clickLng, closestCentroid);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2. Ganti Lapisan Peta (Basemap)
  const handleTileChange = (tileKey) => {
    if (!mapRef.current || !tileLayerRef.current) return;
    mapRef.current.removeLayer(tileLayerRef.current);
    const tileConf = MAP_TILES[tileKey];
    tileLayerRef.current = L.tileLayer(tileConf.url, {
      maxZoom: 20,
      subdomains: tileConf.subdomains,
      attribution: tileConf.attribution
    }).addTo(mapRef.current);
    setActiveTile(tileKey);
  };

  // 3. Render / Update Marker Rumah, Marker Sekolah, Lingkaran Radius, & Garis Jarak
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // A. Ikon Penanda Rumah Pendaftar (Custom HTML DivIcon)
    const homeIconHtml = `
      <div style="position: relative; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 40px; height: 40px; background: rgba(249, 115, 22, 0.3); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width: 32px; height: 32px; background: #F97316; border: 2.5px solid #FFFFFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.45); color: #FFFFFF;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
      </div>
    `;

    const homeIcon = L.divIcon({
      html: homeIconHtml,
      className: 'custom-applicant-home-icon',
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -22]
    });

    if (homeMarkerRef.current) {
      homeMarkerRef.current.setLatLng([applicantLat, applicantLng]);
    } else {
      homeMarkerRef.current = L.marker([applicantLat, applicantLng], {
        icon: homeIcon,
        draggable: true
      }).addTo(map);

      // Event Drag Marker Rumah
      homeMarkerRef.current.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        const newLat = parseFloat(pos.lat.toFixed(6));
        const newLng = parseFloat(pos.lng.toFixed(6));

        if (!isInsideDkiJakarta(newLat, newLng)) {
          alert('Titik digeser keluar dari batas DKI Jakarta. Posisi dikembalikan.');
          homeMarkerRef.current.setLatLng([applicantLat, applicantLng]);
          return;
        }

        const closestCentroid = findClosestDukcapilCentroid(newLat, newLng);
        if (onCoordinateChange) {
          onCoordinateChange(newLat, newLng, closestCentroid);
        }
      });
    }

    homeMarkerRef.current.bindPopup(`
      <div style="font-family: inherit; font-size: 11px; line-height: 1.4; padding: 2px; color: #E2E8F0;">
        <strong style="color: #F97316; font-size: 12px; display: block; margin-bottom: 2px;">Titik Domisili Pendaftar</strong>
        <p style="margin: 0; color: #CBD5E1;">Koordinat: <code>${applicantLat.toFixed(5)}, ${applicantLng.toFixed(5)}</code></p>
        <p style="margin: 2px 0 0 0; color: #34D399; font-weight: 700;">Status: ${isAutoSnapped ? '✓ Ter-Autosnap Dukcapil' : '📍 Koordinat Kustom'}</p>
        <p style="margin: 2px 0 0 0; color: #94A3B8; font-size: 10px;">Geser penanda untuk menyesuaikan titik rumah Anda.</p>
      </div>
    `);

    // B. Ikon Penanda SMAN Pilihan
    const schoolIconHtml = `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="width: 34px; height: 34px; background: #18181B; border: 2.5px solid #F43F5E; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.45); color: #F97316;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4"/>
            <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2"/>
            <path d="M18 5v17"/>
            <path d="m4 6 8-4 8 4"/>
            <path d="M6 5v17"/>
            <circle cx="12" cy="9" r="2"/>
          </svg>
        </div>
      </div>
    `;

    const schoolIcon = L.divIcon({
      html: schoolIconHtml,
      className: 'custom-school-icon',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22]
    });

    if (schoolMarkerRef.current) {
      schoolMarkerRef.current.setLatLng([schoolLat, schoolLng]);
    } else {
      schoolMarkerRef.current = L.marker([schoolLat, schoolLng], {
        icon: schoolIcon,
        interactive: true
      }).addTo(map);
    }

    schoolMarkerRef.current.bindPopup(`
      <div style="font-family: inherit; font-size: 11px; line-height: 1.4; padding: 2px; color: #E2E8F0;">
        <strong style="color: #F43F5E; font-size: 12px; display: block; margin-bottom: 2px;">${school?.nama_sekolah || 'SMAN Pilihan'}</strong>
        <p style="margin: 0; color: #CBD5E1;">Radius Zonasi Maksimal: <strong style="color: #FFFFFF;">${formatDistance(schoolRadius)}</strong></p>
        <p style="margin: 2px 0 0 0; color: #94A3B8;">Lokasi: ${school?.kecamatan || 'DKI Jakarta'}, ${school?.kota || 'DKI Jakarta'}</p>
      </div>
    `);

    // C. Lingkaran Radius Zonasi SMAN
    if (schoolRadiusCircleRef.current) {
      schoolRadiusCircleRef.current.setLatLng([schoolLat, schoolLng]);
      schoolRadiusCircleRef.current.setRadius(schoolRadius);
    } else {
      schoolRadiusCircleRef.current = L.circle([schoolLat, schoolLng], {
        radius: schoolRadius,
        color: '#F97316',
        weight: 1.5,
        fillColor: '#F97316',
        fillOpacity: 0.1,
        dashArray: '5, 5'
      }).addTo(map);
    }

    // D. Garis Geodesik Haversine (Polyline) Menghubungkan Rumah ke Sekolah
    const lineCoords = [
      [applicantLat, applicantLng],
      [schoolLat, schoolLng]
    ];
    const lineColor = isWithinRadius ? '#10B981' : '#F43F5E';

    if (distancePolylineRef.current) {
      distancePolylineRef.current.setLatLngs(lineCoords);
      distancePolylineRef.current.setStyle({
        color: lineColor,
        dashArray: isWithinRadius ? '6, 6' : '3, 6'
      });
    } else {
      distancePolylineRef.current = L.polyline(lineCoords, {
        color: lineColor,
        weight: 3,
        dashArray: '6, 6',
        opacity: 0.9
      }).addTo(map);
    }

    // E. Render Centroid Resmi Dukcapil
    if (centroidsLayerGroupRef.current) {
      centroidsLayerGroupRef.current.clearLayers();
      if (showCentroids) {
        OFFICIAL_DUKCAPIL_CENTROIDS.forEach((c) => {
          const isSelected = c.id === selectedCentroidId;
          const centroidMarker = L.circleMarker([c.lat, c.lng], {
            radius: isSelected ? 7 : 4.5,
            color: isSelected ? '#F97316' : '#64748B',
            fillColor: isSelected ? '#F43F5E' : '#94A3B8',
            fillOpacity: isSelected ? 0.9 : 0.6,
            weight: isSelected ? 2.5 : 1
          });

          centroidMarker.bindTooltip(
            `<strong>${c.nama}</strong><br/>Klik untuk Auto-Snap ke titik resmi ini`,
            { direction: 'top', offset: [0, -8] }
          );

          centroidMarker.on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            if (onCoordinateChange) {
              onCoordinateChange(c.lat, c.lng, c);
            }
          });

          centroidsLayerGroupRef.current.addLayer(centroidMarker);
        });
      }
    }
  }, [applicantLat, applicantLng, schoolLat, schoolLng, schoolRadius, isWithinRadius, isAutoSnapped, selectedCentroidId, showCentroids]);

  // Fungsi Fokus / Recenter Menyesuaikan Rumah & Sekolah
  const handleRecenter = () => {
    if (!mapRef.current) return;
    const bounds = L.latLngBounds(
      [applicantLat, applicantLng],
      [schoolLat, schoolLng]
    );
    mapRef.current.fitBounds(bounds, {
      padding: [45, 45],
      maxZoom: 16,
      animate: true
    });
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-inner bg-[#18181B]">
      {/* Container Leaflet Peta */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-[360px] sm:h-[420px] z-0 focus:outline-none"
      />

      {/* Top Controls Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-[400] flex items-center justify-between gap-2 pointer-events-none">
        {/* Layer Basemap Switcher */}
        <div className="flex items-center gap-1 bg-[#18181B]/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-white/15 pointer-events-auto">
          {Object.entries(MAP_TILES).map(([key, item]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTileChange(key)}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition flex items-center gap-1 ${
                activeTile === key
                  ? 'bg-[#F97316] text-white shadow-xs'
                  : 'text-slate-300 hover:bg-white/10'
              }`}
            >
              <span>{item.icon}</span>
              <span className="hidden sm:inline">{item.name}</span>
            </button>
          ))}
        </div>

        {/* Zoom & Recenter Controls */}
        <div className="flex items-center gap-1 bg-[#18181B]/95 backdrop-blur-md p-1 rounded-xl shadow-md border border-white/15 pointer-events-auto">
          <button
            type="button"
            onClick={handleRecenter}
            title="Pusatkan Antara Rumah & Sekolah"
            className="p-1.5 rounded-lg text-[#E2E8F0] hover:bg-orange-500/15 hover:text-[#F97316] transition flex items-center gap-1 text-[11px] font-bold"
          >
            <Crosshair className="w-3.5 h-3.5 text-[#F97316]" />
            <span className="hidden sm:inline">Pusatkan</span>
          </button>
          <div className="w-[1px] h-4 bg-white/10 mx-0.5"></div>
          <button
            type="button"
            onClick={() => mapRef.current?.zoomIn()}
            className="p-1.5 rounded-lg text-[#E2E8F0] hover:bg-white/10 transition"
            title="Perbesar Peta"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => mapRef.current?.zoomOut()}
            className="p-1.5 rounded-lg text-[#E2E8F0] hover:bg-white/10 transition"
            title="Perkecil Peta"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Floating Status & Telemetri Haversine Panel (Bottom Overlay) */}
      <div className="absolute bottom-3 left-3 right-3 z-[400] pointer-events-auto">
        <div className="bg-[#18181B]/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              isWithinRadius ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/15 text-[#F43F5E] border border-rose-500/30'
            }`}>
              {isWithinRadius ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-[#F43F5E]" />}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Kalkulasi Spasial Haversine Riil:
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isWithinRadius 
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}>
                  {isWithinRadius ? '✓ Masuk Radius Zonasi' : '⚠️ Di Luar Radius Zonasi'}
                </span>
                {isAutoSnapped && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/15 text-orange-300 border border-orange-500/30">
                    <ShieldCheck className="w-3 h-3 text-[#F97316]" />
                    <span>Auto-Snap Dukcapil Sah</span>
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-base sm:text-lg font-black text-white font-mono">
                  {formatDistance(currentDistance)}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  menuju <strong className="text-[#E2E8F0]">{school?.nama_sekolah?.split(' ')[0] || 'SMAN'}</strong> (Maks: {formatDistance(schoolRadius)})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Helper Button */}
          <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <span className="text-[10px] text-slate-400 hidden lg:inline">
              Klik atau geser pin oranye untuk mengubah titik rumah
            </span>
            <button
              type="button"
              onClick={handleRecenter}
              className="px-3 py-1.5 rounded-xl bg-[#222227] hover:bg-white/10 text-[#E2E8F0] border border-white/10 text-xs font-bold transition flex items-center gap-1 shrink-0"
            >
              <Compass className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Lihat Garis Jarak</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
