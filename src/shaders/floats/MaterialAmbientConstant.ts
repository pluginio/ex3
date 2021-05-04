import { ShaderFloat } from "./ShaderFloat";
import { Material } from "../../display/Material";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";

export class MaterialAmbientConstant extends ShaderFloat
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
        let ambient: number[] = this._material.ambient

        this._data.position = 0
        this._data.writeFloat32(ambient[0])
        this._data.writeFloat32(ambient[1])
        this._data.writeFloat32(ambient[2])
        this._data.writeFloat32(ambient[3])
    }

    public get material(): Material
    {
        return this._material
    }
}