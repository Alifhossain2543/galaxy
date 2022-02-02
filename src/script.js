import "./style.css"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import { BufferAttribute } from "three"

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

const params = {
  count: 50000,
  size: 0.03,
  radius: 6,
  branches: 4,
  spin : 1,
  randomness: 0.2,
   randomnessPower : 4,
   insideColor: "#ff6030",
   outsideColor: "#1b3984",

}

let galaxyGeo = null
let galaxyMat = null
let galaxies = null

const generateGalaxy = () => {
  if (galaxies !== null) {
    galaxyGeo.dispose()
    galaxyMat.dispose()
    scene.remove(galaxies)
  }

  const { count, size, radius, branches, spin, randomness, randomnessPower, insideColor, outsideColor } =
    params
  galaxyGeo = new THREE.BufferGeometry()
  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)
  galaxyMat = new THREE.PointsMaterial({
    size: size,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors : true
  })
const colorInside = new THREE.Color(insideColor)
const colorOutside = new THREE.Color(outsideColor)

colorInside.lerp(colorOutside, 0.5)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    const Radius = Math.random() * radius
    const spinAngle = Radius * spin
    const branchesAngle = ((i % branches) / branches * Math.PI) * 2

  const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
  const randomY =
    Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
  const randomZ =
    Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
    

    positions[i3] = Math.cos(branchesAngle + spinAngle) * Radius + randomX
    positions[i3 + 1] = 0 + randomY
    positions[i3 + 2] = Math.sin(branchesAngle + spinAngle) * Radius + randomZ

    const mixColor = colorInside.clone()
    mixColor.lerp(colorOutside, Radius/ radius)

    colors[i3] = mixColor.r
    colors[i3 + 1] = mixColor.g
    colors[i3 + 2] = mixColor.b

  }

  galaxyGeo.setAttribute("position", new BufferAttribute(positions, 3))
  galaxyGeo.setAttribute("color", new BufferAttribute(colors, 3))
  galaxies = new THREE.Points(galaxyGeo, galaxyMat)
  scene.add(galaxies)
}

generateGalaxy()

gui
  .add(params, "count")
  .min(100)
  .max(100000)
  .step(100)
  .onFinishChange(generateGalaxy)
gui
  .add(params, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy)
gui
  .add(params, "branches")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy)
  
  gui
    .add(params, "randomness")
    .min(0)
    .max(5)
    .step(0.01)
    .onFinishChange(generateGalaxy)
      
  gui
    .add(params, "randomnessPower")
    .min(1)
    .max(10)
    .step(0.01)
    .onFinishChange(generateGalaxy)

  gui
    .add(params, "spin")
    .min(-5)
    .max(5)
    .step(1)
    .onFinishChange(generateGalaxy)

gui
  .add(params, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy)
  gui
    .add(params, "insideColor")
    .onFinishChange(generateGalaxy)
      gui.add(params, "outsideColor").onFinishChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.dampingFactor = 0.1
controls.rotateSpeed = 0.4

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
