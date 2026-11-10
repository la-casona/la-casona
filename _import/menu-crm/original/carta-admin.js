/* LA CASONA · Panel de carta y datos (Supabase, solo rol admin) */
(() => {
  'use strict';
  const CLOUD = window.CasonaCloud;
  const { toast, esc } = window.CasonaStaff;
  const $ = (s, el = document) => el.querySelector(s);
  const money = n => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(Number(n) || 0);
  let cats = [], prods = [];
  let ready = false, categorySaving = false, productSaving = false;
  let categoryIntent = null, productIntent = null;
  const busyProducts = new Set();
  let editingId = null, editBusy = false, returnProductId = null;
  const editor = $('#editProductDialog'), editForm = $('#editProductForm');
  const categoryForm = $('#categoryForm'), productForm = $('#productForm');
  const field = (form, name) => form.elements.namedItem(name);
  const message = (id, text, error = false) => { const el = $(id); el.textContent = text; el.classList.toggle('is-error', error); };
  const newId = prefix => prefix + CLOUD.newKey().replace(/-/g, '');
  function nextOrder(rows) {
    const max = rows.reduce((n, row) => Math.max(n, Number(row.orden) || 0), -1);
    if (max >= 2147483647) throw new Error('No se puede agregar al final: revisa el orden de esta sección.');
    return max + 1;
  }
  function syncCreateControls(selected) {
    const select = field(productForm, 'categoria_id');
    const previous = selected || select.value;
    select.innerHTML = cats.length ? '<option value="">Elige una sección…</option>' + cats.map(c => `<option value="${esc(c.id)}">${esc(c.titulo)}${c.activa ? '' : ' (oculta)'}</option>`).join('') : '<option value="">Primero crea una sección</option>';
    if (cats.some(c => c.id === previous)) select.value = previous;
    $('#categoryFields').disabled = !ready || categorySaving;
    $('#productFields').disabled = !ready || !cats.length || productSaving;
    updateProductHint();
  }
  function updateProductHint() {
    const c = cats.find(c => c.id === field(productForm, 'categoria_id').value);
    $('#productHint').textContent = !cats.length ? 'Crea una sección para agregar tu primer platillo.' : c && !c.activa ? 'Esta sección está oculta: sus platillos no se mostrarán en el menú público.' : 'Se agrega disponible y visible, al final de la sección.';
  }
  field(productForm, 'categoria_id').addEventListener('change', updateProductHint);

  /* Altas independientes: guardar solo tras confirmar el INSERT del servidor.
     El id se mantiene si hay error para que un reintento no duplique registros. */
  categoryForm.addEventListener('submit', async e => {
    e.preventDefault(); if (!ready || categorySaving) return;
    const title = field(categoryForm, 'titulo');
    title.setCustomValidity(title.value.trim() ? '' : 'Escribe el nombre de la sección.');
    if (!categoryForm.reportValidity()) return;
    categorySaving = true; syncCreateControls();
    message('#categoryMessage', 'Guardando sección…');
    try {
      if (!categoryIntent) categoryIntent = newId('sec-');
      const c = await CLOUD.carta.crearCategoria({id:categoryIntent, titulo:title.value.trim(), orden:nextOrder(cats)});
      if (!c || c.id !== categoryIntent) throw new Error('El servidor no confirmó la sección.');
      cats.push(c); cats.sort((a,b) => a.orden - b.orden || a.id.localeCompare(b.id));
      categoryIntent = null; categoryForm.reset();
      $('#search').value = ''; $('#show').value = 'all'; render();
      syncCreateControls(c.id);
      message('#categoryMessage', `Sección «${c.titulo}» creada. Ya puedes agregarle platillos.`);
      toast('Sección <b>creada</b>');
    } catch (err) {
      message('#categoryMessage', 'No se confirmó el guardado. ' + CLOUD.errorText(err) + ' Tus datos siguen en el formulario; si se interrumpió la conexión, recarga la carta antes de repetir el alta.', true);
    } finally { categorySaving = false; syncCreateControls(); }
  });
  categoryForm.addEventListener('input', () => field(categoryForm, 'titulo').setCustomValidity(''));

  productForm.addEventListener('submit', async e => {
    e.preventDefault(); if (!ready || productSaving || !cats.length) return;
    const name = field(productForm, 'nombre'), category = field(productForm, 'categoria_id'), price = field(productForm, 'precio');
    name.setCustomValidity(name.value.trim() ? '' : 'Escribe el nombre del platillo.');
    category.setCustomValidity(cats.some(c => c.id === category.value) ? '' : 'Elige una sección válida.');
    const value = Number(price.value);
    price.setCustomValidity(price.value !== '' && Number.isFinite(value) && value >= 0 && value < 100000 && Math.abs(value * 100 - Math.round(value * 100)) <= .000001 ? '' : 'Escribe un precio de 0 a 99,999.99, con máximo dos decimales.');
    if (!productForm.reportValidity()) return;
    productSaving = true; syncCreateControls();
    message('#productMessage', 'Guardando platillo…');
    try {
      if (!productIntent) productIntent = newId('p-');
      const selected = category.value;
      const p = await CLOUD.carta.crearProducto({id:productIntent, categoria_id:selected, nombre:name.value.trim(), descripcion:field(productForm, 'descripcion').value.trim(), precio:value, orden:nextOrder(prods.filter(row => row.categoria_id === selected))});
      if (!p || p.id !== productIntent) throw new Error('El servidor no confirmó el platillo.');
      prods.push(p); prods.sort((a,b) => a.orden - b.orden || a.id.localeCompare(b.id));
      productIntent = null; productForm.reset();
      $('#search').value = ''; $('#show').value = 'all'; render(); syncCreateControls(selected);
      message('#productMessage', `Platillo «${p.nombre}» agregado: ${money(p.precio)}.`);
      toast('Platillo <b>agregado</b>');
    } catch (err) {
      message('#productMessage', 'No se confirmó el guardado. ' + CLOUD.errorText(err) + ' Tus datos siguen en el formulario; si se interrumpió la conexión, recarga la carta antes de repetir el alta.', true);
    } finally { productSaving = false; syncCreateControls(); }
  });
  productForm.addEventListener('input', () => ['nombre','categoria_id','precio'].forEach(key => field(productForm, key).setCustomValidity('')));

  /* ---------- Datos del restaurante ---------- */
  async function loadConfig() {
    const c = await CLOUD.config.get();
    if (!c) return;
    const f = $('#cfgForm');
    f.telefono.value = c.telefono || '';
    f.whatsapp.value = c.whatsapp || '';
    f.envio_domicilio.value = Number(c.envio_domicilio);
    f.pagos.value = (c.pagos || []).join(', ');
    f.sesion_inactividad_min.value = c.sesion_inactividad_min;
    f.sesion_max_horas.value = c.sesion_max_horas;
    f.recoger_en_sucursal.checked = !!c.recoger_en_sucursal;
    f.pedidos_linea_activos.checked = c.pedidos_linea_activos !== false;
  }
  $('#cfgForm').addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    const wa = f.whatsapp.value.replace(/\s/g, '');
    const pagos = f.pagos.value.split(',').map(s => s.trim()).filter(Boolean).slice(0, 6);
    f.whatsapp.setAttribute('aria-invalid', String(!/^\d{0,15}$/.test(wa)));
    f.pagos.setAttribute('aria-invalid', String(!pagos.length));
    if (!/^\d{0,15}$/.test(wa) || !pagos.length) return;
    const btn = $('#cfgBtn'); btn.disabled = true;
    try {
      await CLOUD.config.actualizar({
        telefono: f.telefono.value.trim(), whatsapp: wa,
        envio_domicilio: Math.max(0, Number(f.envio_domicilio.value) || 0), pagos,
        sesion_inactividad_min: Math.min(600, Math.max(10, parseInt(f.sesion_inactividad_min.value, 10) || 90)),
        sesion_max_horas: Math.min(24, Math.max(1, parseInt(f.sesion_max_horas.value, 10) || 4)),
        recoger_en_sucursal: f.recoger_en_sucursal.checked, pedidos_linea_activos: f.pedidos_linea_activos.checked
      });
      await loadConfig();
      toast('Datos <b>guardados</b>');
    } catch (err) { toast(`No se pudo guardar: ${esc(CLOUD.errorText(err))}`, 4000); }
    finally { btn.disabled = false; }
  });

  /* ---------- Carta ---------- */
  async function loadCarta() {
    try { ({ cats, prods } = await CLOUD.carta.listAll()); ready = true; render(); syncCreateControls(); }
    catch (e) { ready = false; syncCreateControls(); $('#carta').innerHTML = `<p class="adm-empty">No se pudo cargar la carta.<br><small>${esc(CLOUD.errorText(e))}</small><br><button class="btn" type="button" data-reload-carta>Reintentar carga</button></p>`; }
  }
  function render() {
    const q = $('#search').value.trim().toLowerCase();
    const show = $('#show').value;
    const ok = p => (!q || p.nombre.toLowerCase().includes(q)) &&
      (show === 'all' || (show === 'out' ? !p.disponible : !p.activo));
    const html = cats.map(c => {
      const list = prods.filter(p => p.categoria_id === c.id && ok(p));
      if (!list.length && (q || show !== 'all')) return '';
      return `<section class="carta-cat" data-category-id="${esc(c.id)}"><h3>${esc(c.titulo)}${c.activa ? '' : ' <small>oculta</small>'}</h3>
        <ul class="carta-list">${list.map(p => `<li class="carta-item${p.activo ? '' : ' is-hidden'}${p.disponible ? '' : ' is-out'}" data-id="${esc(p.id)}">
          <span class="carta-name">${esc(p.nombre)}</span>
          <label class="carta-price"><span class="vh">Precio de ${esc(p.nombre)}</span>$<input class="input" type="number" min="0" max="99999.99" step="0.01" value="${Number(p.precio)}" data-f="precio" ${busyProducts.has(p.id) ? 'disabled' : ''}></label>
          <label class="carta-tg"><input type="checkbox" data-f="disponible" ${p.disponible ? 'checked' : ''} ${busyProducts.has(p.id) ? 'disabled' : ''}> Disponible</label>
          <label class="carta-tg"><input type="checkbox" data-f="activo" ${p.activo ? 'checked' : ''} ${busyProducts.has(p.id) ? 'disabled' : ''}> Visible</label>
          <span class="carta-actions">
            <button type="button" data-edit-product ${busyProducts.has(p.id) ? 'disabled' : ''} aria-label="Editar ${esc(p.nombre)}">Editar</button>
            <button type="button" class="carta-danger" data-delete-product ${busyProducts.has(p.id) ? 'disabled' : ''} aria-label="Eliminar ${esc(p.nombre)}">Eliminar</button>
          </span>
        </li>`).join('')}</ul>${list.length ? '' : '<p class="carta-section-empty">Esta sección todavía no tiene platillos. Agrégalos desde el formulario de arriba.</p>'}</section>`;
    }).join('');
    $('#carta').innerHTML = html || `<p class="adm-empty">${cats.length ? 'Nada coincide con la búsqueda.' : 'Tu carta está vacía. Crea una sección y agrega tu primer platillo.'}</p>`;
  }
  $('#search').addEventListener('input', render);
  $('#show').addEventListener('change', render);
  $('#carta').addEventListener('click', e => {
    if (e.target.closest('[data-reload-carta]')) { loadCarta(); return; }
    const action = e.target.closest('[data-edit-product],[data-delete-product]');
    if (!action || !ready) return;
    const id = action.closest('.carta-item').dataset.id;
    const p = prods.find(row => row.id === id);
    if (!p || busyProducts.has(id)) return;
    if (action.hasAttribute('data-edit-product')) openEditor(p);
    else deleteProduct(p);
  });

  /* ---------- Editar y eliminar el platillo existente ---------- */
  function setProductBusy(id, busy) {
    if (busy) busyProducts.add(id); else busyProducts.delete(id);
    const row = [...$('#carta').querySelectorAll('.carta-item')].find(el => el.dataset.id === id);
    if (row) {
      row.setAttribute('aria-busy', String(busy));
      row.querySelectorAll('input,button').forEach(el => { el.disabled = busy; });
    }
  }
  function editorHint() {
    const c = cats.find(row => row.id === field(editForm, 'categoria_id').value);
    $('#editProductSectionHint').textContent = c && !c.activa ? 'Esta sección está oculta: el platillo no aparecerá en el menú público.' : 'Al cambiar de sección, se coloca al final de la sección elegida.';
  }
  function openEditor(p) {
    if (editBusy) return;
    editingId = p.id; returnProductId = p.id;
    editForm.reset();
    [...editForm.elements].forEach(el => el.setCustomValidity?.(''));
    field(editForm, 'nombre').value = p.nombre;
    field(editForm, 'descripcion').value = p.descripcion || '';
    field(editForm, 'precio').value = Number(p.precio);
    field(editForm, 'categoria_id').innerHTML = cats.map(c => `<option value="${esc(c.id)}">${esc(c.titulo)}${c.activa ? '' : ' (oculta)'}</option>`).join('');
    field(editForm, 'categoria_id').value = p.categoria_id;
    field(editForm, 'activo').checked = !!p.activo;
    field(editForm, 'disponible').checked = !!p.disponible;
    message('#editProductMessage', '');editorHint();
    editor.showModal();field(editForm, 'nombre').focus();
  }
  function setEditBusy(busy) {
    editBusy = busy;
    $('#editProductFields').disabled = busy;
    $('#editProductSave').disabled = busy;
    $('#editProductCancel').disabled = busy;
    $('#editProductSave').textContent = busy ? 'Guardando…' : 'Guardar cambios';
  }
  $('#editProductCancel').addEventListener('click', () => { if (!editBusy) editor.close(); });
  editor.addEventListener('cancel', e => { if (editBusy) e.preventDefault(); });
  editor.addEventListener('close', () => {
    editingId = null;
    const row = [...$('#carta').querySelectorAll('.carta-item')].find(el => el.dataset.id === returnProductId);
    (row?.querySelector('[data-edit-product]') || $('#search')).focus();
  });
  field(editForm, 'categoria_id').addEventListener('change', editorHint);
  editForm.addEventListener('input', () => ['nombre','categoria_id','precio'].forEach(key => field(editForm, key).setCustomValidity('')));
  editForm.addEventListener('submit', async e => {
    e.preventDefault();
    if (!ready || editBusy || !editingId || busyProducts.has(editingId)) return;
    const p = prods.find(row => row.id === editingId);
    if (!p) { message('#editProductMessage', 'El platillo ya no está en esta carta. Recarga para comprobarlo.', true); return; }
    const name = field(editForm, 'nombre'), category = field(editForm, 'categoria_id'), price = field(editForm, 'precio');
    name.setCustomValidity(name.value.trim() ? '' : 'Escribe el nombre del platillo.');
    category.setCustomValidity(cats.some(c => c.id === category.value) ? '' : 'Elige una sección válida.');
    const value = Number(price.value);
    price.setCustomValidity(price.value !== '' && Number.isFinite(value) && value >= 0 && value < 100000 && Math.abs(value * 100 - Math.round(value * 100)) <= .000001 ? '' : 'Escribe un precio válido con máximo dos decimales.');
    if (!editForm.reportValidity()) return;
    const id = p.id;
    setProductBusy(id, true);setEditBusy(true);message('#editProductMessage', 'Guardando cambios…');
    try {
      const changes = {nombre:name.value.trim(), descripcion:field(editForm, 'descripcion').value.trim(), categoria_id:category.value, precio:value, activo:field(editForm, 'activo').checked, disponible:field(editForm, 'disponible').checked};
      if (changes.categoria_id !== p.categoria_id) changes.orden = nextOrder(prods.filter(row => row.categoria_id === changes.categoria_id));
      const saved = await CLOUD.carta.actualizarProducto(id, changes);
      if (!saved || saved.id !== id) throw new Error('El servidor no confirmó los cambios.');
      Object.assign(p, saved);
      render();editor.close();
      message('#cartaActionMessage', `Platillo «${p.nombre}» actualizado.`);
      toast('Platillo <b>actualizado</b>');
    } catch (err) {
      message('#editProductMessage', 'No se confirmaron los cambios. ' + CLOUD.errorText(err) + ' Tu edición sigue aquí; no se creará otro platillo.', true);
    } finally { setProductBusy(id, false);setEditBusy(false); }
  });
  async function deleteProduct(p) {
    if (busyProducts.has(p.id) || !ready) return;
    if (!confirm(`¿Eliminar definitivamente «${p.nombre}» de la carta?\n\nTambién se eliminarán sus extras. Los pedidos anteriores conservan sus nombres y precios.\n\nSi solo quieres dejar de ofrecerlo temporalmente, cancela y desmarca «Visible».`)) return;
    const id = p.id;setProductBusy(id, true);
    message('#cartaActionMessage', 'Eliminando platillo…');
    try {
      await CLOUD.carta.borrarProducto(id);
      prods = prods.filter(row => row.id !== id);render();
      message('#cartaActionMessage', `Platillo «${p.nombre}» eliminado.`);
      toast('Platillo <b>eliminado</b>');
    } catch (err) {
      message('#cartaActionMessage', 'No se confirmó la eliminación. ' + CLOUD.errorText(err) + ' El platillo permanece en la lista. Si se interrumpió la conexión, recarga para comprobar su estado antes de reintentar.', true);
    } finally { setProductBusy(id, false); }
  }

  $('#carta').addEventListener('change', async e => {
    const el = e.target.closest('[data-f]'); if (!el) return;
    const row = el.closest('.carta-item');
    const p = prods.find(x => x.id === row.dataset.id);
    if (!p || busyProducts.has(p.id)) return;
    const f = el.dataset.f;
    let v;
    if (f === 'precio') {
      v = Number(el.value);
      if (el.value === '' || !Number.isFinite(v) || !(v >= 0 && v < 100000) || Math.abs(v * 100 - Math.round(v * 100)) > .000001) { el.value = Number(p.precio); toast('Precio no válido'); return; }
      if (v === Number(p.precio)) return;
      if (!confirm(`¿Cambiar el precio de "${p.nombre}" de ${money(p.precio)} a ${money(v)}?`)) { el.value = Number(p.precio); return; }
    } else v = el.checked;
    setProductBusy(p.id, true);
    try {
      const saved = await CLOUD.carta.actualizarProducto(p.id, { [f]: v });
      if (!saved || saved.id !== p.id) throw new Error('El servidor no confirmó el cambio.');
      Object.assign(p, saved);
      toast(f === 'precio' ? `<b>${esc(p.nombre)}</b> · ${money(p.precio)}` : `<b>${esc(p.nombre)}</b> ${f === 'disponible' ? (v ? 'disponible' : 'agotado') : (v ? 'visible' : 'oculto')}`);
    } catch (err) {
      if (f === 'precio') el.value = Number(p.precio); else el.checked = !v;
      toast(`No se pudo guardar: ${esc(CLOUD.errorText(err))}`, 4000);
    }
    setProductBusy(p.id, false);
    render();
  });

  window.CasonaStaff.require(['admin'], async () => {
    try { await loadConfig(); } catch (e) { toast(`Datos: ${esc(CLOUD.errorText(e))}`, 4000); }
    loadCarta();
  });
})();
