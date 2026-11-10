# La Casona · Menú digital, mesas QR y administración

Sitio estático HTML/CSS/JavaScript, sin compilación, conectado al backend Supabase existente. La conexión del navegador se centraliza en `js/cloud.js` y usa la clave pública; los permisos reales se aplican con Auth y RLS en el servidor.

## Logo en los sistemas internos

El archivo original aportado por el propietario está en `images/logo-la-casona.png`, sin redibujarlo ni modificar sus colores. Se utiliza en el encabezado superior izquierdo de `carta.html`, `mesas.html` y `cocina.html`, y en las tarjetas de acceso del equipo generadas por `js/v2/staff.js`. El CSS de administración encuadra los márgenes vacíos de la imagen y mantiene sus proporciones y el dibujo completo.

**No se agregó el logo a `menuV2.html` ni se modificaron su portada o sus animaciones.** No se cambiaron permisos, datos ni lógica de acceso. Se revisaron encabezado y acceso en escritorio y móvil y la carga de Mesas/Cocina, sin añadir páginas de prueba al Workspace. No se realizó despliegue.

## Páginas vigentes

| Archivo | Uso |
|---|---|
| `menuV2.html` | Menú de clientes, carrito y pedidos en mesa o en línea |
| `menuV2.html?mesa=<id>&k=<código>` | Entrada desde el QR de una mesa; valida y abre su sesión temporal |
| `carta.html` | Administrador: secciones, CRUD de platillos y datos del restaurante |
| `mesas.html` | Administrador: mesas, códigos QR y tarjetas imprimibles |
| `cocina.html` | Equipo admin/cocina: comandas y estados en tiempo real |

No se añadió `index.html` ni se cambió la página de entrada del proyecto.

### Dos HTML de recursos que deben conservarse

- `assets/ui/entrega-v2.html`
- `assets/ui/pasos-mesa-v4.html`

**No son páginas de prueba ni borradores sobrantes.** `js/v2/polished-ui.js` los carga para extraer los SVG, estilos y controladores originales de las animaciones instaladas. Borrarlos impediría cargar las versiones nuevas de entrega y pasos de mesa. Sus estilos se aíslan del resto del menú mediante clases de componente; las fuentes son las locales del proyecto.

## Limpieza del Workspace

A petición del propietario se retiraron **15 HTML auxiliares**: las ocho páginas de pruebas, los tres standalone de trabajo, el menú antiguo de referencia y las tres referencias HTML duplicadas. También se retiraron los scripts de pruebas y los CSS/JavaScript exclusivos de esas páginas, ya sin consumidores.

Quedan cuatro páginas HTML principales en la raíz y los dos HTML de recursos activos indicados arriba. No se tocaron imágenes, fuentes/licencias, datos, SQL, credenciales/configuración del backend ni código funcional del menú o de administración.

Se conservaron `content.json`, la guía SQL, el borrador de privacidad y los Markdown de origen. `README-original.md` y `docs/README-drive.md` son documentos históricos de la importación: pueden mencionar herramientas o páginas que ya se retiraron; este README describe el estado actual.

Verificación tras la limpieza: sin referencias desde los HTML/JavaScript activos a las páginas y scripts eliminados; menú con Entrega v2 cargada y acceso de Carta sin errores JS observados; portada revisada visualmente en móvil. No se hicieron escrituras reales, migraciones ni despliegues.

## Administrador: secciones y CRUD de platillos

Entrar con una cuenta de **admin** en `carta.html`.

- **Nueva sección:** nombre de 1–60 caracteres; se agrega activa al final. Las secciones vacías se muestran en administración, pero aparecen en el menú público al tener al menos un platillo visible.
- **Nuevo platillo:** sección, nombre de 1–80 caracteres, precio MXN de 0 a 99,999.99 con hasta dos decimales y descripción opcional de hasta 300 caracteres. Se agrega visible y disponible al final de su sección.
- **Editar:** diálogo con nombre, descripción, sección, precio, disponible y visible. Conserva el ID y los extras; cambiar de sección lo coloca al final del destino. Cancelar no guarda. Los errores mantienen la edición escrita.
- **Eliminar:** confirmación explícita antes del borrado definitivo. También se eliminan sus extras por la relación existente. Para retirarlo temporalmente, desmarcar «Visible» en lugar de eliminar.
- Se conservan los controles rápidos de precio, disponible y visible, y los filtros de búsqueda, agotados y ocultos.
- El administrador también configura teléfono, WhatsApp, envío, pagos, recogida y duración de las sesiones de mesa.

Los cambios se ven al recargar el menú público. Una sección oculta mantiene sus platillos fuera del menú público aunque estén marcados como visibles.

Las altas utilizan INSERT con ID estable durante un intento; las ediciones utilizan UPDATE por ID, nunca un alta de respaldo. El borrado solo se refleja como éxito tras recibir el ID eliminado del servidor. Se bloquean operaciones simultáneas sobre el mismo platillo y no se guardan altas o cambios en localStorage como alternativa al backend. Si se pierde la conexión, comprobar la carta antes de repetir una operación cuyo resultado no se confirmó.

Según el esquema existente, `pedido_items.producto_id` tiene `ON DELETE SET NULL` y cada pedido conserva copias de nombre y precio: editar o borrar un platillo no reescribe el historial. Los extras tienen `ON DELETE CASCADE`.

El CRUD completo corresponde a **platillos**; las secciones cuentan con creación, no con eliminación desde este panel. Las políticas de INSERT/UPDATE/DELETE para admin ya están en el esquema original; no se alteraron permisos ni se ejecutó SQL durante estas mejoras.

## Frontend instalado

- Portada «¿Qué deseas pedir hoy? · La Casona», patio botánico SVG, sombras, flores y fuentes locales.
- Cielo por hora local: día de 6:30 a 17:30, atardecer de 17:30 a 20:00 y noche el resto. Para revisar: `menuV2.html?cielo=dia|tarde|noche`.
- Entrega v2: moto, paquete/casa y bolsa con cara, campana y plantas. Selección por clic o teclado conectada al pedido; el precio de envío proviene de la configuración real, no del importe de demostración del recurso.
- Pasos Mesa v4: ficha que viaja entre plato, ticket y campana, solo en modo mesa. Los pasos del pedido en línea «Elige / Tus datos / WhatsApp» se conservan.
- Sello QR en `js/v2/mesa-stamp.js` y `css/mesa-stamp.css`: solo sello animado e impresión roja sobre fondo transparente, sin ticket, fondo negro ni marco añadido; número de la sesión existente.
- Pausas de animación fuera de pantalla/pestaña, limpieza de controladores al redibujar el modo y soporte de movimiento reducido. El sello usa Anton local y Space Mono de Google Fonts, como en el diseño aportado.

## Backend, instalación y almacenamiento

Guía: `supabase/GUIA-INSTALACION.md`. Scripts conservados, no ejecutados por esta limpieza:

1. `supabase/01_instalar.sql`: tablas, funciones y RLS.
2. `supabase/02_menu_inicial.sql`: carta inicial; no debe usarse para sustituir cambios del propietario.
3. `supabase/03_primer_admin.sql`: asignación del primer administrador.
4. `supabase/04_pruebas_seguridad.sql`: comprobaciones de permisos del backend; se conserva porque es documentación/SQL útil, no una página HTML de pruebas.

La configuración de conexión existente permanece en `js/cloud.js`. Usar solo la Project URL y la clave publishable/anon, nunca claves secretas o service_role en el navegador.

Tablas principales de Supabase:
- `config`: datos y reglas del restaurante.
- `categorias`, `productos`, `producto_extras`: carta.
- `mesas`: mesas, token y versión QR, solo admin.
- `casona_private.sesiones_mesa`: sesiones temporales, accesibles por funciones.
- `pedidos`, `pedido_items`: pedidos e historial.
- `staff`: cuentas del equipo y roles admin/cocina.

`staff.js` organiza la interfaz de acceso; no sustituye la autorización RLS del servidor. La lectura pública de carta utiliza Supabase y conserva la caché existente de siete días como respaldo. Sin conexión/configuración, se conserva el comportamiento previo del menú local.

Claves existentes del navegador, sin cambios:
- `casonaV2.cart`: carrito.
- `casonaV2.sesionMesa`: sesión de mesa.
- `casonaV2.cliente` y `casonaV2.fulfil`: datos de entrega y modalidad.
- `casona.menuCache.v1`: caché de la carta.
- `casona.auth`: sesión del equipo.
- `casona.qrBase`: dirección base de los QR.

Una sesión QR caduca por inactividad, duración máxima, desactivación de mesa, cambio de QR o salida voluntaria. Sin sesión, el menú funciona en modo pedido en línea.

## Verificaciones y trabajo pendiente

Antes de retirar los archivos auxiliares se probaron, con backend simulado en memoria, altas, edición, cancelación, borrado, rechazos, conservación de registros ajenos/historial, selección de entrega, carrito, animaciones y renderizado responsive. Las páginas de esas pruebas se eliminaron por solicitud del propietario. Esas comprobaciones no certifican permisos o pedidos reales contra producción.

No se ha realizado despliegue mediante el asistente ni se ha generado una URL pública nueva. Los cambios del repositorio no actualizan una publicación anterior sin su despliegue autorizado.

Pendientes del propietario: comprobar configuración y permisos reales en su servidor, revisar datos comerciales y `docs/AVISO-PRIVACIDAD-BORRADOR.md`, y aprobar la publicación cuando corresponda.

Forma de trabajo: implementar el código y diseños que proporcione el propietario; crear standalone cuando lo solicite, sin añadir rediseños ni funcionalidades por iniciativa propia.
