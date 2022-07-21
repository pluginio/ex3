import { IVertexShader } from "../../renderers/interfaces/IVertexShader";
import { Renderer } from "../../renderers/Renderer";
import { ShaderParameters } from "../../shaders/ShaderParameters";
import { VertexShader } from "../../shaders/VertexShader";
import { GL20 } from "./GL20";
import { PdrShader } from "./PdrShader";

export class PdrVertexShader extends PdrShader implements IVertexShader
{
    public constructor(renderer: Renderer, vShader: VertexShader)
    {
        super()
        console.log("Creating vertex shader - WebGL 2.0")
        let gl = GL20.gl

        let programText = vShader.getProgram(VertexShader.profile)
        this._shader = gl.createShader(gl.VERTEX_SHADER)
        gl.shaderSource(this._shader, programText)
        gl.compileShader(this._shader)
    }

    public enable(renderer: Renderer, vShader: VertexShader, parameters: ShaderParameters): void
    {
        console.log("Enabling vertex shader")
       //TODO:  gl.attachShader(program, vShader)

        let profile = VertexShader.profile
        let numConstants = vShader.numConstants
        for(let i = 0; i < numConstants; ++i)
        {
            let numRegisters = vShader.getNumRegistersUsed(i)
            let data = parameters.getConstant(i)
            // console.log("++++++++++++++++++++++++++++++++++++ ", data.float32Array)

            // TODO: let baseRegister = vShader.getBaseRegister(profile, i)
            for(let j = 0; j < numRegisters; ++j)
            {
                console.log("entry: ", data.getRegister(j))
                //GL20.gl.uniformMatrix4fv(null, false, data)
            }
        }

        this.setSamplerState(renderer, vShader, profile, parameters,
            renderer._data.mMaxVShaderImages, renderer._data.mCurrentSS)
    }

    public disable(renderer: Renderer, vShader: VertexShader, 
        parameters: ShaderParameters): void
    {
        //TODO: disable the program
        console.log("Disabling vertex shader")
        let profile = VertexShader.profile
        this.disableTextures(renderer, vShader, profile, parameters,
            renderer._data.mMaxVShaderImages)
    }
}