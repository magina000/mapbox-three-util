import { guid } from '@/utils/funs'
import mqtt from 'mqtt'
import type { MqttClient, IConnackPacket } from 'mqtt'
import { defineStore } from 'pinia'
import Watcher from '@/class/watcher'

// const DEFAULT_URL = 'ws://1.202.169.148:28083/mqtt'
const DEFAULT_URL = 'ws://60.191.57.2:8083/mqtt'

interface MqttState {
  url: Undefable<string>
  option: ClientOption
  client: Undefable<MqttClient>
  subscribeMembers: string[]
  watcher: Watcher[]
}

interface ClientOption {
  clean: boolean
  connectTimeout: number
  clientId: string
  keepAlive: number
  username: string
  password: string
  qos: any
}

// const defaultOption: ClientOption = {
//   clean: true, // true: 清除会话, false: 保留会话
//   connectTimeout: 4000, // 超时时间
//   clientId: 'mqtt_client_' + guid(),
//   keepAlive: 60, // 认证信息
//   username: 'platform',
//   password: 'platform&CetitiPlatform',
//   qos: 1,
// }
const defaultOption: ClientOption = {
  clean: true, // true: 清除会话, false: 保留会话
  connectTimeout: 4000, // 超时时间
  clientId: 'mqtt_client_' + guid(),
  keepAlive: 60, // 认证信息
  username: 'bigdata',
  password: 'Mqtt&BigData',
  qos: 1,
}

const isWildCard = (topic: string) => topic.indexOf('/+/') > -1
const getWildCardRegTopic = (topic: string) => topic.replace('/+/', '/[^/]*/')

export const useMqttStore = defineStore('mqtt', {
  state: (): MqttState => ({
    url: undefined,
    option: defaultOption,
    client: undefined,
    subscribeMembers: [],
    watcher: [],
  }),
  actions: {
    CONNECT(url: string = DEFAULT_URL, clientOption?: Partial<ClientOption>) {
      this.url = url
      this.option = Object.assign(
        {},
        this.option,
        { clientId: 'mqtt_client_' + guid() }, //每次重新生成clientId
        clientOption
      )
      const client = mqtt.connect(this.url, this.option)
      console.log(this.url, 'client')
      client.on('connect', (e: IConnackPacket) => {
        console.log(`客户端: ${this.option.clientId}, 连接mqtt服务器成功:`, e)
      })
      client.on('reconnect', () => {
        console.log(`客户端: ${this.option.clientId}, 正在重连`)
      })
      client.on('error', (error: Error) => {
        console.log(`客户端: ${this.option.clientId}, 连接失败:`, error)
      })
      client.on('message', (topic: string, message: any) => {
        // const data = JSON.parse(Buffer.from(message).toString('utf8'))
        const data = JSON.parse(message)
        this.watcher.forEach(v => {
          v.notify(topic, data, message)
        })
      })
      this.client = client
    },
    DISCONNECT() {
      if (!this.client) return
      this.client.end(true)
      this.client = undefined
      this.subscribeMembers = []
    },
    ADDWATCHER(watcher: Watcher) {
      this.watcher.push(watcher)
    },
    SUBSCRIBE({ serve, topic, callback }: { serve: string; topic: string; callback: Fn }) {
      if (!this.client) return
      const watcher = this.watcher.find(v => v.serve === serve)
      if (!watcher) return
      /**通配符topic处理--------*/
      let _topic = topic
      if (isWildCard(topic)) _topic = getWildCardRegTopic(topic)
      /**通配符topic处理--------*/
      if (!watcher.topicMembers[_topic]) watcher.create(_topic, callback)
      this.client.subscribe(topic, { qos: this.option.qos }, error => {
        if (error) {
          console.log(`订阅主题: ${topic}失败: `, error)
        } else {
          console.log(`订阅主题: ${topic}成功`)
          if (!this.subscribeMembers.includes(topic)) this.subscribeMembers.push(topic)
        }
      })
    },
    UNSUBSCRIBE({ serve, topic, callback }: { serve: string; topic: string; callback?: Fn }) {
      if (!this.client) return
      const watcher = this.watcher.find(v => v.serve === serve)
      if (!watcher) return
      /**通配符topic处理--------*/
      let _topic = topic
      if (isWildCard(topic)) _topic = getWildCardRegTopic(topic)
      /**通配符topic处理--------*/
      watcher.destroy(_topic)
      let count = 0
      this.watcher.forEach(v => {
        if (v.topicMembers[_topic]) count++
      })
      if (count === 0) {
        //已经没有服务订阅该主题。则取消订阅
        this.client.unsubscribe(topic, {} as any, error => {
          if (error) {
            console.log(`客户端: ${this.option.clientId}, 取消订阅主题: ${topic}失败: `, error)
          } else {
            console.log(`客户端: ${this.option.clientId}, 取消订阅主题: ${topic}成功`)
            const idx = this.subscribeMembers.findIndex(v => v === topic)
            this.subscribeMembers.splice(idx, 1)
            callback && callback()
          }
        })
      } else {
        console.log(`客户端: ${this.option.clientId}, 取消订阅主题: ${topic}成功`)
        callback && callback()
      }
    },
    PUBLISH(topic: string, data: any, qos = 1) {
      if (!this.client) return
      this.client.publish(topic, data, { qos } as any)
      // console.log('推送成功')
    },
  },
})
