import { ShaderFloat } from "./ShaderFloat";
import { Light } from "../../display/Light";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";

export class LightAttenuationConstand extends ShaderFloat
{
    protected _light: Light

    public constructor(light: Light)
    {
        super(1)
        this._light = light
        this._allowUpdater = true
    }

    public dispose(): void
    {
        super.dispose()
    }

    public update(visual: Visual, camera: Camera): void
    {
        this._data.position = 0
        this._data.writeFloat32(this._light.constant)
        this._data.writeFloat32(this._light.linear)
        this._data.writeFloat32(this._light.quadratic)
        this._data.writeFloat32(this._light.intensity)
    }

    public get light(): Light
    {
        return this._light
    }
}