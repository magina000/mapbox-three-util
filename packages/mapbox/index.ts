import mapboxgl from 'mapbox-gl'
import { Threebox } from 'threebox-plugin'
import { MAPBOX, THREEBOX } from '../constant/map'
import { MapOption, ModelOption, ActualTargetData, FollowData } from './typing'
import EventEmitter from '../class/EventEmitter'
import { ActualModel } from '../class/ActualModel'
import { StaticModel } from '../class/StaticModel'
import TWEEN from '@tweenjs/tween.js'
import { MODEL, FOLLOW } from '../constant/map'
import { mapUtil } from '../util'
import * as THREE from 'three'

export class HikMapbox extends EventEmitter {
  private option: MapOption //地图配置 包括mapbox配置和threebox配置
  private mapbox: any //mapbox地图实例
  private threebox: any //threebox实例
  private actualTargetMap: Map<string, ActualModel> //实时渲染目标物Map
  private tweenGroup: any
  private raf: any
  private followTarget: any

  constructor(option: MapOption) {
    super()
    this.option = option
    this.actualTargetMap = new Map()
    this.init()
  }

  public init() {
    const mbOption = Object.assign(MAPBOX, this.option)
    const tbOption = Object.assign(THREEBOX, this.option.threebox)
    this.mapbox = new mapboxgl.Map(mbOption)
    this.mapbox.on('load', () => {
      this.threebox = new Threebox(
        this.mapbox,
        this.mapbox.getCanvas().getContext('webgl'),
        tbOption
      )
      window.tb = this.threebox
      this.emit('load')

      // 添加XYZ轴辅助工具
      const axesHelper = new THREE.AxesHelper(10000)
      this.threebox.scene.add(axesHelper)

      //目标物拾取
      this.mapbox.on('click', (e: any) => {
        this.emit('click', e)
      })

      //实时目标物人机非渲染
      this.tweenGroup = new TWEEN.Group()
      const animate = () => {
        this.raf = requestAnimationFrame(animate)
        // this.tweenGroup && this.tweenGroup.update()
        // this.delActualModels() //移除已消失模型
        // this.setFollowCamera()
      }
      animate()
    })
  }

  public async destroy() {
    if (this.raf) cancelAnimationFrame(this.raf)
    this.mapbox && this.mapbox.remove()
    if (this.threebox) {
      // await this.threebox.dispose()
      await this.threebox.clear(null, true)
    }
  }

  //接收实时数据处理
  public async actualTargetRender(data: ActualTargetData) {
    const { id, url, lnglat, color } = data
    const target = this.actualTargetMap.get(id)
    if (target) {
      if (target.model) target.model.update({ id, lnglat, color })
    } else {
      if (!url || url === '') {
        throw new Error('模型地址不能为空')
      }
      let target: any = { id, model: null }
      this.actualTargetMap.set(id, target)
      target.model = await this.addActualModel(data)
    }
  }

  //渲染实时目标物
  public async addActualModel(option: ModelOption) {
    try {
      const model = await ActualModel.init(
        Object.assign(option, {
          map: this.mapbox,
          tb: this.threebox,
          tweenGroup: this.tweenGroup,
        })
      )
      return model
    } catch (error) {
      throw new Error(`模型创建失败: ${error}`)
    }
  }

  //删除实时目标物
  public delActualModels() {
    if (this.actualTargetMap.size === 0) return
    const time = Date.now()
    this.actualTargetMap.forEach((v, k) => {
      const target = v.model
      if (!target) return
      const delTime = target.option.delTime || MODEL.delTime
      if (time - target.time >= delTime) {
        v.model.remove()
        this.actualTargetMap.delete(k)
      }
    })
  }

  //渲染静态模型
  public async addModel(option: ModelOption) {
    try {
      const model = await StaticModel.init(
        Object.assign(option, {
          map: this.mapbox,
          tb: this.threebox,
        })
      )
      return model
    } catch (error) {
      throw new Error(`模型创建失败: ${error}`)
    }
  }

  //获取动态模型
  public getActualModel(id: string) {
    return this.actualTargetMap.get(id)
  }

  //模型拾取
  public pickModel(e: any) {
    const features = this.threebox.queryRenderedFeatures(e.point)
    if (features.length > 0) {
      return mapUtil.getModelUserData(features[0].object)
    }
    return null
  }

  //第一视角跟随
  public follow(data: FollowData) {
    this.followTarget = Object.assign({}, FOLLOW, data)
  }

  //取消跟随
  public cancelFollow() {
    this.followTarget = null
  }

  public setFollowCamera() {
    if (!this.followTarget) return
    const { id, zoom, pitch, isStart } = this.followTarget
    const t = this.actualTargetMap.get(id)
    if (!t) return
    if (isStart) this.followTarget.isStart = false
    const obj = {
      center: t.model.option.lnglat,
      zoom,
      pitch,
      speed: 0,
      duration: isStart ? 0 : t.model.duration,
      // duration: isStart ? 0 : duration,
      bearing: t.model.direction,
    }
    this.mapbox.easeTo(obj)
  }
}
