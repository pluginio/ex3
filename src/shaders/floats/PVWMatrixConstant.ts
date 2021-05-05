import { ShaderFloat } from "./ShaderFloat";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";
import { Matrix } from "../../geom/Matrix";

export class PVWMatrixConstant extends ShaderFloat
{
    public constructor()
    {
        super(4)
        this._allowUpdater = true
    }

    public update(visual: Visual, camera: Camera): void
    {
        let projViewMatrix: Matrix = camera.projectionViewMatrix
        let worldMatrix: Matrix = visual.worldTransform.matrix
        let projViewWorldMatrix = projViewMatrix.multiply(worldMatrix)
        let source: number[] = projViewWorldMatrix.toArray()

        this._data.position = 0
        for(let i: number = 0; i < 16; ++i)
        {
            this._data.writeFloat32(source[i])
        }
    }
}