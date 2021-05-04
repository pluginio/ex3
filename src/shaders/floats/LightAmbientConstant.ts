import { ShaderFloat } from "./ShaderFloat";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";
import { Light } from "../../display/Light";

export class LightAmbientConstant extends ShaderFloat
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
        this.dispose()
    }

    public update(visual: Visual, camera: Camera): void
    {
        let ambient: number[] = this._light.ambient

        this._data.position = 0
        this._data.writeFloat32(ambient[0])
        this._data.writeFloat32(ambient[1])
        this._data.writeFloat32(ambient[2])
        this._data.writeFloat32(ambient[3])
    }

    public get light(): Light
    {
        return this._light
    }
}