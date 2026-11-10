// script.js - validasi form dengan jQuery Validation Plugin
$(document).ready(function () {

  // Aturan khusus: nomor HP Indonesia
  $.validator.addMethod("hpIndonesia", function (value, element) {
    return this.optional(element) || /^(\+62|62|0)8[1-9][0-9]{6,10}$/.test(value);
  }, "Masukkan nomor HP Indonesia yang valid");

  $("#form-pesan").validate({
    rules: {
      nama:      { required: true, minlength: 3 },
      email:     { required: true, email: true },
      telepon:   { required: true, hpIndonesia: true },
      produk:    { required: true },
      jumlah:    { required: true, number: true, min: 1, max: 50 },
      alamat:    { required: true, minlength: 10 },
      password:  { required: true, minlength: 6 },
      password2: { required: true, equalTo: "#password" },
      setuju:    { required: true }
    },
    messages: {
      nama:      { required: "Nama wajib diisi", minlength: "Minimal 3 karakter" },
      email:     { required: "Email wajib diisi", email: "Format email tidak valid" },
      telepon:   { required: "No. HP wajib diisi" },
      produk:    { required: "Pilih salah satu produk" },
      jumlah:    { required: "Jumlah wajib diisi", number: "Harus berupa angka", min: "Minimal 1 kg", max: "Maksimal 50 kg" },
      alamat:    { required: "Alamat wajib diisi", minlength: "Alamat minimal 10 karakter" },
      password:  { required: "Password wajib diisi", minlength: "Minimal 6 karakter" },
      password2: { required: "Ulangi password Anda", equalTo: "Password tidak sama" },
      setuju:    "Anda harus menyetujui ketentuan"
    },
    errorPlacement: function (error, element) {
      if (element.attr("type") === "checkbox") {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    },
    submitHandler: function (form) {
      $("#sukses").slideDown(400);
      form.reset();
    }
  });
});