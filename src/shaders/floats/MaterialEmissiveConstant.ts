import { ShaderFloat } from "./ShaderFloat";
import { Material } from "../../display/Material";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";

export class MaterialEmissiveConstant extends ShaderFloat
{
    protected _material: Material

    public constructor(material: Material)
    {
        super(1)
        this._material = material
        this._allowUpdater = true
    }

    public update(visual: Visual, camera: Camera): void
    {
        let emissive: number[] = this._material.emissive

        this._data.position = 0
        this._data.writeFloat32(emissive[0])
        this._data.writeFloat32(emissive[1])
        this._data.writeFloat32(emissive[2])
        this._data.writeFloat32(emissive[3])
    }

    public get material(): Material
    {
        return this._material
    }
}