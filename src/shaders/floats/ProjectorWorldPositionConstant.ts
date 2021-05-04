import { ShaderFloat } from "./ShaderFloat";
import { Projector } from "../../resources/Projector";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";
import { Point } from "../../geom/Point";

export class ProjectorWorldPositionConstant extends ShaderFloat
{
    protected _projector: Projector

    public constructor(projector: Projector)
    {
        super(1)
        this._projector = projector
        this._allowUpdater = true
    }

    public update(visual: Visual, camera: Camera): void
    {
        let worldPosition: Point = this._projector.position

        this._data.position = 0
        this._data.writeFloat32(worldPosition.x)
        this._data.writeFloat32(worldPosition.y)
        this._data.writeFloat32(worldPosition.z)
        this._data.writeFloat32(worldPosition.w)
    }

    public get projector(): Projector
    {
        return this._projector
    }
}