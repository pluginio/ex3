import { VisualEffect } from "./VisualEffect";
import { Disposable } from "../core/Disposable";
import { VisualPass } from "./VisualPass";
import { ShaderParameters } from "./ShaderParameters";
import { ShaderFloat } from "./floats/ShaderFloat";
import { Texture } from "resources/Texture";
import { VisualTechnique } from "./VisualTechnique";

export class VisualEffectInstance implements Disposable {

    protected _effect: VisualEffect
    protected _techniqueIndex: number
    protected _numPasses: number
    protected _vertexParameters: ShaderParameters[] = []
    protected _pixelParameters: ShaderParameters[] = []

    public constructor(effect: VisualEffect, techniqueIndex: number)
    {
        this._effect = effect
        this._techniqueIndex = techniqueIndex
        
        console.assert(effect != null, "Effect must be specified")
        console.assert(0 <= techniqueIndex && techniqueIndex < effect.numTechniques(),
            "Invalid technique index")
        
        let technique: VisualTechnique = this._effect.technique(this._techniqueIndex)
        this._numPasses = technique.numPasses

        for(let i: number = 0; i < this._numPasses; ++i)
        {
            let pass: VisualPass = technique.passAt(i)
            this._vertexParameters[i] = new ShaderParameters(pass.vertexShader)
            this._pixelParameters[i] = new ShaderParameters(pass.pixelShader)
        }
    }

    public dispose(): void
    {
        this._vertexParameters.forEach(element => {
            element.dispose()
            element = null
        });
        this._vertexParameters = null

        this._pixelParameters.forEach(element => {
            element.dispose()
            element = null
        });
        this._pixelParameters = null

        this._effect.dispose()
        this._effect = null
    }

    public get effect(): VisualEffect
    {
        return this._effect
    }

    public get techniqueIndex(): number
    {
        return this._techniqueIndex
    }

    public get numPasses(): number
    {
        return this._effect.technique(this._techniqueIndex).numPasses
    }

    public getPass(pass: number): VisualPass
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._effect.technique(this._techniqueIndex).passAt(pass)
        }

        console.assert(false, "Invalid pass index")
        return null
    }

    public getVertexParameters(pass: number): ShaderParameters
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._vertexParameters[pass]
        }

        console.assert(false, "Invalid pass index")
        return null
    }

    public getPixelParameteres(pass: number): ShaderParameters
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._pixelParameters[pass]
        }

        console.assert(false, "Invalid pass index")
        return null
    }

    public setVertexConstantByName(pass: number, name: string, sFloat: ShaderFloat): number
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._vertexParameters[pass].setConstantByName(name, sFloat)
        }

        console.assert(false, "Invalid pass index")
        return -1
    }

    public setPixelConstantByName(pass: number, name: string, sFloat: ShaderFloat): number
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._pixelParameters[pass].setConstantByName(name, sFloat)
        }

        console.assert(false, "Invalid pass index")
        return -1
    }

    public setVetexTextureByName(pass: number, name: string, texture: Texture): number
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._vertexParameters[pass].setTextureByName(name, texture)
        }

        console.assert(false, "Invalid pass index")
        return -1
    }

    public setPixelTextureByName(pass: number, name: string, texture: Texture): number
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._pixelParameters[pass].setTextureByName(name, texture)
        }

        console.assert(false, "Invalid pass index")
        return -1
    }




    public setVertexConstant(pass: number, handle: number, sFloat: ShaderFloat): void
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._vertexParameters[pass].setConstant(handle, sFloat)
        }

        console.assert(false, "Invalid pass index")
    }

    public setPixelConstant(pass: number, handle: number, sFloat: ShaderFloat): void
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._pixelParameters[pass].setConstant(handle, sFloat)
        }

        console.assert(false, "Invalid pass index")
    }

    public setVertexTexture(pass: number, handle: number, texture: Texture): void
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._vertexParameters[pass].setTexture(handle, texture)
        }

        console.assert(false, "Invalid pass index")
    }

    public setPixelTexture(pass: number, handle: number, texture: Texture ): void
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._pixelParameters[pass].setTexture(handle, texture)
        }

        console.assert(false, "Invalid pass index")
    }





    public getVertexConstantByName(pass: number, name: string): ShaderFloat
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._vertexParameters[pass].getConstantByName(name)
        }

        console.assert(false, "Invalid pass index")
        return null
    }

    public getPixelConstantByName(pass: number, name: string): ShaderFloat
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._pixelParameters[pass].getConstantByName(name)
        }

        console.assert(false, "Invalid pass index")
        return null
    }

    public getVertexTextureByName(pass: number, name: string): Texture
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._vertexParameters[pass].getTextureByName(name)
        }

        console.assert(false, "Invalid pass index")
        return null
    }

    public getPixelTextureByName(pass: number, name: string): Texture
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._pixelParameters[pass].getTextureByName(name)
        }

        console.assert(false, "Invalid pass index")
        return null
    }


    public getVertexConstant(pass: number, handle: number): ShaderFloat
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._vertexParameters[pass].getConstant(handle)
        }

        console.assert(false, "Invalid pass index")
        return null
    }

    public getPixelConstant(pass: number, handle: number): ShaderFloat
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._pixelParameters[pass].getConstant(handle)
        }

        console.assert(false, "Invalid pass index")
        return null
    }

    public getVertexTexture(pass: number, handle: number): Texture
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._vertexParameters[pass].getTexture(handle)
        }

        console.assert(false, "Invalid pass index")
        return null
    }

    public getPixelTexture(pass: number, handle: number): Texture
    {
        if(0 <= pass && pass < this._numPasses)
        {
            return this._pixelParameters[pass].getTexture(handle)
        }

        console.assert(false, "Invalid pass index")
        return null
    }
}