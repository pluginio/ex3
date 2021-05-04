import { Renderer } from "../Renderer";
import { Disposable } from "../../core/Disposable";
import { ShaderParameters } from "../../shaders/ShaderParameters"
import { VertexShader } from "../../shaders/VertexShader"

export interface IVertexShader extends Disposable
{
    enable(renderer: Renderer, vShader: VertexShader, parameters: ShaderParameters): void
    disable(renderer: Renderer, vShader: VertexShader, parameters: ShaderParameters): void
}