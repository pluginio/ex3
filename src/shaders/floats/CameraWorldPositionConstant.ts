import { ShaderFloat } from "./ShaderFloat";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";
import { Point } from "../../geom/Point";

export class CameraWorldPositionConstant extends ShaderFloat
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
        let worldPosition: Point = camera.position

        this._data.position = 0
        this._data.writeFloat32(worldPosition.x)
        this._data.writeFloat32(worldPosition.y)
        this._data.writeFloat32(worldPosition.z)
        this._data.writeFloat32(worldPosition.w)
    }
}