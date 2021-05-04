import { ShaderFloat } from "./ShaderFloat";
import { Light } from "../../display/Light";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";
import { Matrix } from "../../geom/Matrix";
import { Point } from "../../geom/Point";

export class LightModelPositionConstant extends ShaderFloat
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
        let worldInvMatrix: Matrix = visual.worldTransform.inverse
        let modelPosition: Point = worldInvMatrix.multiplyPoint(worldPosition)
        
        this._data.position = 0
        this._data.writeFloat32(modelPosition.x)
        this._data.writeFloat32(modelPosition.y)
        this._data.writeFloat32(modelPosition.z)
        this._data.writeFloat32(modelPosition.w)
    }

    public get light(): Light
    {
        return this._light
    }
}