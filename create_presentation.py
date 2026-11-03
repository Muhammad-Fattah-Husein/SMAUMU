import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Palette
    C_NAVY = RGBColor(11, 37, 69)      # #0B2545
    C_DARK_BLUE = RGBColor(15, 59, 102) # #0F3B66
    C_BLUE = RGBColor(2, 132, 199)     # #0284C7
    C_SKY = RGBColor(56, 189, 248)     # #38BDF8
    C_WHITE = RGBColor(255, 255, 255)
    C_BG_LIGHT = RGBColor(248, 250, 252) # #F8FAFC
    C_CARD_BORDER = RGBColor(226, 232, 240) # #E2E8F0
    C_DARK = RGBColor(15, 23, 42)      # #0F172A
    C_MUTED = RGBColor(100, 116, 139)  # #64748B
    C_EMERALD = RGBColor(5, 150, 105)  # #059669
    C_ROSE = RGBColor(225, 29, 72)     # #E11D48
    C_AMBER = RGBColor(217, 119, 6)    # #D97706

    def add_bg(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, title_text, category_text, dark_mode=False):
        # Header bar / category
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.45), Inches(11.733), Inches(0.35))
        tf = cat_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = category_text.upper()
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = C_SKY if dark_mode else C_BLUE

        # Title
        t_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.733), Inches(0.65))
        tf_t = t_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.color.rgb = C_WHITE if dark_mode else C_NAVY

    def add_card(slide, x, y, w, h, bg_color=C_WHITE, border_color=C_CARD_BORDER):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
        card.fill.solid()
        card.fill.fore_color.rgb = bg_color
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
        return card

    # ==========================================
    # SLIDE 1: COVER
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1, C_NAVY)

    # Accent decorative banner
    acc = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.8), Inches(3.2), Inches(0.32))
    acc.fill.solid()
    acc.fill.fore_color.rgb = C_BLUE
    acc.line.fill.background()
    p = acc.text_frame.paragraphs[0]
    p.text = "WEB IN ACTION (WIA) MIA 2026"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = C_WHITE
    p.alignment = PP_ALIGN.CENTER

    # Title & Subtitle box
    tbox = s1.shapes.add_textbox(Inches(0.8), Inches(1.4), Inches(11.733), Inches(2.8))
    tf = tbox.text_frame
    tf.word_wrap = True
    
    p1 = tf.paragraphs[0]
    p1.text = "SMAUMU (SMAN UntukMu)"
    p1.font.size = Pt(36)
    p1.font.bold = True
    p1.font.color.rgb = C_WHITE
    p1.space_after = Pt(10)

    p2 = tf.add_paragraph()
    p2.text = "Portal Transparansi Penerimaan Siswa Baru SMAN Berbasis Real-Time Data & Civic Accountability"
    p2.font.size = Pt(16)
    p2.font.color.rgb = C_SKY
    p2.space_after = Pt(20)

    p3 = tf.add_paragraph()
    p3.text = "Tema: Designing Digital Futures – Powering Public Transparency"
    p3.font.size = Pt(13)
    p3.font.bold = True
    p3.font.color.rgb = C_WHITE

    # 4 Subtheme Badges
    subthemes = [
        "1. Open Government Data",
        "2. Public Service Tracking",
        "3. Civic Reporting & Accountability",
        "4. Data-Driven Decision Support"
    ]
    for i, st in enumerate(subthemes):
        bx = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 2.95), Inches(4.5), Inches(2.85), Inches(0.85))
        bx.fill.solid()
        bx.fill.fore_color.rgb = C_DARK_BLUE
        bx.line.color.rgb = C_SKY
        bx.line.width = Pt(1)
        p = bx.text_frame.paragraphs[0]
        p.text = st
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_WHITE
        p.alignment = PP_ALIGN.CENTER

    # Footer Metadata
    fbox = s1.shapes.add_textbox(Inches(0.8), Inches(5.8), Inches(11.733), Inches(0.9))
    tf_f = fbox.text_frame
    tf_f.word_wrap = True
    pf = tf_f.paragraphs[0]
    pf.text = "Tim Pengembang: Tim Inovasi Transparansi WIA 2026  |  Lead Dev: Arya Wijaya  |  UI/UX: Maya Safitri  |  GIS & Data: Dimas Rizky"
    pf.font.size = Pt(10)
    pf.font.color.rgb = C_MUTED
    pf2 = tf_f.add_paragraph()
    pf2.text = "Tech Stack: Next.js 14 • Supabase PostgreSQL • Haversine GIS Engine • SHA-256 Merkle Chain • GitHub Pages"
    pf2.font.size = Pt(9.5)
    pf2.font.color.rgb = C_SKY

    s1.notes_slide.notes_text_frame.text = (
        "Salam dewan juri yang terhormat. Kami mempersembahkan SMAUMU (SMAN UntukMu), "
        "portal civic transparency yang mentransformasi tata kelola PPDB SMAN menjadi terbuka, "
        "terverifikasi sains data, dan akuntabel di hadapan publik."
    )

    # ==========================================
    # SLIDE 2: LATAR BELAKANG & PROBLEM STATEMENT
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2, C_BG_LIGHT)
    add_header(s2, "Defisit Kepercayaan Publik & Tiga Titik Kritis PPDB SMAN", "Latar Belakang Permasalahan")

    problems = [
        ("Sengketa Kuota Tersembunyi", 
         "Informasi kuota diperbarui lambat secara harian tanpa metrik pengisian. Terjadi persepsi kursi tiba-tiba habis yang memicu spekulasi jual-beli bangku di belakang layar.",
         C_AMBER, "Kuota Tertutup"),
        ("Manipulasi GPS & Numpang KK",
         "Oknum memanipulasi titik pin lokasi rumah pada aplikasi pendaftaran, atau memindahkan nama anak ke Kartu Keluarga famili lain di dekat sekolah favorit (< 1 tahun).",
         C_ROSE, "Fraud Geospasial"),
        ("Kotak Hitam & Ketiadaan Audit",
         "Masyarakat tidak memiliki kepastian pelacakan berkas. Tidak ada saluran pelaporan yang aman dan anonim, serta nihil audit log publik yang kebal intervensi dinas.",
         C_BLUE, "Zero Auditability")
    ]

    for i, (title, desc, color, tag) in enumerate(problems):
        card = add_card(s2, 0.8 + i * 3.95, 1.6, 3.8, 3.8)
        # Top color accent
        top_bar = s2.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8 + i * 3.95), Inches(1.6), Inches(3.8), Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = color
        top_bar.line.fill.background()

        tb = s2.shapes.add_textbox(Inches(1.0 + i * 3.95), Inches(1.85), Inches(3.4), Inches(3.4))
        tf = tb.text_frame
        tf.word_wrap = True
        
        # Tag
        p_tag = tf.paragraphs[0]
        p_tag.text = tag.upper()
        p_tag.font.size = Pt(8.5)
        p_tag.font.bold = True
        p_tag.font.color.rgb = color
        p_tag.space_after = Pt(6)

        # Title
        p_t = tf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(13)
        p_t.font.bold = True
        p_t.font.color.rgb = C_DARK
        p_t.space_after = Pt(10)

        # Desc
        p_d = tf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = C_MUTED
        p_d.line_spacing = 1.2

    # Bottom Callout Box (Ombudsman Data)
    stat_card = add_card(s2, 0.8, 5.6, 11.733, Inches(1.2), bg_color=C_WHITE, border_color=C_ROSE)
    sb = s2.shapes.add_textbox(Inches(1.0), Inches(5.65), Inches(11.333), Inches(1.1))
    tf_s = sb.text_frame
    tf_s.word_wrap = True
    p_s1 = tf_s.paragraphs[0]
    p_s1.text = "FAKTA EMPIRIS LAPANGAN (OMBUDSMAN RI 2024-2025):"
    p_s1.font.size = Pt(9.5)
    p_s1.font.bold = True
    p_s1.font.color.rgb = C_ROSE

    p_s2 = tf_s.add_paragraph()
    p_s2.text = (
        "Tercatat lebih dari 4.200 aduan kecurangan PPDB SMAN di Indonesia, dengan 68% berakar pada manipulasi KK fiktif "
        "dan pergeseran titik koordinat GPS. SMAUMU hadir untuk menutup celah sistemik ini dengan transparansi teknologi."
    )
    p_s2.font.size = Pt(10.5)
    p_s2.font.color.rgb = C_DARK

    s2.notes_slide.notes_text_frame.text = (
        "Soroti fakta empiris Ombudsman RI: 4.200 aduan dan 68% manipulasi zonasi. "
        "Ini membuktikan masalah bukan hanya sekadar administrasi, melainkan krisis integritas sistemik."
    )

    # ==========================================
    # SLIDE 3: SOLUSI HOLISTIK & PARADIGMA DUAL-TRUTH
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3, C_BG_LIGHT)
    add_header(s3, "Solusi Holistik SMAUMU: Mengubah 'Kotak Hitam' Menjadi Terbuka", "Visi & Pendekatan Desain")

    # Left card: Konvensional vs SMAUMU
    add_card(s3, 0.8, 1.6, 5.6, 5.2)
    lbox = s3.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.2), Inches(4.8))
    tf_l = lbox.text_frame
    tf_l.word_wrap = True
    
    p = tf_l.paragraphs[0]
    p.text = "KOMPARASI PENDEKATAN SISTEMIK"
    p.font.size = Pt(10)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.space_after = Pt(10)

    comparisons = [
        ("Informasi Kuota", "Update berkala statis, sering tertunda", "Live Quota Burn-Rate & estimasi jam habis"),
        ("Verifikasi Zonasi", "Pengecekan manual rentan suap/kelalaian", "Geo-Discrepancy Haversine otomatis"),
        ("Pelaporan Warga", "Form birokratis rentan kebocoran identitas", "Civic Whistleblower 100% anonim + Token"),
        ("Audit Tindakan", "Log internal dapat disunting petugas", "Immutable Audit Log SHA-256 Merkle Chain")
    ]
    for item, conv, sdm in comparisons:
        pt = tf_l.add_paragraph()
        pt.text = f"• {item}:"
        pt.font.bold = True
        pt.font.size = Pt(9.5)
        pt.font.color.rgb = C_DARK
        
        pc = tf_l.add_paragraph()
        pc.text = f"   Lama: {conv}\n   SMAUMU: {sdm}"
        pc.font.size = Pt(8.5)
        pc.font.color.rgb = C_MUTED
        pc.space_after = Pt(6)

    # Right card: Dual-Truth Paradigm
    rcard = add_card(s3, 6.7, 1.6, 5.8, 5.2, bg_color=C_NAVY, border_color=C_SKY)
    rbox = s3.shapes.add_textbox(Inches(7.0), Inches(1.8), Inches(5.2), Inches(4.8))
    tf_r = rbox.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = "INOVASI FILOSOFI: DUAL-TRUTH PARADIGM"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_SKY
    p.space_after = Pt(10)

    p_body = tf_r.add_paragraph()
    p_body.text = (
        "SMAUMU mengusung paradigma 'Kebenaran Berdampingan' (Dual-Truth):\n"
        "Sistem tidak menolak berkas pemohon secara buta atau sewenang-wenang. "
        "Sebaliknya, data klaim pemohon disandingkan langsung dengan data resmi terverifikasi Dukcapil dan satelit GIS."
    )
    p_body.font.size = Pt(9.5)
    p_body.font.color.rgb = C_WHITE
    p_body.space_after = Pt(12)

    # Truth A & B Mini Cards
    p_ta = tf_r.add_paragraph()
    p_ta.text = "Truth-A (Klaim Pendaftar):"
    p_ta.font.bold = True
    p_ta.font.size = Pt(9.5)
    p_ta.font.color.rgb = C_SKY

    p_ta_desc = tf_r.add_paragraph()
    p_ta_desc.text = "Alamat klaim, lama tinggal di KK, koordinat input, dan dokumen pendaftar."
    p_ta_desc.font.size = Pt(8.5)
    p_ta_desc.font.color.rgb = RGBColor(203, 213, 225)
    p_ta_desc.space_after = Pt(8)

    p_tb = tf_r.add_paragraph()
    p_tb.text = "Truth-B (Catatan Otoritatif Dukcapil / Dapodik):"
    p_tb.font.bold = True
    p_tb.font.size = Pt(9.5)
    p_tb.font.color.rgb = RGBColor(52, 211, 153) # Light green

    p_tb_desc = tf_r.add_paragraph()
    p_tb_desc.text = "Koordinat gerbang sekolah resmi, database NIK kependudukan, masa tinggal KK sah."
    p_tb_desc.font.size = Pt(8.5)
    p_tb_desc.font.color.rgb = RGBColor(203, 213, 225)

    s3.notes_slide.notes_text_frame.text = (
        "Tekankan inovasi filosofis Dual-Truth: kami menyajikan kebenaran berdampingan "
        "agar proses seleksi bebas prasangka, transparan bagi warga, dan objektif bagi verifikator."
    )

    # ==========================================
    # SLIDE 4: EMPAT SUBTEMA TERINTEGRASI PENUH
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4, C_BG_LIGHT)
    add_header(s4, "Arsitektur Keselarasan Penuh dengan Tema Kompetisi WIA 2026", "Integrasi 4 Subtema Kompetisi")

    subtheme_cards = [
        ("1. Open Government Data",
         "Live Quota Burn-Rate & Open API",
         "Dashboard keterisian kuota real-time per jam, formula kecepatan penyerapan kursi, status kejenuhan kuota (Aman/Waspada/Kritis), dan REST API publik terbuka untuk akses data transparan.",
         C_AMBER, ["Live Kursi/Jam", "Waktu Habis", "REST API"]),
        
        ("2. Public Service Tracking",
         "Alur Pendaftaran Terpadu 4 Tahap",
         "Pendaftaran terpadu tanpa birokrasi berbelit (Jalur -> Biodata & GPS -> Pantau Status -> Tanda Terima QR). Pelacakan nomor tiket berenkripsi dan pencetakan bukti resmi ber-QR hash.",
         C_BLUE, ["4-Step Wizard", "Nomor Tiket", "Tanda Terima QR"]),
        
        ("3. Civic Reporting & Accountability",
         "Civic Whistleblower & Audit Log",
         "Kanal pelaporan kecurangan 100% anonim tanpa pencatatan IP, proteksi investigasi berbasis token hash, serta Immutable Audit Log publik berantai SHA-256 Merkle chain.",
         C_ROSE, ["100% Anonim", "Investigasi Token", "SHA-256 Merkle"]),
        
        ("4. Data-Driven Decision Support",
         "Dual-Truth & Haversine GIS Detector",
         "Dual-Truth Comparator klaim vs catatan resmi, Haversine Great-Circle Geodesic Distance Engine, Passing-Grade Simulator probabilistik, dan Blank-Spot Advisor.",
         C_EMERALD, ["Haversine Engine", "Passing Grade", "Blank-Spot Advisor"])
    ]

    for i, (title, sub, desc, color, pills) in enumerate(subtheme_cards):
        x = 0.8 + (i % 2) * 5.95
        y = 1.6 + (i // 2) * 2.75
        add_card(s4, x, y, 5.75, 2.55)

        # Left bar accent
        lb = s4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(0.12), Inches(2.55))
        lb.fill.solid()
        lb.fill.fore_color.rgb = color
        lb.line.fill.background()

        tb = s4.shapes.add_textbox(Inches(x + 0.3), Inches(y + 0.15), Inches(5.3), Inches(2.25))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = title.upper()
        p1.font.size = Pt(8.5)
        p1.font.bold = True
        p1.font.color.rgb = color
        
        p2 = tf.add_paragraph()
        p2.text = sub
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = C_DARK
        p2.space_after = Pt(4)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = C_MUTED
        p3.space_after = Pt(8)

        p4 = tf.add_paragraph()
        p4.text = "Fitur Utama: " + " • ".join(pills)
        p4.font.size = Pt(8)
        p4.font.bold = True
        p4.font.color.rgb = C_DARK

    s4.notes_slide.notes_text_frame.text = (
        "Jelaskan bahwa SMAUMU mengintegrasikan seluruh 4 subtema WIA secara organik "
        "tanpa ada subtema yang dipaksakan. Seluruh modul saling bertukar data secara harmonis."
    )

    # ==========================================
    # SLIDE 5: TECH STACK & ARSITEKTUR SISTEM
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5, C_BG_LIGHT)
    add_header(s5, "Tech Stack Modern: Kinerja Tinggi, Aman, & Siap Skala", "Arsitektur Teknologi")

    tech_pillars = [
        ("Frontend & UI", "Next.js 14 & Tailwind", 
         "Arsitektur React 18 dengan Static HTML Export (output: 'export'), Tailwind CSS utility-first, Lucide React icons, dan Google Fonts Plus Jakarta Sans & JetBrains Mono.", C_BLUE),
        ("Backend & Database", "Supabase PostgreSQL 15+", 
         "PostgreSQL ternormalisasi 3NF, Row Level Security (RLS) policies, Realtime Database Subscriptions, dan Next.js Serverless API routes.", C_DARK_BLUE),
        ("Algoritma & Spasial", "Haversine GIS Engine", 
         "Kalkulasi trigonometri jarak geodesic lingkaran besar di browser dan server untuk mendeteksi deviasi titik GPS rumah pendaftar vs radius resmi sekolah.", C_EMERALD),
        ("Keamanan & Kripto", "SHA-256 Merkle Chain", 
         "Struktur rantai hash kriptografis anti-pemalsuan (tamper-evident audit trail), token hash acak untuk whistleblower, dan zero public admin registration.", C_ROSE)
    ]

    for i, (cat, name, desc, color) in enumerate(tech_pillars):
        add_card(s5, 0.8 + i * 2.95, 1.6, 2.85, 3.8)
        
        top_bar = s5.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8 + i * 2.95), Inches(1.6), Inches(2.85), Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = color
        top_bar.line.fill.background()

        tb = s5.shapes.add_textbox(Inches(0.95 + i * 2.95), Inches(1.85), Inches(2.55), Inches(3.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = cat.upper()
        p1.font.size = Pt(8.5)
        p1.font.bold = True
        p1.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = name
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = C_DARK
        p2.space_after = Pt(8)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = C_MUTED
        p3.line_spacing = 1.25

    # CI/CD & Deploy Box
    dcard = add_card(s5, 0.8, 5.6, 11.733, 1.2, bg_color=C_NAVY, border_color=C_SKY)
    db = s5.shapes.add_textbox(Inches(1.0), Inches(5.65), Inches(11.333), Inches(1.1))
    tf_d = db.text_frame
    tf_d.word_wrap = True

    p = tf_d.paragraphs[0]
    p.text = "PIPELINE AUTOMATED CI/CD & DEPLOYMENT READY"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_SKY

    p_sub = tf_d.add_paragraph()
    p_sub.text = (
        "• GitHub Actions Workflow (.github/workflows/deploy.yml) mengotomasi validasi kode, static compilation, "
        "dan publikasi ke GitHub Pages.\n"
        "• Dual-Mode Architecture: Beroperasi mulus dengan koneksi live Supabase Cloud atau offline demo memory fallback."
    )
    p_sub.font.size = Pt(9)
    p_sub.font.color.rgb = C_WHITE

    s5.notes_slide.notes_text_frame.text = (
        "Jelaskan arsitektur dual-mode: jika API Supabase aktif, data tersimpan di PostgreSQL cloud. "
        "Jika offline, fallback demo storage memastikan juri tetap dapat menguji seluruh 21 rute."
    )

    # ==========================================
    # SLIDE 6: FITUR UNGGULAN 1 - LIVE QUOTA BURN-RATE
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6, C_BG_LIGHT)
    add_header(s6, "Inovasi 1: Live Quota Burn-Rate Engine & Open API", "Keterbukaan Data Pemerintah")

    # Left Card: Metrik & Formula
    add_card(s6, 0.8, 1.6, 5.6, 5.2)
    lb = s6.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.2), Inches(4.8))
    tf_l = lb.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "FORMULASI & INDIKATOR KECEPATAN KURSI"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.space_after = Pt(8)

    p1 = tf_l.add_paragraph()
    p1.text = "1. Velocity (Burn-Rate):"
    p1.font.bold = True
    p1.font.size = Pt(9.5)
    p1.font.color.rgb = C_DARK

    p1_d = tf_l.add_paragraph()
    p1_d.text = "Velocity = Δ Pendaftar Terverifikasi / Δ Jam Seleksi Aktif"
    p1_d.font.size = Pt(9)
    p1_d.font.color.rgb = C_MUTED
    p1_d.space_after = Pt(6)

    p2 = tf_l.add_paragraph()
    p2.text = "2. Estimasi Waktu Habis (Depletion Time):"
    p2.font.bold = True
    p2.font.size = Pt(9.5)
    p2.font.color.rgb = C_DARK

    p2_d = tf_l.add_paragraph()
    p2_d.text = "Remaining Hours = Sisa Kursi Tersedia / Velocity"
    p2_d.font.size = Pt(9)
    p2_d.font.color.rgb = C_MUTED
    p2_d.space_after = Pt(6)

    p3 = tf_l.add_paragraph()
    p3.text = "3. Status Tiga Tingkat Kejenuhan Kursi:"
    p3.font.bold = True
    p3.font.size = Pt(9.5)
    p3.font.color.rgb = C_DARK

    status_items = [
        ("Aman (< 65%)", "Keterisian normal, laju masuk terkendali.", C_EMERALD),
        ("Waspada (65% - 85%)", "Kecepatan pendaftaran meningkat, sisa kursi menipis.", C_AMBER),
        ("Kritis (> 85% atau sisa < 2 jam)", "Persaingan ketat, pendaftar disarankan mengecek sekolah alternatif.", C_ROSE)
    ]
    for s_title, s_desc, s_color in status_items:
        ps = tf_l.add_paragraph()
        ps.text = f"• {s_title}: {s_desc}"
        ps.font.size = Pt(8.5)
        ps.font.color.rgb = s_color

    # Right Card: Manfaat & Real-time Visual
    add_card(s6, 6.7, 1.6, 5.8, 5.2)
    rb = s6.shapes.add_textbox(Inches(6.9), Inches(1.8), Inches(5.4), Inches(4.8))
    tf_r = rb.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = "TRANSPARANSI DATA SEKETIKA BAGI MASYARAKAT"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_NAVY
    p.space_after = Pt(8)

    benefits = [
        ("Mencegah Kursi Siluman", "Setiap penambahan atau pembatalan kursi langsung terhitung dalam metrik publik secara seketika."),
        ("Pengambilan Keputusan Cepat", "Orang tua dapat melihat laju penyerapan per jalur (Zonasi 50%, Afirmasi 20%, Prestasi 20%, Mutasi 10%)."),
        ("Akses Terbuka Open API", "Disediakan endpoint publik /api/kuota yang dapat diaudit oleh akademisi, media, dan LSM pegiat transparansi."),
        ("Blank-Spot Early Warning", "Mendeteksi secara dini area pemukiman yang kekurangan daya tampung SMAN terdekat.")
    ]
    for b_title, b_desc in benefits:
        pb = tf_r.add_paragraph()
        pb.text = f"✓ {b_title}"
        pb.font.bold = True
        pb.font.size = Pt(9.5)
        pb.font.color.rgb = C_BLUE

        pbd = tf_r.add_paragraph()
        pbd.text = b_desc
        pbd.font.size = Pt(8.5)
        pbd.font.color.rgb = C_MUTED
        pbd.space_after = Pt(6)

    s6.notes_slide.notes_text_frame.text = (
        "Burn-Rate Engine adalah jantung transparansi kuota. Tidak ada lagi cerita 'kursi tiba-tiba habis' "
        "karena grafik laju pengisian terpampang transparan per jam."
    )

    # ==========================================
    # SLIDE 7: FITUR UNGGULAN 2 - DUAL-TRUTH & HAVERSINE
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7, C_BG_LIGHT)
    add_header(s7, "Inovasi 2: Dual-Truth Comparator & Geo-Discrepancy Detector", "Sains Data & Deteksi Fraud")

    # Top: Haversine Formula box
    hf_card = add_card(s7, 0.8, 1.6, 11.733, 1.3, bg_color=C_NAVY, border_color=C_SKY)
    hfb = s7.shapes.add_textbox(Inches(1.0), Inches(1.68), Inches(11.333), Inches(1.1))
    tf_h = hfb.text_frame
    tf_h.word_wrap = True

    p = tf_h.paragraphs[0]
    p.text = "HAVERSINE GREAT-CIRCLE GEODESIC DISTANCE ENGINE"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_SKY

    p_f = tf_h.add_paragraph()
    p_f.text = (
        "d = 2R · atan2( √[ sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlon/2) ], √(1 - a) )\n"
        "Mengukur jarak geodesic presisi tinggi antara pin GPS rumah klaim pendaftar vs koordinat gerbang resmi SMAN."
    )
    p_f.font.size = Pt(9)
    p_f.font.color.rgb = C_WHITE

    # Left: Dual-Truth Mockup UI
    add_card(s7, 0.8, 3.1, 5.75, 3.7)
    lb = s7.shapes.add_textbox(Inches(1.0), Inches(3.25), Inches(5.35), Inches(3.4))
    tf_l = lb.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "VISUALISASI KOMPARASI BERDAMPINGAN"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_DARK
    p.space_after = Pt(6)

    dt_items = [
        ("Klaim Pendaftar (Truth-A)", "Alamat: Tebet Timur Dalam • Jarak Klaim: 310 meter • Lama KK: 4 bulan"),
        ("Basis Data Resmi (Truth-B)", "Dukcapil: Rawamangun • Jarak Geodesic Asli: 1.680 meter • Status KK: Anomali"),
        ("Selisih Deviasi (Δ Discrepancy)", "Δ Jarak: +1.370 meter • Level Resiko: RED FLAG (Peringatan Kritis)")
    ]
    for tag, val in dt_items:
        pt = tf_l.add_paragraph()
        pt.text = tag
        pt.font.bold = True
        pt.font.size = Pt(9)
        pt.font.color.rgb = C_BLUE if "Klaim" in tag else (C_DARK_BLUE if "Resmi" in tag else C_ROSE)
        
        pv = tf_l.add_paragraph()
        pv.text = val
        pv.font.size = Pt(8.5)
        pv.font.color.rgb = C_MUTED
        pv.space_after = Pt(4)

    # Right: Ambang Batas Otomatis (Threshold Rules)
    add_card(s7, 6.8, 3.1, 5.733, 3.7)
    rb = s7.shapes.add_textbox(Inches(7.0), Inches(3.25), Inches(5.333), Inches(3.4))
    tf_r = rb.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = "SISTEM AMBANG BATAS VALIDASI OTOMATIS"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_DARK
    p.space_after = Pt(6)

    thresholds = [
        ("Toleransi Presisi GPS (Δ < 150m)", "Wajar akibat variasi sinyal satelit seluler; berkas diproses normal.", C_EMERALD),
        ("Peringatan Verifikasi (150m ≤ Δ ≤ 500m)", "Sistem menandai kuning; verifikator wajib meninjau foto KK fisik.", C_AMBER),
        ("Anomali Kritis Fraud (Δ > 500m)", "Sistem mengunci otomatis; notifikasi anomali diteruskan ke meja audit.", C_ROSE),
        ("Audit Masa KK (< 12 Bulan)", "Otomatis mendeteksi pemindahan KK numpang yang melanggar juknis PPDB.", C_ROSE)
    ]
    for th_name, th_desc, th_col in thresholds:
        pt = tf_r.add_paragraph()
        pt.text = f"• {th_name}"
        pt.font.bold = True
        pt.font.size = Pt(9)
        pt.font.color.rgb = th_col

        pd = tf_r.add_paragraph()
        pd.text = th_desc
        pd.font.size = Pt(8.5)
        pd.font.color.rgb = C_MUTED
        pd.space_after = Pt(4)

    s7.notes_slide.notes_text_frame.text = (
        "Dual-Truth Comparator dan Haversine Engine menghentikan praktik numpang KK dan geser pin map. "
        "Seluruh deviasi dihitung instan oleh algoritma objektif tanpa campur tangan subjektif manusia."
    )

    # ==========================================
    # SLIDE 8: INOVASI 3 - REGISTRASI 4 TAHAP & TIKET
    # ==========================================
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8, C_BG_LIGHT)
    add_header(s8, "Inovasi 3: Alur Pendaftaran Terpadu 4 Langkah & Tanda Terima QR", "Pelacakan Layanan Publik")

    steps = [
        ("Tahap 1", "Pilih Jalur & Sekolah", 
         "Memilih jalur (Zonasi, Afirmasi, Prestasi, Mutasi) dengan transparansi persentase kuota resmi dan daya tampung sekolah target.", C_BLUE),
        ("Tahap 2", "Biodata & Pinpoint GPS", 
         "Pengisian NIK, NISN, nilai rapor 5 semester, dan penandaan titik domisili GPS akurat dengan tombol deteksi GPS real-time.", C_BLUE),
        ("Tahap 3", "Pantau Tiket Enkripsi", 
         "Penerbitan kode tiket unik (misal TIKET-SMU-2026-A89F1) dengan pelacakan progres verifikasi transparan secara live.", C_DARK_BLUE),
        ("Tahap 4", "Tanda Terima Digital QR", 
         "Penerbitan bukti pendaftaran resmi ber-QR hash digital yang dapat dipindai publik untuk memverifikasi keaslian berkas.", C_EMERALD)
    ]

    for i, (stp, title, desc, color) in enumerate(steps):
        add_card(s8, 0.8 + i * 2.95, 1.6, 2.85, 3.8)

        top_bar = s8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8 + i * 2.95), Inches(1.6), Inches(2.85), Inches(0.12))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = color
        top_bar.line.fill.background()

        tb = s8.shapes.add_textbox(Inches(0.95 + i * 2.95), Inches(1.85), Inches(2.55), Inches(3.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p1 = tf.paragraphs[0]
        p1.text = stp.upper()
        p1.font.size = Pt(8.5)
        p1.font.bold = True
        p1.font.color.rgb = color

        p2 = tf.add_paragraph()
        p2.text = title
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = C_DARK
        p2.space_after = Pt(8)

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.size = Pt(8.5)
        p3.font.color.rgb = C_MUTED
        p3.line_spacing = 1.25

    # Bottom summary box
    b_card = add_card(s8, 0.8, 5.6, 11.733, 1.2, bg_color=C_WHITE, border_color=C_BLUE)
    bb = s8.shapes.add_textbox(Inches(1.0), Inches(5.65), Inches(11.333), Inches(1.1))
    tf_b = bb.text_frame
    tf_b.word_wrap = True

    p = tf_b.paragraphs[0]
    p.text = "KEUNGGULAN SISTEM PELACAKAN TIKET SMAUMU"
    p.font.size = Pt(9.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE

    p_sub = tf_b.add_paragraph()
    p_sub.text = (
        "• Masyarakat tidak lagi cemas menunggu hasil pengumuman karena setiap perpindahan status (Diajukan, Terverifikasi, "
        "Memerlukan Klarifikasi, Diterima) tercatat beserta nama petugas verifikator dan timestamp terenkripsi."
    )
    p_sub.font.size = Pt(9.5)
    p_sub.font.color.rgb = C_DARK

    s8.notes_slide.notes_text_frame.text = (
        "Subtema Public Service Tracking diimplementasikan lewat alur 4 tahap yang ramah pengguna. "
        "QR Hash pada tanda terima memungkinkan pembuktian instan tanpa perlu legalisir kertas manual."
    )

    # ==========================================
    # SLIDE 9: INOVASI 4 - CIVIC WHISTLEBLOWER & AUDIT LOG
    # ==========================================
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9, C_BG_LIGHT)
    add_header(s9, "Inovasi 4: Civic Whistleblower & Cryptographic Audit Log", "Akuntabilitas & Pelaporan Partisipatif")

    # Left: Whistleblower
    add_card(s9, 0.8, 1.6, 5.75, 5.2)
    lb = s9.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.35), Inches(4.8))
    tf_l = lb.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "CIVIC WHISTLEBLOWER (100% ANONIM)"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_ROSE
    p.space_after = Pt(8)

    w_features = [
        ("Nol Perekaman Identitas", "Sistem tidak mencatat alamat IP, lokasi perangkat, atau informasi pribadi pelapor untuk menjamin keselamatan."),
        ("Token Investigasi Kriptografis", "Pelapor menerima token acak (misal TOKEN-WBL-7719-XPQ) sebagai kunci satu-satunya untuk melacak tindak lanjut dinas."),
        ("Pengunggahan Bukti Dokumen", "Mendukung lampiran bukti foto KK palsu, koordinat fiktif, atau indikasi pungli bangku."),
        ("Integrasi Dashboard Verifikator", "Setiap laporan warga langsung muncul pada antrean khusus investigasi verifikator dinas.")
    ]
    for w_title, w_desc in w_features:
        pw = tf_l.add_paragraph()
        pw.text = f"🛡️ {w_title}"
        pw.font.bold = True
        pw.font.size = Pt(9.5)
        pw.font.color.rgb = C_DARK

        pwd = tf_l.add_paragraph()
        pwd.text = w_desc
        pwd.font.size = Pt(8.5)
        pwd.font.color.rgb = C_MUTED
        pwd.space_after = Pt(5)

    # Right: SHA-256 Merkle Chain Audit
    add_card(s9, 6.8, 1.6, 5.733, 5.2, bg_color=C_NAVY, border_color=C_SKY)
    rb = s9.shapes.add_textbox(Inches(7.0), Inches(1.8), Inches(5.333), Inches(4.8))
    tf_r = rb.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = "IMMUTABLE AUDIT LOG (SHA-256 MERKLE LINK)"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_SKY
    p.space_after = Pt(8)

    p_f = tf_r.add_paragraph()
    p_f.text = (
        "Setiap aksi mutasi (pengesahan tiket, pembatalan pendaftaran, penyesuaian kuota) "
        "diikat secara permanen menggunakan formula hash berantai:"
    )
    p_f.font.size = Pt(9)
    p_f.font.color.rgb = C_WHITE
    p_f.space_after = Pt(6)

    # Code formula
    p_c = tf_r.add_paragraph()
    p_c.text = "CurrentHash = SHA256( PrevHash + Timestamp + ActorID + Action + Target + Data )"
    p_c.font.size = Pt(8)
    p_c.font.bold = True
    p_c.font.color.rgb = RGBColor(147, 197, 253)
    p_c.space_after = Pt(10)

    a_features = [
        ("Anti-Manipulasi Petugas", "Bahkan admin sistem tidak dapat mengubah atau menghapus rekaman masa lalu tanpa merusak seluruh integritas rantai."),
        ("Verifikasi Integritas Live", "Disediakan tombol satu klik di antarmuka publik untuk mengkalkulasi ulang seluruh rantai hash dalam waktu 1 detik."),
        ("Transparansi ke Ombudsman", "Log audit dapat diakses langsung oleh pengawas eksternal dan publik secara terbuka.")
    ]
    for a_title, a_desc in a_features:
        pa = tf_r.add_paragraph()
        pa.text = f"⛓️ {a_title}"
        pa.font.bold = True
        pa.font.size = Pt(9)
        pa.font.color.rgb = C_SKY

        pad = tf_r.add_paragraph()
        pad.text = a_desc
        pad.font.size = Pt(8.5)
        pad.font.color.rgb = RGBColor(203, 213, 225)
        pad.space_after = Pt(4)

    s9.notes_slide.notes_text_frame.text = (
        "Soroti pilar Civic Reporting & Accountability: Whistleblower anonim memberikan keberanian warga "
        "untuk melapor, sedangkan SHA-256 Merkle Chain mengunci integritas keputusan petugas dinas."
    )

    # ==========================================
    # SLIDE 10: INOVASI 5 - PASSING-GRADE SIMULATOR & ZONASI HEATMAP
    # ==========================================
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10, C_BG_LIGHT)
    add_header(s10, "Inovasi 5: Passing-Grade Simulator & Zonasi Heatmap", "Dukungan Keputusan Berbasis Data")

    # Left: Passing Grade Simulator
    add_card(s10, 0.8, 1.6, 5.75, 5.2)
    lb = s10.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(5.35), Inches(4.8))
    tf_l = lb.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "PASSING-GRADE PROBABILISTIC SIMULATOR"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.space_after = Pt(8)

    sim_features = [
        ("Simulasi Peluang Kelulusan (0 - 100%)", "Mengolah data nilai rapor semester 1-5, bobot akreditasi SMP asal, dan poin piagam prestasi."),
        ("Peringkat Pendaftar Real-time", "Menghitung estimasi ranking pendaftar relatif terhadap seluruh pendaftar yang telah masuk."),
        ("Rekomendasi SMAN Cadangan", "Jika peluang di sekolah pilihan utama di bawah 50%, sistem merekomendasikan sekolah negeri alternatif dengan daya tampung mencukupi."),
        ("Mencegah Kepanikan Siswa", "Membantu calon siswa menyusun strategi pendaftaran secara rasional berbasis data ilmiah.")
    ]
    for s_title, s_desc in sim_features:
        ps = tf_l.add_paragraph()
        ps.text = f"🧮 {s_title}"
        ps.font.bold = True
        ps.font.size = Pt(9.5)
        ps.font.color.rgb = C_DARK

        psd = tf_l.add_paragraph()
        psd.text = s_desc
        psd.font.size = Pt(8.5)
        psd.font.color.rgb = C_MUTED
        psd.space_after = Pt(5)

    # Right: Zonasi Heatmap & Blank-Spot
    add_card(s10, 6.8, 1.6, 5.733, 5.2)
    rb = s10.shapes.add_textbox(Inches(7.0), Inches(1.8), Inches(5.333), Inches(4.8))
    tf_r = rb.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = "INTERACTIVE ZONASI HEATMAP & BLANK-SPOT ADVISOR"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_DARK_BLUE
    p.space_after = Pt(8)

    hm_features = [
        ("Visualisasi Peta Sebaran Pendaftar", "Memetakan konsentrasi pendaftar di sekitar sekolah favorit beserta radius zonasi resmi (500m, 1.000m, 1.500m)."),
        ("Analisis Disparitas Wilayah (Blank-Spots)", "Mengidentifikasi kecamatan atau kelurahan yang mengalami defisit kursi SMAN ekstrem (contoh: defisit 1.552 kursi di Cipayung, 1.734 di Kalideres)."),
        ("Dasar Rekomendasi Kebijakan Dinas", "Menjadi instrumen analitik bagi Dinas Pendidikan untuk merencanakan Ruang Kelas Baru (RKB) atau penyesuaian kuota jalur afirmasi."),
        ("Aksesibilitas Geografis Transparan", "Memberikan kepastian radius aman zonasi kepada masyarakat luas.")
    ]
    for h_title, h_desc in hm_features:
        ph = tf_r.add_paragraph()
        ph.text = f"🗺️ {h_title}"
        ph.font.bold = True
        ph.font.size = Pt(9.5)
        ph.font.color.rgb = C_DARK

        phd = tf_r.add_paragraph()
        phd.text = h_desc
        phd.font.size = Pt(8.5)
        phd.font.color.rgb = C_MUTED
        phd.space_after = Pt(5)

    s10.notes_slide.notes_text_frame.text = (
        "Simulator dan Blank-Spot Advisor membuktikan subtema Data-Driven Decision Support: "
        "membantu masyarakat memilih sekolah secara cerdas sekaligus memberi masukan kebijakan bagi pemda."
    )

    # ==========================================
    # SLIDE 11: DATABASE SCHEMA & KEAMANAN ZERO-TRUST
    # ==========================================
    s11 = prs.slides.add_slide(blank_layout)
    add_bg(s11, C_BG_LIGHT)
    add_header(s11, "Arsitektur Database PostgreSQL 3NF & Kebijakan Zero-Trust", "Struktur Basis Data & Keamanan")

    # Left: Database Entities
    add_card(s11, 0.8, 1.6, 6.8, 5.2)
    lb = s11.shapes.add_textbox(Inches(1.0), Inches(1.8), Inches(6.4), Inches(4.8))
    tf_l = lb.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "SKEMA BASIS DATA RELASIONAL 3NF (SUPABASE POSTGRESQL)"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.space_after = Pt(6)

    tables = [
        ("pengguna", "Master akun siswa, wali murid, verifikator zonasi, dan admin dinas."),
        ("sekolah", "Master SMAN, NPSN, koordinat gerbang resmi (lat/lon), daya tampung."),
        ("kuota_sekolah", "Alokasi kuota per jalur (Zonasi, Afirmasi, Prestasi, Mutasi) & metrik burn-rate."),
        ("pendaftaran", "Data berkas pendaftar, nilai rapor, jarak Haversine, nomor tiket enkripsi."),
        ("laporan_warga", "Aduan whistleblower anonim, token investigasi, berkas bukti, respon dinas."),
        ("audit_log", "Buku besar rantai SHA-256 (prev_hash, curr_hash, aktor, timestamp, mutasi).")
    ]
    for tbl, dsc in tables:
        pt = tf_l.add_paragraph()
        pt.text = f"• {tbl}: {dsc}"
        pt.font.size = Pt(8.5)
        pt.font.color.rgb = C_DARK
        pt.space_after = Pt(4)

    # Right: Zero-Trust Security Policies
    add_card(s11, 7.8, 1.6, 4.733, 5.2, bg_color=C_NAVY, border_color=C_SKY)
    rb = s11.shapes.add_textbox(Inches(8.0), Inches(1.8), Inches(4.333), Inches(4.8))
    tf_r = rb.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = "KEBIJAKAN KEAMANAN ZERO-TRUST"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_SKY
    p.space_after = Pt(8)

    sec_rules = [
        ("Ketiadaan Registrasi Admin Publik", "Sesuai prinsip Zero-Trust, akun admin dinas tidak dapat didaftarkan lewat web publik. Diterbitkan eksklusif lewat DDL SQL resmi."),
        ("Row Level Security (RLS)", "Aturan ketat PostgreSQL: Siswa hanya dapat membaca berkas pribadi; publik hanya dapat melihat kuota agregat & audit hash."),
        ("Autentikasi Terpisah", "Portal pengguna umum (/login) dan portal khusus instansi (/admin/login) memiliki boundary sesi terisolasi."),
        ("Sanitasi & Enkripsi Data", "Validasi format NIK 16 digit, NISN 10 digit, dan sanitasi input anti-SQLi & XSS.")
    ]
    for s_title, s_desc in sec_rules:
        ps = tf_r.add_paragraph()
        ps.text = f"🔒 {s_title}"
        ps.font.bold = True
        ps.font.size = Pt(9)
        ps.font.color.rgb = C_WHITE

        psd = tf_r.add_paragraph()
        psd.text = s_desc
        psd.font.size = Pt(8)
        psd.font.color.rgb = RGBColor(203, 213, 225)
        psd.space_after = Pt(5)

    s11.notes_slide.notes_text_frame.text = (
        "Tekankan aspek keamanan: skema 3NF menjaga integritas relasional, "
        "sedangkan kebijakan Zero-Trust menjamin tidak ada celah privilege escalation bagi pengguna luar."
    )

    # ==========================================
    # SLIDE 12: STATUS IMPLEMENTASI & KELAYAKAN TEKNIS
    # ==========================================
    s12 = prs.slides.add_slide(blank_layout)
    add_bg(s12, C_BG_LIGHT)
    add_header(s12, "Status Implementasi Penuh: Siap Uji & Bebas Eror", "Kelayakan Teknis & Hasil Pengujian")

    stat_cards = [
        ("21", "Rute Web Lengkap", "Seluruh rute publik dan admin telah terimplementasi dan terhubung.", C_BLUE),
        ("0", "Kompilasi Eror", "Terkoreksi bersih pada build static export Next.js 14.", C_EMERALD),
        ("100%", "Cakupan 4 Subtema", "Seluruh subtema kompetisi WIA 2026 terintegrasi fungsional.", C_DARK_BLUE),
        ("SHA-256", "Integritas Data", "Rantai kriptografi tamper-evident aktif mengunci mutasi data.", C_ROSE)
    ]
    for i, (num, lbl, sub, color) in enumerate(stat_cards):
        add_card(s12, 0.8 + i * 2.95, 1.6, 2.85, 1.8)
        tb = s12.shapes.add_textbox(Inches(0.95 + i * 2.95), Inches(1.75), Inches(2.55), Inches(1.5))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = num
        p.font.size = Pt(24)
        p.font.bold = True
        p.font.color.rgb = color
        
        p2 = tf.add_paragraph()
        p2.text = lbl
        p2.font.size = Pt(11)
        p2.font.bold = True
        p2.font.color.rgb = C_DARK
        
        p3 = tf.add_paragraph()
        p3.text = sub
        p3.font.size = Pt(8)
        p3.font.color.rgb = C_MUTED

    # Bottom demo credentials & feature checklist
    d_card = add_card(s12, 0.8, 3.65, 11.733, 3.15)
    db = s12.shapes.add_textbox(Inches(1.0), Inches(3.8), Inches(11.333), Inches(2.85))
    tf_d = db.text_frame
    tf_d.word_wrap = True

    p = tf_d.paragraphs[0]
    p.text = "KREDENSIAL DEMO PENGUJIAN DEWAN JURI & CHECKLIST FITUR"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.space_after = Pt(8)

    p_cred = tf_d.add_paragraph()
    p_cred.text = (
        "• Akun Admin Instansi Dinas: admin.disdik@smaumu.go.id  |  Kata Sandi: admin12345\n"
        "• Akun Verifikator Zonasi: verifikator.zonasi@smaumu.go.id  |  Kata Sandi: verif12345\n"
        "• Akun Auditor Ombudsman: auditor.bebas@ombudsman.go.id  |  Kata Sandi: audit12345"
    )
    p_cred.font.size = Pt(9.5)
    p_cred.font.bold = True
    p_cred.font.color.rgb = C_DARK
    p_cred.space_after = Pt(10)

    p_chk = tf_d.add_paragraph()
    p_chk.text = (
        "Checklist Pengujian Fungsional Live:\n"
        "[✓] Pendaftaran Akun & Formulir 4 Tahap (/register, /daftar)   [✓] Deteksi Deviasi GPS Haversine (/komparator)\n"
        "[✓] Live Burn-Rate & Estimasi Jam Habis (/kuota)              [✓] Passing-Grade Simulator Probabilistik (/simulator)\n"
        "[✓] Pengaduan Whistleblower Anonim (/whistleblower)          [✓] Tombol Live Verifikasi Hash SHA-256 (/audit-log)\n"
        "[✓] Dashboard Verifikasi & Manajemen Kuota Admin (/admin/*)   [✓] Static Export GitHub Pages & Supabase Backend"
    )
    p_chk.font.size = Pt(8.5)
    p_chk.font.color.rgb = C_MUTED
    p_chk.line_spacing = 1.3

    s12.notes_slide.notes_text_frame.text = (
        "Sampaikan kesiapan teknis penuh: aplikasi tidak sekadar mock-up, "
        "seluruh fungsionalitas dan kredensial demo siap diverifikasi langsung oleh dewan juri."
    )

    # ==========================================
    # SLIDE 13: KESIMPULAN & PENUTUP
    # ==========================================
    s13 = prs.slides.add_slide(blank_layout)
    add_bg(s13, C_NAVY)

    tb = s13.shapes.add_textbox(Inches(0.8), Inches(1.5), Inches(11.733), Inches(4.5))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    p.text = "DESAIN MASA DEPAN TRANSPARANSI PUBLIK TELAH HADIR"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_SKY
    p.space_after = Pt(8)

    p1 = tf.add_paragraph()
    p1.text = "SMAUMU (SMAN UntukMu)\nMewujudkan Keadilan Pendidikan Melalui Kekuatan Data"
    p1.font.size = Pt(28)
    p1.font.bold = True
    p1.font.color.rgb = C_WHITE
    p1.space_after = Pt(18)

    points = [
        "Transparansi Radikal: Kuota kursi dan laju penyerapan dibuka seketika untuk menghentikan spekulasi.",
        "Keadilan Spasial: Algoritma Haversine dan Dual-Truth Comparator mengeliminasi manipulasi zonasi.",
        "Akuntabilitas Permanen: Rekaman audit kriptografi SHA-256 menjamin setiap keputusan petugas dapat dipertanggungjawabkan.",
        "Pemberdayaan Warga: Pelapor kecurangan dilindungi sepenuhnya melalui token investigasi anonim."
    ]
    for pt in points:
        p_pt = tf.add_paragraph()
        p_pt.text = "• " + pt
        p_pt.font.size = Pt(11)
        p_pt.font.color.rgb = RGBColor(226, 232, 240)
        p_pt.space_after = Pt(6)

    # Bottom Contact & Thanks
    fb = s13.shapes.add_textbox(Inches(0.8), Inches(6.0), Inches(11.733), Inches(0.8))
    tf_fb = fb.text_frame
    tf_fb.word_wrap = True
    pf = tf_fb.paragraphs[0]
    pf.text = "Terima Kasih • Sesi Tanya Jawab (Q&A)"
    pf.font.size = Pt(14)
    pf.font.bold = True
    pf.font.color.rgb = C_SKY
    pf2 = tf_fb.add_paragraph()
    pf2.text = "Tim Inovasi Transparansi WIA 2026 — Web In Action (WIA) MIA 2026"
    pf2.font.size = Pt(10)
    pf2.font.color.rgb = C_MUTED

    s13.notes_slide.notes_text_frame.text = (
        "Tutup presentasi dengan keyakinan penuh: SMAUMU bukan hanya prototipe lomba, "
        "tetapi cetak biru nyata bagaimana teknologi civic tech dapat menyelesaikan krisis kepercayaan PPDB di Indonesia. "
        "Buka forum untuk tanya jawab dewan juri."
    )

    out_path = r"D:\Competition\MIA2026f\SMAUMU_Presentasi_WIA2026.pptx"
    prs.save(out_path)
    print(f"Presentation saved successfully to {out_path}")

if __name__ == "__main__":
    create_deck()
