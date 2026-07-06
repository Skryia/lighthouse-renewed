/* SLIC — Interactive behaviours (jQuery) */
$(function () {

  // Preloader
  $(window).on('load', function () {
    setTimeout(function () { $('#preloader').addClass('hide'); }, 250);
  });
  // Fallback (in case load fires before handler bound)
  setTimeout(function () { $('#preloader').addClass('hide'); }, 1500);

  // Year in footer
  $('#year').text(new Date().getFullYear());

  // Sticky nav + active section highlighting
  var $nav = $('#nav');
  var $sections = $('main section[id]');
  var $navLinks = $('#navLinks a');

  function onScroll() {
    var top = $(window).scrollTop();
    $nav.toggleClass('scrolled', top > 40);

    var current = '';
    $sections.each(function () {
      var offset = $(this).offset().top - 120;
      if (top >= offset) current = $(this).attr('id');
    });
    if (current) {
      $navLinks.removeClass('active').filter('[href="#' + current + '"]').addClass('active');
    }
  }
  $(window).on('scroll', onScroll);
  onScroll();

  // Mobile menu
  var $toggle = $('#navToggle');
  var $links = $('#navLinks');
  $toggle.on('click', function () {
    var open = $links.toggleClass('open').hasClass('open');
    $toggle.toggleClass('open', open).attr('aria-expanded', open);
  });
  $navLinks.on('click', function () {
    if ($links.hasClass('open')) {
      $links.removeClass('open');
      $toggle.removeClass('open').attr('aria-expanded', false);
    }
  });

  // Reveal on scroll (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $('.reveal').each(function () { io.observe(this); });
  } else {
    $('.reveal').addClass('visible');
  }

  // Animated counters
  var countersDone = false;
  function runCounters() {
    if (countersDone) return;
    var heroTop = $('.hero').offset().top;
    if ($(window).scrollTop() + $(window).height() < heroTop) return;
    countersDone = true;
    $('[data-count]').each(function () {
      var $el = $(this);
      var target = parseInt($el.attr('data-count'), 10);
      var start = 0;
      var duration = 1600;
      var startTime = null;
      function tick(ts) {
        if (!startTime) startTime = ts;
        var p = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        $el.text(Math.round(start + (target - start) * eased) + (target >= 15 ? '+' : ''));
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  $(window).on('scroll load', runCounters);
  setTimeout(runCounters, 800);

  // Gallery lightbox
  var $lb = $('#lightbox');
  var $lbImg = $('#lbImg');
  var $items = $('#galleryGrid .gallery-item');
  var currentIdx = 0;

  function openLB(idx) {
    currentIdx = idx;
    $lbImg.attr('src', $items.eq(idx).attr('href'));
    $lb.addClass('open').attr('aria-hidden', 'false');
    $('body').css('overflow', 'hidden');
  }
  function closeLB() {
    $lb.removeClass('open').attr('aria-hidden', 'true');
    $('body').css('overflow', '');
  }
  function nav(dir) {
    currentIdx = (currentIdx + dir + $items.length) % $items.length;
    $lbImg.attr('src', $items.eq(currentIdx).attr('href'));
  }

  $items.on('click', function (e) {
    e.preventDefault();
    openLB($items.index(this));
  });
  $('#lbClose').on('click', closeLB);
  $('#lbPrev').on('click', function () { nav(-1); });
  $('#lbNext').on('click', function () { nav(1); });
  $lb.on('click', function (e) { if (e.target === this) closeLB(); });
  $(document).on('keydown', function (e) {
    if (!$lb.hasClass('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  });

  // Subtle parallax on hero background
  var $heroBg = $('.hero-bg');
  $(window).on('scroll', function () {
    var y = $(window).scrollTop();
    if (y < 700) $heroBg.css('transform', 'scale(1.08) translateY(' + y * 0.15 + 'px)');
  });
});
