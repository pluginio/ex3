import { ShaderFloat } from "./ShaderFloat";
import { Light } from "../../display/Light";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";
import { Vector } from "../../geom/Vector";

export class LightWorldDVectorConstant extends ShaderFloat
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
        let worldDVector: Vector = this.light.dVector

        this._data.position = 0
        this._data.writeFloat32(worldDVector.x)
        this._data.writeFloat32(worldDVector.y)
        this._data.writeFloat32(worldDVector.z)
        this._data.writeFloat32(worldDVector.w)
    }

    public get light(): Light
    {
        return this._light
    }
}