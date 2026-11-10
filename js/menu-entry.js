/* Entry flags only: no credentials, authorization or persistent-state changes. */
(() => {
  const params = new URLSearchParams(location.search);
  // Printed links from the previous standalone keep working on the integrated site.
  if (/\/menuV2\.html$/i.test(location.pathname) && params.get('embed') !== '1' && (params.has('mesa') || params.has('k'))) {
    const target = new URL('index.html', location.href);
    target.search = location.search; target.hash = 'menu';
    location.replace(target.href);
    return;
  }
  if (params.get('embed') === '1') document.documentElement.classList.add('menu-embedded');
  if (params.has('mesa') || params.has('k')) document.documentElement.classList.add('qr-direct');
})();
