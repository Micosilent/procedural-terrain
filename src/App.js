import "./App.css";
import * as THREE from "three";
import { Component } from "react";
import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
    const columns = window.innerWidth / scale;
    const rows = window.innerHeight / scale;

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    let triangles = [];
    for (let y = -rows / 2; y < rows / 2; y++) {
      let columnVectors = [];
      for (let x = -columns / 2; x < columns / 2; x++) {
        columnVectors.push(
          new Vector3(x * scale, y * scale, Math.random() * 100)
        );
      }
      triangles.push(columnVectors);
    }

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

    camera.position.set(window.innerWidth / 2, window.innerHeight / 2, 700);
    camera.lookAt(0, 0, 0);

    //Animation loop
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();
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
