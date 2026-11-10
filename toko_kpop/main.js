// main.js - efek jQuery & navigasi tab
$(document).ready(function () {

  // Efek 1: FADE - judul hero muncul bertahap
  $("#hero-tag").fadeIn(600, function () {
    $("#hero-title").fadeIn(900, function () {
      $("#hero-sub").fadeIn(700);
    });
  });

  // Efek 2: SLIDE - tutup promo bar & toggle FAQ
  $("#close-promo").click(function () {
    $("#promo-bar").slideUp(400);
  });
  $("#faq-toggle").click(function () {
    $("#faq-body").slideToggle(400);
  });

  // Efek 3: ANIMATE - kartu produk naik saat di-hover
  $(".card").hover(
    function () { $(this).stop().animate({ top: "-12px" }, 200); },
    function () { $(this).stop().animate({ top: "0px" }, 200); }
  );

  // Navigasi TAB
  $(".tab-menu li").click(function () {
    var target = "#" + $(this).data("tab");
    $(".tab-menu li").removeClass("active");
    $(this).addClass("active");
    $(".tab-content").hide();
    $(target).fadeIn(300);
  });

  // Smooth scroll untuk menu navigasi
  $("nav a, #hero-btn").click(function (e) {
    var hash = this.hash;
    if (hash) {
      e.preventDefault();
      $("html, body").animate({ scrollTop: $(hash).offset().top - 60 }, 600);
    }
  });
});