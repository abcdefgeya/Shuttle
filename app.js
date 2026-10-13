function register() {
    const username = document.getElementById('regUser').value;
    const password = document.getElementById('regPass').value;

    if (username === "" || password === "") {
        alert("Username dan Password harus diisi!");
        return;
    }

    // Cek apakah username sudah terdaftar
    const users = JSON.parse(localStorage.getItem('users')) || {};
    
    if (users[username]) {
        alert("Username sudah terdaftar! Pilih username lain.");
        return;
    }

    // Simpan akun baru
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));

    // Langsung ke login tanpa alert
    window.location.href = "login.html";
}

function login() {
    const identifier = document.getElementById('loginUser').value;
    const pass = document.getElementById('loginPass').value;

    if (identifier === "" || pass === "") {
        alert("Isi dulu bos No. HP/Email sama Passwordnya!");
        return;
    }

    // Ambil data akun dari localStorage
    const users = JSON.parse(localStorage.getItem('users')) || {};

    // Cek di akun terdaftar
    if (users[identifier] && users[identifier] === pass) {
        localStorage.setItem('currentUser', identifier);
        window.location.href = "index.html";
    } else {
        alert("Username/Email atau Password salah!");
    }
}

function cekLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = "login.html";
    }
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

function goHome() {
    window.location.href = "home.html";
}

function goPesanan() {

    window.location.href = "pesanan.html";
}

function goInbox() {
    window.location.href = "inbox.html";
}

function goAkun() {
    window.location.href = "akun.html";
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = "login.html";
}

function cekReservasi() {
    // Tidak digunakan lagi - langsung di halaman utama
}

function cariTiketUtama() {
    const kodeTiket = document.getElementById('cek-kode').value.trim().toUpperCase();
    const errorMsg = document.getElementById('cek-error');
    const successMsg = document.getElementById('cek-success');

    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    if (!kodeTiket) {
        errorMsg.textContent = 'Masukkan kode tiket';
        errorMsg.style.display = 'block';
        return;
    }

    const pesanan = JSON.parse(localStorage.getItem('pesanan')) || [];
    const tiket = pesanan.find(p => p.kode_pesanan === kodeTiket && p.status === 'paid');

    if (!tiket) {
        errorMsg.textContent = 'Kode tiket tidak ditemukan';
        errorMsg.style.display = 'block';
        return;
    }

    localStorage.setItem('tiketAktif', JSON.stringify(tiket));
    successMsg.textContent = 'Tiket ditemukan! Membuka...';
    successMsg.style.display = 'block';

    setTimeout(() => {
        window.location.href = "tiket-view.html";
    }, 500);
}

function toggleCekTiket() {
    const modal = document.getElementById('cek-tiket-modal');
    const backdrop = document.getElementById('modal-cek-tiket');
    
    if (modal.style.display === 'none') {
        modal.style.display = 'block';
        backdrop.style.display = 'block';
        document.getElementById('cek-kode').focus();
        document.body.style.overflow = 'hidden';
    } else {
        modal.style.display = 'none';
        backdrop.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('cek-kode').value = '';
        document.getElementById('cek-error').style.display = 'none';
        document.getElementById('cek-success').style.display = 'none';
    }
}

// Close modal ketika klik backdrop
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        const backdrop = document.getElementById('modal-cek-tiket');
        if (backdrop) {
            backdrop.addEventListener('click', toggleCekTiket);
        }
    });
} else {
    const backdrop = document.getElementById('modal-cek-tiket');
    if (backdrop) {
        backdrop.addEventListener('click', toggleCekTiket);
    }
}

function cariJadwal() {
    const asal = document.getElementById('asal').value;
    const tujuan = document.getElementById('tujuan').value;
    const tanggal = document.getElementById('tanggal').value;

    if (!asal || !tujuan || !tanggal) {
        alert("Silakan isi semua field: Asal, Tujuan, dan Tanggal!");
        return;
    }

    const currentSearch = {
        dari: asal,
        tujuan: tujuan,
        tanggal: tanggal
    };
    
    localStorage.setItem('currentSearch', JSON.stringify(currentSearch));
    window.location.href = "booking.html";
}

function pilihLokasi(lokasi) {
    alert("Anda memilih lokasi: " + lokasi + "\n\nPoint Shuttle " + lokasi + ":\nJalan Utama No. 123\nTelepon: 0812-3456-7890");
}

// Data jadwal bus (bisa diganti dengan API)
function getDaftarJadwal(dari, tujuan) {
    // Hitung durasi berdasarkan jarak
    const durasiPerRoute = {
        'Bandung-Jakarta': 3,
        'Jakarta-Bandung': 3,
        'Bandung-Surabaya': 6,
        'Surabaya-Bandung': 6,
        'Bandung-Yogyakarta': 5,
        'Yogyakarta-Bandung': 5,
        'Jakarta-Surabaya': 12,
        'Surabaya-Jakarta': 12,
        'Jakarta-Yogyakarta': 10,
        'Yogyakarta-Jakarta': 10,
        'Surabaya-Yogyakarta': 4,
        'Yogyakarta-Surabaya': 4,
        'Bandung-Malang': 7,
        'Malang-Bandung': 7,
        'Jakarta-Malang': 14,
        'Malang-Jakarta': 14
    };
    
    const routeKey = dari + '-' + tujuan;
    const durasi = durasiPerRoute[routeKey] || 4; // Default 4 jam jika rute tidak ada
    
    // Generate jam tiba berdasarkan jam berangkat + durasi
    function hitungJamTiba(jamBerangkat, durasi) {
        const [jam, menit] = jamBerangkat.split(':').map(Number);
        const totalMenit = jam * 60 + menit + (durasi * 60);
        const jamTiba = Math.floor(totalMenit / 60) % 24;
        const menitTiba = totalMenit % 60;
        return jamTiba.toString().padStart(2, '0') + ':' + menitTiba.toString().padStart(2, '0');
    }
    
    const jadwalData = [
        {
            jam_berangkat: "07:00",
            jam_tiba: hitungJamTiba("07:00", durasi),
            durasi: durasi + " jam",
            harga: 75000,
            kapasitas: 10,
            tersedia: 7
        },
        {
            jam_berangkat: "09:30",
            jam_tiba: hitungJamTiba("09:30", durasi),
            durasi: durasi + " jam",
            harga: 75000,
            kapasitas: 10,
            tersedia: 5
        },
        {
            jam_berangkat: "12:00",
            jam_tiba: hitungJamTiba("12:00", durasi),
            durasi: durasi + " jam",
            harga: 65000,
            kapasitas: 10,
            tersedia: 8
        },
        {
            jam_berangkat: "14:30",
            jam_tiba: hitungJamTiba("14:30", durasi),
            durasi: durasi + " jam",
            harga: 65000,
            kapasitas: 10,
            tersedia: 3
        },
        {
            jam_berangkat: "17:00",
            jam_tiba: hitungJamTiba("17:00", durasi),
            durasi: durasi + " jam",
            harga: 85000,
            kapasitas: 10,
            tersedia: 9
        }
    ];
    return jadwalData;
}

function tampilJadwal() {
    const searchData = JSON.parse(localStorage.getItem('currentSearch'));
    
    if (!searchData) {
        window.location.href = "home.html";
        return;
    }
    
    const { dari, tujuan, tanggal } = searchData;
    
    // Tampilkan informasi rute
    document.getElementById('rute-text').innerHTML = `<strong>${dari} → ${tujuan}</strong>`;
    document.getElementById('tanggal-text').innerHTML = `<strong>Tanggal:</strong> ${tanggal}`;
    
    const daftarJadwal = getDaftarJadwal(dari, tujuan);
    const jadwalContainer = document.getElementById('jadwal');
    jadwalContainer.innerHTML = '';
    
    daftarJadwal.forEach((jadwal, index) => {
        const statusKursi = jadwal.tersedia === 0 ? 
            '<span class="kapasitas kapasitas-penuh">❌ PENUH</span>' : 
            `<span class="kapasitas">✅ ${jadwal.tersedia} kursi</span>`;
        
        const card = document.createElement('div');
        card.className = 'jadwal-card';
        card.id = 'jadwal-' + index;
        card.onclick = () => pilihJadwal(index, jadwal);
        
        card.innerHTML = `
            <div class="rute-header">
                <span>${jadwal.jam_berangkat} - ${jadwal.jam_tiba}</span>
                <span class="durasi">${jadwal.durasi}</span>
            </div>
            
            <div class="jadwal-details">
                <div class="detail-item">
                    <span class="detail-label">Waktu Perjalanan</span>
                    <div class="jam-jadwal">
                        <span class="jam">${jadwal.jam_berangkat}</span>
                        <span class="panah">→</span>
                        <span class="jam">${jadwal.jam_tiba}</span>
                    </div>
                </div>
                <div class="detail-item harga-kapasitas">
                    <div>
                        <span class="detail-label">Harga per Orang</span>
                        <span class="detail-value harga">Rp ${jadwal.harga.toLocaleString('id-ID')}</span>
                    </div>
                    <div>
                        <span class="detail-label">Kursi Tersedia</span>
                        <div>${statusKursi}</div>
                    </div>
                </div>
            </div>
        `;
        
        jadwalContainer.appendChild(card);
    });
}

function pilihJadwal(index, jadwal) {
    // Hapus seleksi sebelumnya
    document.querySelectorAll('.jadwal-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // Tandai yang dipilih
    document.getElementById('jadwal-' + index).classList.add('selected');
    
    // Simpan jadwal yang dipilih
    const selectedJadwal = {
        ...jadwal,
        index: index
    };
    localStorage.setItem('selectedJadwal', JSON.stringify(selectedJadwal));
    
    // Tampilkan informasi jadwal yang dipilih
    document.getElementById('selected-info').style.display = 'block';
    document.getElementById('selected-time').textContent = `${jadwal.jam_berangkat} - ${jadwal.jam_tiba}`;
    document.getElementById('selected-price').textContent = jadwal.harga.toLocaleString('id-ID');
    document.getElementById('selected-seats').textContent = `${jadwal.tersedia} kursi`;
    
    // Enable tombol lanjut
    document.getElementById('btn-lanjut').disabled = false;
}

function lanjutKeKursi() {
    const selectedJadwal = JSON.parse(localStorage.getItem('selectedJadwal'));
    
    if (!selectedJadwal) {
        alert("Silakan pilih jadwal terlebih dahulu!");
        return;
    }
    
    if (selectedJadwal.tersedia === 0) {
        alert("Maaf, jadwal ini tidak memiliki kursi tersedia!");
        return;
    }
    
    // Simpan data ke localStorage untuk booking
    const searchData = JSON.parse(localStorage.getItem('currentSearch'));
    const bookingData = {
        dari: searchData.dari,
        tujuan: searchData.tujuan,
        tanggal: searchData.tanggal,
        jam_berangkat: selectedJadwal.jam_berangkat,
        jam_tiba: selectedJadwal.jam_tiba,
        harga: selectedJadwal.harga,
        tanggalPesan: new Date().toISOString().split('T')[0]
    };
    
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    window.location.href = "kursi.html";
}

// ============ FITUR PROMO CODE ============

// Data Promo Codes
const daftarPromo = [
  {
    kode: "WELCOME50",
    nama: "Welcome Discount",
    tipe: "persentase",
    nilai: 10,
    deskripsi: "Diskon 10% untuk pengguna baru",
    minimal_pembelian: 0,
    max_diskon: 100000,
    status: "aktif",
    berlaku_sampai: "2026-12-31"
  },
  {
    kode: "PROMO2024",
    nama: "Promo Tahun Baru",
    tipe: "persentase",
    nilai: 15,
    deskripsi: "Diskon 15% untuk semua tiket",
    minimal_pembelian: 0,
    max_diskon: 150000,
    status: "aktif",
    berlaku_sampai: "2026-12-31"
  },
  {
    kode: "DISCOUNT25K",
    nama: "Potongan Rp 25.000",
    tipe: "fixed",
    nilai: 25000,
    deskripsi: "Potongan harga langsung Rp 25.000",
    minimal_pembelian: 50000,
    max_diskon: 25000,
    status: "aktif",
    berlaku_sampai: "2026-12-31"
  },
  {
    kode: "BANDUNG20",
    nama: "Spesial Bandung",
    tipe: "persentase",
    nilai: 20,
    deskripsi: "Diskon 20% untuk rute dari/ke Bandung",
    minimal_pembelian: 0,
    max_diskon: 200000,
    status: "aktif",
    berlaku_sampai: "2026-12-31"
  },
  {
    kode: "JAKARTA30",
    nama: "Spesial Jakarta",
    tipe: "persentase",
    nilai: 12,
    deskripsi: "Diskon 12% untuk rute dari/ke Jakarta",
    minimal_pembelian: 0,
    max_diskon: 120000,
    status: "aktif",
    berlaku_sampai: "2026-12-31"
  },
  {
    kode: "RUTIN100K",
    nama: "Program Loyalitas",
    tipe: "fixed",
    nilai: 50000,
    deskripsi: "Potongan Rp 50.000 untuk pembeli setia",
    minimal_pembelian: 100000,
    max_diskon: 50000,
    status: "aktif",
    berlaku_sampai: "2026-12-31"
  }
];

function validasiPromo() {
  const kodePromo = document.getElementById('promo-code').value.toUpperCase().trim();
  
  if (!kodePromo) {
    tampilPesanPromo("Masukkan kode promo terlebih dahulu", false);
    return;
  }

  // Cari promo yang cocok
  const promo = daftarPromo.find(p => p.kode === kodePromo && p.status === 'aktif');
  
  if (!promo) {
    tampilPesanPromo("Kode promo tidak valid atau sudah kadaluarsa", false);
    document.getElementById('promo-code').value = '';
    return;
  }

  // Validasi minimal pembelian
  const hargaAsli = parseInt(document.getElementById('summary-harga').textContent.replace(/\D/g, ''));
  
  if (hargaAsli < promo.minimal_pembelian) {
    tampilPesanPromo(
      `Minimalkan pembelian Rp ${promo.minimal_pembelian.toLocaleString('id-ID')}. Harga Anda: Rp ${hargaAsli.toLocaleString('id-ID')}`,
      false
    );
    document.getElementById('promo-code').value = '';
    return;
  }

  // Hitung diskon
  let diskon = 0;
  if (promo.tipe === 'persentase') {
    diskon = Math.floor((hargaAsli * promo.nilai) / 100);
  } else {
    diskon = promo.nilai;
  }

  // Batasi diskon maksimal
  diskon = Math.min(diskon, promo.max_diskon);

  // Simpan promo ke localStorage
  const promoData = {
    kode: promo.kode,
    nama: promo.nama,
    diskon: diskon,
    tipe: promo.tipe,
    nilai: promo.nilai,
    minimal_pembelian: promo.minimal_pembelian,
    max_diskon: promo.max_diskon
  };
  localStorage.setItem('selectedPromo', JSON.stringify(promoData));

  // Tampilkan success message
  const pesan = promo.tipe === 'persentase' 
    ? `✅ ${promo.nama} (${promo.nilai}%) - Hemat Rp ${diskon.toLocaleString('id-ID')}`
    : `✅ ${promo.nama} - Hemat Rp ${diskon.toLocaleString('id-ID')}`;
  
  tampilPesanPromo(pesan, true);

  // Update total pembayaran
  updateTotalDenganDiskon();

  // Tampilkan detail diskon
  const promoDetail = document.getElementById('promo-detail');
  if (promoDetail) {
    document.getElementById('promo-min').textContent = 
      `Minimal Pembelian: Rp ${promo.minimal_pembelian.toLocaleString('id-ID')}`;
    document.getElementById('promo-potongan').textContent = 
      `Potongan: Rp ${diskon.toLocaleString('id-ID')}`;
    promoDetail.style.display = 'block';
  }

function tampilPesanPromo(pesan, isSuccess) {
  const promoInfo = document.getElementById('promo-info');
  const promoMessage = document.getElementById('promo-message');
  
  promoMessage.textContent = pesan;
  promoMessage.style.color = isSuccess ? '#28a745' : '#dc3545';
  promoInfo.style.display = 'block';

  // Auto-hide error message setelah 3 detik
  if (!isSuccess) {
    setTimeout(() => {
      promoInfo.style.display = 'none';
    }, 3000);
  }
}

function updateTotalDenganDiskon() {
  const hargaAsli = parseInt(document.getElementById('summary-harga').textContent.replace(/\D/g, ''));
  const selectedPromo = JSON.parse(localStorage.getItem('selectedPromo'));
  
  let diskon = 0;
  if (selectedPromo) {
    diskon = selectedPromo.diskon;
  }

  const totalSelesai = hargaAsli - diskon;

  // Tampilkan diskon jika ada
  if (diskon > 0) {
    document.getElementById('diskon-row').style.display = 'flex';
    document.getElementById('summary-diskon').textContent = `- Rp ${diskon.toLocaleString('id-ID')}`;
  }

  // Update total
  document.getElementById('summary-total').textContent = `Rp ${totalSelesai.toLocaleString('id-ID')}`;
  document.getElementById('qris-amount').textContent = totalSelesai.toLocaleString('id-ID');
}

// ===== tambahan fitur otomatis =====

// tingkatkan counter pemesanan berturut-turut untuk user aktif
function incrementConsecutiveBookings() {
  const user = localStorage.getItem('currentUser');
  if (!user) return;
  let cnt = parseInt(localStorage.getItem(user + '_consecutive') || '0');
  cnt += 1;
  localStorage.setItem(user + '_consecutive', cnt.toString());
}

// cek dan terapkan promo otomatis (loyalitas / kamis tengahari)
function applyAutomaticPromos() {
  const user = localStorage.getItem('currentUser');
  const hargaAsli = parseInt(document.getElementById('summary-harga').textContent.replace(/\D/g, ''));
  if (!user || !hargaAsli) return;

  let totalAutoDiscount = 0;
  let messages = [];

  // loyalitas: setiap 3 booking berturut-turut
  let cnt = parseInt(localStorage.getItem(user + '_consecutive') || '0');
  if (cnt >= 3) {
    const d = Math.floor(hargaAsli * 0.2);
    totalAutoDiscount += d;
    messages.push('Diskon loyalitas 20%');
    // reset counter setelah dipakai
    localStorage.setItem(user + '_consecutive', '0');
  }

  // diskon Kamis jam 12
  const now = new Date();
  if (now.getDay() === 4 && now.getHours() === 12) {
    const d = Math.floor(hargaAsli * 0.1);
    totalAutoDiscount += d;
    messages.push('Diskon Kamis 10%');
  }

  if (totalAutoDiscount > 0) {
    // buat objek promo sementara supaya updateTotalDenganDiskon bekerja
    const promoData = {
      kode: 'AUTOPROMO',
      nama: 'Promo Otomatis',
      diskon: totalAutoDiscount,
      tipe: 'persentase',
      nilai: '-',
      minimal_pembelian: 0,
      max_diskon: totalAutoDiscount
    };
    localStorage.setItem('selectedPromo', JSON.stringify(promoData));

    // tampilkan info di section promo
    const promoInfo = document.getElementById('promo-info');
    const promoMessage = document.getElementById('promo-message');
    promoMessage.textContent = `✅ ${messages.join(', ')} - Hemat Rp ${totalAutoDiscount.toLocaleString('id-ID')}`;
    promoInfo.style.display = 'block';
    promoInfo.style.color = '#28a745';

    // update total dan detail
    updateTotalDenganDiskon();
        }
    }
}
