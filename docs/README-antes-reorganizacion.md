# La Casona · web, menú y administración

Sitio estático HTML/CSS/JavaScript, sin compilación. El menú y los paneles conservan la conexión Supabase aportada por el propietario. La copia de trabajo no se publica automáticamente.

## Entradas vigentes

| Ruta | Uso |
|---|---|
| `index.html` | Web completa: hero, marquee, menú nativo e historia |
| `index.html#menu` | Sección del menú, en el mismo documento y con un único scroll |
| `index.html?mesa=<id>&k=<código>#menu` | Entrada QR: valida la mesa y aterriza en su bienvenida/sello |
| `menuV2.html` | Menú autónomo; también es la fuente de HTML del merge nativo |
| `carta.html` | Administración de carta y datos del restaurante |
| `mesas.html` | Administración de mesas, generación e impresión de QR |
| `cocina.html` | Comandas y estados para el equipo |

`#menu-digital` se conserva como alias de `#menu`. Los QR anteriores dirigidos a `menuV2.html?mesa=…&k=…` redirigen al index integrado. Antes de imprimir, configurar en Mesas la URL pública definitiva, no una dirección de preview.

## Corrección actual · carga y scroll de la entrada QR · 10 noviembre 2026

- Eliminado el enlace **«Saltar al menú»** del HTML activo y sus estilos. Era un skip-link de la demo que podía asomarse encima del marquee al integrarse. No se añade otro botón de salto.
- En una visita normal se conservan el hero, el marquee y la portada completa del menú de la demo.
- **Al escanear un QR, la web sigue completa**: hero principal, marquee y portada del menú permanecen en el documento. La llegada se sitúa en `#modeCard`, pero se puede subir y bajar libremente. Se retiraron las reglas `.qr-direct` que ocultaban la parte superior.
- `js/menu-integration.js` hace **una sola alineación inicial** después del montaje. No vuelve a posicionar por `document.fonts.ready`, validación tardía ni `casona:stamp-ready`. Wheel, toque, pulsación del puntero o teclas de navegación antes de completar la carga cancelan la llegada automática. El controlador nativo ya no añade otro scroll diferido.
- Los ocho scripts de dependencias/controladores se precargan a la vez que el HTML/CSS y se descargan en paralelo; `async=false` mantiene su orden de ejecución. El contenido local no espera la respuesta de Supabase ni todas las fuentes externas para quedar listo. Se conserva la actualización posterior de la carta desde Supabase.
- Se reserva la relación **2078/757** de las imágenes originales de fachada. El reset CSS de la integración anulaba la reserva de espacio de sus atributos HTML y la decodificación empujaba la bienvenida cientos de píxeles después de llegar. No cambia el tamaño final ni recorta la ilustración.
- El sello arranca únicamente visible, con dos frames de layout y pestaña activa. Espera solo su fuente local `Anton C`, con un máximo de 800 ms, no todas las fuentes de la página. Se mantienen el SVG, diseño, animación y movimiento reducido originales. El evento de montaje ya no controla el scroll.
- No se asigna una mesa por confiar en el número o en la URL: se conserva la validación RPC existente de Supabase. Un QR inválido muestra su aviso, no una mesa ficticia.

## Integración nativa y archivos activos

- `js/menu-integration.js`: incorpora el cuerpo del HTML local `menuV2.html` como nodos reales dentro de `section#menu`; no usa iframe, altura limitada ni scroll interior. Acota el CSS original sin alterar sus declaraciones ni breakpoints.
- `js/v2/menu-native.js` y `js/v2/patio-native.js`: controladores de la sección nativa, con consultas DOM acotadas. `js/v2/menu-v2.js` y `js/v2/patio.js`: controladores de la entrada autónoma.
- `js/menu-entry.js` y `css/menu-integration.css`: banderas de entrada, destino QR y adaptaciones exteriores.
- `js/v2/mesa-stamp.js`, `css/mesa-stamp.css`: sello original y arranque cuando es visible.
- `js/v2/polished-ui.js`, `css/polished-ui.css`: componentes originales de entrega y pasos.
- **No borrar** `assets/ui/entrega-v2.html` ni `assets/ui/pasos-mesa-v4.html`: son recursos activos que carga el menú para sus ilustraciones y animaciones, no páginas de test.
- `js/cloud.js`: conexión y operaciones de Supabase. Solo usa la configuración pública ya aportada; nunca introducir claves secretas o service_role en el navegador.

El HTML y el CSS de diseño se comparten con `menuV2.html`. Para futuras actualizaciones de lógica, revisar las pequeñas adaptaciones de ámbito de los controladores nativos. No serializar los shorthands de fuente con variables a través de CSSOM: puede perderse el `font` cuando coexiste con `font-variant-numeric`.

## Nav completo · 10 noviembre 2026

- Instalados los originales aportados: `assets/nav/logotipo-la-casona-restaurante.webp`, `assets/nav/ilustracion-lineal-botanica-terracota.webp`, `assets/nav/ornamento-estrella-trazo-manual.webp`, `assets/nav/estrella-frame-2.png` y `assets/nav/estrella-frame-3.png`.
- Los tres 404 históricos se debían a referencias cuyos archivos no estaban en las importaciones anteriores. Resueltos con los archivos suministrados, sin sustitutos ni rediseño.
- `js/editorial-nav.js` utiliza ahora los tres frames de esta carpeta. Se conserva la animación original a 3 fps y se registran los límites alfa de los nuevos PNG de 1161 × 1354 para no desplazar la estrella entre frames. Se mantienen pausa, movimiento reducido y navegación originales.
- Verificado visualmente el nav abierto: [móvil](https://www.genspark.ai/api/files/s/waXVEek3) y [escritorio](https://www.genspark.ai/api/files/s/DqFv5NAK). Logo arriba a la izquierda, estrella y flor abajo a la izquierda presentes; hero y marquee sin cambios.

## Limpieza realizada

Se retiraron los HTML de pruebas, visores, auditorías, mediciones, laboratorios y calibradores sin consumidores activos, sus scripts duplicados en la raíz y `js/`, sus estilos exclusivos y los verificadores temporales de `_import/`. También se retiraron los archivos temporales creados para comprobar esta corrección: no se deja una mesa simulada ni un modo de prueba en producción.

También se eliminaron los **12 HTML restantes de `_import/`**: listados de Drive, respaldos de index y copias archivadas del menú/paneles/animaciones. No queda ningún HTML en `_import/`, ni se conservan los visores y scripts temporales de esta revisión.

Se conservan imágenes, fuentes/licencias, código funcional, materiales no HTML bajo `_import/`, documentación y SQL de instalación en `supabase/`. Los SQL no se han ejecutado. Las ocho rutas heredadas (`a-propos.html`, `contact.html`, `lesquin.html`, `mentions-legales.html`, `meylan.html`, `privatisation.html`, `recrutement.html`, `sophia-antipolis.html`) son redirecciones de compatibilidad al index mediante `js/legacy-routes.js`, no pruebas ni importadores. Se mantienen para no romper entradas antiguas. Los materiales históricos pueden mencionar archivos eliminados; esta página describe el estado vigente.

Fuentes autorizadas:
- Importación inicial: https://drive.google.com/drive/folders/1Odv_-4iB-gTtuCo0AINVWki245kGjuoQ
- Menú y sistemas: https://drive.google.com/drive/folders/1UQbh2ny9jPSlS4maorJIoAtd8jM11GRG
- Recursos del nav: https://drive.google.com/drive/folders/1nn-il9oOCy0vv3POX9e3pfz9j1o81Uy2

## Almacenamiento y acceso

- Supabase existente: configuración, categorías, productos, extras, mesas, sesiones temporales, pedidos, líneas de pedido y equipo.
- Supabase Auth y RLS/RPC del servidor controlan el acceso a datos; la pantalla de login solo organiza la interfaz. No se cambian permisos, cuentas ni políticas durante esta corrección.
- Claves del navegador conservadas: `casonaV2.cart`, `casonaV2.sesionMesa`, `casonaV2.cliente`, `casonaV2.fulfil`, `casona.menuCache.v1`, `casona.auth`, `casona.qrBase` y `casona-pause-motion`.
- Sin limpieza, migración ni reinicialización de registros de visitantes; sin pedidos de prueba, mesas o cuentas nuevas en el servidor.

## Verificación y límites

- **Revisión actual del scroll:** se instrumentó temporalmente el index real con una URL QR incompleta (sin `k`): no se creó una sesión ni se simuló una mesa válida. Se observó una sola llamada inicial de scroll, la tarjeta a 12 px del borde superior y sin el desplazamiento posterior de ~395 px que causaba la fachada al cargar. Subir a `scrollY=0` conservó hero y marquee visibles; un evento tardío de sello no produjo otra llamada de scroll. Una interacción wheel antes de terminar el montaje canceló la llegada (0 llamadas automáticas). Los ocho scripts comenzaron sus descargas simultáneamente en la captura de recursos.
- Verificación visual tras entrar por QR y volver arriba: [móvil](https://www.genspark.ai/api/files/s/RxIctAYg) y [escritorio](https://www.genspark.ai/api/files/s/AnRyZBIp), con hero completo, sin código visible ni límite de scroll en el menú. También se revisó la tarjeta de aviso de QR incompleto. La instrumentación temporal y su referencia se eliminaron tras la prueba.
- Las capturas anteriores que mostraban hero/marquee ocultos correspondían al comportamiento retirado; no describen ya la entrada QR actual.
- Auditoría posterior a la limpieza: cinco entradas activas y 37 recursos HTML/CSS/JS necesarios, sin archivos ausentes. Los tres paneles siguen mostrando login sin sesión. El index real carga su menú sin errores JavaScript observados. [Vista normal móvil](https://www.genspark.ai/api/files/s/MteuiIZY).
- Auditoría ampliada tras instalar el nav y eliminar los HTML archivados: **120 recursos locales comprobados, 0 ausentes y 0 imágenes cargadas rotas**. Incluye las cinco entradas, dependencias HTML/CSS/JS, fuentes, imágenes del documento, ilustraciones y fotos declaradas en `menu-data.js`. El bucle de la estrella recorrió los estados 0, 1 y 2. Los tres 404 del nav están resueltos. La cifra incluye el script temporal de auditoría, retirado después. Google Fonts sigue siendo una dependencia externa; la auditoría de archivos locales no garantiza disponibilidad futura de servicios externos ni imágenes que se incorporen después desde el backend. El capturador avisó de actividad de red prolongada, sin impedir terminar la auditoría.
- La comprobación de QR incompleto y scroll no certifica una sesión QR real ni una comanda de extremo a extremo. No se generaron mesas, sesiones o pedidos de prueba. Pendiente: comprobar «Probar» con una mesa real en el teléfono y origen del propietario. No se dispone de su URL exacta de prueba ni de una medición de carga en ese dispositivo; no se promete un tiempo fijo de carga.
- **Sin despliegue ni nueva URL pública.** Los cambios están en la copia de trabajo/previsualización. Actualizar un dominio publicado requiere autorización independiente y despliegue aprobado.

## Forma de trabajo

Implementar el código y diseños que aporte el propietario; realizar tareas sencillas cuando se soliciten, sin rediseños ni funcionalidades añadidas por iniciativa propia. Mantener el directorio libre de páginas de prueba permanentes que no sean necesarias.
