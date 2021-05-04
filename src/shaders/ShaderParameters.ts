import { Shader } from "./Shader";
import { ShaderFloat } from "./floats/ShaderFloat";
import { Texture } from "../resources/Texture";
import { Visual } from "../display/Visual";
import { Camera } from "../display/Camera";
import { Disposable } from "../core/Disposable";

export class ShaderParameters implements Disposable
{
    protected _shader: Shader
    protected _numConstants: number
    protected _constants: ShaderFloat[] = []
    protected _numTextures: number
    protected _textures: Texture[] = []

    public constructor(shader: Shader)
    {
        console.assert(shader != null, "Shader must be specified")

        this._shader = shader
        this._numConstants = this._shader.numConstants
        this._numTextures = this._shader.numSamplers
    }

    public dispose(): void
    {
        this._constants = null
        this._textures = null
    }

    public get numConstants(): number
    {
        return this._numConstants
    }

    public get numTextures(): number
    {
        return this._numTextures
    }

    public get constants(): ShaderFloat[]
    {
        return this._constants
    }

    public get textures(): Texture[]
    {
        return this._textures
    }

    public setConstantByName(name: string, sFloat: ShaderFloat): number
    {
        for(let i: number = 0; i < this._numConstants; ++i)
        {
            if(this._shader.getConstantByName(i) == name)
            {
                this._constants[i] = sFloat
                return i
            }
        }

        console.assert(false, "Cannot find constant")
        return -1
    }

    public setTextureByName(name: string, texture: Texture): number
    {
        for(let i: number = 0; i < this._numConstants; ++i)
        {
            if(this._shader.getSamplerByName(i) == name)
            {
                this._textures[i] = texture
                return i
            }
        }

        console.assert(false, "Cannot find constant")
        return -1
    }

    public setConstant(handle: number, sFloat: ShaderFloat): void
    {
        if(0 <= handle && handle < this._numConstants)
        {
            this._constants[handle] = sFloat
            return
        }

        console.assert(false, "Invalid constant handle")
    }

    public setTexture(handle: number, texture: Texture): void
    {
        if(0 <= handle && handle < this._numConstants)
        {
            this._textures[handle] = texture
            return
        }

        console.assert(false, "Invalid constant handle")
    }

    public getConstantByName(name: string): ShaderFloat
    {
        for(let i: number = 0; i < this._numConstants; ++i)
        {
            if(this._shader.getConstantByName(i) == name)
            {
                return this._constants[i]
            }
        }

        console.assert(false, "Cannot find constant")
        return null
    }

    public getTextureByName(name: string): Texture
    {
        for(let i: number = 0; i < this._numConstants; ++i)
        {
            if(this._shader.getConstantByName(i) == name)
            {
                return this._textures[i]
            }
        }

        console.assert(false, "Cannot find texture")
        return null
    }

    public getConstant(handle: number): ShaderFloat
    {
        if(0 <= handle && handle < this._numConstants)
        {
            return this._constants[handle]
        }

        console.assert(false, "Invalid constant handle")
        return null
    }

    public getTexture(handle: number): Texture
    {
        if(0 <= handle && handle < this._numConstants)
        {
            return this._textures[handle]
        }

        console.assert(false, "Invalid texture handle")
        return null
    }

    public updateConstants(visual: Visual, camera: Camera): void
    {
        let constants: ShaderFloat[] = this._constants
        for(let i: number = 0; i < this._numConstants; ++i)
        {
            if(constants[i].allowUpdater())
            {
                constants[i].update(visual, camera)
            }
        }
    }
}