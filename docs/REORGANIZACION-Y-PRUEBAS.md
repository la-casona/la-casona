# Entrega técnica · reorganización de La Casona

10 noviembre 2026. Preparación estática para GitHub Pages; **sin despliegue realizado**.

## 1. Organización y rutas

Las cuatro aplicaciones originales tienen entradas propias:

| Sistema | Entrada física | Ruta corta en Pages |
|---|---|---|
| Web y menú | `web/index.html` | `/web/` |
| Mesas y QR | `mesas/index.html` | `/mesas/` |
| Cocina | `cocina/index.html` | `/cocina/` |
| Carta y datos | `administracion/index.html` | `/administracion/` |

Se usa `administracion` sin acento. Con un dominio propio en la raíz, esas son las rutas completas. En un proyecto Pages publicado bajo `https://usuario.github.io/la-casona/`, se antepone `/la-casona/`: por ejemplo `/la-casona/mesas/`. Pages resuelve el directorio con `index.html` y normaliza la barra final; no hace falta router, framework, backend ni reglas de reescritura.

La raíz `index.html` conduce a `web/index.html`. Los enlaces internos usan los archivos `index.html` explícitos para funcionar también en el visor de este proyecto, que **no sirve directorios por su índice**. Esto no elimina el acceso por rutas cortas en Pages; sí implica que al navegar internamente la barra puede mostrar `index.html`.

Los sistemas comparten `css/`, `js/`, `assets/`, `fonts/` e `images/`. Independencia aquí significa entradas/controladores separados, no cuatro copias autosuficientes: **no subir únicamente `web/` ni mover una aplicación fuera de esta raíz común**. Esa sería otra operación con otras rutas.

- Árbol exhaustivo: [ARBOL-COMPLETO.txt](ARBOL-COMPLETO.txt).
- Inventario exacto y reglas de movimiento: [INVENTARIO-MOVIMIENTOS.md](INVENTARIO-MOVIMIENTOS.md).

## 2. Alcance conservado

No se reconstruyó HTML, no se cambiaron declaraciones CSS, productos, precios, estados, roles, validaciones, permisos ni algoritmos. Las ediciones funcionales se limitan a resolución de rutas, navegación y dirección por defecto del QR. Los controladores de cocina y carta se movieron sin editar su contenido. Se conservan el menú integrado, su entrada autónoma, ilustraciones HTML originales, animaciones, sonido generado por cocina, paneles, diálogos y llamadas de negocio existentes.

No se modificó `js/cloud.js`, la URL/clave pública de Supabase, SQL, RLS, Auth, RPC, Realtime ni librerías/versiones. No se crearon cuentas, sesiones de mesa, mesas o pedidos de prueba. No se borraron datos ni claves de localStorage. Las copias históricas se conservaron mediante movimientos, no mediante borrado o sustitución.

## 3. Rutas y referencias revisadas

- HTML: recursos relativos `../css/`, `../js/`, `../assets/`, `../fonts/`, `../images/` desde las cuatro carpetas.
- CSS: se conserva su ubicación y sus `url('../fonts/...')`, `url('../assets/...')`; por eso no necesita reescribir ni duplicar estilos.
- Integración del menú: raíz del proyecto relativa al documento web; HTML en `web/menuV2.html`; scripts y estilos comunes desde esa raíz. La secuencia de descarga/ejecución se conserva.
- Imágenes creadas por JavaScript: fotos/íconos del menú, frames de la estrella y logo del acceso al equipo revisados para la nueva profundidad.
- Componentes cargados por fetch: `assets/ui/entrega-v2.html` y `assets/ui/pasos-mesa-v4.html` se mantienen y sus rutas se ajustaron.
- QR: el valor por defecto es `new URL('../web/index.html#menu', location.href)`. Una preferencia existente `casona.qrBase` no se borra ni sobrescribe. `js/cloud.js` sigue generando los mismos parámetros `mesa` y `k` y validando con los mismos servicios.
- Compatibilidad: `index.html`, `mesas.html`, `cocina.html`, `carta.html`, `menuV2.html` redirigen conservando consulta y fragmento. Las ocho entradas históricas continúan con sus secciones correspondientes del nuevo index.
- No se añadieron rutas locales absolutas `/css`, `/assets`, `/mesas`, etc. Las URL absolutas externas de Supabase, Google Fonts, Maps, WhatsApp y fuentes históricas siguen externas.

## 4. Pruebas ejecutadas

### Auditoría de recursos

Rastreo de las cuatro entradas, menú autónomo, alias, páginas heredadas y recursos HTML/CSS/JS, fuentes e imágenes. Incluyó los recursos declarados dinámicamente por la integración y las fotos/íconos de `menu-data.js`.

Resultado final de la ejecución: **135 rutas locales comprobadas, 0 ausentes, 0 referencias locales absolutas a la raíz detectadas en el rastreo HTML/CSS**. Se identificaron 14 destinos externos, sin prometer su disponibilidad. La cifra incluye un script temporal de inspección, retirado después; no es un conteo del total de archivos del repositorio.

La primera pasada encontró 404 en `mesas/`, `cocina/`, `administracion/` porque el visor no resuelve índices de directorio. Se cambiaron enlaces internos/alias a archivos `index.html` explícitos y se repitió el rastreo con resultado vacío de ausentes. No se añadió una falsa implementación de rutas en JavaScript ni se alteró el servidor.

### Carga y renderizado reales

- `web/index.html`: selector `#menu[data-native-ready="true"]`, sin errores JavaScript observados. [Captura móvil](https://www.genspark.ai/api/files/s/5GhbYpi3): hero, imágenes y marquee originales presentes.
- `mesas/index.html`: selector `#loginForm`, sin errores JavaScript observados. [Captura escritorio](https://www.genspark.ai/api/files/s/s4ZhWipj): logo, navegación y acceso originales.
- `cocina/index.html`: selector `#loginForm`, sin errores JavaScript observados. [Captura móvil](https://www.genspark.ai/api/files/s/bDZwT3VX): acceso original, sin imágenes rotas ni desbordamiento.
- `administracion/index.html`: selector `#loginForm`, sin errores JavaScript observados. [Captura escritorio](https://www.genspark.ai/api/files/s/Drzcu1Fa): diseño y acceso originales.
- `web/menuV2.html`: menú autónomo cargado; selector `#indexGrid li a`, sin errores JavaScript observados. Un primer selector de prueba inexistente (`.index-link`) agotó el tiempo; corregido el selector, la prueba pasó sin cambiar la aplicación.
- Alias antiguos `index.html`, `mesas.html`, `cocina.html`, `carta.html`: navegación real a las nuevas aplicaciones completada en navegador.
- Conservación de consulta/fragmento: evaluada para los cinco alias con parámetros y fragmento de recuperación ficticios, sin autenticación ni RPC de mesa.

### Supabase y comunicación

En el index real, mediante inspección temporal de solo lectura:

- `CasonaCloud.configured === true`.
- `CASONA_DEBUG.state.menuSource === 'cloud'`: la carta vino del backend, no solo del respaldo local o caché.
- `CasonaCloud.auth.staff()` devolvió `null` en navegador sin sesión; no se expuso el panel por moverlo de carpeta.
- Menú nativo listo y **0 imágenes cargadas rotas**.
- Revisión de código: todos siguen usando la misma conexión `js/cloud.js`, clave `casona.auth`, tablas, RPC y suscripción Realtime. Las llamadas de escritura y sus firmas no se editaron.

Se verificó la conexión de lectura y el estado anónimo, **no un inicio de sesión válido ni pedidos de extremo a extremo**. Sin una cuenta autorizada y una mesa real no se puede afirmar que se probaron edición, impresión autenticada, recuperación por correo o llegada de comandas a cocina. No se pidieron contraseñas ni se hicieron escrituras para aparentar esa comprobación.

### Resolución bajo subdirectorios

Se evaluó la resolución con `new URL` usando dos bases:

- `https://example.com/` → QR por defecto en `https://example.com/web/index.html#menu`.
- `https://usuario.github.io/la-casona/` → QR en `https://usuario.github.io/la-casona/web/index.html#menu` y CSS en `https://usuario.github.io/la-casona/css/admin.css`.

Es una prueba de resolución de rutas; **no equivale a haber publicado esos dominios ni haber probado Pages en producción**.

### Advertencias del entorno

El navegador de herramientas muestra un aviso de sandbox del iframe de previsualización. En el rastreo estático avisó de red todavía activa, pero entregó los resultados completos. Los cuatro puntos de entrada cargaron y las capturas terminaron.

Se intentó además una segunda comprobación HTTP de todo el árbol, incluidos originales históricos: el visor rechazó HEAD con 405 y el intento con GET/cancelación de cuerpo encontró `ERR_HTTP2_PROTOCOL_ERROR`/timeout. Se omitió esa comprobación adicional conforme a la autorización del propietario para no insistir con el servicio de pruebas. No es un resultado de archivos ausentes ni una prueba exhaustiva completada. El árbol se elaboró con el listado del repositorio; los movimientos se verificaron con las respuestas de renombrado y el rastreo funcional de 135 rutas sí terminó satisfactoriamente. No se dejaron páginas/scripts de auditoría ni simulaciones.

## 5. Intervención manual antes de dar por cerrado el despliegue

1. Subir **la raíz completa del proyecto** al repositorio. En Settings → Pages elegir la rama que contenga estos cambios y la carpeta `/(root)`; conservar `.nojekyll`. No publicar solo una de las cuatro carpetas. Si ya se utiliza un flujo de Actions propio, su artefacto debe contener esta misma raíz.
2. Confirmar la URL definitiva: dominio propio o prefijo del repositorio. Todavía no se proporcionó esa URL y no se creó ninguna publicación desde aquí.
3. En Supabase Auth → URL Configuration, revisar manualmente Site URL y Redirect URLs para las nuevas entradas del equipo, tanto las variantes de carpeta como `index.html` que realmente se usarán. El método de recuperación conserva el mismo `redirectTo` derivado de la página actual; la nueva URL debe estar permitida. **No cambiar RLS ni permisos** para resolver una URL de retorno.
4. En Mesas, revisar «Dirección del menú en los QR» y guardar la URL pública final, por ejemplo `https://usuario.github.io/la-casona/web/index.html#menu`. Las preferencias antiguas no se alteraron. Los QR antiguos con un origen aún disponible funcionan mediante alias; un QR que apunta a un dominio/preview retirado no puede repararse con rutas locales y necesita reimpresión.
5. En el sitio ya publicado, verificar `/web/`, `/mesas/`, `/cocina/`, `/administracion/` (con prefijo de repositorio si corresponde), navegación entre paneles y acceso con roles reales. Comprobar inicio/cierre de sesión, correo de recuperación, crear/editar un platillo autorizado, leer/probar/imprimir un QR real, y enviar un pedido controlado de esa mesa hasta cocina. Comprobar sonido y cambios de estado con el equipo.
6. Si cambia el origen respecto a la web anterior, es normal tener que iniciar sesión otra vez: localStorage y sesiones del navegador son por origen. No borrar almacenamiento ni intentar migrar tokens manualmente.
7. Los materiales `originales/`, `_import/`, documentación y SQL son archivos de procedencia, no rutas de administración. Una publicación estática puede servirlos como cualquier otro archivo; revisarlos antes de publicar en un repositorio público. Se conservaron por encargo, no son un mecanismo de protección. La seguridad de los datos de negocio sigue siendo Supabase Auth/RLS.

Sin despliegue, migraciones, cambios de cuentas o alteraciones de seguridad ejecutados durante esta reorganización.
