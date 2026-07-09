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
        renderer.setClearColor(0x000000, 0); // Transparent so container background shows
        container.appendChild(renderer.domElement);

        // Main rotating group (user can rotate this with drag)
        var mainGroup = new THREE.Group();
        scene.add(mainGroup);

        // --- Create Single Large 3D Music Note (♫) ---
        var noteGroup = new THREE.Group();
        noteGroup.scale.set(1.3, 1.3, 1.3);
        noteGroup.position.set(-0.18, -0.15, 0);
        mainGroup.add(noteGroup);

        var noteMat = new THREE.MeshStandardMaterial({
            color: 0x8B263E, // Deep brand burgundy
            roughness: 0.35,
            metalness: 0.1
        });

        // 1. Note head 1 (tilted cylinder, scaled to oval)
        var headGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32);
        var head1 = new THREE.Mesh(headGeom, noteMat);
        head1.rotation.x = Math.PI / 3;
        head1.rotation.z = -Math.PI / 6;
        head1.scale.set(1.4, 0.8, 1.0);
        head1.position.set(-0.4, -0.5, 0);
        noteGroup.add(head1);

        // 2. Note head 2
        var head2 = head1.clone();
        head2.position.set(0.4, -0.3, 0);
        noteGroup.add(head2);

        // 3. Stem 1 (thick cylindrical post)
        var stemGeom = new THREE.CylinderGeometry(0.035, 0.035, 1.2, 16);
        var stem1 = new THREE.Mesh(stemGeom, noteMat);
        stem1.position.set(-0.22, 0.1, 0);
        noteGroup.add(stem1);

        // 4. Stem 2
        var stem2 = stem1.clone();
        stem2.position.set(0.58, 0.3, 0);
        noteGroup.add(stem2);

        // 5. Connecting Beam (connecting tops of Stems)
        var beamGeom = new THREE.BoxGeometry(0.88, 0.14, 0.07);
        var beam = new THREE.Mesh(beamGeom, noteMat);
        beam.position.set(0.16, 0.72, 0); // adjusted height for perfect alignment
        beam.rotation.z = 0.245; // angle of connection
        noteGroup.add(beam);

        // --- Lights ---
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);

        var dirLight = new THREE.DirectionalLight(0xffffff, 0.95);
        dirLight.position.set(5, 6, 4);
        scene.add(dirLight);

        // --- Interactive Mouse Drag-to-Rotate ---
        var isDragging = false;
        var previousMousePosition = { x: 0, y: 0 };
        var targetRotX = 0;
        var targetRotY = 0;

        container.addEventListener('mousedown', function (e) {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            var deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };
            targetRotY += deltaMove.x * 0.005;
            targetRotX += deltaMove.y * 0.005;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });

        window.addEventListener('mouseup', function () {
            isDragging = false;
        });

        // Touch drag support for mobile
        container.addEventListener('touchstart', function (e) {
            isDragging = true;
            previousMousePosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }, { passive: true });

        window.addEventListener('touchmove', function (e) {
            if (!isDragging) return;
            var deltaMove = {
                x: e.touches[0].clientX - previousMousePosition.x,
                y: e.touches[0].clientY - previousMousePosition.y
            };
            targetRotY += deltaMove.x * 0.005;
            targetRotX += deltaMove.y * 0.005;
            previousMousePosition = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
            };
        }, { passive: true });

        window.addEventListener('touchend', function () {
            isDragging = false;
        });

        var clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            var t = clock.getElapsedTime();

            // Gentle background auto-rotation
            if (!isDragging) {
                targetRotY += 0.0035;
            }

            // Smooth interpolation (damping) for drag rotations
            mainGroup.rotation.y += (targetRotY - mainGroup.rotation.y) * 0.08;
            mainGroup.rotation.x += (targetRotX - mainGroup.rotation.x) * 0.08;

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
