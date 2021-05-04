import { ShaderFloat } from "./ShaderFloat";
import { Vector } from "../../geom/Vector";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";

export class CameraWorldDVectorConstant extends ShaderFloat
{
    public constructor()
    {
        super(1)
        this._allowUpdater = true
    }

    public dispose(): void
    {
        super.dispose()
    }

    public update(visual: Visual, camera: Camera): void
    {
        let worldDVector: Vector = camera.dVector

        this._data.position = 0
        this._data.writeFloat32(worldDVector.x)
        this._data.writeFloat32(worldDVector.y)
        this._data.writeFloat32(worldDVector.z)
        this._data.writeFloat32(worldDVector.w)
    }
}