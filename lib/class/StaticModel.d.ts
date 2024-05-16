import { MapOption } from '../mapbox/typing';
type Option = MapOption & {
    map: any;
    tb: any;
};
export declare class StaticModel {
    option: any;
    model: any;
    id: string;
    layerId: string;
    constructor(option: Option);
    static init(option: Option): Promise<StaticModel>;
    create(): Promise<StaticModel>;
    remove(): void;
}
export {};
