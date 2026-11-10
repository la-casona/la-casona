/* Static entry aliases only. Preserve queries (including QR codes) and Auth
   recovery hashes unchanged. No credentials, API calls or storage changes. */
(() => {
  'use strict';
  const path = document.currentScript?.dataset.entry;
  if (!path) return;
  const target = new URL(path, document.baseURI);
  target.search = location.search;
  target.hash = location.hash;
  const link = document.getElementById('destination');
  if (link) link.href = target.href;
  location.replace(target.href);
})();
