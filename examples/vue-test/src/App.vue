<script setup lang="ts">
import { onMounted, ref } from 'vue'
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
    label: {
      element: createLabel('浙A21234', 'plateNo'),
      offset: [0, 0],
      height: 3,
    },
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
  if (timer) clearInterval(timer)
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
  removePlates()
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
let plates = ref<Map<string, any>>(new Map())

const setPlates = (data: any) => {
  // plateCollects.value.set(data.id, data)
  if (hikMapbox.actualTargetMap.get(data.id)) {
    plates.value.set(data.id, data)
  }
}

let timer: any
const removePlates = () => {
  if (timer) clearInterval(timer)
  timer = setInterval(() => {
    plates.value.forEach((v, k) => {
      if (!hikMapbox.actualTargetMap.get(k)) {
        // console.log(k, hikMapbox.actualTargetMap)
        plates.value.delete(k)
      }
    })
  }, 1000)
}

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
          label: {
            element: createLabel(v.id, 'plateNo'),
            offset: [0,0],
            height: 5,
          },
          renderingback: (data: any) => {
            // console.log('renderback', data)
            // setPlates(data)
          },
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

const createLabel = (text: string, clsName: string) => {
  let popup = document.createElement('div')
  popup.className = clsName
  popup.innerHTML = text
  return popup
}

onMounted(() => {
  hikMapbox = new HikMapbox({
    container: 'map',
    // center: [116.48929027500393, 39.729121481528],
    center: [120.90133841501851, 31.974180365993664],
    // center: [120.6, 31.41],
    zoom: 17,
  })
  hikMapbox.on('load', async () => {
    // mqttStore.SUBSCRIBE({
    //   serve: MQTT_SERVE,
    //   topic: topicURL,
    //   callback: callback,
    // })
    // add()
  })
  hikMapbox.on('zoom', (zoom: number) => {
    if (model) {
      model.label.visible = zoom > 16
    }
  })
  //目标物拾取
  hikMapbox.on('click', (e: any) => {
    const modelId = hikMapbox.pickModel(e)
    console.log('pick', modelId)
    // const model = hikMapbox.getActualModel(modelId)
    if (modelId)
      hikMapbox.follow({
        id: modelId,
        zoom: 19,
        pitch: 45,
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
  <div class="map-container">
    <div id="map"></div>
    <template v-for="(v, k) in plates" :key="v[0]">
      <div class="plate" :style="{ left: v[1].x + 'px', top: v[1].y + 'px' }">{{ v[0] }}</div>
    </template>
  </div>
</template>

<style scoped lang="less">
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
.map-container {
  width: 800px;
  height: 800px;
  position: relative;
}
#map {
  width: 100%;
  height: 100%;
  :deep(.plateNo) {
    padding: 0 3px;
    width: 100%;
    border-radius: 4px;
    font-weight: 500;
    font-size: 16px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    color: black;
    background: linear-gradient(to bottom, rgb(198, 244, 222), rgb(46, 211, 74));
  }
}
.plate {
  position: absolute;
  transform: translate(-50%, -30px);
}
</style>
