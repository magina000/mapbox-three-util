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
  public label: any
  public renderingback: Function = ({ x, y }: { x: number; y: number }): void => {}

  constructor(option: Option) {
    this.option = option
    this.id = option.id
    this.layerId = `layer_${option.id}`
    const time = Date.now()
    this.time = time
    this.animateTime = time
    this.duration = 0
    this.direction = 0
    this.tweenGroup = option.tweenGroup
  }

  /**
   * 这个静态异步函数使用提供的选项初始化一个 ActualModel 实例，并在创建后返回它。
   * @param {Option} option - `option` 参数是传递给 `init` 函数的对象。它可能包含初始化 `ActualModel` 实例所需的配置选项或数据。
   * @returns 异步创建后将返回“ActualModel”类的实例。
   */
  static async init(option: Option): Promise<ActualModel> {
    const instance = new ActualModel(option)
    await instance.create()
    return instance
  }

  /**
   * 该函数使用指定的选项在地图上创建 3D 模型并将其添加到自定义图层。
   * @returns 一旦函数内部的异步操作完成，`create` 函数就会返回一个 Promise，该 Promise 会使用 `ActualModel` 对象进行解析。
   */
  public async create() {
    return new Promise<ActualModel>((resolve, reject) => {
      const { url, lnglat, rotation, type, units, anchor, clone, scale, color } = Object.assign(
        {},
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
      this.direction = rotation
      let labelOption: any
      if (this.option.label) {
        labelOption = Object.assign({}, MODEL.label, this.option.label)
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
            if (labelOption) {
              const { element, height, offset, visible } = labelOption
              this.label = model.drawLabelHTML(
                element,
                visible,
                { x: offset[0], y: offset[1] },
                height
              )
            }
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

  /**
   * 如果存在，“remove”函数会从表中删除模型，并从地图中删除图层。
   */
  public remove() {
    this.option.tb.remove(this.model)
    if (this.option.map.getLayer(this.layerId)) this.option.map.removeLayer(this.layerId)
  }

  /**
   * 函数“update”根据新的经度和纬度数据更新模型的位置，并可选择更改颜色和动画处理。
   * @param {UpdateData} data - `update` 函数中的 `data` 参数包含以下属性：
   * @returns 在提供的代码片段中，为类或对象定义了 `update` 方法。该方法以 `UpdateData` 对象为参数，并根据提供的数据执行各种操作。
   */
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
    if (dis < 1) return //相邻点小于指定距离不更新位置
    // if (this.tween && this.tween.isPlaying()) return //动画还在进行中不重置动画
    if (this.tween && this.tween.isPlaying()) this.tween.stop()
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
        const p = this.option.map.project([lng, lat])
        this.option.renderingback && this.option.renderingback({ id: data.id, ...p })
      })
      .onComplete(() => {
        this.tween && this.tween.stop()
      })
  }

  /**
   * 如果提供的颜色与模型的当前颜色不同，则函数“setColor”设置 3D 模型的颜色。
   * @param {any} model - `model` 参数是一个表示 Three.js 场景中的 3D 模型的对象。
   * @param {string | undefined} color - `color`
   * 参数是一个字符串，表示要为模型设置的颜色值。它可以是有效的颜色字符串（例如“red”、“#ff0000”）或未定义。
   * @returns 如果没有提供“color”参数（即“undefined”），该函数将提前返回并且不执行任何进一步的操作。
   */
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
