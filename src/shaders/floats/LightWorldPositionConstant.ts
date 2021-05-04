import { ShaderFloat } from "./ShaderFloat";
import { Light } from "../../display/Light";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";
import { Point } from "../../geom/Point";

export class LightWorldPositionConstant extends ShaderFloat
{
    protected _light: Light

    public constructor(light: Light)
    {
        super(1)
        this._light = light
        this._allowUpdater = true
    }

    public update(visual: Visual, camera: Camera): void
    {
        let worldPosition: Point = this._light.position

        this._data.position = 0
        this._data.writeFloat32(worldPosition.x)
        this._data.writeFloat32(worldPosition.y)
        this._data.writeFloat32(worldPosition.z)
        this._data.writeFloat32(worldPosition.w)
    }

    public get light(): Light
    {
        return this._light
    }
}