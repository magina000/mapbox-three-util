<script setup lang="ts">
import { onMounted } from 'vue'
import { HikMapbox } from '../../../packages/index'
import { useMqttStore } from '@/stores/mqtt'
import Watcher from '@/class/watcher'
import * as turf from '@turf/turf'
import * as THREE from 'three'

const mqttStore = useMqttStore()

let hikMapbox: any = null
let model: any = null
const MQTT_SERVE = 'MQTT_TEST'

mqttStore.CONNECT()
mqttStore.ADDWATCHER(new Watcher(MQTT_SERVE))
// const topicURL = 'guoqi/web/mec/U-HK0401/RCU2CLOUD_OBJS'
const topicURL = '/mec/HKZLMEC23110003/objectlist/up'

const add = async () => {
  model = await hikMapbox.addModel({
    id: '123',
    url: 'glb/car_white.glb',
    lnglat: [120.90133841501851, 31.974180365993664],
    scale: 5,
    rotation: 225,
  })
  console.log('model', model)
  // const model = hikMapbox.getModel('123')
  // console.log(model)
}

const del = () => {
  // hikMapbox.removeModel('123')
  model.remove()
}

const stop = () => {
  mqttStore.UNSUBSCRIBE({
    serve: MQTT_SERVE,
    topic: topicURL,
  })
}

const update = () => {
  const bearing = turf.bearing(
    turf.point([120.90134841501851, 31.974180365993664]),
    turf.point([120.90134841501851, 31.974170365993664])
  )
  console.log('更新位置', bearing)
  const last = 45
  const cur = -last
  console.log(cur)
  const rad = THREE.MathUtils.degToRad(bearing)
  console.log(rad, model.model)
  // model.model.rotation.y = rad
  model.model.setRotation({ x: 0, y: 0, z: 90 })
}

const start = () => {
  mqttStore.SUBSCRIBE({
    serve: MQTT_SERVE,
    topic: topicURL,
    callback: callback,
  })
}

const follow = () => {
  hikMapbox.follow(model)
}

const cancelFollow = () => {
  hikMapbox.cancelFollow()
}

let time: any

const MEC_TYPES = [0, 1, 3, 2, 4, 5, 7, 11]

// const callback = async ({ data }: any) => {
//   // const cur = Date.now()
//   // if (!time) {
//   //   time = cur
//   // } else {
//   //   if (cur - time < 1000) return
//   // }
//   // time = cur
//   try {
//     const p = data.targets
//     p.forEach(async (v: any) => {
//       if (!MEC_TYPES.includes(v.type)) return
//       const _v = {
//         id: v.uuid,
//         url: 'glb/car_white.glb',
//         lnglat: [v.position.longitude, v.position.latitude],
//         rotation: v.heading,
//         scale: 1,
//       }
//       hikMapbox.actualTargetRender(_v)
//     })
//   } catch (error) {}
// }

const callback = async (data: any) => {
  try {
    const p = data.objectList
    p.forEach((v: any) => {
      if (v.type === 2 || v.type === 3) {
        const _v = {
          id: v.id,
          url: 'glb/car_white.glb',
          lnglat: [v.location.lon, v.location.lat],
          rotation: v.heading,
          scale: 1,
          delTime: 1000, //ms
          // color: Math.random() < 0.5 ? '#FF1493' : '#7B68EE',
        }
        hikMapbox.actualTargetRender(_v)
      }
    })
  } catch (error) {}
}

const destroy = () => {
  hikMapbox.destroy()
}

const initThreeJS = () => {
  // 获取容器
  const container = document.getElementById('mapContainer')
  if (!container) return

  // 创建场景
  const scene = new THREE.Scene()

  // 创建相机
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  )

  // 创建渲染器
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.clientWidth, container.clientHeight)
  container.appendChild(renderer.domElement)

  // 创建一个立方体
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
  const cube = new THREE.Mesh(geometry, material)
  scene.add(cube)


  // 设置相机位置
  camera.position.z = 5

  const axesHelper = new THREE.AxesHelper(10000)

  scene.add(axesHelper)

  // 动画函数
  const animate = () => {
    requestAnimationFrame(animate)

    // 旋转立方体
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    // 渲染场景
    renderer.render(scene, camera)
  }

  // 开始动画
  animate()
}

onMounted(() => {
  hikMapbox = new HikMapbox({
    container: 'mapContainer',
    // center: [116.48929027500393, 39.729121481528],
    center: [120.90133841501851, 31.974180365993664],
    zoom: 17,
  })
  hikMapbox.on('load', async () => {
    // mqttStore.SUBSCRIBE({
    //   serve: MQTT_SERVE,
    //   topic: topicURL,
    //   callback: callback,
    // })
  })
  //目标物拾取
  hikMapbox.on('click', (e: any) => {
    const modelId = hikMapbox.pickModel(e)
    console.log('pick', modelId)
    // const model = hikMapbox.getActualModel(modelId)
    if (modelId)
      hikMapbox.follow({
        id: modelId,
        zoom: 20,
        pitch: 0,
      })
  })
})
</script>

<template>
  <div class="btns">
    <button @click="add" class="btn">新增模型</button>
    <button @click="del" class="btn">删除模型</button>
    <button @click="update" class="btn">更新位置</button>
    <button @click="follow" class="btn">视角跟随</button>
    <button @click="cancelFollow" class="btn">取消跟随</button>
    <button @click="start" class="btn">开始</button>
    <button @click="stop" class="btn">停止</button>
    <button @click="destroy" class="btn">销毁</button>
  </div>
  <div id="mapContainer"></div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
.btns {
  display: flex;
}
.btn {
  width: 100px;
  height: 30px;
}
#mapContainer {
  width: 900px;
  height: 900px;
}
</style>
