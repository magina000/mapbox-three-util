import { MapOption } from '../mapbox/typing'
import { MODEL } from '../constant/map'

type Option = MapOption & {
  map: any
  tb: any
}

export class StaticModel {
  public option: any
  public model: any
  public id: string
  public layerId: string

  constructor(option: Option) {
    this.option = option
    this.id = option.id
    this.layerId = `layer_${option.id}`
  }

  static async init(option: Option): Promise<StaticModel> {
    const instance = new StaticModel(option)
    await instance.create()
    return instance
  }

  //创建模型
  public async create() {
    return new Promise<StaticModel>((resolve, reject) => {
      const { url, lnglat, rotation, type, units, anchor, clone, scale } = Object.assign(
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
}
