import { ShaderFloat } from "./ShaderFloat";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";

export class VMatrixConstant extends ShaderFloat
{
    public constructor()
    {
        super(4)
        this._allowUpdater = true
    }

    public update(visual: Visual, camera: Camera): void
    {
        let viewMatrix: number[] = camera.viewMatrix.tuple

        this._data.position = 0
        for(let i: number = 0; i < 16; ++i)
        {
            this._data.writeFloat32(viewMatrix[i])
        }
    }
}