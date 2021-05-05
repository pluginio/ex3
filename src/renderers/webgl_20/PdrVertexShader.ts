import { IVertexShader } from "../../renderers/interfaces/IVertexShader";
import { Renderer } from "../../renderers/Renderer";
import { ShaderParameters } from "../../shaders/ShaderParameters";
import { VertexShader } from "../../shaders/VertexShader";

export class PdrVertexShader implements IVertexShader
{
    public constructor(renderer: Renderer, vFormat: VertexShader)
    {
        console.log("Creating vertex shader - WebGL 2.0")
    }

    public dispose(): void
    {
        console.log("Disposing vertex shader")
    }

    public enable(renderer: Renderer, vShader: VertexShader, parameters: ShaderParameters): void
    {
        console.log("Enabling vertex shader")
    }

    public disable(renderer: Renderer, vShader: VertexShader, parameters: ShaderParameters): void
    {
        console.log("Disabling vertex shader")
    }
}