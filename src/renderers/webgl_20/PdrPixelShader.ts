import { IPixelShader } from "../../renderers/interfaces/IPixelShader";
import { Renderer } from "../../renderers/Renderer";
import { PixelShader } from "../../shaders/PixelShader";
import { ShaderParameters } from "../../shaders/ShaderParameters";
import { GL20 } from "./GL20";
import { PdrShader } from "./PdrShader";

export class PdrPixelShader extends PdrShader implements IPixelShader
{
    public constructor(renderer: Renderer, pShader: PixelShader)
    {
        super()
        console.log("Creating pixel shader - WebGL 2.0")
        let gl = GL20.gl

        let programText = pShader.getProgram(PixelShader.profile)
        this._shader = gl.createShader(gl.FRAGMENT_SHADER)
        gl.shaderSource(this._shader, programText)
        gl.compileShader(this._shader)
    }

    public enable(renderer: Renderer, pShader: PixelShader, parameters: ShaderParameters): void
    {
        console.log("Enabling pixel shader")
    }

    public disable(renderer: Renderer, pShader: PixelShader, parameters: ShaderParameters): void
    {
        console.log("Disabling pixel shader")
    }
}