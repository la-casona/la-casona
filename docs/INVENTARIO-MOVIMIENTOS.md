# Inventario de movimientos · La Casona

Fecha: 10 noviembre 2026. Operaciones de renombrado, sin borrar recursos originales ni sustituir bibliotecas.

## Entradas y controladores

| Origen | Destino | Ajustes posteriores |
|---|---|---|
| `index.html` | `web/index.html` | Prefijos relativos `../` de recursos; imagen Open Graph |
| `menuV2.html` | `web/menuV2.html` | Prefijos relativos `../` de recursos |
| `mesas.html` | `mesas/index.html` | Recursos comunes, navegación entre sistemas, controlador local y ejemplo de URL QR |
| `cocina.html` | `cocina/index.html` | Recursos comunes, navegación y controlador local |
| `carta.html` | `administracion/index.html` | Recursos comunes, navegación y controlador local |
| `js/v2/mesas-admin.js` | `mesas/mesas-admin.js` | Solo la URL de menú por defecto pasa a `../web/index.html#menu` |
| `js/v2/cocina.js` | `cocina/cocina.js` | Sin edición de contenido |
| `js/v2/carta-admin.js` | `administracion/carta-admin.js` | Sin edición de contenido |
| `README.md` | `docs/README-antes-reorganizacion.md` | Conservado sin edición como historial; nuevo README en raíz |

En las cinco rutas HTML antiguas se escribieron redirecciones estáticas nuevas. El HTML original de cada aplicación está en su destino, no se ha reconstruido. La redirección conserva `location.search` y `location.hash`, incluidos los códigos QR y retornos de recuperación de Supabase Auth.

## Recursos originales sueltos de la raíz

Se movieron **135 archivos** que estaban sueltos en la raíz a `originales/raiz/`, conservando sus nombres y bytes. El listado exhaustivo es el bloque `originales/raiz/` de [ARBOL-COMPLETO.txt](ARBOL-COMPLETO.txt).

**Regla exacta del inventario:** para cada archivo `F` de ese bloque, el movimiento fue `F` → `originales/raiz/F`. No incluye archivos preexistentes de `_import/`, ni ninguna imagen/fuente activa de `assets/`, `images/` o `fonts/`.

Este conjunto incluye imágenes, fuentes y licencias, bibliotecas antiguas, CSS/JS originales y referencias de diseño. Las entradas vigentes utilizaban las copias organizadas en `css/`, `js/`, `assets/`, `fonts/` e `images/`, que se mantienen en su lugar. El rastreo de dependencias y la carga de las cuatro aplicaciones no necesitaron ningún recurso de `originales/raiz/`. Esta carpeta es un archivo de procedencia, no una quinta aplicación; no se garantiza ejecutar allí demos históricas fuera de su contexto de origen. No se borró ni deduplicó su contenido.

## Carpetas compartidas conservadas sin mover

- `css/`: todos los estilos existentes, sin cambios de declaraciones ni diseño.
- `js/`: conexión Supabase, acceso del equipo, controladores web y librerías; solo salen los tres controladores exclusivos indicados arriba.
- `assets/`, `fonts/`, `images/`: contenido original intacto, sin recomprimir ni convertir.
- `supabase/`: SQL y guía intactos; no se ejecutó SQL.
- `_import/`: material de procedencia intacto.
- `docs/`: documentos anteriores conservados.
- Las ocho páginas HTML heredadas en raíz conservan su HTML; su controlador común apunta ahora a `web/index.html`.

## Ediciones de rutas en archivos no movidos

| Archivo | Cambio de rutas, no de negocio |
|---|---|
| `js/menu-integration.js` | Raíz calculada con `new URL('../', document.baseURI)`; fuente HTML en `web/menuV2.html`. CSS y controladores siguen en sus rutas comunes originales |
| `js/editorial-nav.js` | Los dos frames adicionales usan `../assets/nav/` desde `web/` |
| `js/v2/menu-data.js` | Prefijo de fotos/íconos `../assets/menu/`; productos, precios y opciones sin cambios |
| `js/v2/polished-ui.js` | Los dos componentes originales se buscan en `../assets/ui/` |
| `js/v2/staff.js` | Logo en `../images/` y enlace a `../cocina/index.html`; lógica de acceso intacta |
| `js/legacy-routes.js` | Destino de páginas heredadas: `web/index.html` y su ancla original |

`js/cloud.js`, sus claves públicas, su proyecto, métodos RPC, Auth, Realtime, tablas y claves de almacenamiento **no se modificaron**.

## Archivos nuevos permanentes

- `.nojekyll`: permite servir la estructura directamente con GitHub Pages, sin transformar ni excluir `_import/` por Jekyll.
- `js/entry-redirect.js`: redirecciones de compatibilidad, sin API ni acceso a almacenamiento.
- Nuevos alias en `index.html`, `mesas.html`, `cocina.html`, `carta.html`, `menuV2.html`.
- Nuevo `README.md` vigente.
- `docs/ARBOL-COMPLETO.txt`, este inventario y `docs/REORGANIZACION-Y-PRUEBAS.md`.

Los cuatro archivos temporales de auditoría creados durante este trabajo se retiraron al acabar. No se eliminaron archivos preexistentes.
