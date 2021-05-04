import { ShaderFloat } from "./ShaderFloat";
import { Light } from "../../display/Light";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";

export class LightDiffuseConstant extends ShaderFloat
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
        let diffuse: number[] = this._light.diffuse

        this._data.position = 0
        this._data.writeFloat32(diffuse[0])
        this._data.writeFloat32(diffuse[1])
        this._data.writeFloat32(diffuse[2])
        this._data.writeFloat32(diffuse[3])
    }

    public get light(): Light{
        return this._light
    }
}
