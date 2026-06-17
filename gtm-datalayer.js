(function () {
  var locationById = {
    'btn-agendar-hero':      'hero',
    'btn-agendar-confianca': 'results',
    'btn-agendar-faq':       'faq',
    'link-whatsapp-contato': 'contact',
    'btn-agendar-contato':   'contact',
    'btn-whatsapp-float':    'floating'
  };

  var locationBySection = {
    'hero':        'hero',
    'numeros':     'numbers',
    'sobre':       'about',
    'servicos':    'services',
    'depoimentos': 'results',
    'faq':         'faq',
    'contato':     'contact'
  };

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a[href*="wa.me"]');
    if (!el) return;

    var location = locationById[el.id];

    if (!location) {
      var section = el.closest('section');
      if (section && section.id) {
        location = locationBySection[section.id] || section.id;
      } else if (el.closest('footer')) {
        location = 'footer';
      } else {
        location = 'unknown';
      }
    }

    var text = (el.textContent || '').trim();
    if (!text) text = el.getAttribute('aria-label') || '';

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'whatsapp_click',
      button_location: location,
      button_text: text
    });
  });
})();
