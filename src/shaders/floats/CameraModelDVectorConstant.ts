import { ShaderFloat } from "./ShaderFloat";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";
import { Vector } from "../../geom/Vector";
import { Matrix } from "../../geom/Matrix";

export class CameraModelDVectorConstant extends ShaderFloat {

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
        let worldInvMatrix: Matrix = visual.worldTransform.inverse
        let modelDVector: Vector = worldInvMatrix.multiplyVector(worldDVector)

        this._data.position = 0
        this._data.writeFloat32(modelDVector.x)
        this._data.writeFloat32(modelDVector.y)
        this._data.writeFloat32(modelDVector.z)
        this._data.writeFloat32(modelDVector.z)
    }
}