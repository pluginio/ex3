import { ShaderFloat } from './ShaderFloat'
import { Light } from '../../display/Light'
import { Visual } from '../../display/Visual'
import { Camera } from '../../display/Camera'
import { Matrix } from '../../geom/Matrix';
import { Vector } from '../../geom/Vector';

export class LightModelDVectorConstant extends ShaderFloat
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
        let worldInvMatrix: Matrix = visual.worldTransform.inverse
        let modelDVector: Vector = worldInvMatrix.multiplyVector(this._light.dVector)

        this._data.position = 0
        this._data.writeFloat32(modelDVector.x)
        this._data.writeFloat32(modelDVector.y)
        this._data.writeFloat32(modelDVector.z)
        this._data.writeFloat32(modelDVector.w)
    }

    public get light(): Light
    {
        return this._light
    }
}