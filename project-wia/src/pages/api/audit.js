import { db } from '@/services/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const logs = db.getAuditLogs();
    return res.status(200).json({ success: true, data: logs });
  }

  if (req.method === 'POST') {
    // Cryptographic Chain Verification Request
    const result = db.verifyAuditIntegrity();
    return res.status(200).json({ success: true, verification: result });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
