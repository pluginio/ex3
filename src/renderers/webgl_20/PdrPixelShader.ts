import { IPixelShader } from "../../renderers/interfaces/IPixelShader";
import { Renderer } from "../../renderers/Renderer";
import { PixelShader } from "../../shaders/PixelShader";
import { ShaderParameters } from "../../shaders/ShaderParameters";

export class PdrPixelShader implements IPixelShader
{
    public constructor(renderer: Renderer, pixelShader: PixelShader)
    {
        console.log("Creating pixel shader - WebGL 2.0")
    }

    public dispose(): void
    {

    }

    public enable(renderer: Renderer, pShader: PixelShader, parameters: ShaderParameters): void
    {

    }

    public disable(renderer: Renderer, pShader: PixelShader, parameters: ShaderParameters): void
    {
        
    }
}