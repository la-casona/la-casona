// Keep old AMICI entry paths useful without showing another restaurant's content.
(() => {
  const destinations = {
    'a-propos.html': '#historia',
    'contact.html': '#visitanos',
    'lesquin.html': '#la-casa',
    'meylan.html': '#la-casa',
    'sophia-antipolis.html': '#la-casa',
    'privatisation.html': '#visitanos',
    'recrutement.html': '#visitanos',
    'mentions-legales.html': '#inicio'
  };
  const page = location.pathname.split('/').pop();
  const destination = 'index.html' + (destinations[page] || '#inicio');
  document.getElementById('destination').href = destination;
  location.replace(destination);
})();
