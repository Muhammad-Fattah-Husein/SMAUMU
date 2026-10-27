/**
 * Data Service for SMAUMU.
 * 
 * Provides an asynchronous Promise-based API for School Quota & Announcement operations.
 * Currently uses localStorage for persistent in-browser state.
 * 
 * SWAPPING WITH FIREBASE / SUPABASE:
 * ----------------------------------------------------
 * To swap with Firebase:
 *   const docRef = doc(db, 'schools', schoolId);
 *   await updateDoc(docRef, { quota: newQuota });
 * 
 * To swap with Supabase:
 *   const { data, error } = await supabase.from('schools').select('*');
 *   await supabase.from('schools').update({ quota: newQuota }).eq('id', schoolId);
 * ----------------------------------------------------
 */

import { INITIAL_SCHOOLS, DEMO_ADMINS } from './mockData';

const STORAGE_KEY = 'smaumu_schools_data_v1';

// Initialize localStorage if empty
const loadStorage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SCHOOLS));
    return INITIAL_SCHOOLS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse localStorage, resetting to default:', e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SCHOOLS));
    return INITIAL_SCHOOLS;
  }
};

const saveStorage = (schools) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schools));
};

export const dataService = {
  /**
   * Fetch all schools with their current quotas and announcements.
   * Maps to: `getDocs(collection(db, 'schools'))` in Firebase or `supabase.from('schools').select('*')`
   */
  async getSchools() {
    await new Promise((resolve) => setTimeout(resolve, 150)); // simulate network latency
    return loadStorage();
  },

  /**
   * Fetch a single school by ID.
   */
  async getSchoolById(id) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const schools = loadStorage();
    const school = schools.find((s) => s.id === id);
    if (!school) throw new Error(`Sekolah dengan ID ${id} tidak ditemukan.`);
    return school;
  },

  /**
   * Fast update of filled seats for School Admin dashboard.
   */
  async updateFilledSeats(schoolId, filledSeats) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const schools = loadStorage();
    const index = schools.findIndex((s) => s.id === schoolId);
    if (index === -1) throw new Error('Sekolah tidak ditemukan.');

    const school = schools[index];
    const totalSeats = school.quota.totalSeats;

    if (filledSeats > totalSeats) {
      throw new Error(`Kursi terisi (${filledSeats}) tidak boleh melebihi daya tampung total (${totalSeats}).`);
    }

    school.quota.filledSeats = Number(filledSeats);
    school.quota.lastUpdated = new Date().toISOString();
    schools[index] = school;

    saveStorage(schools);
    return school;
  },

  /**
   * Update full breakdown for Zonasi, Prestasi, Afirmasi, and Perpindahan.
   */
  async updateDetailedQuota(schoolId, detailedData) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const schools = loadStorage();
    const index = schools.findIndex((s) => s.id === schoolId);
    if (index === -1) throw new Error('Sekolah tidak ditemukan.');

    const school = schools[index];

    const totalSeats =
      detailedData.zonasiTotal +
      detailedData.prestasiTotal +
      detailedData.afirmasiTotal +
      detailedData.perpindahanTotal;

    const filledSeats =
      detailedData.zonasiFilled +
      detailedData.prestasiFilled +
      detailedData.afirmasiFilled +
      detailedData.perpindahanFilled;

    if (filledSeats > totalSeats) {
      throw new Error('Total kursi terisi dari seluruh jalur melebihi daya tampung.');
    }

    school.quota = {
      ...school.quota,
      ...detailedData,
      totalSeats,
      filledSeats,
      lastUpdated: new Date().toISOString(),
    };

    schools[index] = school;
    saveStorage(schools);
    return school;
  },

  /**
   * Publish a new live announcement for a school.
   */
  async addAnnouncement(schoolId, { title, content, category, isActive = true }) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const schools = loadStorage();
    const index = schools.findIndex((s) => s.id === schoolId);
    if (index === -1) throw new Error('Sekolah tidak ditemukan.');

    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title,
      content,
      category,
      isActive: Boolean(isActive),
      createdAt: new Date().toISOString(),
    };

    schools[index].announcements.unshift(newAnnouncement);
    saveStorage(schools);
    return newAnnouncement;
  },

  /**
   * Toggle visibility (isActive) of an announcement.
   */
  async toggleAnnouncement(schoolId, announcementId) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const schools = loadStorage();
    const school = schools.find((s) => s.id === schoolId);
    if (!school) throw new Error('Sekolah tidak ditemukan.');

    const ann = school.announcements.find((a) => a.id === announcementId);
    if (!ann) throw new Error('Pengumuman tidak ditemukan.');

    ann.isActive = !ann.isActive;
    saveStorage(schools);
    return ann;
  },

  /**
   * Delete an announcement.
   */
  async deleteAnnouncement(schoolId, announcementId) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const schools = loadStorage();
    const school = schools.find((s) => s.id === schoolId);
    if (!school) throw new Error('Sekolah tidak ditemukan.');

    school.announcements = school.announcements.filter((a) => a.id !== announcementId);
    saveStorage(schools);
    return true;
  },

  /**
   * Reset data to default seeds.
   */
  resetData() {
    saveStorage(INITIAL_SCHOOLS);
    return INITIAL_SCHOOLS;
  },

  /**
   * Authenticate admin against demo admins or users collection.
   */
  async authenticateAdmin(username, password) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const admin = DEMO_ADMINS.find(
      (a) => a.username === username.trim() && a.password === password.trim()
    );
    if (!admin) {
      throw new Error('Username atau kata sandi admin salah.');
    }
    const schools = loadStorage();
    const assignedSchool = schools.find((s) => s.id === admin.schoolId);
    return {
      username: admin.username,
      name: admin.name,
      schoolId: admin.schoolId,
      assignedSchool,
    };
  }
};
