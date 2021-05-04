import { Renderer } from "../Renderer";
import { Disposable } from "../../core/Disposable";
import { ShaderParameters } from "../../shaders/ShaderParameters"
import { PixelShader } from "../../shaders/PixelShader"

export interface IPixelShader extends Disposable
{
    enable(renderer: Renderer, pShader: PixelShader, parameters: ShaderParameters): void
    disable(renderer: Renderer, pShader: PixelShader, parameters: ShaderParameters): void
}