/* Compatibility layer for the static archive. Original layouts and animations are unchanged. */
(() => {
    const localPhotos = new Set(['AMICI-1','AMICI-6','AMICI-8','AMICI-9','AMICI-9_1','AMICI-10','AMICI-11','AMICI-12','AMICI-13','AMICI-14','AMICI-15','AMICI-21','AMICI-22','AMICI-23','AMICI-LESQUIN','Amici-43','AmiciLesquin_Satycation11','Amici-Lesquin-Moodboard-21','DSCF7252','371A7421','371A7382','371A7379','371A7285','371A7238','371A7224','371A7419','371A7401','371A7259','371A7144']);
    document.querySelectorAll('img').forEach(image => {
        const source = image.getAttribute('data-import-src') || image.getAttribute('src') || image.dataset.src || '';
        let name = source.split('/').pop().split('?')[0].replace(/-\d+x\d+(?=(_\d+)?\.)/, '');
        if (source.includes('/2024/04/AMICI-9-')) name = 'AMICI-9_1.jpg';
        const stem = name.replace(/\.[^.]+$/, '');
        if (localPhotos.has(stem)) {
            const local = 'images/' + name;
            image.removeAttribute('srcset');
            image.removeAttribute('data-srcset');
            if (image.hasAttribute('data-src')) image.dataset.src = local;
            else image.src = local;
        } else if (image.hasAttribute('data-import-src')) {
            image.src = source;
        }
        image.removeAttribute('data-import-src');
        image.removeAttribute('data-import-srcset');
    });
    document.querySelectorAll('link[rel*="icon"]').forEach(link => {
        link.href = 'images/favicon-48x48.png';
        link.removeAttribute('sizes');
    });
    document.querySelectorAll('link[rel="manifest"]').forEach(link => link.remove());
    // WordPress form handlers and CAPTCHA cannot process a static-site submission.
    document.querySelectorAll('form.frm-show-form').forEach(form => {
        const notice = document.createElement('p');
        notice.textContent = 'Le formulaire est temporairement indisponible sur cette copie du site. Merci de contacter directement le restaurant.';
        notice.setAttribute('role', 'status');
        notice.style.cssText = 'padding:16px;border:1px solid currentColor;margin:16px 0;font-size:14px;line-height:1.6';
        form.prepend(notice);
        form.addEventListener('submit', event => { event.preventDefault(); event.stopImmediatePropagation(); notice.scrollIntoView({block:'center'}); }, true);
        form.querySelectorAll('[type="submit"]').forEach(button => { button.disabled = true; button.title = 'Envoi non disponible sur le site statique'; });
    });
})();
