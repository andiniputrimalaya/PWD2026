// Matikan animasi jika pengguna meminta reduced motion (aksesibilitas)
jQuery.fx.off = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

$(function () {

    // ----- 1. NAVIGASI TAB (Event: click, Efek: fadeIn) -----
    $('.tab-panel').hide().first().show();

    $('.tab').on('click', function () {
        const target = $(this).data('target');
        $('.tab').removeClass('active');
        $(this).addClass('active');
        $('.tab-panel').hide();
        $(target).fadeIn(300);
    });

    // ----- 2. KARTU MELAYANG (Event: mouseenter/mouseleave, Efek: animate) -----
    $('.card')
        .on('mouseenter', function () { $(this).stop().animate({ top: '-6px' }, 150); })
        .on('mouseleave', function () { $(this).stop().animate({ top: '0px' }, 150); });

    // ----- 3. FAQ ACCORDION (Event: click, Efek: slideDown/slideUp) -----
    $('.faq-q').on('click', function () {
        const $jawaban = $(this).next('.faq-a');
        const $tanda = $(this).find('span');
        $jawaban.stop(true, true).slideToggle(250);
        $tanda.text($tanda.text() === '+' ? '−' : '+');
    });

    // ----- 4. BACK TO TOP (Event: scroll, Efek: fadeIn/fadeOut & animate) -----
    const $btnTop = $('#backToTop');
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 300) {
            $btnTop.fadeIn(200);
        } else {
            $btnTop.fadeOut(200);
        }
    });
    $btnTop.on('click', function () {
        $('html, body').animate({ scrollTop: 0 }, 500);
    });

    // ----- 5. SMOOTH SCROLL NAVBAR (Efek: animate scrollTop) -----
    $('a[href^="#"]').on('click', function (e) {
        const href = $(this).attr('href');
        if (href.length < 2) return;
        const $tujuan = $(href);
        if ($tujuan.length === 0) return;
        e.preventDefault();
        $('html, body').animate({ scrollTop: $tujuan.offset().top - 60 }, 500);
    });

    // ----- 6. TOAST (Efek: fadeIn/delay/fadeOut) -----
    function tampilkanToast(pesan, tipe) {
        $('#toast')
            .stop(true, true)
            .removeClass('success error')
            .addClass(tipe)
            .text(pesan)
            .fadeIn(250)
            .delay(2500)
            .fadeOut(400);
    }

    // ----- 7. VALIDASI FORM (jQuery Validation Plugin + Custom Method) -----
    $.validator.addMethod('nomorHp', function (value, element) {
        return this.optional(element) || /^[0-9]{10,12}$/.test(value);
    }, 'Nomor HP harus 10-12 digit angka');

    const validator = $('#formDaftar').validate({
        rules: {
            nama: { required: true, minlength: 3 },
            email: { required: true, email: true },
            hp: { required: true, nomorHp: true },
            usia: { required: true, digits: true, min: 12 },
            tiket: { required: true },
            jumlah: { required: true, digits: true, min: 1, max: 5 },
            setuju: { required: true }
        },
        messages: {
            nama: { required: 'Nama wajib diisi', minlength: 'Nama minimal 3 karakter' },
            email: { required: 'Email wajib diisi', email: 'Format email tidak valid' },
            hp: { required: 'Nomor HP wajib diisi' },
            usia: { required: 'Usia wajib diisi', digits: 'Usia harus angka', min: 'Usia minimal 12 tahun' },
            tiket: { required: 'Pilih jenis tiket terlebih dahulu' },
            jumlah: { required: 'Jumlah tiket wajib diisi', digits: 'Jumlah harus angka', min: 'Minimal 1 tiket', max: 'Maksimal 5 tiket' },
            setuju: { required: 'Anda harus menyetujui syarat & ketentuan' }
        },
        errorElement: 'div',
        errorClass: 'pesan-error',
        errorPlacement: function (error, element) {
            if (element.attr('type') === 'checkbox') {
                error.insertAfter(element.closest('.form-check'));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (el) {
            $(el).addClass('is-error').removeClass('is-valid');
        },
        unhighlight: function (el) {
            $(el).removeClass('is-error').addClass('is-valid');
        },
        submitHandler: function (form) {
            const nama = $('#nama').val().trim();
            tampilkanToast('Terima kasih, ' + nama + '! Pendaftaran berhasil.', 'success');
            $('#sukses').stop(true, true).slideDown(300).delay(3000).slideUp(300);
            form.reset();
            validator.resetForm();
            $('#formDaftar input, #formDaftar select').removeClass('is-error is-valid');
        }
    });
});