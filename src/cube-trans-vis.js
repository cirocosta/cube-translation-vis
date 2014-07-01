angular.module('cube-trans-vis', [])
  .directive('cubeTransvis', ['$parse', function ($parse) {
    'use strict';

    function startVisualization (elem, attrs, scope, invoker) {

      ////////////////////////////////////
      // definition of global variables //
      ////////////////////////////////////

      var scene
        , renderer
        , camera
        , canvasWidth
        , canvasHeight
        , cube
        , line
        , tween
        , pyramid;

      var xRotation = 0.0
        , yRotation = 0.0
        , zRotation = 0.0;

      var sizes = {
        cube: {
          w: 1.0,
          h: 1.0,
          d: 1.0,
        }
      };

      var positions = {
        cube: {
          x: 0.0,
          y: 0.0,
          z: 0.0,
        }
      };

      var colors = {
        yellow: 0xffff00,
        green: 0x00ff00,
        lightGrey: 0xdfdfdf,
        softGrey: 0xcacaca,
        blue: 0x0000ff,
        red: 0xff0000,
        white: 0xffffff,
        black: 0x000000
      };

      ///////////////
      // functions //
      ///////////////

      function debounce (fn, delay) {
        var timer = null;

        return function () {
          var context = this;
          var args = arguments;

          clearTimeout(timer);
          timer = setTimeout(function () {
            fn.apply(context, args);
          }, delay);
        };
      }


      function initializeScene () {
        renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setClearColor(colors.lightGrey, 1);

        canvasWidth = attrs.width || 200;
        canvasHeight = canvasWidth;

        renderer.setSize(canvasWidth, canvasHeight);

        var canvas = elem.append(renderer.domElement);
        if (attrs.width)
          canvas.children()[0].style.width = attrs.width + 'px';

        scene = new THREE.Scene();

        pyramid = createPyramid(0.2, 0.5, colors.green);
        pyramid.position.set(0.0, 3.0, 0.0);

        scene.add(pyramid);

        pyramid = createPyramid(0.2, 0.5, colors.red);
        pyramid.position.set(3.0, 0.0, 0.0);
        pyramid.rotateZ(3/2*Math.PI);

        scene.add(pyramid);

        pyramid = createPyramid(0.2, 0.5, colors.blue);
        pyramid.position.set(0.0, 0.0, 3.0);
        pyramid.rotateX(1/2*Math.PI);

        scene.add(pyramid);

        line = createLine(3, colors.red, 'x');
        scene.add(line);

        line = createLine(-3, colors.softGrey, 'x');
        scene.add(line);

        line = createLine(3, colors.green, 'y');
        scene.add(line);

        line = createLine(-3, colors.softGrey, 'y');
        scene.add(line);

        line = createLine(3, colors.blue, 'z');
        scene.add(line);

        line = createLine(-3, colors.softGrey, 'z');
        scene.add(line);

        cube = createCube(1.4, 1.4, 1.4);
        cube.position.set(0.0, 0.0, 0.0);

        // instantiating the camera and then moving it 10 units toward Z to
        // allow it to look to the center of the scene.

        camera = new THREE.PerspectiveCamera(70, canvasWidth / canvasHeight, 1, 100);
        camera.position.set(4,4,4);
        camera.lookAt(cube.position);

        // add the camera to the scene.

        scene.add(camera);
        // scene.add(new THREE.GridHelper(6, 1));


        var directionalLight = new THREE.DirectionalLight(colors.white, 1.3);
        directionalLight.position = camera.position;

        scene.add(directionalLight);
        scene.add(cube);

        document.addEventListener("keydown", onDocumentKeyDown, false);
        document.addEventListener("keydown", debounce(function (e) {
          tween = new TWEEN.Tween(positions.cube).to({x:0.0, y:0.0, z:0.0}, 50);
          tween.easing(TWEEN.Easing.Quadratic.InOut);
          tween.start();

          positions.cube.x = 0.0;
          positions.cube.y = 0.0;
          positions.cube.z = 0.0;
        }, 500), false);
      }

      function onDocumentKeyDown (event) {
        var keyCode = event.which;

        switch (keyCode) {
          case 87: // W
          positions.cube.y += 1;
          invoker(scope, {dir: '+y'});
          break;

          case 83: // S
          positions.cube.y -= 1;
          invoker(scope, {dir: '-y'});
          break;

          case 68: // D
          positions.cube.x += 1;
          invoker(scope, {dir: '+x'});
          break;

          case 65: // A
          positions.cube.x -= 1;
          invoker(scope, {dir: '-x'});
          break;

          case 69: // E
          positions.cube.z += 1;
          invoker(scope, {dir: '+z'});
          break;

          case 81: // Q
          positions.cube.z -= 1;
          invoker(scope, {dir: '-z'});
          break;
        }
      }

      function renderScene () {
        renderer.render(scene, camera);
      }

      function animateScene () {
        TWEEN.update();

        cube.position.set(positions.cube.x,
                  positions.cube.y,
                  positions.cube.z);

        requestAnimationFrame(animateScene);
        renderScene();
      }

      function createPyramid (bw, height, color) {
        var pyramidGeometry = new THREE.CylinderGeometry(0, bw, height, 4, false);

        var pyramidMaterial = new THREE.MeshBasicMaterial({
          color: color,
          side: THREE.DoubleSide
        });

        return new THREE.Mesh(pyramidGeometry, pyramidMaterial);
      }

      function createCube (w, h, d) {
        var cubeGeometry = new THREE.BoxGeometry(w, h, d);

        var cubeMaterials = [
          new THREE.MeshLambertMaterial({color: colors.red}),
          new THREE.MeshLambertMaterial({color: colors.green}),
          new THREE.MeshLambertMaterial({color: 0xFF00FF}),
          new THREE.MeshLambertMaterial({color: 0xFFFF00}),
          new THREE.MeshLambertMaterial({color: 0x00FFFF}),
          new THREE.MeshLambertMaterial({color: colors.white})
        ];

        var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);

        return new THREE.Mesh(cubeGeometry, cubeMaterial);
      }

      // window.addEventListener('resize', onWindowResize, false);

      // function onWindowResize(){
      //   camera.aspect = window.innerWidth / window.innerHeight;
      //   camera.updateProjectionMatrix();

      //   renderer.setSize( window.innerWidth, window.innerHeight );
      // }


      function createLine (size, color, axis) {
        var material = new THREE.LineBasicMaterial({
          color: color
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        geometry.vertices.push(new THREE.Vector3(0, 1 * size, 0));

        var line = new THREE.Line(geometry, material);

        switch (axis) {
          case 'x':
          line.rotateZ(3/2*Math.PI);
          break;

          case 'y':
          break;

          case 'z':
          line.rotateX(1/2*Math.PI);
          break;

          default:
          break;
        }

        return line;
      }

      // MAIN

      initializeScene();
      animateScene();
    }

    return {
      restrict: 'E',
      link: function ($scope, $elem, $attrs) {
        var invoker = $parse($attrs.handler);

        startVisualization($elem, $attrs, $scope, invoker);

      }
    };
  }]);
