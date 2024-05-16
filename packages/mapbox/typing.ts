export interface MapOption {
  [key: string]: any
  threebox?: any
}

export interface ModelOption {
  id: string
  url: string
  lnglat: [number, number]
  scale?: number
  rotation?: number
  delTime?: number
  color?: string
}

export interface ModelItem {
  id: string
  data: ModelOption
  model: any
}

export type ActualTargetData = ModelOption

export interface FollowData {
  id: string
  zoom?: number
  pitch: number
}
