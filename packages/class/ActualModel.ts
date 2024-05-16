import { MapOption } from '../mapbox/typing'
import { MODEL } from '../constant/map'
import * as turf from '@turf/turf'
import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

type Option = MapOption & {
  map: any
  tb: any
  tweenGroup: any
}

interface UpdateData {
  id: string
  lnglat: [number, number]
  color?: string
}

export class ActualModel {
  public option: any
  public model: any
  public id: string
  public layerId: string
  public time: number //数据时间
  private animateTime: number //产生动画时间
  private direction: number | undefined
  private duration: number
  private tween: any
  private tweenGroup: any

  constructor(option: Option) {
    this.option = option
    this.id = option.id
    this.layerId = `layer_${option.id}`
    const time = Date.now()
    this.time = time
    this.animateTime = time
    this.duration = 0
    this.tweenGroup = option.tweenGroup
  }

  static async init(option: Option): Promise<ActualModel> {
    const instance = new ActualModel(option)
    await instance.create()
    return instance
  }

  //创建模型
  public async create() {
    return new Promise<ActualModel>((resolve, reject) => {
      const { url, lnglat, rotation, type, units, anchor, clone, scale, color } = Object.assign(
        MODEL,
        this.option
      )
      const option: any = {
        type,
        units,
        anchor,
        clone,
        scale,
        obj: url,
        rotation: { x: 90, y: 0, z: 0 },
      }
      this.option.map.addLayer({
        id: this.layerId,
        type: 'custom',
        renderingMode: '3d',
        onAdd: () => {
          this.option.tb.loadObj(option, (model: any) => {
            model.userData.id = this.id
            model.setCoords(lnglat)
            model.setRotation({ x: 0, y: 0, z: -rotation })
            this.setColor(model, color)
            this.option.tb.add(model)
            this.model = model
            resolve(model)
          })
        },
        render: () => {
          this.option.tb.update()
        },
      })
    })
  }

  //删除模型
  public remove() {
    this.option.tb.remove(this.model)
    if (this.option.map.getLayer(this.layerId)) this.option.map.removeLayer(this.layerId)
  }

  //更新模型位置
  public update(data: UpdateData) {
    if (!this.model) return
    const prev = this.option.lnglat
    const cur = data.lnglat
    const time = Date.now()
    this.time = time
    if (data.color) this.setColor(this.model, data.color)
    if (prev[0] === cur[0] && prev[1] === cur[1]) return //经纬度相同不更新位置
    const dis = turf.distance(turf.point(prev), turf.point(cur), {
      units: 'meters',
    })
    if (dis < 0.3) return //相邻点小于指定距离不更新位置
    if (this.tween && this.tween.isPlaying()) return //动画还在进行中不重置动画
    const start = { lng: prev[0], lat: prev[1] }
    const end = { lng: cur[0], lat: cur[1] }
    const duration = time - this.animateTime
    this.animateTime = time
    this.duration = duration
    const direction = turf.bearing(turf.point(prev), turf.point(cur))
    this.direction = direction
    this.model.setRotation({ x: 0, y: 0, z: -this.direction })
    this.option.lnglat = cur
    this.tween = new TWEEN.Tween(start, this.tweenGroup)
      .to(end, duration)
      .easing(TWEEN.Easing.Linear.None)
      .start()
      .onUpdate(({ lng, lat }: { lng: number; lat: number }) => {
        this.model.setCoords([lng, lat])
      })
      .onComplete(() => {
        this.tween && this.tween.stop()
      })
  }

  //设置颜色
  private setColor(model: any, color: string | undefined) {
    if (!color) return
    if (color !== model.userData.color) {
      model.traverse((child: any) => {
        if (child.isMesh) {
          child.material.color.set(new THREE.Color(color))
        }
      })
      model.userData.color = color
    }
  }
}
