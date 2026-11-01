/**
 * Client-Side API Interceptor for GitHub Pages & Static Hosts
 * Automatically intercepts /api/* calls in browser context and routes them
 * directly to portalApi (Supabase cloud or local store).
 * Prevents 404 Not Found errors on static hosts.
 */

import { portalApi } from '@/services/portalApi';

export function setupClientApiInterceptor() {
  if (typeof window === 'undefined') return;
  if (window.__API_INTERCEPTOR_INSTALLED__) return;
  window.__API_INTERCEPTOR_INSTALLED__ = true;

  const originalFetch = window.fetch;

  window.fetch = async function(resource, init = {}) {
    let url = typeof resource === 'string' ? resource : resource.url;

    // Check if the request targets Next.js /api routes
    const isLocalApi = url.startsWith('/api/') || (url.includes('/api/') && url.startsWith(window.location.origin));

    if (!isLocalApi) {
      return originalFetch.apply(this, arguments);
    }

    try {
      const parsedUrl = new URL(url, window.location.origin);
      const pathname = parsedUrl.pathname;
      const method = (init.method || 'GET').toUpperCase();
      let body = {};
      if (init.body) {
        try {
          body = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
        } catch {
          body = {};
        }
      }

      let responsePayload = { success: false, message: 'Endpoint tidak ditemukan' };
      let status = 200;

      // 1. /api/kuota
      if (pathname.includes('/api/kuota')) {
        if (method === 'GET') {
          const res = await portalApi.getKuota();
          responsePayload = res;
        } else if (method === 'POST') {
          const { sekolah_id, jalur, deltaApplicants, deltaFilled } = body;
          const res = await portalApi.updateKuotaSeat(sekolah_id, jalur, deltaApplicants, deltaFilled);
          responsePayload = res;
        }
      }

      // 2. /api/pendaftaran
      else if (pathname.includes('/api/pendaftaran')) {
        if (method === 'GET') {
          const tiket = parsedUrl.searchParams.get('tiket');
          if (tiket) {
            responsePayload = await portalApi.getPendaftaranByTicket(tiket);
            if (!responsePayload.success) status = 404;
          } else {
            responsePayload = await portalApi.getAllPendaftaran();
          }
        } else if (method === 'POST') {
          responsePayload = await portalApi.submitPendaftaran(body);
          status = responsePayload.success ? 201 : 400;
        }
      }

      // 3. /api/verifikasi
      else if (pathname.includes('/api/verifikasi')) {
        if (method === 'POST') {
          const { id, status: newStatus, catatan, verifikator } = body;
          responsePayload = await portalApi.verifyPendaftaran(id, newStatus, verifikator, catatan);
        }
      }

      // 4. /api/whistleblower
      else if (pathname.includes('/api/whistleblower')) {
        if (method === 'GET') {
          const token = parsedUrl.searchParams.get('token');
          if (token) {
            responsePayload = await portalApi.getWhistleblowerByToken(token);
            if (!responsePayload.success) status = 404;
          } else {
            responsePayload = await portalApi.getAllWhistleblower();
          }
        } else if (method === 'POST') {
          responsePayload = await portalApi.submitWhistleblower(body);
          status = responsePayload.success ? 201 : 400;
        } else if (method === 'PUT') {
          const { id, status: newStatus, respon_petugas } = body;
          responsePayload = await portalApi.updateWhistleblowerStatus(id, newStatus, respon_petugas);
        }
      }

      // 5. /api/audit
      else if (pathname.includes('/api/audit')) {
        if (method === 'GET') {
          const logs = await portalApi.getAuditLogs();
          responsePayload = { success: true, data: logs.data || logs };
        } else if (method === 'POST') {
          const result = await portalApi.verifyAuditIntegrity();
          responsePayload = { success: true, verification: result };
        }
      }

      return new Response(JSON.stringify(responsePayload), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err) {
      console.error('API Interceptor error:', err);
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
}
