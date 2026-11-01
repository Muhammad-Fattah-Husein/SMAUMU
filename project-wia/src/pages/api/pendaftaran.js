import { db } from '@/services/db';
import { generateTicketNumber } from '@/utils/crypto';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { tiket } = req.query;
    if (tiket) {
      const record = db.getPendaftaranByTiket(tiket);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Nomor tiket tidak ditemukan' });
      }
      return res.status(200).json({ success: true, data: record });
    }
    const all = db.getAllPendaftaran();
    return res.status(200).json({ success: true, data: all });
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (!body.nama_siswa || !body.nik || !body.sekolah_id || !body.jalur) {
      return res.status(400).json({ success: false, message: 'Data formulir tidak lengkap' });
    }

    const nomorTiket = body.nomor_tiket || generateTicketNumber();
    const created = db.addPendaftaran({
      ...body,
      nomor_tiket: nomorTiket
    });

    return res.status(201).json({ success: true, data: created });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
