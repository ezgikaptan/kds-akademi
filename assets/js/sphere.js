/*
 * Vanilla Three.js interactive 3D element (no React/R3F needed).
 * Four nested wireframe icosahedrons in the KDS brand colors (pink,
 * blue, purple, orange - one per discipline), auto-rotating and
 * tilting gently toward the cursor. Guards itself if Three.js fails
 * to load or the user prefers reduced motion, and only initializes
 * once the section actually scrolls into view.
 */
document.addEventListener('DOMContentLoaded', function () {
    var container = document.getElementById('kds-sphere');
    if (!container || typeof THREE === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var initialized = false;

    function init() {
        if (initialized) return;
        initialized = true;

        var width = container.clientWidth;
        var height = container.clientHeight || width;
        if (!width) return;

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        camera.position.z = 5;

        var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);
        container.appendChild(renderer.domElement);

        var group = new THREE.Group();
        scene.add(group);

        // One nested shape per KDS discipline: music, dance, theatre, visual arts
        var colors = [0xE91E63, 0x00BCD4, 0x9C27B0, 0xFDB744];
        var meshes = colors.map(function (color, i) {
            var geometry = new THREE.IcosahedronGeometry(1.6 - i * 0.28, 0);
            var material = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: 0.85
            });
            var mesh = new THREE.Mesh(geometry, material);
            group.add(mesh);
            return mesh;
        });

        var pointerX = 0;
        var pointerY = 0;
        var currentRotX = 0;
        var currentRotY = 0;

        container.addEventListener('mousemove', function (e) {
            var rect = container.getBoundingClientRect();
            pointerX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            pointerY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        });
        container.addEventListener('mouseleave', function () {
            pointerX = 0;
            pointerY = 0;
        });

        var clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            var t = clock.getElapsedTime();

            meshes.forEach(function (mesh, i) {
                var dir = i % 2 === 0 ? 1 : -1;
                mesh.rotation.x = t * 0.15 * dir;
                mesh.rotation.y = t * 0.2 * dir;
            });

            currentRotY += (pointerX * 0.6 - currentRotY) * 0.05;
            currentRotX += (pointerY * 0.6 - currentRotX) * 0.05;
            group.rotation.y = currentRotY;
            group.rotation.x = currentRotX;

            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', function () {
            var w = container.clientWidth;
            var h = container.clientHeight || w;
            if (!w || !h) return;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        });
    }

    if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    init();
                    obs.disconnect();
                }
            });
        }, { threshold: 0.15 });
        obs.observe(container);
    } else {
        init();
    }
});
