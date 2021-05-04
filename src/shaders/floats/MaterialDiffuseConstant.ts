import { ShaderFloat } from "./ShaderFloat";
import { Material } from "../../display/Material";
import { Visual } from "../../display/Visual";
import { Camera } from "../../display/Camera";

export class MaterialDiffuseConstant extends ShaderFloat
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
        let diffuse: number[] = this._material.diffuse

        this._data.position = 0
        this._data.writeFloat32(diffuse[0])
        this._data.writeFloat32(diffuse[1])
        this._data.writeFloat32(diffuse[2])
        this._data.writeFloat32(diffuse[3])
    }

    public get material(): Material
    {
        return this._material
    }
}