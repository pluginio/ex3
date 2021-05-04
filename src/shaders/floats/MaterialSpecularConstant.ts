import { ShaderFloat } from "./ShaderFloat";
import { Material } from "../../display/Material";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";

export class MaterialSpecularConstant extends ShaderFloat
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
        let specular: number[] = this._material.specular

        this._data.position = 0
        this._data.writeFloat32(specular[0])
        this._data.writeFloat32(specular[1])
        this._data.writeFloat32(specular[2])
        this._data.writeFloat32(specular[3])
    }

    public get material(): Material
    {
        return this._material
    }
}