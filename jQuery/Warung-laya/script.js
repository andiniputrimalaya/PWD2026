/* ============================================================
   GLOW SKINCARE - JQUERY SCRIPT
   Praktikum Pemrograman Web Dasar
   ============================================================ */
$(document).ready(function () {

  /* 1. DATA PRODUK */
  const produkData = [
    { id: 1, nama: 'Gentle Face Wash', harga: 45000, kategori: 'pembersih', icon: '🧼', desc: 'Pembersih wajah lembut harian', badge: 'Best Seller', badgeType: 'hot' },
    { id: 2, nama: 'Micellar Water', harga: 55000, kategori: 'pembersih', icon: '💧', desc: 'Angkat makeup tanpa bilas', badge: 'Favorit', badgeType: '' },
    { id: 3, nama: 'Cleansing Balm', harga: 85000, kategori: 'pembersih', icon: '🫧', desc: 'Balm pelarut makeup waterproof', badge: '', badgeType: '' },
    { id: 4, nama: 'Face Toner', harga: 60000, kategori: 'pembersih', icon: '🌿', desc: 'Toner penyegar dan pelembap', badge: 'Baru', badgeType: '' },
    { id: 5, nama: 'Vitamin C Serum', harga: 120000, kategori: 'serum', icon: '🍊', desc: 'Cerahkan wajah kusam', badge: 'Best Seller', badgeType: 'hot' },
    { id: 6, nama: 'Niacinamide Serum', harga: 95000, kategori: 'serum', icon: '✨', desc: 'Samarkan pori dan minyak', badge: 'Favorit', badgeType: '' },
    { id: 7, nama: 'Hyaluronic Serum', harga: 110000, kategori: 'serum', icon: '💦', desc: 'Hidrasi mendalam sepanjang hari', badge: '', badgeType: '' },
    { id: 8, nama: 'Retinol Serum', harga: 135000, kategori: 'serum', icon: '🌙', desc: 'Perawatan anti-aging malam hari', badge: 'Baru', badgeType: '' },
    { id: 9, nama: 'Moisturizer Gel', harga: 75000, kategori: 'pelindung', icon: '🧴', desc: 'Pelembap ringan non-lengket', badge: '', badgeType: '' },
    { id: 10, nama: 'Night Cream', harga: 98000, kategori: 'pelindung', icon: '🌸', desc: 'Krim malam nutrisi kulit', badge: '', badgeType: '' },
    { id: 11, nama: 'Sunscreen SPF 50', harga: 80000, kategori: 'pelindung', icon: '☀️', desc: 'Perlindungan UVA/UVB maksimal', badge: 'Best Seller', badgeType: 'hot' },
    { id: 12, nama: 'Lip Balm SPF 15', harga: 35000, kategori: 'pelindung', icon: '💄', desc: 'Lembapkan dan lindungi bibir', badge: 'Baru', badgeType: '' }
  ];

  /* 2. STATE */
  let cart = [];
  let currentFilter = 'all';
  let searchKeyword = '';
  const BATAS_DISKON = 100000;
  const PERSEN_DISKON = 0.1;

  const rp = n => 'Rp ' + n.toLocaleString('id-ID');

  /* Hitung subtotal, diskon, total (dipakai UI & checkout) */
  function hitungTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
    const qty = cart.reduce((sum, item) => sum + item.qty, 0);
    const diskon = subtotal > BATAS_DISKON ? subtotal * PERSEN_DISKON : 0;   // Latihan 1
    return { subtotal, qty, diskon, total: subtotal - diskon };
  }

  /* 3. RENDER PRODUK */
  function renderProduk() {
    const $grid = $('#produkGrid');
    $grid.empty();
    const kw = searchKeyword.toLowerCase();
    const filtered = produkData.filter(function (p) {
      const matchKategori = currentFilter === 'all' || p.kategori === currentFilter;
      const matchSearch = p.nama.toLowerCase().includes(kw) || p.desc.toLowerCase().includes(kw);
      return matchKategori && matchSearch;
    });

    if (filtered.length === 0) {
      $grid.html(`
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#bbb;">
          <i class="fas fa-search" style="font-size:3.5rem;color:#ffe4ec;margin-bottom:20px;display:block;"></i>
          <h3 style="color:#999;font-weight:600;margin-bottom:8px;">Produk tidak ditemukan</h3>
          <p style="font-size:.9rem;">Coba kata kunci atau kategori lain</p>
        </div>`);
      return;
    }

    filtered.forEach(function (p) {
      const badgeHtml = p.badge ? `<div class="produk-badge ${p.badgeType}">${p.badge}</div>` : '';
      $grid.append(`
        <div class="produk-card" data-id="${p.id}" data-kategori="${p.kategori}">
          ${badgeHtml}
          <div class="produk-img">${p.icon}</div>
          <div class="produk-info">
            <h3>${p.nama}</h3>
            <p class="desc">${p.desc}</p>
            <div class="produk-footer">
              <div class="produk-price">${rp(p.harga)}<small>per botol</small></div>
              <button class="btn-add-cart" data-id="${p.id}" title="Tambah ke keranjang">
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>`);
    });
  }

  /* 4. FILTER (Navbar) */
  $('.nav-link').click(function () {
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    currentFilter = $(this).data('filter');
    $('.filter-btn').removeClass('active');
    $(`.filter-btn[data-cat="${currentFilter}"]`).addClass('active');
    renderProduk();
  });

  /* 5. FILTER (Tombol) */
  $('.filter-btn').click(function () {
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');
    currentFilter = $(this).data('cat');
    $('.nav-link').removeClass('active');
    $(`.nav-link[data-filter="${currentFilter}"]`).addClass('active');
    renderProduk();
  });

  /* 6. PENCARIAN REAL-TIME */
  $('#searchProduk').on('input', function () {
    searchKeyword = $(this).val();
    renderProduk();
  });

  /* 7. TAMBAH KE KERANJANG */
  $(document).on('click', '.btn-add-cart', function (e) {
    e.stopPropagation();
    const id = $(this).data('id');
    const produk = produkData.find(p => p.id === id);
    if (!produk) return;

    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ id: produk.id, nama: produk.nama, harga: produk.harga, icon: produk.icon, qty: 1 });
    }

    updateCartUI();
    showToast(`${produk.icon} ${produk.nama} ditambahkan!`);

    $(this).css('transform', 'rotate(90deg) scale(1.3)');
    setTimeout(() => $(this).css('transform', ''), 300);
    $('#cartBadge').css('transform', 'scale(1.4)');
    setTimeout(() => $('#cartBadge').css('transform', 'scale(1)'), 200);
  });

  /* 8. UPDATE UI KERANJANG (+ Latihan 1: Diskon 10%) */
  function updateCartUI() {
    const $cartItems = $('#cartItems');
    const h = hitungTotal();

    $('#cartBadge').text(h.qty);

    if (h.diskon > 0) {
      $('#cartTotal').html(`
        <small style="text-decoration:line-through;color:#999;">${rp(h.subtotal)}</small>
        ${rp(h.total)}
        <small style="color:#2ecc71;font-weight:600;">Diskon 10% -${rp(h.diskon)}</small>`);
    } else {
      $('#cartTotal').text(rp(h.total));
    }

    if (cart.length === 0) {
      $cartItems.html(`
        <div class="cart-empty">
          <i class="fas fa-shopping-cart"></i>
          <p>Keranjang masih kosong</p>
          <small>Yuk pilih skincare dulu!</small>
        </div>`);
      return;
    }

    let html = '';
    cart.forEach(function (item) {
      html += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-icon">${item.icon}</div>
          <div class="cart-item-info">
            <h5>${item.nama}</h5>
            <div class="price">${rp(item.harga * item.qty)}</div>
            <div class="qty-control">
              <button class="qty-btn" data-action="minus" data-id="${item.id}">−</button>
              <span class="qty-value">${item.qty}</span>
              <button class="qty-btn" data-action="plus" data-id="${item.id}">+</button>
            </div>
          </div>
          <button class="cart-item-remove" data-id="${item.id}" title="Hapus">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
    });
    $cartItems.html(html);
  }

  /* 9. QTY PLUS/MINUS */
  $(document).on('click', '.qty-btn', function () {
    const action = $(this).data('action');
    const id = $(this).data('id');
    const item = cart.find(i => i.id === id);
    if (!item) return;
    if (action === 'plus') {
      item.qty += 1;
    } else {
      item.qty -= 1;
      if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
  });

  /* 10. HAPUS ITEM */
  $(document).on('click', '.cart-item-remove', function () {
    const id = $(this).data('id');
    const item = cart.find(i => i.id === id);
    if (item) showToast(`${item.icon} ${item.nama} dihapus dari keranjang`);
    cart = cart.filter(i => i.id !== id);
    updateCartUI();
  });

  /* 11. BUKA/TUTUP KERANJANG */
  $('#cartBtn').click(function () {
    $('#cartSidebar').addClass('open');
    $('#cartOverlay').fadeIn(300);
  });
  $('#cartClose, #cartOverlay').click(function () {
    $('#cartSidebar').removeClass('open');
    $('#cartOverlay').fadeOut(300);
  });

  /* 12. LATIHAN 2: SIMPAN RIWAYAT KE localStorage */
  function simpanRiwayat(total, qty, pembeli) {
    const riwayat = JSON.parse(localStorage.getItem('riwayat')) || [];
    riwayat.push({ tanggal: new Date().toISOString(), total, qty, pembeli });
    localStorage.setItem('riwayat', JSON.stringify(riwayat));
  }

  /* 13. LATIHAN 3: MODAL FORM + VALIDASI */
  function tutupModal() { $('#modalOverlay').fadeOut(250); }

  $('#btnCheckout').click(function () {
    if (cart.length === 0) {
      showToast('❌ Keranjang masih kosong!');
      return;
    }
    $('#formPembeli')[0].reset();
    $('.err').hide();
    $('.form-group').removeClass('invalid');
    $('#modalOverlay').css('display', 'flex').hide().fadeIn(250);
  });

  $('#modalClose').click(tutupModal);
  $('#modalOverlay').click(function (e) { if (e.target === this) tutupModal(); });

  function cek($input, $err, valid) {
    $err.toggle(!valid);
    $input.closest('.form-group').toggleClass('invalid', !valid);
    return valid;
  }
  function validNama()   { return cek($('#nama'),   $('#errNama'),   $('#nama').val().trim().length >= 3); }
  function validAlamat() { return cek($('#alamat'), $('#errAlamat'), $('#alamat').val().trim().length >= 10); }
  function validHp()     { return cek($('#hp'),     $('#errHp'),     /^08\d{8,11}$/.test($('#hp').val().trim())); }

  // Validasi real-time
  $('#nama').on('input', validNama);
  $('#alamat').on('input', validAlamat);
  $('#hp').on('input', validHp);

  $('#formPembeli').submit(function (e) {
    e.preventDefault();
    const ok = [validNama(), validAlamat(), validHp()].every(Boolean);
    if (!ok) return;

    const h = hitungTotal();
    const pembeli = { nama: $('#nama').val().trim(), alamat: $('#alamat').val().trim(), hp: $('#hp').val().trim() };

    const $btn = $('#btnKonfirmasi');
    $btn.html('<i class="fas fa-spinner fa-spin"></i> Memproses...').prop('disabled', true);

    setTimeout(function () {
      $btn.html('<i class="fas fa-check-circle"></i> Konfirmasi Pesanan').prop('disabled', false);

      simpanRiwayat(h.total, h.qty, pembeli);   // Latihan 2

      cart = [];
      updateCartUI();
      tutupModal();
      $('#cartSidebar').removeClass('open');
      $('#cartOverlay').fadeOut(300);

      showToast(`✅ Terima kasih ${pembeli.nama}! ${h.qty} item · ${rp(h.total)}`);
    }, 1500);
  });

  /* 14. TOAST */
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    $('#toastMsg').text(message);
    $('#toast').addClass('show');
    toastTimer = setTimeout(() => $('#toast').removeClass('show'), 2500);
  }

  /* 15. HAMBURGER (Mobile) */
  $('#hamburger').click(function () {
    $('#navMenu').toggleClass('show');
    const icon = $(this).find('i');
    if ($('#navMenu').hasClass('show')) icon.removeClass('fa-bars').addClass('fa-times');
    else icon.removeClass('fa-times').addClass('fa-bars');
  });
  $('.nav-link').click(function () {
    if (window.innerWidth <= 768) {
      $('#navMenu').removeClass('show');
      $('#hamburger').find('i').removeClass('fa-times').addClass('fa-bars');
    }
  });

  /* 16. INISIALISASI */
  renderProduk();
  updateCartUI();
  console.log('%c🧴 Glow Skincare - Siap!', 'color:#ff6b9d;font-size:16px;font-weight:bold;');
  console.log('%cTotal produk: ' + produkData.length, 'color:#2d1b3d;font-size:12px;');
});