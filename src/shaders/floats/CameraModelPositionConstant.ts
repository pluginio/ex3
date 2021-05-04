import { ShaderFloat } from './ShaderFloat'
import { Visual } from '../../display/Visual'
import { Camera } from '../../display/Camera'
import { Point } from '../../geom/Point'
import { Matrix } from '../../geom/Matrix'

export class CameraModelPositionConstant extends ShaderFloat
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
        let worldInvMatrix: Matrix = visual.worldTransform.inverse
        let modelPosition: Point = worldInvMatrix.multiplyPoint(worldPosition)

        this._data.position = 0
        this._data.writeFloat32(modelPosition.x)
        this._data.writeFloat32(modelPosition.y)
        this._data.writeFloat32(modelPosition.z)
        this._data.writeFloat32(modelPosition.w)
    }
}