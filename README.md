# La Casona · web y sistemas por directorio

Sitio estático HTML/CSS/JavaScript con el Supabase existente. Reorganizado para GitHub Pages el 10 noviembre 2026, sin reconstruir aplicaciones, cambiar su diseño, modificar datos o publicar un despliegue.

## Accesos

| Uso | Ruta en un dominio raíz | Archivo |
|---|---|---|
| Web, historia y menú integrado | `/web/` | `web/index.html` |
| Mesas y códigos QR | `/mesas/` | `mesas/index.html` |
| Cocina | `/cocina/` | `cocina/index.html` |
| Administración de platillos y datos | `/administracion/` | `administracion/index.html` |
| Menú autónomo original | `/web/menuV2.html` | `web/menuV2.html` |

Se usa **administracion sin acento**. En GitHub Pages de proyecto se incluye el nombre del repositorio: por ejemplo `https://usuario.github.io/la-casona/mesas/`. Son ejemplos, no direcciones publicadas. En un dominio propio que sirva la raíz del proyecto basta `/mesas/`.

La raíz `/` conduce a la web. Las rutas anteriores `mesas.html`, `cocina.html`, `carta.html` y `menuV2.html` siguen como alias, conservando parámetros y fragmentos. También permanecen las ocho entradas heredadas y sus destinos de sección.

## Estructura

```text
la-casona/
├── web/                 # index.html y menuV2.html originales
├── mesas/               # index.html y mesas-admin.js
├── cocina/              # index.html y cocina.js
├── administracion/      # index.html y carta-admin.js
├── css/                 # estilos comunes y web, sin rediseño
├── js/                  # cloud.js, acceso, controladores web, vendor/
├── assets/              # hero/, marquee/, menu/, nav/, ui/, v2/
├── fonts/               # fuentes y licencias originales
├── images/              # imágenes y referencias originales
├── originales/raiz/     # 135 archivos originales sueltos, movidos sin borrar
├── _import/             # procedencia anterior conservada
├── supabase/            # SQL y guía, intactos; no se ejecutaron
├── docs/                # entrega, árbol completo, inventario e historial
├── index.html           # entrada de compatibilidad hacia web/
├── mesas.html           # alias hacia mesas/index.html
├── cocina.html          # alias hacia cocina/index.html
├── carta.html           # alias hacia administracion/index.html
├── menuV2.html          # alias hacia web/menuV2.html
├── [8 HTML heredados]   # ver árbol exhaustivo
├── .nojekyll
└── README.md
```

**Árbol completo, sin omitir archivos:** [docs/ARBOL-COMPLETO.txt](docs/ARBOL-COMPLETO.txt).

Las carpetas de recursos comunes se conservan en la raíz para evitar copias y mantener las referencias internas de CSS y librerías. Las cuatro aplicaciones tienen entradas independientes, pero dependen de esos recursos: **publicar la raíz completa, no solo `web/` ni cada carpeta por separado**.

## Entrega y validación

- [Inventario de archivos movidos y cambios de rutas](docs/INVENTARIO-MOVIMIENTOS.md).
- [Pruebas, problemas encontrados, límites y pasos manuales](docs/REORGANIZACION-Y-PRUEBAS.md).
- [README anterior conservado como historial](docs/README-antes-reorganizacion.md); sus rutas antiguas no son el inventario vigente.

Resultados: cuatro aplicaciones cargadas en sus nuevas entradas sin errores JavaScript observados; capturas reales del hero y del acceso de los tres paneles con diseño original. Rastreo de 135 rutas durante la auditoría, sin recursos ausentes; la cifra incluía un script temporal posteriormente retirado. La web obtuvo la carta desde Supabase (`menuSource: cloud`), menú nativo listo y sin imágenes cargadas rotas. Los alias antiguos redirigieron en navegador. Se comprobó la resolución de rutas tanto en raíz como bajo `/la-casona/`.

No se probó un inicio de sesión válido ni una comanda de extremo a extremo con cuentas/mesas reales; no se hicieron escrituras de prueba. Esas verificaciones quedan detalladas como pasos manuales, no se dan por hechas.

## QR, menú y compatibilidad

- Entrada vigente: `web/index.html?mesa=<id>&k=<codigo>#menu`.
- El menú es nativo dentro de la web, sin iframe ni scroll interior. Se mantienen hero, marquee, bienvenida/sello, animaciones y la corrección previa del scroll QR.
- El menú de respaldo sigue usando `js/v2/config.js` y `js/v2/menu-data.js`; la carta del servidor se carga con la misma conexión de siempre.
- El generador de Mesas propone la nueva URL pública del menú relativa al proyecto. La preferencia existente `casona.qrBase` no se borra ni sobrescribe: revisar y guardar la URL definitiva antes de imprimir.
- `assets/ui/entrega-v2.html` y `assets/ui/pasos-mesa-v4.html` son recursos activos del menú, **no borrarlos**.
- Los enlaces entre paneles usan `index.html` explícito para ser compatibles con el visor. En Pages también se puede entrar por `/mesas/`, etc.; el visor actual no resuelve índices de directorio y puede dar 404 al pedir solo la carpeta.

## Supabase y almacenamiento conservados

`js/cloud.js` permanece sin modificar: mismo proyecto, clave pública, Auth, RLS/RPC, Realtime y operaciones de mesas, carta, pedidos y cocina. No hay un nuevo backend ni autenticación inventada en JavaScript. El control real de los datos sigue en Supabase.

Se conservan las claves del navegador: `casonaV2.cart`, `casonaV2.sesionMesa`, `casonaV2.cliente`, `casonaV2.fulfil`, `casona.menuCache.v1`, `casona.auth`, `casona.qrBase` y `casona-pause-motion`. No hubo limpieza de almacenamiento, migraciones ni reinicializaciones.

Un cambio de dominio/origen puede requerir iniciar sesión otra vez; mover carpetas en el mismo origen no cambia esas claves. No publicar claves secretas/service_role ni modificar permisos para arreglar una ruta.

## Publicar en GitHub Pages: pendiente del propietario

1. Subir la raíz completa y configurar Pages con la rama correspondiente y `/(root)`; conservar `.nojekyll`.
2. Confirmar dominio/prefijo público definitivo. **No hay nueva URL pública ni despliegue realizado aquí.**
3. Revisar en Supabase Auth las URLs de retorno permitidas para las nuevas entradas y sus variantes `index.html`, especialmente recuperación de contraseña. No se cambiaron ajustes de Supabase desde este trabajo.
4. Guardar en Mesas la URL final del menú y comprobar un QR real antes de imprimir. Los QR de un dominio retirado necesitan revisión/reimpresión aunque existan alias en el nuevo.
5. Probar con cuentas autorizadas el acceso del equipo, recuperación, edición, impresión y recorrido de pedido mesa → cocina. No compartir contraseñas en el chat.
6. Revisar los materiales de procedencia antes de publicar un repositorio público: originales, importaciones, documentos y SQL se conservaron por encargo y un hosting estático puede servirlos como archivos públicos. No son una barrera de seguridad.
