import { MapOption, ModelOption, ActualTargetData, FollowData } from './typing';
import EventEmitter from '../class/EventEmitter';
import { ActualModel } from '../class/ActualModel';
import { StaticModel } from '../class/StaticModel';
export declare class HikMapbox extends EventEmitter {
    private option;
    private mapbox;
    private threebox;
    actualTargetMap: Map<string, ActualModel>;
    private tweenGroup;
    private raf;
    private followTarget;
    constructor(option: MapOption);
    /**
     * `init` 函数初始化 Mapbox 和 Threebox，设置点击和缩放的事件监听器，并处理目标对象的实时渲染。
     */
    init(): void;
    /**
     * `destroy` 函数取消动画帧，移除 Mapbox 和 Threebox 对象，并清除 Threebox 资源。
     */
    destroy(): Promise<void>;
    /**
     * 函数“actualTargetRender”使用新数据更新现有目标模型，如果目标模型不存在则添加新的目标模型。
     * @param {ActualTargetData} data - `actualTargetRender` 函数中的 `data` 参数包含以下属性：
     */
    actualTargetRender(data: ActualTargetData): Promise<void>;
    /**
     * 此 TypeScript 函数异步添加具有指定选项的实际模型。
     * @param {ModelOption} option - `addActualModel` 函数中的 `option` 参数属于 `ModelOption` 类型。它是一个包含初始化
     * `ActualModel` 所需属性的对象。这些属性可能用于配置和设置模型，例如 `map`、`tb` 和 `tween`
     * @returns `addActualModel` 函数返回使用提供的选项初始化 `ActualModel` 后创建的 `model` 对象。
     */
    addActualModel(option: ModelOption): Promise<ActualModel>;
    /**
     * `delActualModels` 函数根据指定的删除时间从地图中删除模型。
     * @returns 如果 `this.actualTargetMap` 的大小为 0，则该函数将返回而不执行任何操作。
     */
    delActualModels(): void;
    /**
     * 函数“addModel”使用指定的选项异步初始化模型，如果模型创建失败则抛出错误。
     * @param {ModelOption} option - `option` 参数是一个包含创建模型的配置选项的对象。它被传递给 `addModel` 函数，以使用提供的选项初始化模型。
     * @returns `addModel` 函数返回使用提供的选项初始化 StaticModel 后创建的 `model` 对象。
     */
    addModel(option: ModelOption): Promise<StaticModel>;
    /**
     * 此函数从地图中检索与给定 ID 关联的实际模型。
     * @param {string} id - `id` 参数是一个字符串，表示您想要从 `actualTargetMap` 中检索的模型的唯一标识符。
     * @returns `getActualModel` 函数从 `actualTargetMap` 返回与提供的 `id` 键关联的值。
     */
    getActualModel(id: string): ActualModel | undefined;
    /**
     * 函数“pickModel”检索基于给定点在地图上呈现的 3D 模型相关的用户数据。
     * @param {any} e - `pickModel` 函数中的参数 `e`
     * 通常是一个事件对象，其中包含有关触发该函数的事件的信息。这可能是鼠标单击事件、触摸事件或任何其他类型的事件，具体取决于函数的调用方式。`e` 参数
     * @returns `pickModel` 函数返回与地图上指定点处渲染的要素相关联的模型的用户数据。如果在该点处未找到任何要素或模型，则返回 `null`。
     */
    pickModel(e: any): any;
    /**
     * TypeScript 中的 `follow` 函数取消任何现有的关注操作，并将新的关注数据分配给 `followTarget` 属性。
     * @param {FollowData} data - `follow` 函数中的 `data` 参数可能包含要跟踪的目标的信息。此信息可能包括目标的
     * ID、名称、位置等详细信息，或跟踪操作所需的任何其他相关数据。
     */
    follow(data: FollowData): void;
    /**
     * 函数“cancelFollow”将“followTarget”属性设置为null。
     */
    cancelFollow(): void;
    /**
     * 函数“setFollowCamera”使用 Mapbox 设置相机跟随具有指定参数的目标。
     * @returns 如果没有设置 `followTarget`，函数会提前返回，不执行任何操作。如果在 `actualTargetMap` 中没有找到指定 ID
     * 的目标，函数也会提前返回，不执行任何操作。
     */
    setFollowCamera(): void;
}
