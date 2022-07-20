import { ShaderFloat } from "./ShaderFloat";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";
import { Matrix } from "../../geom/Matrix";

export class VWMatrixConstant extends ShaderFloat
{
    public constructor()
    {
        super(4)
        this._allowUpdater = true
    }

    public update(visual: Visual, camera: Camera)
    {
        let viewMatrix: Matrix = camera.viewMatrix
        let worldMatrix: Matrix = visual.worldTransform.matrix
        let viewWorldMatrix: Matrix = viewMatrix.multiply(worldMatrix)
        let source: number[] = viewWorldMatrix.tuple

        this._data.position = 0
        for(let i: number = 0; i < 16; ++i)
        {
            this._data.writeFloat32(source[i])
        }
    }
}