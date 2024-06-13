type Listener = (...args: any[]) => void;
export default class EventEmitter {
    private events;
    on(eventName: string, listener: Listener): void;
    off(eventName: string, listener: Listener): void;
    emit(eventName: string, ...args: any[]): void;
}
export {};
