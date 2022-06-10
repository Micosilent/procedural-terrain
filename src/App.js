import "./App.css";
import * as THREE from "three";
import { Component } from "react";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { makeNoise2D } from "open-simplex-noise";
import { makeRectangle } from "fractal-noise";

class App extends Component {
  componentDidMount() {
    //Setup scene
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(renderer.domElement);
    //Setup geometry
    const scale = 20;
    const noiseScale = 300;
    const columns = Math.round(window.innerWidth / scale);
    const rows = Math.round(window.innerHeight / scale);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    //Create point cloud
    let triangles = [];
    const noise2D = makeRectangle(columns, rows, makeNoise2D(Date()), {
      frequency: 0.04,
      octaves: 8,
    });
    console.log(noise2D);

    for (let y = -rows / 2; y < rows / 2; y++) {
      let columnVectors = [];
      for (let x = -columns / 2; x < columns / 2; x++) {
        let noiseValue = noise2D[x + columns / 2][y + rows / 2];
        columnVectors.push(
          new Vector3(x * scale, y * scale, noiseValue * noiseScale)
        );
      }
      triangles.push(columnVectors);
    }
    //Draw triangles for points
    for (let y = 0; y < triangles.length - 1; y++) {
      for (let x = 0; x < triangles[y].length - 1; x++) {
        let points = [];
        points.push(triangles[y][x]);
        points.push(triangles[y + 1][x]);
        points.push(triangles[y][x + 1]);
        points.push(triangles[y][x]);

        let geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, lineMaterial);
        scene.add(line);
      }
    }

    //Camera initial setup
    camera.position.set(window.innerWidth / 2, window.innerHeight / 2, 700);
    camera.lookAt(0, 0, 0);

    //Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
    console.log("hola");
    //Animation loop
    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }
  render() {
    return <div ref={(ref) => (this.mount = ref)} />;
  }
}
export default App;
