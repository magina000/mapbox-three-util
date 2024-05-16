import { MapOption } from '../mapbox/typing';
type Option = MapOption & {
    map: any;
    tb: any;
    tweenGroup: any;
};
interface UpdateData {
    id: string;
    lnglat: [number, number];
    color?: string;
}
export declare class ActualModel {
    option: any;
    model: any;
    id: string;
    layerId: string;
    time: number;
    private animateTime;
    private direction;
    private duration;
    private tween;
    private tweenGroup;
    constructor(option: Option);
    static init(option: Option): Promise<ActualModel>;
    create(): Promise<ActualModel>;
    remove(): void;
    update(data: UpdateData): void;
    private setColor;
}
export {};
