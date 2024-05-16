export default class Watcher {
  public serve
  public topicMembers: Record<string, Undefable<Fn>>
  constructor(serve: string) {
    this.serve = serve
    this.topicMembers = {}
  }
  create(topic: string, callback: Fn) {
    this.topicMembers[topic] = callback
  }
  destroy(topic: string) {
    delete this.topicMembers[topic]
  }
  /**
   * 通知回调函数执行
   * @param topic 主题
   * @param data 处理后的数据
   * @param buffer 原始Buffer
   */
  notify(topic: string, data: any, buffer: Buffer) {
    let callback = this.topicMembers[topic]
    if (!callback) {
      for (const k in this.topicMembers) {
        if (new RegExp(k).test(topic)) {
          callback = this.topicMembers[k]
          break
        }
      }
    }
    callback && callback(data, topic, buffer)
  }
}
