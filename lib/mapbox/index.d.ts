import { MapOption, ModelOption, ActualTargetData, FollowData } from './typing';
import EventEmitter from '../class/EventEmitter';
import { ActualModel } from '../class/ActualModel';
import { StaticModel } from '../class/StaticModel';
export declare class HikMapbox extends EventEmitter {
    private option;
    private mapbox;
    private threebox;
    private actualTargetMap;
    private tweenGroup;
    private raf;
    private followTarget;
    constructor(option: MapOption);
    init(): void;
    destroy(): Promise<void>;
    actualTargetRender(data: ActualTargetData): Promise<void>;
    addActualModel(option: ModelOption): Promise<ActualModel>;
    delActualModels(): void;
    addModel(option: ModelOption): Promise<StaticModel>;
    getActualModel(id: string): ActualModel | undefined;
    pickModel(e: any): any;
    follow(data: FollowData): void;
    cancelFollow(): void;
    setFollowCamera(): void;
}
