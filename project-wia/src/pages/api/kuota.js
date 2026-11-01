import { db } from '@/services/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const kuota = db.getAllKuotaWithMetrics();
    return res.status(200).json({ success: true, data: kuota });
  }

  if (req.method === 'POST') {
    const { sekolah_id, jalur, deltaApplicants, deltaFilled } = req.body;
    const updated = db.updateKuotaSeat(sekolah_id, jalur, deltaApplicants || 1, deltaFilled || 0);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Kuota sekolah tidak ditemukan' });
    }
    return res.status(200).json({ success: true, data: updated });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
