# La Casona — historia, patio y mesa

## Instalación del marquee v6 «Seda» · 31 octubre 2026

- **Instalada la propuesta aportada por el propietario** en `index.html#marquee-gastronomico`, entre el hero y el menú digital. Cintas rosa/azul en canvas, guirnaldas botánicas superior/inferior, once ilustraciones temáticas SVG y titulares negros. Se conserva el diseño de la v6, incluidos espacio entre conjuntos y alturas de 164 px (≤900), 180 px (escritorio) y 196 px (≥1600).
- Recursos de producción: `css/marquee-v6.css` y `js/marquee-v6.js`; reemplazan sus dos importaciones antiguas. Reutiliza `assets/marquee/` y las fuentes existentes. No se modifica el HTML de platos ni se generan fotografías nuevas.
- Solo adaptaciones de integración: CSS sin wrapper de laboratorio, rutas de fuentes/textura ajustadas y selectores de ilustraciones acotados; JS tolera ausencia del botón/status del standalone. El controlador global existente `js/casona.js` sigue siendo dueño de la pausa y de `casona-pause-motion`; no se altera ningún almacenamiento. Se conserva el evento `casona:motion-change` y la preferencia de movimiento reducido.
- Originales recibidos preservados: `standalones/marquee/marqueedelacasona-v6.html` desde https://www.genspark.ai/api/files/s/vhE7pgt4 y `standalones/marquee/marquee-v6.js` desde https://www.genspark.ai/api/files/s/jdULYp9o . Copia literal adicional en `standalones/marquee/js/marquee-v6.js` para satisfacer la ruta que trae el HTML. El standalone inicial no se sobrescribe.
- Respaldo textual previo: `references/marquee/pre-v6-index.html` (documental, no una entrada navegable). `css/editorial-marquee.css` y `js/editorial-marquee.js` permanecen archivados sin cambios, ya no se cargan en index. El backup no constituye una recuperación de datos.
- **Regresión actual:** `marquee-v6-checks.html` / `js/marquee-v6-checks.js`: **65 PASS / 0 FAIL**. Comparación contra la propuesta v6 real a 320/390/768/1280/1983 px: geometría exacta de 33 cajas, SVG de ilustraciones y guirnaldas idénticos, fotos sin deformación, sin overflow, contenido/orden, control global, canvas/tinta/CSS pausados, teclado, eventos táctiles sintéticos y continuidad con resize/scroll. Se verifica que todo el HTML fuera del marquee y sus dos importaciones es idéntico al backup previo.
- `menu-checks.html`: nueva ejecución **226 PASS / 0 FAIL**. Consola del index sin errores de aplicación (solo aviso del sandbox). No se afirma prueba en teléfono físico, rendimiento medido ni emulación nueva de movimiento reducido; la lógica reducida se conserva.
- Revisión visual directa del index: [PC](https://www.genspark.ai/api/files/s/AonatTYk), [móvil](https://www.genspark.ai/api/files/s/z7wXT7hF). Detalle real en `marquee-v6-review.html`: [PC](https://www.genspark.ai/api/files/s/RHBVkLID), [móvil390](https://www.genspark.ai/api/files/s/gnDxw5Oo). El visor oculta únicamente los vecinos dentro de un iframe del index real; no replica la implementación.
- **Sin despliegue ni nueva URL pública.** Instalado en la copia de trabajo/previsualización. Pendiente: validación del propietario y publicación solo con autorización separada. Suites históricas `marquee-checks.html` (GSAP/alturas anteriores) y `standalones/marquee-checks.html` (extracción inicial contra index) ya no validan el index v6; usar la nueva suite, no sus cifras históricas.

## Ticket #1 · marquee standalone para Opus · 31 octubre 2026

- Nueva entrada independiente: `standalones/marquee/marqueedelacasona.html`. Todo el HTML, CSS, JavaScript y los datos de composición dentro del archivo; dos fuentes y licencias en `fonts/`, once fotos y textura en `images/`, todas copias binarias exactas. Compartir la carpeta completa; no se ha generado ZIP. Instrucciones y brief para Opus: `standalones/marquee/README.md`.
- **Sin modificar index.html ni el marquee, hero, nav o menú de la web principal.** La propuesta mejorada se integrará en un ticket posterior, cuando el propietario la devuelva y lo solicite.
- Autonomía sin CDN/fetch: GSAP sustituido solo en la copia por requestAnimationFrame; límites alfa precalculados con el algoritmo original; botón de pausa local sin persistencia. Conserva composición, breakpoints y parámetros de movimiento; no se afirma igualdad exacta de easing con GSAP. Encabezado/nota son solo el entorno de trabajo.
- `standalones/marquee-checks.html`: **48 PASS / 0 FAIL**. Copy, carga, geometría inline idéntica de las 22 cajas título/foto frente al index real a 390/768/1280/1983 px, alturas, ausencia de overflow, pausa/teclado/eventos táctiles, continuidad en resize e identidad byte a byte de 16 recursos. Se excluye explícitamente el beacon externo que el proxy de preview inyecta (no está en el HTML guardado). Medición reproducible: `standalones/marquee-measure.html`.
- Capturas directas: [escritorio](https://www.genspark.ai/api/files/s/atjjVr1E) y [móvil](https://www.genspark.ai/api/files/s/oznREuaZ). Verificación HTTP en Chromium, no prueba en teléfono físico ni apertura file://; preparado sin fetch/canvas de píxeles para uso local. Movimiento reducido conservado en código, no reemulado en esta suite.
- Sin datos persistentes, API, backend, despliegue ni nueva URL pública. Pendiente: recibir y revisar la propuesta de Opus antes de reintegrarla.

## Estado actual · menú editorial completo · 31 octubre 2026

- Incorporado el menú **inmediatamente después de `#marquee-gastronomico`**, antes de `#la-casa`. Entrada: `index.html#menu-digital`. El enlace «Ver menú» del hero lleva ahora a este índice. Diseño/movimiento del hero, navegación principal, marquee y secciones posteriores conservados; el otro acceso histórico por WhatsApp en «A la mesa» permanece sin cambios.
- **14 categorías / 101 platos y bebidas / 3 anotaciones de origen**, todo en HTML seleccionable y disponible sin JavaScript. Orden, mayúsculas, acentos, nombres, precios y notas verificados contra `references/menu/content.json`. Se conserva **COCTELERIA** sin tilde conforme al copy literal, aunque el manifiesto visual empleaba COCTELERÍA. No se inventan datos comerciales.
- Descargados directamente desde el Drive autorizado **29 stems WebP y `prototype.png`**, sin regeneración ni reexportación. Los enlaces `drive.google.com/uc` rechazaban la redirección 303; `drive.usercontent.google.com/download` permitió importar los originales. Inventario y IDs: `references/menu/assets.json`. Originales: `assets/menu/`; prototipo: `references/menu/prototype.png`. Los 30 archivos se decodificaron correctamente; alfa y dimensiones medidos en `references/menu/assets-check.html`.
- Estilos aislados: `css/editorial-menu.css`. Controlador: `js/editorial-menu.js`. Tipografías locales: Anton (ya existente), Barlow Condensed y Caveat, con licencias OFL. La familia exacta del prototipo no estaba identificada: son aproximaciones reales, no texto rasterizado.
- Retícula editorial de bandas asimétricas: 01 a ancho completo; 02–04; 05–07; 08–11; 12–14; firma. A 1024 px ocupa aproximadamente **1536 px de alto**. Separadores CSS, fotografías y ornamentos independientes. El controlador compensa márgenes alfa de cada archivo y escala proporcionalmente, sin deformarlos ni duplicar sombras. Contextos: papel 0, separadores 3, fotos 8, ornamentos 9, títulos 15, listas 16; índice móvil 25.
- A ≤900 px: lectura vertical 01–14 y selector de categorías plegable accesible. A 768 px: fotografía/listado en paralelo dentro de cada categoría; a 390 px: foto y lista apiladas, texto de 18 px y precios alineados. Controles táctiles ≥44 px, foco visible, fragmentos URL y foco al destino. No se incorpora parallax, animación decorativa ni dependencia de servicios externos.
- Anotaciones «Referencia del menú digital público · precios por confirmar 2/3/4» conservadas visibles junto al plato correspondiente. Su tratamiento editorial definitivo sigue pendiente de decisión del propietario; no se han eliminado para forzar semejanza con la imagen.

### Verificación actual

- `menu-checks.html` / `js/menu-checks.js`: **217 PASS / 0 FAIL**. Copy literal completo, orden, carga de 29 imágenes, proporciones, destinos/foco/estado del índice, objetivos táctiles, fuentes, ausencia de desbordamiento horizontal y de cruces foto/lista a **320, 390, 768, 1024, 1280 y 1440 px**. Pruebas programáticas en Chromium; no equivalen a pruebas en un teléfono físico ni a recorrido manual completo de tabulación.
- `marquee-checks.html`: nueva regresión **64 PASS / 0 FAIL**, incluida continuidad al redimensionar y volver tras scroll, controles globales y tipografías del hero/nav. `index.html`: sin errores de consola de aplicación (solo aviso del sandbox de la plataforma).
- Captura PC del componente real a1024 px: https://www.genspark.ai/api/files/s/m1mYn0jV . Comparada con el prototipo al mismo ancho: estructura y jerarquías próximas, sin colisiones funcionales; **no se certifica identidad de píxel al 100 %** (kerning/fuentes y notas de origen producen diferencias).
- Sitio integrado: https://www.genspark.ai/api/files/s/1DaaLWen . Tablet768: https://www.genspark.ai/api/files/s/EyxiUcwO . Móvil390, comienzo: https://www.genspark.ai/api/files/s/WJPvmUBj ; secciones05–08: https://www.genspark.ai/api/files/s/BGcmGMNT ; secciones09–14: https://www.genspark.ai/api/files/s/kaCa12pV ; café y cierre: https://www.genspark.ai/api/files/s/H51ziSZw . La captura móvil inicial todavía muestra el botón auxiliar del visor: ya se oculta en móvil y nunca estuvo en producción.
- Visores de revisión: `menu-review.html` (iframe de index a1024, superposición opcional del prototipo solo en el visor), `menu-review-tablet.html`, `menu-review-mobile-middle.html`, `menu-review-mobile-end.html`, `menu-review-mobile-footer.html`. Todos muestran el **index real**, no otra implementación. Los visores móviles de tramos ocultan secciones previas únicamente dentro de su iframe de revisión para evitar el reinicio de scroll del capturador; no alteran producción.

### Almacenamiento, alcance y siguientes pasos

- Demo estática: HTML de producción, CSS y JS locales. El JSON de contenido es copia documental para pruebas, no base de datos ni backend. No se modifica el almacenamiento existente de preferencia de movimiento.
- Sin CRM, carrito, pedidos nuevos, autenticación ni API. El enlace existente «Pedir en línea» por WhatsApp permanece intacto.
- **Sin despliegue realizado ni nueva URL pública**. Las capturas son pruebas de previsualización. La publicación requerirá autorización separada; revisar el peso/exclusión de todo el material de referencias histórico antes de publicar.
- Pendientes: decisión editorial sobre las tres notas originales, validación final del propietario sobre las diferencias tipográficas respecto a la imagen y, en otra fase, diseño/implementación del CRM. No se afirma equivalencia exacta de fuentes desconocidas ni pixel-perfect absoluto.

## Estado actual · nuevo lote de referencias en el proyecto

- Incorporadas **48 imágenes originales (47 PNG y 1 JPG)** mediante WriteFileFromUrl desde https://drive.google.com/drive/folders/1PHDVq7rGqZNkFGdZGoEk9xSqLIByvwVO . Guardadas en `references/pool/`, con nombres originales; 45.961.451 bytes (~45,96 MB).
- Índice visual nuevo: `references/pool/index.html`. Inventario con IDs de origen: `references/pool/manifest.json`. Detalles: `references/pool/README.md`.
- Verificación nueva: `references/pool/checks.html` dio **48 PASS / 0 FAIL**, firmas de imagen y decodificación correctas, coincidencia con las 48 entradas del listado de Drive y 48 contenidos únicos por SHA-256 dentro del lote. No se afirma deduplicación visual ni comparación binaria con todo el material histórico.
- El catálogo auxiliar se revisó en móvil y escritorio. Conserva los nombres técnicos originales y abre cada archivo completo. No existía una aplicación local llamada Studio; los originales quedan en los archivos del proyecto y se consultan también desde este catálogo.
- Sin cambios en la web principal, el nav, el hero o el marquee. No se sobrescriben referencias anteriores. Sin despliegue, nueva URL pública, API, backend ni base de datos. Revisar exclusión/peso de las referencias de trabajo antes de publicar el proyecto en el futuro.

## Estado actual · continuidad del marquee al hacer scroll

- Corregido en `js/editorial-marquee.js`: el listener de resize reconstruía siempre el tween desde el inicio, incluso si solo cambiaba la altura del viewport (caso habitual al ocultarse la barra del navegador móvil). Ahora compara ancho, altura y escala del componente y no reconstruye si su geometría permanece igual.
- Cuando cambia realmente la geometría, se conserva la posición normalizada del ciclo antes de eliminar el tween y se restaura sobre la nueva anchura. Se usa la anchura subpíxel medida, no `clientWidth` redondeado, para transferir posición entre transform y scrollLeft.
- Corregido también el salto al tocar cerca de la unión: `css/editorial-marquee.css` mantiene las copias inertes durante las pausas para evitar que la reducción de scrollWidth limite scrollLeft. Siguen siendo `aria-hidden` e `inert`. Solo el visor de referencia oculta las copias.
- Se mantienen autoplay a la derecha, 28 px/s, hover al 45 %, pausa global, movimiento reducido, exploración táctil/teclado y pausa fuera de pantalla/pestaña oculta. Fuera de pantalla se pausa el mismo tween, no se reinicia. Diseño, fotos, fuentes, alturas, hero y nav sin cambios.
- `marquee-checks.html` / `js/marquee-checks.js`: **64 PASS / 0 FAIL** en la nueva ejecución. Regresión a 390/768/1280/1983 px, más pruebas de resize solo de altura, cambio de ancho a 1024, toque cerca de la unión, pointercancel y scroll real fuera/dentro de pantalla. La expectativa histórica de Playfair se actualiza a MEETU, ya vigente en el hero.
- Los fallos de continuidad se reprodujeron antes de corregirlos. Pruebas de puntero sintéticas y resize en iframe del index real: no equivalen a una prueba en teléfono físico ni a emular específicamente la barra de Safari.
- Revisión visual actual del componente real: [móvil](https://www.genspark.ai/api/files/s/BfflrV8W) y [escritorio](https://www.genspark.ai/api/files/s/QVSuNpgx), sin huecos ni cambios de composición. Entrada visual: `marquee-review-compact.html`; web: `index.html#marquee-gastronomico`.
- Sin despliegue ni cambios de almacenamiento. Las suites y capturas inferiores son históricas.

## Estado actual · sustitución del follaje móvil

- `index.html`: el `<source media="(max-width:900px)">` de `.arch-foliage` usa ahora `images/follaje-movil.png`, original PNG del propietario (255.804 bytes), descargado sin reexportar desde https://gensparkpublicblob.blob.core.windows.net/user-upload-image/v1/3dc468a8-f559-472e-899a-b7563a40120e .
- Se conserva el encuadre CSS existente, la transparencia y el recurso de escritorio `assets/hero/follaje-primer-plano.webp`. El PNG móvil anterior queda archivado, ya no seleccionado por el picture de producción.
- Nav sin modificaciones: las propuestas de pulido anteriores no se aplican por decisión del propietario. Hero y marquee siguen contiguos; no vuelve la imagen intermedia.
- Verificación visual nueva en `index.html`, móvil 390 × 844: https://www.genspark.ai/api/files/s/5y6Nq5kt . Hojas oliva en el margen izquierdo, transparencia correcta y titular/botones legibles. No se repite la regresión completa ni se afirma un nuevo test de escritorio.
- Sin despliegue, backend, almacenamiento nuevo ni URL pública nueva.

## Estado actual · retirada de la imagen intermedia

- Retirado `#para-hoy` de `index.html`, junto con la importación y el archivo `css/hero-marquee-bridge.css`. Hero y marquee vuelven a ser hermanos consecutivos, sin franja ni espacio residual.
- Se conserva el original `images/hero-marquee-text.png` y su diagnóstico como material archivado, sin cargarlo en la página principal.
- Comprobación visual nueva en index: [móvil](https://www.genspark.ai/api/files/s/OqjCtkET) y [escritorio](https://www.genspark.ai/api/files/s/RjGp15bY). Ambas muestran la unión directa.
- Nav sin cambios de código en esta entrega. Inspeccionados CSS, controlador y [captura móvil actual](https://www.genspark.ai/api/files/s/uO0wjZVc) para proponer refinamientos, pendientes de aprobación: tamaños secundarios estables al cambiar el activo (ahora dependen de la longitud del título activo), alineación óptica de A/V respecto al separador, apertura más coordinada sin añadir movimiento perpetuo y corrección del fallo heredado de sección en `#fuentes`.
- Sin despliegue, nueva URL pública ni cambios en almacenamiento. Las capturas y valores de secciones inferiores son históricos.

## Historial · imagen entre hero y marquee (retirada)

- Se incorpora el original del propietario **«¿QUÉ DESEA USTED PARA HOY?»** en `index.html#para-hoy`, después de `#inicio` y antes de `#marquee-gastronomico`.
- Archivo local: `images/hero-marquee-text.png`, PNG transparente de 683 × 1024, 392.667 bytes. Descarga original: https://gensparkpublicblob.blob.core.windows.net/user-upload-image/v1/c90bba3d-4ecf-4926-8b69-bf6584aa9901 . No se redibuja ni se convierte en una fuente.
- Estilos aislados en `css/hero-marquee-bridge.css`: franja marfil, centrado con grid, padding vertical simétrico de 24–40 px. Ancho visible adaptable de 120–176 px; proporción original conservada. Se compensan los márgenes transparentes con los límites alfa medidos `[36,24,616,963]`, sin alterar el PNG. Alt descriptivo con el texto de la imagen.
- Hero, nav, marquee y su movimiento no se modifican internamente. Sin JavaScript nuevo en producción, almacenamiento, backend ni despliegue.
- Diagnóstico del original: `hero-marquee-asset-check.html` y `js/hero-marquee-asset-check.js` (imagen sobre fondo claro y medidas alfa).
- Verificación visual **directa sobre index.html**: [móvil](https://www.genspark.ai/api/files/s/iflMPYWe) y [escritorio](https://www.genspark.ai/api/files/s/ozGZjr1s). Imagen completa y centrada entre ambas secciones, sin solapamientos. Las capturas muestran los primeros 4000 px de la página. Se retiró un visor auxiliar en iframe que no mostraba correctamente el encuadre; no forma parte del sitio.
- Las notas inferiores de nav/hero/marquee se mantienen como historial. No se repitieron sus suites completas en esta inserción puntual.

## Última corrección · tracking activo más cerrado

- A petición del propietario, `css/editorial-nav.css` cambia **−0,039108em → −0,075em** en las tres reglas de tipografía activa (común, escritorio y móvil). Esta corrección prevalece sobre los valores y mediciones históricos inferiores.
- ManEater, color, tamaños de referencia, inactivos, números y elementos gráficos no se modifican. El controlador existente sigue ajustando el tamaño de los otros enlaces activos al ancho de La casa.
- Verificación visual nueva sobre el menú real: [móvil, La casa](https://www.genspark.ai/api/files/s/0HBSkR2Q) y [escritorio, La historia](https://www.genspark.ai/api/files/s/oXfO9tzG). Texto legible, sin recortes ni choque con estrella. No se afirma identidad exacta con el recorte.
- La suite `nav-active-type-checks.html` conserva expectativas del tracking anterior: sus resultados 184/0 inferiores son históricos, no validan este cambio. No se ha repetido la regresión completa de navegación en esta corrección puntual.
- Entradas: `index.html`, `nav-review-mobile.html`, `nav-active-review.html`. Sin despliegue ni cambios de almacenamiento.

## Estado anterior · tipografía activa del nav

Este resumen prevalece sobre los historiales inferiores. Sitio estático: `index.html`. Sin despliegue, backend, base de datos ni nueva URL pública.

### Ajuste actual
- Se modifica **solo el CSS del enlace activo del menú** en `css/editorial-nav.css`; controlador `js/editorial-nav.js`, fotografías, estrella, números, cierre, destinos e inactivos sin cambios en esta revisión.
- Se mantiene **ManEater original local, peso 400**, sin scaleX/scaleY ni negrita sintética. El énfasis depende de `aria-current="location"`, no de que sea siempre el primer enlace.
- Tracking activo: **−0,039108 em**. Color activo: **#a62813**, aproximado a los píxeles dominantes de la referencia. Los números conservan su color anterior y las etiquetas inactivas, su verde.
- Referencia aportada: `images/nav-active-type-reference.png` y copia del último adjunto `images/nav-active-type-latest.png`, descargadas con WriteFileFromUrl. Archivo 734 × 346; bbox de tinta roja estimada 706 × 172, relación 4,10465:1. Esta medición aproxima tinta visible, no certifica identidad de píxel.
- En PC, La casa usa 12,69cqw y ajuste superior .44cqw: conserva aproximadamente su huella horizontal sin invadir fotografías. En móvil se mantiene el tamaño aprobado y se ajusta el tracking. El controlador existente toma La casa como referencia para dimensionar los otros títulos activos.

### Reconfirmación con el último adjunto · 25 de octubre de 2026
- Original guardado en `images/nav-active-type-owner.png` (266.023 bytes); el medidor ahora lee este archivo. Confirma 734 × 346, tinta 706 × 172, relación 4,10465 y tracking calculado −0,039108 em.
- El CSS de producción ya contenía el ajuste correspondiente: se conserva sin añadir deformación ni duplicar reglas. Esta continuación actualiza la referencia y las verificaciones, no introduce otro rediseño.
- Nueva ejecución de `nav-active-type-checks.html`: **184 PASS / 0 FAIL**, cuatro estados a cinco anchos. Capturas nuevas: [móvil](https://www.genspark.ai/api/files/s/CvbeahgX) y [escritorio](https://www.genspark.ai/api/files/s/IXNpI51N), sin recortes ni colisión con la estrella. Las capturas inferiores pertenecen a la revisión previa.
- Sin despliegue; hero y marquee no modificados.

### Verificación y entradas
- `nav-review-mobile.html`: menú real móvil, La casa activa.
- `nav-active-review.html`: selector de los cuatro estados del menú real; inicia con La historia.
- `nav-active-type-measure.html` / `js/nav-active-type-measure.js`: medición de la fuente y del recorte original.
- `nav-active-type-checks.html` / `js/nav-active-type-checks.js`: **184 PASS / 0 FAIL** sobre index real a 390, 576, 768, 1024 y 1280 px. Incluye cuatro estados, familia decodificada, color, tracking, márgenes, mayor tamaño activo, secundarios verdes, estrella de tamaño constante, foco, cierre y destino de historia.
- Relación de tinta La casa medida en navegador: 4,0803–4,1448 según tamaño/hinting; referencia 4,10465. No se vende como coincidencia exacta.
- Captura móvil: https://www.genspark.ai/api/files/s/bl4TInj0 . La casa legible, separada de número y estrella.
- Captura escritorio: https://www.genspark.ai/api/files/s/3KJxCOhm . La historia activa. Revisión visual específica confirma espacio entre letra y estrella; medida DOM: 63,31 px a 1280. Una primera descripción automática insinuó solapamiento y quedó descartada tras esa comprobación.
- El fallo heredado de detección de sección en `#fuentes` queda fuera de este ajuste. No se afirma haber repetido toda la regresión histórica de animaciones.

### Estado heredado que se conserva
- Hero: **MEETU.woff2**, original del propietario de 7.548 bytes; ya importada, con ajuste de tinta, tracking y scaleY(1.2). `hero-meetu-review.html` compara su recorte real con la referencia. No se ha vuelto a retocar el hero durante esta revisión del nav; su comparación final completa queda pendiente de cerrar.
- Marquee: Antic Didone + Anton, sin controles locales, alturas 132/144/158 px, separación entre conjuntos, marfil cálido y bordes finos. `marquee-spacing-review.html` revisa el detalle de MIXOLOGÍA/LA BUENA COMIDA. Su suite previa dio 55/0, no se presenta como una ejecución nueva de esta entrega.
- Las suites históricas que aún esperan Playfair en el hero o un botón local del marquee pertenecen a versiones anteriores. Las entradas vigentes están indicadas arriba.

---

## Historial de versiones anteriores

## Estado vigente · marquee afinado con Antic Didone · 25 de octubre de 2026

Esta sección prevalece sobre las notas históricas de más abajo. Proyecto estático HTML/CSS/JS, sin build, backend, base de datos ni checkout. **Sin despliegue solicitado o realizado en esta entrega; no hay una nueva URL pública.**

### Entradas
- Web: `index.html#marquee-gastronomico`.
- Comparación PC: `marquee-review.html`. Usa el componente real de `index.html?marquee-reference` en un iframe **1983 × 793**, reducido solo para caber en el visor; permite superponer el original. El visor oculta únicamente los hermanos del componente dentro de su iframe para evitar restauraciones de scroll móviles. No copia el markup ni usa el prototipo como implementación.
- Franja a tamaño de ventana: `marquee-review-compact.html` o `marquee-review.html?compacto`.
- Pruebas del sitio real: `marquee-checks.html` + `js/marquee-checks.js`.
- Inventario de origen: `imports/marquee-inventory.html`; listado de Drive conservado en `imports/drive-marquee-source.html`.
- Archivos, decisiones y límites: `references/marquee/README.md`.

### Alcance y originales
- Se reemplaza únicamente el antiguo `.ticker`, situado entre hero y `#la-casa`. No se ha editado el nav, el hero, la historia, la carta ni el resto del sitio.
- **14/14 archivos de la carpeta Drive descargados con WriteFileFromUrl**, sin reexportar: fondo y once sprites en `assets/marquee/`, prototipo y captura anterior en `references/marquee/`.
- Origen: https://drive.google.com/drive/folders/10AljkvfykoeQ6BNVg_WqLhktHNngY8hg . La carpeta no contenía un `manifest.json`; `references/marquee/mount-map.json` es una transcripción identificada del mapa suministrado en el chat, no un original descargado.
- Once titulares seleccionables conservan copy, acentos y orden. Once fotografías independientes, sin deformar su proporción. El alfa se mide una vez por imagen, con resolución de análisis limitada a 700 px, para compensar el aire transparente. La imagen original completa se mantiene.
- Contexto aislado: fondo 0, **texto 10 y fotografías 20** por petición del propietario; pausa 30. Las fotos pasan delante de las letras. Sombras propias, sin sombras CSS duplicadas. Desvanecimiento común para texto y fotos.
- Fuentes locales **Antic Didone 400**, elegida expresamente por el propietario para los seis titulares serif, y **Anton 400** para los cinco sans. Antic Didone se importó del repositorio oficial Google Fonts junto con su OFL: `fonts/AnticDidone-Regular.ttf`, `fonts/AnticDidone-OFL.txt`. Bodoni ya no se usa en el marquee.
- La altura de las letras se consigue con `font-size` real; el dibujo estrecho se calibra con `scaleX` por bloque. **No hay scaleY ni negrita sintética.** Se miden acentos de todas las líneas, no solo la primera. Las fotos conservan su proporción.
- Referencia adjunta original importada sin reexportar: `images/marquee-reference-refinement.png`. Los visores comparan contra ella; el prototipo anterior sigue archivado.

### Comportamiento y accesibilidad
- GSAP local ya existente: secuencia hacia la derecha, 28 px/s, bucle por ancho real, copias `aria-hidden` e `inert`. Hover al 45 % con transición de 450 ms; salir restaura el ritmo. Son parámetros de implementación revisables, no valores deducidos de la imagen.
- Flotación más discreta: de 0 a −1,5 px durante 5 s, sin rotaciones inventadas. Movimiento suspendido fuera de pantalla o pestaña oculta.
- **Autoplay hacia la derecha tanto en PC como en móvil, sin necesidad de hover.** Se eliminó el bloqueo por puntero táctil. Pausa global y `prefers-reduced-motion` siguen prevaleciendo; no se ignoran preferencias guardadas del visitante.
- Tocar el contenido activa pausa local y deslizamiento nativo; el único control pausa/reanudar vuelve a activar la animación. **Flechas visuales anterior/siguiente eliminadas del HTML y de sus listeners.** Se conserva un control discreto de 44 × 44 px, sin tapar fotos.
- Foco visible de teclado detiene el recorrido; teclas de dirección, Home y End permiten acceder a los once elementos. Sin scroll horizontal de toda la página.
- Alturas reducidas: **180 px hasta 900 px de ancho, 200 px en escritorio intermedio y 224 px desde 1600 px**, frente a 240/260/310 anteriores. Escalas de unidades .50/.58/.68: imágenes y letras también más pequeñas. Se conserva todo el contenido, no se mete una captura encogida. El modo comparativo mantiene el lienzo completo 1983 × 793.
- **Atajos todavía sin destino:** no se han añadido enlaces ficticios ni anclas por categoría. Hace falta confirmar las correspondencias, incluida LA BUENA COMPAÑÍA.
- No se añade almacenamiento: la pausa local del marquee vive en memoria; se respeta la preferencia global ya existente. No hay llamadas a servicios externos en ejecución.

### Verificación vigente y pendientes
- `marquee-checks.html`: **51 PASS / 0 FAIL**. Carga de fondo y once sprites; decodificación de Antic Didone/Anton; seis titulares serif correctos; fotos delante del texto; ausencia de flechas; copy, conservación de hero/nav y geometría a **1983, 1280, 768 y 390 px**. Incluye autoplay hacia la derecha SIN disparar hover en un entorno táctil, ralentización, teclado, pausa, reanudación tras tocar y unión geométrica del bucle.
- Captura PC actual: https://www.genspark.ai/api/files/s/KboqSP8k . Once grupos, saltos conservados y fotografías delante. Quedan pequeños desplazamientos de algunas bebidas/platos respecto al original. **No se certifica identidad píxel a píxel.**
- Captura móvil actual: https://www.genspark.ai/api/files/s/jXCvZjXw . Franja compacta, serif fina, sin flechas, único control de pausa sin colisiones. Las capturas con Bodoni y flechas son históricas, no evidencia actual.
- El comprobador exhaustivo independiente `marquee-assets-check.html` agotó tiempo y no se reintentó. El montaje real sí decodificó y midió alfa de los once sprites. No se afirma auditoría exhaustiva de transparencia sobre múltiples fondos.
- No se emuló el cambio de la preferencia de movimiento del sistema operativo ni se probó en dispositivos físicos; sí se comprobó pausa global, modo táctil y eventos de ratón. La prueba de unión es geométrica, no una grabación de vídeo.
- Próximos pasos: revisión del propietario de tipografía/ritmo y confirmación de destinos para los atajos. No se generan nuevas imágenes ni una nueva dirección visual.

### Estado conservado de hero y nav
- Hero: **Playfair Display SC Black 900**, no Instrument Serif ni Bodoni; patio al 80 %, botones refinados y cabecera inicial sin sticky. Saludo original Nunito intacto. Calibradores: `hero-calibrador-pc.html` / `hero-calibrador-movil.html`.
- Nav: **ManEater original local**, solo etiquetas; números Fraunces. Tracking aprobado por el propietario, precarga y reajuste al cargar fuentes. Prueba previa `nav-maneater-checks.html`: 25/0 (no es una regresión nueva de esta entrega).
- El fallo heredado de sección activa en `#fuentes` sigue pendiente y fuera del alcance de este marquee.

---

## Historial anterior — puede describir versiones sustituidas

## Hero editorial desde SOMA · 21 de octubre de 2026

### Estado y entradas
- **Implementación inicial disponible; no es una reproducción pixel-perfect certificada.** La tipografía exacta solicitada está pendiente de que el propietario facilite nombre o archivo. Se utiliza provisionalmente **Instrument Serif local**, no se afirma que sea la fuente del prototipo. Nunito y el componente original del saludo se conservan.
- Sitio: `index.html`. Comparación del hero real y prototipo: `hero-review.html` (iframe 1671 × 941, reducido solo en el visor). Variantes: `hero-review.html?ancho=390` y `hero-review.html?ancho=768`. El visor pausa animaciones únicamente dentro del iframe y utiliza `?saludo=noche`; el sitio normal mantiene la hora de Ciudad de México.
- Pruebas actuales: `hero-editorial-checks.html`. Inventario y alfa: `hero-assets-check.html`. Las pruebas anteriores `hero-checks.html`/`ink-checks.html` describen el hero retirado y no validan el actual.

### Importación y alcance
- Se importaron **los 12 archivos de la carpeta Drive** mediante `WriteFileFromUrl`, sin reexportar: 7 stems WebP, círculo PNG, follaje móvil PNG, prototipo de escritorio, referencia móvil y captura previa. Fuente: https://drive.google.com/drive/folders/1PDsILiporxXwOCQK3i1OFlbUfTq9Moat . Se empleó descarga directa de `drive.usercontent.google.com` porque el endpoint `drive.google.com/uc` devolvía redirecciones que la herramienta no seguía.
- Stems en `assets/hero/`: `fondo-papel-marfil.webp`, `fotografia-patio-colonial.webp`, `follaje-primer-plano.webp`, `recorte-botanico-izquierdo.webp`, `collage-botanico-derecho.webp`, `logotipo-original-la-casona.webp`, `fotografia-plato-gastronomico.webp`, `circulo-terracota.png`, `follaje-primer-plano-mobile.png`.
- Referencias en `references/hero/`: `prototype.png` **1671 × 941**, `mobile-reference.png` **940 × 1672**, `current.png`. Copia del HTML anterior: `references/hero/index-before.html` (archivo histórico, no entrada funcional independiente).
- No había `manifest.json` en Drive: `references/hero/manifest.json` es un **mapa de montaje transcrito del mensaje**, identificado como tal, con bboxes revisadas, z-index, dimensiones intrínsecas y bounds alfa medidos. No pretende ser el manifiesto completo original descargado.
- Cambios de producción: `index.html`, nuevos `css/editorial-hero.css` y `js/editorial-hero.js`. Menú expandido, controlador de navegación, estrella, X y secciones inferiores no se han editado. La cabecera conserva su disparador real: flota sobre el hero y recupera logo/CTA al desplazar la página.
- Se retiran del arranque del índice las hojas/controladores del hero antiguo (`hero-arcade`, `hero-alive`, `ink-motion`), conservando sus archivos históricos. No se ejecuta ya la entrada WebGL del hero anterior.

### Montaje e interacción
- Capas independientes en un contexto aislado: papel 0, collage derecho 1, patio 2, recorte izquierdo 3, círculo 5, acento 6, plato 7, follaje/logo 8, información 10, titular 12–13 y acciones 14. El prototipo nunca se usa como imagen de la página.
- HTML seleccionable: «EL SABOR / DE ENCONTRARNOS» en PC; tres líneas en móvil. El tamaño se ajusta mediante font-size real, sin scaleX. En ≤900 px se reorganiza según la referencia móvil; a 390 px se reserva un alto mínimo de 780 px para controles y legibilidad.
- Las imágenes se escalan conservando proporción; se compensan márgenes alfa y se recorta por contenedores. El patio usa máscara de arco. No se añaden fotografías ni ingredientes. La procedencia del patio/plato como fotografías reales del establecimiento no se afirma.
- `js/greeting-motion.js` y `css/greeting-motion.css` **sin cambios**: SVG y secuencias originales. El reloj conserva `America/Mexico_City` y los umbrales 05–12/12–19/19–05 del controlador anterior. El reloj auxiliar queda visualmente oculto, accesible, para mantener la apariencia del prototipo. Parámetros existentes `?saludo=manana`, `tarde`, `noche` conservados.
- «Ver menú» conserva el contacto existente `wa.me/523411011861` para solicitar la carta. «Pedir en línea» abre ese contacto con un mensaje de pedido; **no hay checkout ni nueva API de pedidos**.
- Movimiento: scroll nativo de 0 a un alto de hero → título 0 a −32 px, patio 0 a −52 px, plato al 30 % de ese recorrido. Valores limitados, RAF solo al recibir eventos. Táctil, ≤900 px, pausa o reduced-motion → estado estático. Hover/foco del menú cambia contraste; flecha se desplaza 3 px. No se inventan rotaciones de stems.

### Validación y límites
- `hero-editorial-checks.html`: última ejecución **37 PASS / 0 FAIL**. Carga de imágenes/fuentes locales; titular HTML; conservación de secciones; greeting original y tres periodos; márgenes, saltos, no desbordamiento, controles de al menos 44 px y destinos WhatsApp a **1671, 768 y 390 px**; pausa, abrir/cerrar diálogo y retorno de foco. No comprueba envío real de mensajes ni emula todas las preferencias del sistema operativo.
- Comparación visual de escritorio: https://www.genspark.ai/api/files/s/b3lDJhY2 . El iframe usa 1671 × 941; la captura del visor está reducida y **no es evidencia de comparación de píxeles 1:1**. Diferencias observadas: forma/kerning del titular, recorte del patio, tamaño/posición del plato y pequeños desplazamientos de logo/acciones.
- Captura móvil real a 390 px: https://www.genspark.ai/api/files/s/B6ogafzk . Titular en tres líneas, saludo/logo separados y acciones visibles; el follaje añade ruido visual cerca del inicio del titular y del contorno del botón. No se observó scroll horizontal ni código visible. A 768 px se comprobaron cajas y comportamiento, no una captura visual dedicada.
- Pendiente: **identificar/importar la fuente exacta**, recalibrar texto y después afinar patio/plato/recortes frente al original. No hay porcentaje de fidelidad ni promesa de 100 %. Las capturas son previas a una corrección no visual de espacio semántico en el h1 y mejoras del visor.
- Sin despliegue, nueva URL pública, base de datos ni almacenamiento adicional. Solo se mantienen preferencias locales existentes. La publicación requiere autorización expresa.

### Estado heredado del menú (no modificado por este hero)
- Navegación por sección activa y estrella de tamaño constante guardadas; `nav-active-review.html` permite revisar estados. Última suite previa: 84 PASS / 1 FAIL (`#fuentes` se adelanta a A la mesa); sigue pendiente, no se presenta como corregido.
- La X actual hace salida diagonal recortada y reentrada desde el extremo opuesto, sin giro/escala/fade del trazo en el gesto. `nav-close-review.html` permite repetirlo. Última suite dedicada previa 12/0. La descripción del desplazamiento corto que sigue debajo es histórica y está sustituida por este gesto.


## Cierre revisado: diagonales independientes · 19 de octubre de 2026

- Sustituye el giro/rebote anterior, descartado por el usuario. Ahora `\` sale hacia abajo-derecha y `/` hacia arriba-derecha: cada trazo se desplaza a lo largo de su diagonal, **sin rotación ni cambio de escala**.
- Hover/foco: desplazamiento de 4 unidades SVG; toque: 7 unidades. Al salir/cancelar se vuelve suavemente a la X. Cierre: salida de 26 unidades, desfase de 35 ms y desaparición del menú; total 300 ms. Continúa desde la posición de interacción, sin saltar antes al centro.
- Solo se ha modificado el movimiento en `js/editorial-nav.js`, actualizado `nav-refinements-checks.html` y esta documentación. La flor, la estrella a 3 fps y la composición no cambian.
- **22 PASS / 0 FAIL**: direcciones opuestas en vertical, escala 1/rotación 0, toque/cancelación, doble clic, restauración al reabrir, pausa, foco, Escape y anclas, además de las comprobaciones anteriores de la flor.
- Captura móvil en reposo: https://www.genspark.ai/api/files/s/0nxgWzo7 . X sin desplazamiento residual y flor completa. La captura fija no acredita el movimiento; las trayectorias se comprobaron por las propiedades del SVG en ejecución.
- Ver/aprobar: `nav-star-review.html` o abrir «Explorar» en `index.html`. No hay despliegue ni almacenamiento nuevo. Los detalles del giro descritos en la entrega siguiente son históricos y quedan sustituidos por esta revisión.


## Flor móvil y animación del cierre · 19 de octubre de 2026

- **Flor móvil:** se reserva una franja de papel debajo de la foto de la mesa. La flor ya tenía una capa superior, pero su trazo coincidía con la fotografía; aumentar el z-index no resolvía esa coincidencia. El nuevo `max-height` de la mesa usa el alto visible de la botánica y un margen de 10–16 px. Se mantiene la posición/tamaño de la flor y no se modifica la composición de PC. Separaciones medidas: **10,03 px a 390**, **11,55 px a 576** y **15,41 px a 768**.
- **X — versión inicial, sustituida arriba:** el SVG ahora tiene dos trazos independientes, con el mismo dibujo en reposo. Ratón/foco de teclado: giro corto de 90° con rebote contenido y retorno. Al tocar: compresión breve del dibujo, sin mover la zona táctil de 48 × 48 px. Al cerrar: anticipación de 70 ms, recogida escalonada de ambos trazos y salida del menú; duración total aproximada 275 ms. No hay animación idle del botón ni nuevas librerías.
- Integración en el controlador existente `js/editorial-nav.js`: se cancelan los gestos al cerrar, pausar, cambiar la visibilidad o reabrir. Los clics repetidos no duplican el cierre. Se conservan Escape, anclas, foco y el estado estático con movimiento reducido/pausa. La estrella conserva su secuencia de 3 fps.
- Archivos cambiados: `index.html` (dos paths del cierre), `css/editorial-nav.css` (reserva de papel móvil y origen SVG), `js/editorial-nav.js` (interacciones y salida), este README. Pruebas nuevas: `nav-refinements-checks.html`.
- **Revisión interactiva:** `nav-star-review.html` abre el menú real a la anchura de la ventana. Para repetir, cerrar y pulsar «Explorar». La página respeta las preferencias de movimiento; con la pausa activada el cierre es inmediato.

### Comprobaciones de esta entrega
- `nav-refinements-checks.html`: **21 PASS / 0 FAIL**. Incluye separación flor/foto a tres anchos, caja de PC intacta, superficie táctil inmóvil, toque/cancelación, recogida de trazos, doble clic, reapertura, retorno de foco, cancel/Escape, cierre inmediato con pausa y ancla de historia.
- Captura real **móvil 390 × 844**: https://www.genspark.ai/api/files/s/1ITty4Aw . Flor completa sobre papel, sin trazos sobre la foto ni recortes, y X visible.
- Captura real **escritorio 1280 × 800**: https://www.genspark.ai/api/files/s/c01oizFg . X fina en reposo, sin duplicados ni nuevos solapamientos. Las capturas fijas comprueban composición; la animación se comprobó por estados y propiedades en navegador.
- Los objetivos históricos del Calibrador siguen siendo los prototipos aportados: el nuevo recorte de la mesa móvil es un cambio solicitado posterior y aparecerá como diferencia respecto a aquel original. La captura móvil guardada anteriormente ya no coincide con el CSS y se rechaza como evidencia vigente; no se alteró su archivo histórico para hacerla pasar.
- Pruebas breves, sin reintentos de servicio. No se emuló un cambio real de preferencia del sistema reduced-motion; la pausa del sitio sí se ejercitó. No se afirma auditoría exhaustiva de dispositivos físicos.
- Sin despliegue, nuevos datos ni almacenamiento. Permanecen las rutas de preview y las preferencias locales existentes.


## Estrella del menú · idle de tres fotogramas · 19 de octubre de 2026

- **Único cambio solicitado:** sustituir el idle anterior de rotación por la secuencia **original → nuevo 1 → nuevo 2 → original**, a **3 fps** (un corte cada 333,33 ms). Sin fundidos, giros adicionales ni fotogramas generados. No se modificaron el layout aprobado, los textos, las fotografías ni las demás animaciones.
- Implementación en `js/editorial-nav.js`, dentro del controlador existente. No se ha añadido un segundo controlador ni una librería. La secuencia funciona también con puntero táctil, no solo con ratón.
- Original: `assets/nav/ornamento-estrella-trazo-manual.webp` (1161 × 1354). Nuevos originales PNG importados sin reexportar: `images/nav-star-frame-2.png` y `images/nav-star-frame-3.png` (ambos 878 × 1024), en el orden del mensaje del usuario.
- `nav-star-assets-check.html` verifica alfa: los tres tienen aproximadamente 94 % de píxeles transparentes. Bounds visibles: original `[220,244,698,844]`, nuevo 1 `[183,201,529,639]`, nuevo 2 `[166,201,529,639]` (x, y, ancho, alto). La compensación de los márgenes transparentes mantiene el trazo en el mismo lugar, con escala uniforme y sin deformarlo. El fondo negro de la vista adjunta no se incorpora al sitio.
- Los fotogramas se precargan y decodifican antes de iniciar el bucle. Si falla un archivo, se conserva la estrella original estática; el menú sigue funcionando. No hay solicitudes nuevas en cada cambio de frame.
- Se reproduce continuamente mientras el menú está abierto y la pestaña visible. Pausar animaciones, activar reduced-motion, ocultar la pestaña o cerrar el menú detiene el temporizador y restaura el original. El token de generación invalida las cargas asíncronas de aperturas anteriores. Al reanudar, se reinicia la secuencia desde el original.
- **Ver y aprobar:** `nav-star-review.html`, que abre el menú real al tamaño de la ventana y respeta las preferencias de movimiento. En el sitio habitual (`index.html`), basta con abrir el menú. Las páginas de calibración continúan pausando el movimiento para medir el fotograma original.

### Verificación
- `nav-star-checks.html`: **15 PASS / 0 FAIL** sobre la página real. Comprueba orden de los tres frames, periodos, ausencia de rotación y saltos del contenedor, pausa/reanudación, visibilidad simulada, cierre, foco, reproducción a 390 px y navegación por ancla.
- Intervalos medidos entre cambios: **333, 334, 333, 334, 333 ms**. Son temporizadores de navegador, no una garantía de sincronización si el dispositivo está bloqueado o en segundo plano.
- Captura de escritorio revisada: https://www.genspark.ai/api/files/s/0H5izjoA . Una sola estrella transparente, sin rectángulo negro ni imagen rota; resto del menú conservado.
- La captura visual móvil devolvió `browserless sandbox renders are saturated on this pod`. No se reintentó. La reproducción a ancho móvil sí pasó la prueba funcional; queda pendiente esa captura visual. La preferencia del sistema reduced-motion está conectada al mismo bloqueo de reproducción, pero no se emuló un cambio de preferencia del sistema en esta suite.
- Sin despliegue ni nueva URL pública, sin base de datos ni almacenamiento adicional. Se mantienen únicamente las preferencias locales ya existentes.


## Actualización de PC · nueva referencia 1024 × 711 · 18 de octubre de 2026

Esta sección sustituye las indicaciones anteriores de escritorio a 1505 × 1045. El original anterior se conserva como archivo histórico, no como objetivo activo.

### Cambios y rutas
- Original de PC descargado **sin reexportar** desde el adjunto del usuario: `images/nav-prototype-desktop.png`, verificado en navegador a **1024 × 711**.
- `css/editorial-nav.css` incorpora un bloque aislado **`@media(min-width:901px)`**: recoloca el logo, textos, números, separadores, panel verde, mesa, arco, agave, estrella, botánica y cierre. Los stems siguen siendo independientes, conservan sus proporciones y los enlaces continúan como texto HTML. El agave pasa por delante del arco y su imagen sobresale del anclaje inferior, recortada únicamente por la escena.
- No se modifican el hero, las demás secciones, el controlador de navegación ni las reglas móviles. No se identifica como cierta la fuente de la referencia; se conserva Fraunces local.
- **Ver PC frente al original:** `nav-review.html`. El iframe real mide 1024 × 711 y solo se escala el visor.
- **Calibrador PC:** `calibrador.html`. Nuevo contrato `js/calibrador-desktop-spec.js`, con tinta medida directamente sobre el original mediante `nav-desktop-reference-check.html`. El selector conserva la referencia móvil.
- **Preparar captura PC:** `calibrador-captura.html`, iframe real 1024 × 711, sin movimiento, fuentes e imágenes listas. Chrome DevTools con viewport 1024 × 711 y DPR 1 permite aportar una captura exacta. La extracción auxiliar admite de forma explícita un PNG preparado 1280 × 800 con el lienzo completo en x0/y0/1024×711; no estira ni acepta otros tamaños silenciosamente.
- El control de vigencia de la captura móvil ignora exclusivamente el nuevo bloque de PC (inactivo a ≤900 px), pero sigue rechazando cambios en CSS móvil o compartido. No se ha reemplazado el CSS histórico de esa captura para hacerla pasar.

### Verificación efectiva
- Original: medidas de tinta/logo/ornamentos calculadas por máscaras RGB sobre regiones del PNG, no por una puntuación de un modelo visual.
- Informe DOM final de PC: **12/12 elementos**, sin bloqueos; geometría **98,96 %** y propiedades de estilo declaradas **100 %**. **Ninguno de estos porcentajes equivale a fidelidad visual.** Siguen registradas diferencias de alto en estrella (+8,24 px) y botánica (−5,74 px); no se deformaron los stems ni se cambiaron los objetivos para ocultarlas.
- Captura real tras los ajustes: https://www.genspark.ai/api/files/s/34lfCP6C . Se revisaron legibilidad, recortes, capas y ausencia de código visible. No se observaron textos invadidos por fotografías.
- `nav-desktop-checks.html`: comprobaciones geométricas sin desbordamiento ni intersección texto/fotos a **1024, 1280, 1505 y 1920 px**. Comparación contra el CSS móvil anterior: **sin diferencias** de cajas, tamaño de texto, tracking, z-index y posición de recorte a **390, 576 y 768 px**.
- La ejecución completa dio **18 PASS / 2 FAIL**: (1) el archivo descargado de la captura no pasó la validación estricta de dimensiones; (2) el test esperaba retorno de foco al disparador pese a haber abierto inicialmente el diálogo sin enfocarlo. Se corrigió la preparación de esta segunda prueba para enfocar el botón antes de abrir; no se cambió el controlador. **La suite corregida aún no se ha vuelto a ejecutar y no se presenta como aprobada.**
- El siguiente intento de diagnóstico devolvió `browserless sandbox renders are saturated on this pod`; se detuvieron las llamadas, según la instrucción del usuario. Por ello no hay un resultado nuevo de píxeles ni una captura móvil visual en esta revisión. El PNG descargado está en `references/nav/desktop-capture.png` únicamente para diagnóstico; no se carga automáticamente como una captura válida.
- Pendiente: comprobar dimensiones reales del archivo descargado, aportar una captura exacta/auxiliar válida, ejecutar el comparador y repetir `nav-desktop-checks.html` y `calibrador-tests.html`. Revisar visualmente móvil cuando el servicio se recupere. No se afirma 100 % de fidelidad ni que la suite completa pase.
- Sin despliegue, base de datos, backend ni cambios de acceso. Las rutas son del proyecto/preview; no se ha publicado una nueva URL de producción.


## Navegación móvil y El Calibrador · 18 de octubre de 2026

### Entradas actuales
- Sitio: `index.html`. Solo se ha ajustado el menú expandido; no el hero ni las demás secciones.
- Menú abierto en el tamaño del dispositivo: `nav-review-mobile.html`.
- **Calibrador móvil con referencia y captura guardada:** `calibrador.html?vista=movil&captura=guardada`.
- Calibrador de escritorio: `calibrador.html`. El selector «Referencia aprobada» cambia entre ambos contratos.
- Captura móvil reproducible: `calibrador-captura-mobile.html`, iframe real de **576 × 1024** en x=0, y=0, fuentes/imágenes cargadas, nav abierto y movimiento pausado.

### Referencia y composición
- Original móvil del usuario conservado sin reexportar: `images/nav-prototype-mobile.png` (**576 × 1024**). Se descargó del URL original del adjunto, no de la previsualización del chat.
- Este PNG se usa únicamente como referencia del Calibrador. **No sustituye el menú real.** El menú usa los stems locales independientes, texto HTML y enlaces/botón funcionales.
- Se conserva el orden y los destinos: La casa → `#la-casa`, La historia → `#historia`, A la mesa → `#a-la-mesa`, Ven a vernos → `#visitanos`.
- `css/editorial-nav.css`: composición vertical independiente hasta 900 px. Marca superior, cuatro enlaces a la izquierda, franja verde y estrella a la derecha, mesa detrás del arco y agave delante. Los rellenos transparentes de los stems se compensan sin reemplazar ni redibujar ilustraciones. Se preservan proporciones intrínsecas.
- La composición tiene una altura mínima proporcional al ancho. En teléfonos altos el espacio adicional se asigna al área fotográfica; en tabletas puede desplazarse verticalmente. El control de cierre mantiene 48 × 48 px y los enlaces al menos 44 px de alto.
- Sigue activa Fraunces local. No se ha identificado como cierta la tipografía de la referencia. `nav-mobile-reference-check.html` mide máscaras de tinta del original y compara candidatos tipográficos: **esa prueba de formas no mide fidelidad de la navegación**.
- `js/editorial-nav.js` sigue siendo el único controlador del menú: dialog nativo, GSAP local, Escape, foco, anclas y preferencias de movimiento. El escritorio conserva su CSS anterior.

### El Calibrador: uso y límites
1. Abre el enlace móvil de arriba. La referencia aprobada ya está cargada; el informe DOM se genera automáticamente.
2. Usa «Generar informe» y «Copiar para el agente», o descarga JSON/TXT. Incluye cajas DOM, tinta de textos simples, alfa visible de imágenes, estilos especificados y correcciones por selector.
3. «Comparar captura móvil guardada» utiliza `references/nav/mobile-capture.png`, una **captura real** de esta revisión. Se comprueba que `css/editorial-nav.css` coincide con `references/nav/mobile-capture-source.css`. Esto no detecta cambios posteriores de HTML, fuentes, imágenes o JavaScript: si cambian, genera una captura nueva.
4. Para una nueva captura exacta: Chrome DevTools → barra de dispositivos → Responsive **576 × 1024**, DPR 1 → abrir `calibrador-captura-mobile.html` → esperar al menú → «Capture screenshot», sin marco de dispositivo. Carga el PNG de 576 × 1024 en el Calibrador.
5. La herramienta de captura del agente genera **1280 × 1024**: el componente completo ocupa x=0…575 y el resto es margen blanco. Solo para ese archivo preparado se activa «Captura auxiliar móvil»: extrae exactamente x0/y0/576×1024 **sin escalar**. No se acepta como captura móvil arbitraria. La extracción se declara en el informe.
6. Un PNG de otras dimensiones se rechaza. 2×/3× requiere permiso explícito. La captura histórica de escritorio 1280 × 1045 está recortada y **no es válida** para el contrato 1505 × 1045; se necesita un navegador que capture ese viewport completo.

- Contrato móvil: `js/calibrador-mobile-spec.js`. Los objetivos proceden del original; no se ajustan para hacer pasar el DOM. Tinta roja/oscura aislada mediante umbrales RGB; bordes de fotografías establecidos sobre el original. La botánica tiene partes ocluidas y su proporción no coincide exactamente con el stem: sigue siendo una discrepancia, no un pase inventado.
- Superposición con opacidad, cuadrícula, cajas de error y mapa de diferencias. Comparación por regiones con color y bordes Sobel. Sin captura válida no hay puntuación visual ni combinada. Un 100 en estilos solo significa que pasan las propiedades declaradas, no que el diseño sea idéntico.
- Referencias y capturas elegidas se procesan localmente en el navegador. No hay base de datos, subida de archivos de visitantes, servicios de IA ni backend. `window.Calibrador` expone el informe y el motor para pruebas.

### Verificación de esta revisión y pendientes
- El original se verificó por píxeles: 576 × 1024; se midieron logo, los cuatro textos, estrella y símbolo de cierre.
- Informe móvil inicial: **12/12 elementos medidos, sin bloqueos**. Después se corrigieron los desplazamientos de texto encontrados (2–9 px). Ese informe inicial no se presenta como puntuación final.
- Se capturó la navegación real tras esos ajustes: https://www.genspark.ai/api/files/s/QGwITX9T . PNG completo 1280 × 1024, lienzo móvil izquierdo 576 × 1024; el margen blanco no forma parte del diseño.
- Al ejecutar la comparación final de píxeles, el servicio devolvió `browserless sandbox renders are saturated on this pod`. No se reintentó en bucle.
- **Pendientes:** ejecutar `calibrador-mobile-checks.html` para medir la captura real; repetir la suite funcional `nav-checks.html` tras esta revisión; inspeccionar capturas a 390 y 768 px. No se afirma 100 % visual ni una nueva validación móvil completa mientras falten esas comprobaciones.
- Los resultados históricos 38/38 del menú y 14/14 del Calibrador son anteriores a esta revisión. El test de imagen idéntica de `calibrador-tests.html` es sintético y no prueba fidelidad del menú real.
- Sin despliegue nuevo, sin modificación de datos ni autenticación. Las rutas anteriores son del proyecto/preview, no una nueva URL pública de producción.


## Importación a este proyecto · 17 de octubre de 2026

### Estado actual
- Importados los 41 archivos de texto adjuntos (12 HTML, 8 CSS, 19 JavaScript, licencia de Three.js y este README), manteniendo el diseño, textos y animaciones originales. Three.js y su licencia están en `js/vendor/`.
- Portada: `/index.html`. Laboratorio de saludos: `/greeting-lab.html`. Las ocho rutas antiguas conservan sus redirecciones. No hay proceso de compilación ni servidor propio.
- Imágenes locales: retrato, entrada, cena, ensalada, mesa, logotipo y foto del patio/jardín. Se ha utilizado la misma imagen adjunta repetida para `casona-patio.jpg` y `casona-jardin.jpg`; no se recibió una segunda fotografía distinta del patio. Confirmar si se desea diferenciarlas.
- Fuentes activas descargadas: Fraunces variable completa normal e itálica (ejes ópticos, peso, SOFT y WONK) y Nunito variable. Procedencia: paquetes `@fontsource-variable/fraunces@5.2.6` y `@fontsource-variable/nunito@5.2.6`, distribuidos por jsDelivr. Licencias OFL guardadas en `fonts/`.
- Se mantienen los nombres originales de los archivos Fraunces por compatibilidad de rutas; son nuevas descargas de la misma familia, no una verificación binaria de los archivos antiguos. Nunito se conecta mediante `css/fonts.css` en portada y laboratorio; ambas páginas ya no solicitan Google Fonts en tiempo de ejecución.
- Los archivos de WordPress/AMICI se conservan como referencia sin cargarlos en la portada. Gotham, presente solo en ese CSS antiguo, no está incluida: requiere archivos con licencia. Tampoco se han inventado las imágenes antiguas de AMICI ni la extracción `extractions/hero/` mencionadas en documentación histórica, que no venían adjuntas y no son necesarias para la web activa.
- Almacenamiento: sitio estático sin tablas, backend ni autenticación. Se mantienen las preferencias locales de movimiento y la entrada por pestaña. Sin cambios en contactos ni contenido comercial.
- Publicación: no se ha realizado ningún despliegue ni configurado una nueva URL pública.

### Verificación de esta importación
- Capturas reales de la portada en escritorio (1280×800) y móvil (390×844), tras finalizar la entrada: sin imágenes rotas, desbordamientos, texto solapado ni código visible detectados.
- Escritorio: https://www.genspark.ai/api/files/s/3jkjItZP
- Móvil: https://www.genspark.ai/api/files/s/Sji3KRjZ
- `hero-checks.html`: **15/15 PASS**, incluida entrada WebGL, liberar canvas, repetir, saltar, Escape, pausa, navegación, anclas, hora local y alternativas simple/estática.
- Nueva auditoría independiente `import-checks.html` + `js/import-checks.js`: **21 PASS / 0 FAIL**. Comprueba las doce instancias de imágenes de la portada (también las diferidas), las tres fuentes realmente cargadas, h1 única, ausencia de Google Fonts remoto, referencias desplegables, inicialización del laboratorio, nueve poses SVG y disponibilidad de controles generales. Los controles se activaron por código; no es una auditoría completa de todas sus interacciones.
- Avisos del entorno: sandbox de iframes y GPU/WebGL por software, incluido `GL_INVALID_VALUE` al subir una textura. La entrada finaliza y la suite pasa; no se afirma ausencia total de avisos ni compatibilidad probada en dispositivos físicos.
- `ink-checks.html` / `js/ink-checks.js` se importan sin alterar: la suite de tinta ya estaba desactualizada según el README original y no se utiliza como evidencia de esta importación.
- Pendientes: confirmar una foto diferente para patio si corresponde, aportar Gotham únicamente si se reactiva el archivo antiguo, actualizar la suite histórica de tinta y revisar en Safari/Android físicos. Publicar solo tras autorización.

> A continuación se conserva la documentación histórica recibida. Sus capturas, resultados y menciones a archivos de versiones anteriores no deben confundirse con las verificaciones actuales indicadas arriba.

## Saludo animado · Greeting Motion System (`js/greeting-motion.js`, `css/greeting-motion.css`)
- Saludo «Buenos días / Buenas tardes / Buenas noches» en **Nunito Black 900** (Google Fonts, OFL), de 30–42 px en escritorio y 22 px en móvil. Las tres variantes se apilan en un grid para que cambiar de saludo no mueva el layout. El punto final toma el color de la hora y salta (a 12 fps) en la pose fuerte.
- Tres iconos SVG vectoriales con poses fijas: **sol** (se estira despierto), **atardecer** (sol con peso sobre un horizonte que se arquea y cede) y **luna** (se recoge, se inclina con picardía; la estrella se estira en un destello de 4 puntas).
- Poses A anticipación · B pose fuerte · C remate (sin frame de reposo `R`). Cambian cada 333 ms exactos, sin interpolación entre poses. Line boil con 3 variantes de semilla fija por pose. La animación idle cicla continuamente todo el tiempo a 3 fps usando los 3 frames de animación (`A`, `B`, `C`).
- Parámetro `?saludo=manana|tarde|noche` para forzar un momento del día. `hero-arcade.js` sigue calculando el periodo, pero ya no escribe el texto si el saludo animado está activo.
- Respeta reduced-motion, el botón de pausa, la pestaña oculta y el hero fuera de pantalla. Con forced-colors los iconos se pintan en CanvasText.
- `/greeting-lab.html` (noindex): los tres saludos lado a lado en bucle idle continuo, avance cuadro por cuadro, cadencia de 3, 1 o 0.5 fps, hoja con los 9 dibujos (3 poses por icono), variantes de boil y tabla de tiempos.

## Movimiento vivo del hero v2 · "boceto a lápiz"
- Antes de caer cada foto, se dibuja a mano su silueta (SVG generado con semilla, cierre sobregirado + segundo trazo). La foto cae dentro, aterriza con squash, rebota y se asienta; luego el lápiz se borra.
- Line boil real: 3 variantes de trazo por foto, ciclo a 8 fps (12 fps durante el beat). El arco del patio conserva su contorno terracota vivo.
- Beat de firma (~10–13 s): el patio se aplasta, se estira y suelta 7 trazos radiales; los vecinos reaccionan con retraso según la distancia.
- Hover/tap: la foto se redibuja (vuelve el contorno) y los vecinos responden. El trazo sigue a la foto con follow-through.
- `hero-arcade.js` ya no anima las fotos si existe `data-hero-alive` (evita la doble entrada que ensuciaba el movimiento).

## Movimiento vivo del hero v1 (`js/hero-alive.js`, `css/hero-alive.css`)

- Entrada del collage por resortes: anticipación, salto, overshoot y asentamiento. El patio entra primero y los vecinos van escalonados.
- Micro-movimiento continuo con un perfil propio por foto (flotación, rotación y respiración), más un jitter "redibujado" a 6 fps.
- Beat de firma cada ~9–12 s: el arco del patio se aplasta y se estira, suelta acentos dibujados y los vecinos reaccionan con retraso.
- Line boil a 12 fps (semillas de `feTurbulence` en `#casona-boil`) solo en ramitas, arco, subrayado y acentos. Las fotos nunca se distorsionan.
- Parallax con el puntero y wobble al pasar el mouse. En táctil, la reacción es al tocar.
- Se pausa con `prefers-reduced-motion`, `motion-paused`, la pestaña oculta o el collage fuera de pantalla.
- Solo transforma `.photo-frame`, así que se conservan el `--rotate`, el z-order 1,2,3,2,1 y el scroll travel.
- Pendiente: confirmar la imagen original de `images/casona-jardin.jpg`.

## Actualización del hero: rotulación, tinta y collage
Implementada en la **portada principal**, sin rediseñar las secciones inferiores.

### Completado
- Título con Fraunces local de mayor peso (620), inicial cursiva (650), segunda línea cursiva (460) y «aquí.» terracota (610). Copy original intacto y una sola h1 accesible.
- Subtítulo en Fraunces, en dos líneas: invitación y «Esta es tu casa.» en cursiva terracota. Tamaño 19 px escritorio / 16 px móvil antes del énfasis relativo.
- **Tinta fresca sobre papel de algodón** (`#casona-printed-ink` / `-mobile`, en ambas líneas del h1). Cinco capas: contorno con humedad horizontal, sangrado capilar (blur + umbral), diente del papel, densidad de pigmento y borde secado más oscuro. Texto HTML real y accesible; forced-colors lo desactiva.
- **Movimiento de la misma tinta:** la tinta entra húmeda y se seca en 2.4 s (SMIL). Después, en `js/ink-motion.js`, el campo de humedad se desliza muy lento bajo el papel fijo, a 15 fps. El puntero cerca del título sube la humedad. Se pausa fuera de pantalla, con la pestaña oculta, con el botón de pausa, con reduced-motion y con save-data.
- Fuentes Fraunces (normal / itálica variables) en `fonts/`. `js/ink-checks.js` todavía valida los valores del filtro anterior: hay que actualizarlo.
- Entrada breve con Web Animations API: dos líneas asentándose suavemente, subtítulo y cinco fotos escalonadas del centro a los extremos. Duraciones de código 700–900 ms con retardos; sin loop continuo ni RAF adicional. Se utiliza el controlador existente, no otro motor.
- Capas del collage fijas: entrada/mesa/patio/comida/jardín = 1/2/3/2/1, también bajo hover. Se eliminó `z-index: inherit` del hover y el cambio de brillo; las fotos no cambian de nivel al apuntarlas.
- La pausa de motion cancela la entrada editorial; también se cancela al ocultar pestaña, al salir el hero de pantalla o al iniciar replay. Se respeta la preferencia reduced-motion mediante el controlador existente. Sin JavaScript queda la composición final HTML/CSS.

### Archivos y rutas
- `index.html`: filtro SVG y marcado del subtítulo; sigue siendo `/` o `/index.html`.
- `css/hero-arcade.css`: pesos, tipografía, filtro y orden fijo del collage.
- `js/hero-arcade.js`: coreografía finita en el controlador existente.
- Parámetros existentes: `?entrada=0` omite entrada y coreografía; `?entrada=1` fuerza la entrada; `?entrada=simple` usa la alternativa ligera. No se ha cambiado el modelo 3D en esta actualización.
- `extractions/hero/index.html`: extracción estática **anterior a esta actualización**, conservada como referencia con fotos/fuentes locales. Manifiesto e invariantes en `extractions/hero/README.md`; no es la nueva portada ni debe usarse para comprobar este cambio.

### Verificación de esta actualización
- Portada real revisada en escritorio 1280×800 y móvil 390×844: título, textura, subtítulo, logo y CTA legibles, sin clipping o solapamientos observados.
- Capturas: escritorio https://www.genspark.ai/api/files/s/Lm9xx2sz ; móvil https://www.genspark.ai/api/files/s/pKySnbxt . Son evidencias, no URLs de despliegue.
- 19 comprobaciones funcionales registradas como PASS: copy, única h1, definición del filtro, ruido estático, fotos cargadas, cinco casos de capas de hover, orden de capas, ausencia de captions, enlace WhatsApp, navegación, animación finita del título, animación individual de fotos, cancelación por pausa y ausencia de canvas tras entrada simple. Se observaron ocho animaciones de revelación en escritorio.
- Hover comprobado aplicando las declaraciones CSS reales mediante una clase de igual especificidad, no con un ratón físico. Captura del estado del patio sobre la página real en iframe: https://www.genspark.ai/api/files/s/rumhdGJZ . No se observaron fotos desaparecidas.
- La consola de esta suite no registró errores de aplicación; sí avisos de sandbox de iframes del entorno. Los archivos temporales `type-checks.html` / `js/type-checks.js` se retiran tras registrar resultados.
- No se midió rendimiento en teléfonos físicos ni se ejecutó emulación específica de la preferencia del sistema reduced-motion; se verificó su conexión por código y se probó el botón de pausa. No se afirma una auditoría exhaustiva de WebGL o de contraste de cada píxel del filtro.

### Límites y siguientes pasos
- Revisar el acabado visual con Alex y en Safari/Android físicos. La textura es deliberadamente sutil; no se ha realizado un benchmark de filtros SVG.
- Se mantienen la solicitud de carta por WhatsApp, las fuentes locales y las fotos auténticas. No hay nueva carta, pedidos, backend ni datos comerciales añadidos.
- No se modificaron tablas, bases de datos o reglas de acceso. La extracción no guarda datos; el sitio conserva únicamente las preferencias locales de motion y de entrada por pestaña existentes.
- Sin despliegue ni nueva URL pública. Los cambios no alcanzan un dominio Hosted hasta un despliegue aprobado.

> Las secciones siguientes documentan la primera versión de La Casona. Sus once pruebas históricas son distintas de las diecinueve anteriores; no constituyen una verificación completa de la entrada WebGL posterior. La antigua suite `hero-checks.html` conserva su resultado pendiente.

## Proyecto y objetivo
Página de storytelling para La Casona Restaurante, en Reforma 46, Zapotlán el Grande, Jalisco. Reutiliza las fuentes Fraunces del proyecto AMICI y su lenguaje editorial: tipografía de gran tamaño, cursivas, fotografías superpuestas, sellos y movimiento ligado al scroll. La página pública se ha sustituido por contenido de La Casona, no es la antigua web traducida.

La información histórica procede del texto facilitado por Alex y sus seis referencias. Se resume sin inventar una fecha de apertura del restaurante, relación de parentesco, horarios, precios ni platillos de una carta no facilitada.

## Funcionalidades completadas
- Página única en español mexicano con metadatos propios de La Casona.
- Hero con fotografías originales superpuestas, logo original y tipografía Fraunces normal/cursiva alojada localmente.
- Secciones: bienvenida, casa/patio, nacimiento del Dr. Antonio González Ochoa, recorrido profesional, reconocimiento de 1973, mesa y visita.
- Paleta de crema, verde bosque, verde salvia, melocotón y amarillo cálido, con cambios de fondo entre capítulos.
- Parallax sutil de fotografías y sellos, apariciones al entrar en pantalla, franja animada e indicador de progreso de lectura. Se conserva el scroll nativo.
- Botón para pausar animaciones, preferencia persistida localmente y respeto a `prefers-reduced-motion`.
- Navegación modal accesible: apertura/cierre, Escape, gestión de foco y enlaces a secciones.
- Desplegable con las seis fuentes históricas originales.
- «Ver menú» abre WhatsApp con un mensaje solicitando la carta, no una carta ficticia.
- Contacto por WhatsApp, enlace telefónico y búsqueda de ubicación en Google Maps.
- Fotografías de La Casona y retrato histórico alojados en `images/`.
- Diseño adaptado a escritorio y móvil.
- Entradas antiguas de AMICI redirigidas a secciones de La Casona; las cartas PDF de AMICI se han retirado.
- La página nueva no carga analítica, cookies publicitarias, Formidable ni scripts de WordPress/AMICI.

## Rutas funcionales
La entrada principal es `/` o `/index.html`. No se requieren parámetros de consulta.

| Ruta | Contenido |
| --- | --- |
| `/index.html#inicio` | Bienvenida y collage |
| `/index.html#la-casa` | Patio y casa |
| `/index.html#historia` | Nacimiento y retrato del doctor |
| `/index.html#recorrido` | Formación y trayectoria |
| `/index.html#fuentes` | Referencias históricas desplegables |
| `/index.html#a-la-mesa` | Invitación a comer y acceso al menú por WhatsApp |
| `/index.html#visitanos` | Dirección, mapa y contacto |

### Compatibilidad con las rutas anteriores
Los siguientes HTML incluyen `noindex,follow` y redirigen mediante `js/legacy-routes.js`. No son redirecciones HTTP 301. Sin JavaScript se muestra un enlace a la nueva portada.
- `/a-propos.html` → `/index.html#historia`
- `/contact.html`, `/privatisation.html`, `/recrutement.html` → `/index.html#visitanos`
- `/lesquin.html`, `/meylan.html`, `/sophia-antipolis.html` → `/index.html#la-casa`
- `/mentions-legales.html` → `/index.html#inicio`; no contiene un aviso legal de La Casona ni conserva los textos legales de otra empresa.

## Archivos activos
- `index.html`: estructura semántica y contenido.
- `css/casona.css`: estilos, fuentes, composición y breakpoints.
- `js/casona.js`: navegación, motion, preferencias y progreso.
- `js/legacy-routes.js`: compatibilidad de rutas antiguas.
- `fonts/Fraunces.7cfaf5.woff2` y `fonts/Fraunces-Italic.a5edd7.woff2`: fuentes reutilizadas de la base.
- `images/casona-*`: logo y fotografías de La Casona.
- `images/antonio-gonzalez-ochoa.jpg`: retrato histórico facilitado.

Los estilos, scripts e imágenes no utilizados de la importación AMICI permanecen en el repositorio como material de referencia; ninguna página activa los carga. No se utiliza la carta de AMICI como menú de La Casona.

## Datos, estructuras y almacenamiento
- Contenido y enlaces definidos en HTML estático; no hay base de datos ni tablas.
- No hay API propia, formularios de recogida de datos, sesiones ni autenticación.
- `localStorage['casona-pause-motion']` guarda únicamente la preferencia de animaciones (`'true'` o `'false'`). El sitio funciona aunque el navegador impida acceder a este almacenamiento.
- No se transmiten datos personales automáticamente; WhatsApp, el marcador telefónico y Maps se abren cuando el visitante pulsa sus enlaces.
- Los recursos visuales y las fuentes de la página nueva se sirven localmente, sin dependencia de imágenes del dominio AMICI.

## URLs públicas y contacto
- Producción de este proyecto: no desplegada en esta sesión. No se ha configurado dominio público.
- API del proyecto: ninguna.
- Teléfono: `+52 341 101 1861` / `tel:+523411011861`.
- WhatsApp: https://wa.me/523411011861 (los enlaces añaden `?text=` con la solicitud de carta o consulta de mesa).
- Mapa: https://www.google.com/maps/search/?api=1&query=La+Casona+Restaurante+Reforma+46+Zapotlan+el+Grande+Jalisco

### Referencias históricas facilitadas
1. https://www.saludpublica.mx/index.php/spm/article/view/4155/4036
2. https://www.saludpublica.mx/index.php/spm/article/view/4154/4035
3. https://www.saludpublica.mx/index.php/spm/article/view/4156/4037
4. http://revistas.unam.mx/index.php/rfm/article/view/73123/64502
5. http://repositorio.fciencias.unam.mx:8080/jspui/bitstream/11154/142744/1/22VBiolog%C3%ADaM%C3%A9dica.pdf
6. https://wjpr.net/abstract_file/12392

## Verificación realizada
- Capturas de la portada real en escritorio (1280 px) y móvil (390 px): tipografía, logo y collage visibles.
- Captura ampliada de escritorio y capturas móviles de las entradas históricas redirigidas: capítulos de historia, fotografía y composición revisados dentro del alcance de las capturas (la herramienta limita las capturas largas a 4000 px).
- Corregida y vuelta a comprobar visualmente en móvil la separación de «Aquí nació / Antonio / González Ochoa».
- Consola de la página principal sin errores registrados.
- Once comprobaciones funcionales sobre la página real cargada en el navegador: identidad, destinos de anclas, abrir/cerrar modal, desplegar seis fuentes, pausa de motion, enlaces de carta, teléfono, ausencia de scripts/metadatos AMICI, respuesta del progreso y carga de todas las fotografías. Todas superadas.
- No se enviaron mensajes reales ni se verificó la atención comercial del número proporcionado. Las referencias externas se conservaron, sin una auditoría de disponibilidad de terceros.
- Los archivos temporales de comprobación se eliminaron al terminar.

## No implementado / pendiente del restaurante
- Carta real en PDF o carta digital: no fue proporcionada. Por ahora se solicita por WhatsApp.
- Reservas confirmadas, disponibilidad en tiempo real o pagos: solo se ofrece una consulta por WhatsApp, nunca una confirmación automática.
- Horarios y aviso legal/privacidad propios: no facilitados, no inventados.
- Dominio final, URL canónica y URL absoluta de Open Graph para publicación.

## Próximos pasos recomendados
1. Revisar la experiencia con Alex y el restaurante.
2. Incorporar su carta real cuando se proporcione y sustituir el destino de «Ver menú» si procede.
3. Confirmar contacto, dirección e información legal antes de publicar.
4. Añadir horarios solo cuando el restaurante los confirme.
5. Publicar desde la pestaña Publish, o solicitar Hosted Deploy explícitamente si se desea ese método.
