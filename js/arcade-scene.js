/* A conceptual arcade, not a measured reconstruction of the restaurant.
   Three.js r160 (MIT). Geometry only; one optional, authentic patio texture. */
import * as THREE from './vendor/three.module.min.js';

export function createArcadeScene(container, photo, onContextLost) {
  const mobile = window.matchMedia('(max-width: 700px)').matches;
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new THREE.WebGLRenderer({canvas, alpha: false, antialias: !mobile, powerPreference: 'low-power'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5));
  renderer.setClearColor(0xeee8d6, 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(mobile ? 55 : 42, 1, .06, 40);
  const resources = new Set();
  const own = item => { resources.add(item); return item; };
  const material = (color, roughness = 1) => own(new THREE.MeshStandardMaterial({color, roughness, metalness:0}));
  const sage = material(0x64784c);
  const sageSide = material(0x364c32);
  const cream = material(0xd9c8a3);
  const rust = material(0x9c533c);
  const floorGreen = material(0x4f6343);
  const floorCream = material(0xe5ddc7);
  scene.add(new THREE.HemisphereLight(0xfffae5, 0x566543, 2.5));
  const sun = new THREE.DirectionalLight(0xffedc5, 3.2);
  sun.position.set(-5, 8, 6);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xd8dfd0, 1.1);
  fill.position.set(5, 3, -3);
  scene.add(fill);

  function archGeometry(radius, thickness, spring, depth) {
    const shape = new THREE.Shape();
    const outer = radius + thickness;
    shape.moveTo(-outer, 0);
    shape.lineTo(-outer, spring);
    shape.absarc(0, spring, outer, Math.PI, 0, true);
    shape.lineTo(outer, 0);
    shape.lineTo(radius, 0);
    shape.lineTo(radius, spring);
    shape.absarc(0, spring, radius, 0, Math.PI, false);
    shape.lineTo(-radius, 0);
    shape.closePath();
    return own(new THREE.ExtrudeGeometry(shape, {depth, bevelEnabled:true, bevelSegments:1, steps:1, bevelSize:.018, bevelThickness:.018, curveSegments:24}));
  }
  const arch = archGeometry(1.06, .19, 2.17, .26);
  const archMolding = archGeometry(1.075, .025, 2.17, .022);
  const baseGeometry = own(new THREE.BoxGeometry(.36, .16, .44));
  const capitalGeometry = own(new THREE.BoxGeometry(.40, .09, .43));
  const beamGeometry = own(new THREE.BoxGeometry(8.0, .16, .39));
  const group = new THREE.Group();
  scene.add(group);
  for (let depth = 0; depth < 3; depth++) {
    const row = new THREE.Group();
    row.position.z = -depth * 2.35;
    group.add(row);
    for (const x of [-2.52, 0, 2.52]) {
      const mesh = new THREE.Mesh(arch, depth === 1 ? [cream, rust] : [sage, sageSide]);
      mesh.position.x = x;
      row.add(mesh);
      const molding = new THREE.Mesh(archMolding, cream);
      molding.position.set(x, 0, .285);
      row.add(molding);
      for (const side of [-1, 1]) {
        const base = new THREE.Mesh(baseGeometry, depth === 1 ? cream : sage);
        base.position.set(x + side * 1.16, .08, .13);
        row.add(base);
        const capital = new THREE.Mesh(capitalGeometry, cream);
        capital.position.set(x + side * 1.16, 2.15, .13);
        row.add(capital);
      }
    }
    const beam = new THREE.Mesh(beamGeometry, depth === 1 ? cream : sage);
    beam.position.set(0, 3.45, .13);
    row.add(beam);
  }
  // Two instanced batches rather than a draw call per floor tile.
  const tileGeometry = own(new THREE.PlaneGeometry(.54, .54));
  const lightTiles = new THREE.InstancedMesh(tileGeometry, floorCream, 180);
  const darkTiles = new THREE.InstancedMesh(tileGeometry, floorGreen, 180);
  let lightCount = 0, darkCount = 0;
  const tile = new THREE.Object3D();
  tile.rotation.x = -Math.PI / 2;
  for (let x = -9; x < 9; x++) {
    for (let z = -14; z < 6; z++) {
      tile.position.set(x * .54 + .27, -.012, z * .54);
      tile.updateMatrix();
      if ((x + z) % 2 === 0) lightTiles.setMatrixAt(lightCount++, tile.matrix);
      else darkTiles.setMatrixAt(darkCount++, tile.matrix);
    }
  }
  lightTiles.count = lightCount; darkTiles.count = darkCount;
  scene.add(lightTiles, darkTiles);
  // Stylized foliage reinforces the entrance. It is decorative geometry, not a fake photo.
  const leafGeometry = own(new THREE.SphereGeometry(1, 8, 5));
  const leaves = new THREE.InstancedMesh(leafGeometry, sageSide, 24);
  const leaf = new THREE.Object3D();
  for (let i = 0; i < 24; i++) {
    const side = i < 12 ? -1 : 1;
    const n = i % 12;
    leaf.position.set(side * (3.1 + Math.sin(n * 1.7) * .45), .5 + n * .17, -1.1 - (n % 3) * .4);
    leaf.scale.set(.16, .43, .035);
    leaf.rotation.set(.2, side * .3, side * (.25 + (n % 4) * .4));
    leaf.updateMatrix();
    leaves.setMatrixAt(i, leaf.matrix);
  }
  scene.add(leaves);
  if (photo?.complete && photo.naturalWidth > 0) {
    const texture = own(new THREE.Texture(photo));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    const pictureMaterial = own(new THREE.MeshBasicMaterial({map:texture}));
    const picture = new THREE.Mesh(own(new THREE.PlaneGeometry(7, 7)), pictureMaterial);
    picture.position.set(0, 2.4, -7.6);
    scene.add(picture);
  }
  let disposed = false;
  let width = 0, height = 0;
  function resize() {
    if (disposed) return;
    const box = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(box.width));
    const h = Math.max(1, Math.round(box.height));
    if (w === width && h === height) return;
    width = w; height = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  function render(progress) {
    if (disposed) return;
    resize();
    const t = Math.max(0, Math.min(1, progress));
    const ease = t * t * (3 - 2 * t);
    camera.position.set((mobile ? .55 : 1.3) * (1 - ease), 2.8 - ease * .86, (mobile ? 8.0 : 9.1) - ease * 8.2);
    camera.lookAt(0, 1.73, -4.6);
    renderer.render(scene, camera);
  }
  function contextLost(event) {
    event.preventDefault();
    if (!disposed) onContextLost();
  }
  canvas.addEventListener('webglcontextlost', contextLost, false);
  container.append(canvas);
  render(0);
  return {
    render,
    stats: () => ({drawCalls:renderer.info.render.calls, triangles:renderer.info.render.triangles, pixelRatio:renderer.getPixelRatio()}),
    dispose() {
      if (disposed) return;
      disposed = true;
      canvas.removeEventListener('webglcontextlost', contextLost);
      resources.forEach(resource => resource.dispose());
      resources.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      scene.clear();
    }
  };
}
