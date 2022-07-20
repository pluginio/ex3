import { ShaderFloat } from "./ShaderFloat";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";

export class WMatrixConstant extends ShaderFloat
{
    public constructor()
    {
        super(4)
        this._allowUpdater = true
    }

    public update(visual: Visual, camera: Camera)
    {
        let worldMatrix: number[] = visual.worldTransform.matrix.tuple

        this._data.position = 0
        for(let i: number = 0; i < 16; ++i)
        {
            this._data.writeFloat32(worldMatrix[i])
        }
    }
}