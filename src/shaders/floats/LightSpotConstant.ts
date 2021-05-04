import {ShaderFloat} from './ShaderFloat'
import {Light} from '../../display/Light'
import { Visual } from '../../display/Visual'
import { Camera } from '../../display/Camera'

export class LightSpotConstant extends ShaderFloat
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
        this._data.position = 0
        this._data.writeFloat32(this._light.angle)
        this._data.writeFloat32(this._light.cosAngle)
        this._data.writeFloat32(this._light.sinAngle)
        this._data.writeFloat32(this._light.exponent)
    }

    public get light(): Light
    {
        return this._light
    }
}