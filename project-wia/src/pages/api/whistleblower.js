import { db } from '@/services/db';
import { generateWhistleToken } from '@/utils/crypto';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { token } = req.query;
    if (token) {
      const report = db.getLaporanByToken(token);
      if (!report) {
        return res.status(404).json({ success: false, message: 'Token investigasi tidak ditemukan' });
      }
      return res.status(200).json({ success: true, data: report });
    }
    const allReports = db.getAllLaporanWarga();
    return res.status(200).json({ success: true, data: allReports });
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (!body.kategori || !body.judul || !body.deskripsi) {
      return res.status(400).json({ success: false, message: 'Kategori, judul, dan deskripsi wajib diisi' });
    }

    const token = generateWhistleToken();
    const kodeLaporan = `WBL-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    const newReport = db.addLaporanWarga({
      ...body,
      kode_laporan: kodeLaporan,
      token_investigasi: token
    });

    return res.status(201).json({ success: true, data: newReport, token_investigasi: token });
  }

  if (req.method === 'PUT') {
    const { id, status, respon_petugas } = req.body;
    const updated = db.updateLaporanStatus(id, status, respon_petugas);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Laporan tidak ditemukan' });
    }
    return res.status(200).json({ success: true, data: updated });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
