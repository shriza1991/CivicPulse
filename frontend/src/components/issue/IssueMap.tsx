import React, { useCallback, useEffect, useRef, useMemo, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import Supercluster from 'supercluster';

import type { Issue } from '@/api/types';
import { getImageUrl } from '@/utils/getImageUrl';
import { getLocalityName } from '@/utils/getLocalityName';
import { humanizeIssueType } from '@/utils/issueHelpers';
import { Navigation, AlertTriangle } from 'lucide-react';

interface IssueMapProps {
  issues: Issue[];
  selectedIssueId: string | null;
  onSelectIssue: (issueId: string) => void;
  className?: string;
}

const getDemandPriorityColor = (severity: number): string => {
  if (severity >= 4) return '#DC2626'; // High / Critical Priority
  if (severity === 3) return '#EA580C'; // Elevated Priority
  if (severity === 2) return '#D97706'; // Moderate Priority
  return '#0D9488'; // Standard Need (Teal)
};

export const IssueMap: React.FC<IssueMapProps> = ({
  issues,
  selectedIssueId,
  onSelectIssue,
  className,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [mapReady, setMapReady] = useState(false);

  // Sanitize and filter input issues
  const validIssues = useMemo(() => {
    return issues.filter((issue) => {
      const lat = Number(issue.latitude);
      const lng = Number(issue.longitude);
      return (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      );
    });
  }, [issues]);

  // Group reports by cluster_id or issue.id (if solitary)
  const groupedData = useMemo(() => {
    const groups: Record<string, Issue[]> = {};
    validIssues.forEach((issue) => {
      const key = issue.cluster_id || `solitary-${issue.id}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(issue);
    });

    return Object.entries(groups).map(([key, reports]) => {
      const sorted = [...reports].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const primary = sorted[0];
      return {
        key,
        reports: sorted,
        primary,
        latitude: primary.latitude,
        longitude: primary.longitude,
        maxSeverity: Math.max(...reports.map((r) => r.severity)),
      };
    });
  }, [validIssues]);

  // Convert grouped data to GeoJSON features for Supercluster
  const geojsonFeatures = useMemo(() => {
    return groupedData.map((group) => ({
      type: 'Feature' as const,
      properties: {
        clusterKey: group.key,
        primaryId: group.primary.id,
        issueType: group.primary.issue_type,
        reportCount: group.reports.length,
        maxSeverity: group.maxSeverity,
        primaryPhoto: group.primary.photo_url,
        primaryStatus: group.primary.status,
        description: group.primary.description,
        groupRef: group,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [group.longitude, group.latitude] as [number, number],
      },
    }));
  }, [groupedData]);

  // Supercluster instance
  const supercluster = useMemo(() => {
    const sc = new Supercluster({
      radius: 45,
      maxZoom: 16,
    });
    sc.load(geojsonFeatures as any);
    return sc;
  }, [geojsonFeatures]);

  // Initialize MapLibre GL Map Instance with India Nationwide Scope
  useEffect(() => {
    const isSupported = typeof window !== 'undefined' && (!!window.WebGLRenderingContext || !!(window as any).WebGL2RenderingContext);
    if (!isSupported) {
      setWebGlSupported(false);
      return;
    }

    const container = mapContainerRef.current;
    if (!container) return;
    if (mapRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: container,
        style: {
          version: 8,
          sources: {
            'osm-tiles': {
              type: 'raster',
              tiles: [
                'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
              ],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors | CommonGround DPI'
            }
          },
          layers: [
            {
              id: 'osm-tiles-layer',
              type: 'raster',
              source: 'osm-tiles',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [78.9629, 20.5937], // India Nationwide Center [lng, lat]
        zoom: 4.5,
        maxZoom: 18,
        minZoom: 3,
        attributionControl: false,
      });

      map.on('load', () => {
        map.resize();
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'bottom-right');
      map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

      popupRef.current = new maplibregl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '260px',
      });

      mapRef.current = map;
      setMapReady(true);

      const resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
      resizeObserver.observe(container);

      return () => {
        resizeObserver.disconnect();
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
        setMapReady(false);
      };
    } catch (err) {
      console.error('[MapLibre] Map constructor exception:', err);
    }
  }, []);

  // Render & Update Supercluster Markers when map moves or data changes
  const updateMarkers = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = map.getBounds();
    const zoom = Math.floor(map.getZoom());
    const bbox: [number, number, number, number] = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    const clusters = supercluster.getClusters(bbox, zoom);

    clusters.forEach((cluster) => {
      const [lng, lat] = cluster.geometry.coordinates;
      const isCluster = cluster.properties && (cluster.properties as any).cluster;

      const el = document.createElement('div');
      el.className = 'custom-maplibre-marker';
      el.style.cursor = 'pointer';

      if (isCluster) {
        const pointCount = (cluster.properties as any).point_count;
        const size = Math.min(32 + pointCount * 3, 58);

        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.borderRadius = '50%';
        el.style.backgroundColor = '#0F766E';
        el.style.border = '2.5px solid #FFFFFF';
        el.style.color = '#FFFFFF';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontWeight = '800';
        el.style.fontSize = '12px';
        el.style.boxShadow = '0 4px 14px rgba(0,0,0,0.3)';
        el.innerText = pointCount.toString();

        el.addEventListener('click', () => {
          const expansionZoom = Math.min(
            supercluster.getClusterExpansionZoom(cluster.id as number),
            17
          );
          map.easeTo({
            center: [lng, lat],
            zoom: expansionZoom,
            duration: 500,
          });
        });
      } else {
        const props = cluster.properties as any;
        const priorityColor = getDemandPriorityColor(props.maxSeverity);
        const reportCount = props.reportCount;

        el.style.width = '32px';
        el.style.height = '32px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = priorityColor;
        el.style.border = '2.5px solid #FFFFFF';
        el.style.color = '#FFFFFF';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.fontWeight = '800';
        el.style.fontSize = '11px';
        el.style.boxShadow = '0 4px 10px rgba(0,0,0,0.25)';
        el.innerText = reportCount > 1 ? reportCount.toString() : '★';

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          onSelectIssue(props.primaryId);

          const group = props.groupRef;
          const primary = group.primary;
          const reports = group.reports;
          const avgSeverity = (reports.reduce((sum: number, r: Issue) => sum + r.severity, 0) / reports.length).toFixed(1);
          const locality = getLocalityName(primary.latitude, primary.longitude);

          const popupContent = `
            <div style="font-family: system-ui, sans-serif; padding: 2px; font-size: 11px; color: #1e293b;">
              ${primary.photo_url ? `
                <div style="height: 90px; width: 100%; border-radius: 6px; overflow: hidden; background-color: #f1f5f9; margin-bottom: 6px;">
                  <img src="${getImageUrl(primary.photo_url)}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.style.display='none';" />
                </div>
              ` : ''}
              <div style="font-weight: 800; font-size: 12px; color: #0f172a; margin-bottom: 2px;">
                ${humanizeIssueType(primary.issue_type, primary.description)}
              </div>
              <div style="color: #475569; font-size: 10px; font-weight: 600; margin-bottom: 6px;">
                📍 ${locality}
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px;">
                <span style="font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: #fef2f2; color: #991b1b; border: 1px solid #fee2e2; text-transform: uppercase;">
                  Priority ${avgSeverity}/5
                </span>
                <span style="font-size: 9px; font-weight: 800; padding: 2px 6px; border-radius: 4px; color: #0f766e; background: #f0fdfa; border: 1px solid #ccfbf1;">
                  ${reports.length} Signal${reports.length > 1 ? 's' : ''}
                </span>
              </div>
              <p style="font-size: 10px; color: #64748b; line-height: 1.3; margin: 0;">
                ${primary.description ? primary.description.slice(0, 95) + '...' : 'Verified community infrastructure need.'}
              </p>
            </div>
          `;

          if (popupRef.current) {
            popupRef.current
              .setLngLat([lng, lat])
              .setHTML(popupContent)
              .addTo(map);
          }
        });
      }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [supercluster, onSelectIssue]);

  // Sync markers on map move or zoom
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    updateMarkers();

    const handleMove = () => updateMarkers();
    map.on('moveend', handleMove);
    map.on('zoomend', handleMove);

    return () => {
      map.off('moveend', handleMove);
      map.off('zoomend', handleMove);
    };
  }, [mapReady, updateMarkers]);

  // Center & Fit Bounds when groupedData changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || groupedData.length === 0) return;

    const bounds = new maplibregl.LngLatBounds();
    groupedData.forEach((g) => {
      bounds.extend([g.longitude, g.latitude]);
    });

    if (groupedData.length === 1) {
      map.flyTo({ center: [groupedData[0].longitude, groupedData[0].latitude], zoom: 12 });
    } else {
      map.fitBounds(bounds, { padding: 50, maxZoom: 14 });
    }
  }, [groupedData]);

  // Fly to selected issue on list interaction
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedIssueId) return;

    const targetGroup = groupedData.find((g) => g.reports.some((r) => r.id === selectedIssueId));
    if (targetGroup) {
      map.flyTo({
        center: [targetGroup.longitude, targetGroup.latitude],
        zoom: 14,
        duration: 800,
      });
    }
  }, [selectedIssueId, groupedData]);

  // Geolocate user position
  const handleGeolocate = () => {
    const map = mapRef.current;
    if (!map || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo({
          center: [pos.coords.longitude, pos.coords.latitude],
          zoom: 14,
          duration: 1000,
        });
      },
      (err) => console.error('Geolocation error:', err)
    );
  };

  if (!webGlSupported) {
    return (
      <div className={className} style={{ position: 'relative', width: '100%', height: '100%', minHeight: '340px' }}>
        <div className="w-full h-full flex flex-col p-6 bg-slate-50 border border-slate-200 rounded-xl font-sans overflow-y-auto space-y-4">
          <div className="flex items-center gap-2 text-slate-800 border-b border-slate-200 pb-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Demand List View (Map Fallback)</h4>
              <p className="text-xs text-slate-500">Vector map unavailable in this browser session. Showing verified demand priorities.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {groupedData.slice(0, 8).map((g) => (
              <div
                key={g.key}
                onClick={() => onSelectIssue(g.primary.id)}
                className="p-3 bg-white border border-slate-200 rounded-lg shadow-xs hover:border-teal-500 cursor-pointer space-y-1.5"
              >
                <div className="flex justify-between items-center text-xs font-bold text-slate-900">
                  <span>{humanizeIssueType(g.primary.issue_type, g.primary.description)}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-teal-50 text-teal-800 border border-teal-200">
                    {g.reports.length} Signal{g.reports.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  📍 {getLocalityName(g.primary.latitude, g.primary.longitude)}
                </div>
                <div className="text-[10px] font-bold text-rose-700">
                  Priority Severity: {g.maxSeverity}/5
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%', minHeight: '360px' }}>
      {/* Dedicated MapLibre Canvas Container Host Element */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Legend Overlay */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-slate-200/90 p-3 rounded-xl shadow-md text-[10px] space-y-2 select-none z-10 max-w-[165px] font-sans font-medium text-slate-700 pointer-events-auto">
        <div className="font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1 text-[9px]">
          Priority Intelligence
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 bg-red-600" />
            <span className="font-medium text-slate-800">Critical Priority (Sev 4-5)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 bg-orange-600" />
            <span className="font-medium text-slate-800">Elevated Need (Sev 3)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 bg-amber-600" />
            <span className="font-medium text-slate-800">Moderate Need (Sev 2)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 bg-teal-600" />
            <span className="font-medium text-slate-800">Standard Community Need</span>
          </div>
        </div>
      </div>

      {/* Locate button */}
      <button
        onClick={handleGeolocate}
        className="absolute bottom-6 right-4 bg-white hover:bg-slate-50 border border-slate-200 p-2.5 rounded-xl shadow-md text-slate-700 transition-all select-none z-10 cursor-pointer active:scale-95 pointer-events-auto"
        title="Pan to My Current Location"
      >
        <Navigation size={15} className="rotate-45" />
      </button>
    </div>
  );
};
