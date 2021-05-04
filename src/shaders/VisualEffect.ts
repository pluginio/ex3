import { VisualTechnique } from './VisualTechnique'
import { VisualPass } from './VisualPass';
import { VertexShader } from './VertexShader';
import { PixelShader } from './PixelShader';
import { AlphaState } from './states/AlphaState';
import { CullState } from './states/CullState';
import { DepthState } from './states/DepthState';
import { OffsetState } from './states/OffsetState';
import { StencilState } from './states/StencilState';
import { WireState } from './states/WireState';
import { Disposable } from '../core/Disposable';

export class VisualEffect implements Disposable
{
    protected _techniques: VisualTechnique[] = []

    public insertTechnique(technique: VisualTechnique): void
    {
        if(technique)
        {
            this._techniques.push(technique)
        }
        else
        {
            console.assert(false, "Input to InsertTechnique must be nonnull")
        }
    }

    public dispose(): void
    {

    }

    public numTechniques(): number
    {
        return this._techniques.length
    }

    public technique(index: number): VisualTechnique
    {
        if (0 <= index && index < this._techniques.length)
        {
            return this._techniques[index]
        }
    
        console.assert(false, "Invalid index in technique")
        return null
    }

    public numPasses(techniqueIndex: number): number
    {
        if (0 <= techniqueIndex && techniqueIndex < this._techniques.length)
        {
            return this._techniques[techniqueIndex].numPasses
        }
    
        console.assert(false, "Invalid index in numPasses")
        return null
    }

    public pass(techniqueIndex: number, passIndex: number): VisualPass
    {
        if (0 <= techniqueIndex && techniqueIndex < this._techniques.length)
        {
            return this._techniques[techniqueIndex].passAt(passIndex)
        }
    
        console.assert(false, "Invalid index in pass")
        return null
    }

    public vertexShader(techniqueIndex: number, passIndex: number): VertexShader
    {
        if (0 <= techniqueIndex && techniqueIndex < this._techniques.length)
        {
            return this._techniques[techniqueIndex].vertexShaderAt(passIndex)
        }
    
        console.assert(false, "Invalid index in vertexShader")
        return null
    }

    public pixelShader(techniqueIndex: number, passIndex: number): PixelShader
    {
        if (0 <= techniqueIndex && techniqueIndex < this._techniques.length)
        {
            return this._techniques[techniqueIndex].pixelShaderAt(passIndex)
        }
    
        console.assert(false, "Invalid index in pixelShader")
        return null
    }

    public alphaState(techniqueIndex: number, passIndex: number): AlphaState
    {
        if (0 <= techniqueIndex && techniqueIndex < this._techniques.length)
        {
            return this._techniques[techniqueIndex].alphaStateAt(passIndex)
        }
    
        console.assert(false, "Invalid index in alphaState")
        return null
    }

    public cullState(techniqueIndex: number, passIndex: number): CullState
    {
        if (0 <= techniqueIndex && techniqueIndex < this._techniques.length)
        {
            return this._techniques[techniqueIndex].cullStateAt(passIndex)
        }
    
        console.assert(false, "Invalid index in cullState")
        return null
    }

    public depthState(techniqueIndex: number, passIndex: number): DepthState
    {
        if (0 <= techniqueIndex && techniqueIndex < this._techniques.length)
        {
            return this._techniques[techniqueIndex].depthStateAt(passIndex)
        }
    
        console.assert(false, "Invalid index in depthState")
        return null
    }

    public offsetState(techniqueIndex: number, passIndex: number): OffsetState
    {
        if (0 <= techniqueIndex && techniqueIndex < this._techniques.length)
        {
            return this._techniques[techniqueIndex].offsetStateAt(passIndex)
        }
    
        console.assert(false, "Invalid index in offsetState")
        return null
    }

    public stencilState(techniqueIndex: number, passIndex: number): StencilState
    {
        if (0 <= techniqueIndex && techniqueIndex < this._techniques.length)
        {
            return this._techniques[techniqueIndex].stencilStateAt(passIndex)
        }
    
        console.assert(false, "Invalid index in stencilState")
        return null
    }

    public wireState(techniqueIndex: number, passIndex: number): WireState
    {
        if (0 <= techniqueIndex && techniqueIndex < this._techniques.length)
        {
            return this._techniques[techniqueIndex].wireStateAt(passIndex)
        }
    
        console.assert(false, "Invalid index in wireState")
        return null
    }
}