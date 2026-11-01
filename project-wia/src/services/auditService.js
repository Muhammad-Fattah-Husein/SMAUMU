/**
 * Immutable Cryptographic Audit Log Service
 * SMAUMU - Web In Action (WIA) MIA 2026
 * Implements tamper-evident SHA-256 Merkle-like chain for public accountability
 */

import { computeBlockHash } from '@/utils/crypto';

export class AuditChain {
  constructor(initialLogs = []) {
    this.chain = [...initialLogs];
  }

  getLogs() {
    return this.chain;
  }

  getLatestHash() {
    if (this.chain.length === 0) {
      return '0000000000000000000000000000000000000000000000000000000000000000';
    }
    return this.chain[this.chain.length - 1].curr_hash;
  }

  addEntry({
    penggunaId = 1,
    penggunaNama = 'Admin Instansi Disdik',
    aksi,
    entitas,
    entitasId,
    deskripsi,
    dataLama = null,
    dataBaru = null,
    ipAddress = '180.252.71.14'
  }) {
    const prevHash = this.getLatestHash();
    const timestamp = new Date().toISOString();
    
    const currHash = computeBlockHash({
      prevHash,
      timestamp,
      penggunaId,
      aksi,
      entitas,
      entitasId,
      data: { dataLama, dataBaru }
    });

    const newLog = {
      id: this.chain.length + 1,
      pengguna_id: penggunaId,
      pengguna_nama: penggunaNama,
      aksi,
      entitas_terkait: entitas,
      entitas_id: entitasId,
      deskripsi_tindakan: deskripsi,
      data_lama: dataLama,
      data_baru: dataBaru,
      ip_address: ipAddress,
      prev_hash: prevHash,
      curr_hash: currHash,
      created_at: timestamp
    };

    this.chain.push(newLog);
    return newLog;
  }

  /**
   * Cryptographically verifies the entire audit log chain
   * Returns true if 100% untampered, or flags any corrupted block
   */
  verifyIntegrity() {
    if (this.chain.length === 0) return { isValid: true, verifiedCount: 0 };

    for (let i = 0; i < this.chain.length; i++) {
      const current = this.chain[i];
      
      // Verify previous hash linkage
      if (i > 0) {
        const previous = this.chain[i - 1];
        if (current.prev_hash !== previous.curr_hash) {
          return {
            isValid: false,
            errorIndex: i,
            errorId: current.id,
            reason: `Broken hash linkage at Block #${current.id}. Expected prev_hash ${previous.curr_hash.slice(0, 12)}... but got ${current.prev_hash.slice(0, 12)}...`,
            verifiedCount: i
          };
        }
      }

      // Re-compute current hash
      const recomputedHash = computeBlockHash({
        prevHash: current.prev_hash,
        timestamp: current.created_at,
        penggunaId: current.pengguna_id,
        aksi: current.aksi,
        entitas: current.entitas_terkait,
        entitasId: current.entitas_id,
        data: { dataLama: current.data_lama, dataBaru: current.data_baru }
      });

      if (recomputedHash !== current.curr_hash) {
        return {
          isValid: false,
          errorIndex: i,
          errorId: current.id,
          reason: `Cryptographic tamper detected at Block #${current.id}! Block data was modified after signing.`,
          verifiedCount: i
        };
      }
    }

    return {
      isValid: true,
      verifiedCount: this.chain.length,
      latestHash: this.chain[this.chain.length - 1].curr_hash,
      message: 'Seluruh rantai audit log terverifikasi 100% valid, runtut, dan bebas manipulasi.'
    };
  }
}
