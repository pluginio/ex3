import { ShaderFloat } from "./ShaderFloat";
import { Light } from "../../display/Light";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";

export class LightSpecularConstant extends ShaderFloat
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
        let specular: number[] = this._light.specular

        this._data.position = 0
        this._data.writeFloat32(specular[0])
        this._data.writeFloat32(specular[1])
        this._data.writeFloat32(specular[2])
        this._data.writeFloat32(specular[3])
    }

    public get light(): Light
    {
        return this._light
    }
}