import { db } from '@/services/db';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { id, status, catatan, verifikator } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, message: 'ID dan status wajib disertakan' });
    }

    const updated = db.updatePendaftaranStatus(id, status, verifikator || 'Dr. H. Bambang Soeprapto', catatan);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Data pendaftaran tidak ditemukan' });
    }

    return res.status(200).json({ success: true, data: updated });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
