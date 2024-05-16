// EventEmitter.ts
type Listener = (...args: any[]) => void

export default class EventEmitter {
  private events: Map<string, Listener[]> = new Map()

  public on(eventName: string, listener: Listener): void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, [])
    }
    this.events.get(eventName)!.push(listener)
  }

  public off(eventName: string, listener: Listener): void {
    const listeners = this.events.get(eventName)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  public emit(eventName: string, ...args: any[]): void {
    const listeners = this.events.get(eventName)
    if (listeners) {
      listeners.forEach(listener => {
        listener(...args)
      })
    }
  }
}
