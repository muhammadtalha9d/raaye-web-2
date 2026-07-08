// Raaye marketing site - shared behavior (hover states, nav dropdowns, FAQ accordions).
(function () {
  function initHoverEffects(root) {
    (root || document).querySelectorAll('[data-hover]').forEach(function (el) {
      if (el.__hoverBound) return;
      el.__hoverBound = true;
      var base = el.getAttribute('style') || '';
      var hover = el.getAttribute('data-hover');
      el.addEventListener('mouseenter', function () {
        el.setAttribute('style', base + ';' + hover);
      });
      el.addEventListener('mouseleave', function () {
        el.setAttribute('style', base);
      });
    });
  }

  function initNavDropdowns() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var dropdowns = header.querySelectorAll('[data-dropdown]');

    function closeAll(except) {
      dropdowns.forEach(function (d) {
        if (d === except) return;
        var panel = d.querySelector('[data-panel]');
        if (panel) panel.style.display = 'none';
      });
    }

    dropdowns.forEach(function (d) {
      var trigger = d.querySelector('[data-trigger]');
      var panel = d.querySelector('[data-panel]');
      if (!trigger || !panel) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = panel.style.display && panel.style.display !== 'none';
        closeAll();
        panel.style.display = isOpen ? 'none' : (panel.getAttribute('data-display') || 'block');
      });
    });

    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) closeAll();
    });
  }

  // Single-open accordion. Marks the first [data-faq-item] within each
  // [data-accordion] group open by default, matching the prototype's `open: 0` state.
  function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach(function (group) {
      var items = group.querySelectorAll('[data-faq-item]');
      items.forEach(function (item, i) {
        var btn = item.querySelector('[data-faq-toggle]');
        var panel = item.querySelector('[data-faq-panel]');
        var icon = item.querySelector('[data-faq-icon]');
        if (!btn || !panel) return;

        function setOpen(open) {
          panel.style.display = open ? 'block' : 'none';
          if (icon) icon.textContent = open ? 'remove' : 'add';
        }
        setOpen(i === 0);

        btn.addEventListener('click', function () {
          var isOpen = panel.style.display === 'block';
          items.forEach(function (other) {
            var otherPanel = other.querySelector('[data-faq-panel]');
            var otherIcon = other.querySelector('[data-faq-icon]');
            if (otherPanel) otherPanel.style.display = 'none';
            if (otherIcon) otherIcon.textContent = 'add';
          });
          setOpen(!isOpen);
        });
      });
    });
  }

  function getStoreRedirectUrl() {
    var ua = navigator.userAgent || '';
    var platform = navigator.platform || '';
    var isAppleDevice = /(iPhone|iPad|iPod)/i.test(ua) || (/Mac/i.test(platform) && navigator.maxTouchPoints > 1);
    var isAndroidDevice = /Android/i.test(ua);

    if (isAppleDevice) {
      return 'https://apps.apple.com/pk/app/raaye-ai-post-generator/id6745610700';
    }

    if (isAndroidDevice) {
      return 'https://play.google.com/store/apps/details?id=socials.productivity.ai&hl=en';
    }

    return 'https://play.google.com/store/apps/details?id=socials.productivity.ai&hl=en';
  }

  function isDownloadCta(link) {
    if (!link) return false;

    var text = (link.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    var href = link.getAttribute('href') || '';

    if (link.getAttribute('data-download-link') === 'true') return true;
    if (href === '/download.html') return true;

    return /(create your first post|start for free|start your 7-day free trial|start 7-day free trial|google play|get it on|download)/i.test(text);
  }

  function initDownloadLinks(root) {
    (root || document).querySelectorAll('a').forEach(function (link) {
      if (!isDownloadCta(link)) return;
      if (link.__downloadBound) return;

      link.__downloadBound = true;
      link.setAttribute('href', '/download.html');
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.addEventListener('click', function (event) {
        event.preventDefault();
        window.open(getStoreRedirectUrl(), '_blank', 'noopener,noreferrer');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHoverEffects();
    initNavDropdowns();
    initAccordions();
    initDownloadLinks();
  });

  window.RaayeSite = { initHoverEffects: initHoverEffects };
})();
