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
    label: any;
    renderingback: Function;
    constructor(option: Option);
    /**
     * 这个静态异步函数使用提供的选项初始化一个 ActualModel 实例，并在创建后返回它。
     * @param {Option} option - `option` 参数是传递给 `init` 函数的对象。它可能包含初始化 `ActualModel` 实例所需的配置选项或数据。
     * @returns 异步创建后将返回“ActualModel”类的实例。
     */
    static init(option: Option): Promise<ActualModel>;
    /**
     * 该函数使用指定的选项在地图上创建 3D 模型并将其添加到自定义图层。
     * @returns 一旦函数内部的异步操作完成，`create` 函数就会返回一个 Promise，该 Promise 会使用 `ActualModel` 对象进行解析。
     */
    create(): Promise<ActualModel>;
    /**
     * 如果存在，“remove”函数会从表中删除模型，并从地图中删除图层。
     */
    remove(): void;
    /**
     * 函数“update”根据新的经度和纬度数据更新模型的位置，并可选择更改颜色和动画处理。
     * @param {UpdateData} data - `update` 函数中的 `data` 参数包含以下属性：
     * @returns 在提供的代码片段中，为类或对象定义了 `update` 方法。该方法以 `UpdateData` 对象为参数，并根据提供的数据执行各种操作。
     */
    update(data: UpdateData): void;
    /**
     * 如果提供的颜色与模型的当前颜色不同，则函数“setColor”设置 3D 模型的颜色。
     * @param {any} model - `model` 参数是一个表示 Three.js 场景中的 3D 模型的对象。
     * @param {string | undefined} color - `color`
     * 参数是一个字符串，表示要为模型设置的颜色值。它可以是有效的颜色字符串（例如“red”、“#ff0000”）或未定义。
     * @returns 如果没有提供“color”参数（即“undefined”），该函数将提前返回并且不执行任何进一步的操作。
     */
    private setColor;
}
export {};
