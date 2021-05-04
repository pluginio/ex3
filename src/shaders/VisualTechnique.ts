import { VisualPass } from './VisualPass';
import { VertexShader } from './VertexShader';
import { PixelShader } from './PixelShader';
import { AlphaState } from './states/AlphaState';
import { CullState } from './states/CullState';
import { DepthState } from './states/DepthState';
import { OffsetState } from './states/OffsetState';
import { WireState } from './states/WireState';
import { StencilState } from './states/StencilState';

export class VisualTechnique
{
    protected _passes: VisualPass[] = []

    public insertPass(pass: VisualPass): void
    {
        if(pass)
        {
            this._passes.push(pass)
        }
        else
        {
            console.assert(false, "Input to InsertPass must be non null")
        }
    }

    public get numPasses(): number
    {
        return this._passes.length
    }

    public passAt(index: number): VisualPass
    {
        if (0 <= index && index < this._passes.length)
        {
            return this._passes[index];
        }
    
        console.assert(false, "Invalid index in passAt");
        return null
    }

    public vertexShaderAt(index: number): VertexShader
    {
        if (0 <= index && index < this._passes.length)
        {
            return this._passes[index].vertexShader;
        }
    
        console.assert(false, "Invalid index in vertexShaderAt");
        return null
    }

    public pixelShaderAt(index: number): PixelShader
    {
        if (0 <= index && index < this._passes.length)
        {
            return this._passes[index].pixelShader;
        }
    
        console.assert(false, "Invalid index in pixelShaderAt");
        return null
    }

    public alphaStateAt(index: number): AlphaState
    {
        if (0 <= index && index < this._passes.length)
        {
            return this._passes[index].alphaState;
        }
    
        console.assert(false, "Invalid index in alphaStateAt");
        return null
    }

    public cullStateAt(index: number): CullState
    {
        if (0 <= index && index < this._passes.length)
        {
            return this._passes[index].cullState;
        }
    
        console.assert(false, "Invalid index in cullStateAt");
        return null
    }

    public depthStateAt(index: number): DepthState
    {
        if (0 <= index && index < this._passes.length)
        {
            return this._passes[index].depthState;
        }
    
        console.assert(false, "Invalid index in depthStateAt");
        return null
    }

    public offsetStateAt(index: number): OffsetState
    {
        if (0 <= index && index < this._passes.length)
        {
            return this._passes[index].offsetState;
        }
    
        console.assert(false, "Invalid index in offsetStateAt");
        return null
    }

    public stencilStateAt(index: number): StencilState
    {
        if (0 <= index && index < this._passes.length)
        {
            return this._passes[index].stencilState;
        }
    
        console.assert(false, "Invalid index in stencilStateAt");
        return null
    }

    public wireStateAt(index: number): WireState
    {
        if (0 <= index && index < this._passes.length)
        {
            return this._passes[index].wireState;
        }
    
        console.assert(false, "Invalid index in wireStateAt");
        return null
    }
}