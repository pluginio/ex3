import { IRenderTarget } from "../../renderers/interfaces/IRenderTarget";
import { Renderer } from "../../renderers/Renderer";
import { Texture2D } from "../../resources/Texture2D";
import { RenderTarget } from "../../resources/RenderTarget";

export class PdrRenderTarget implements IRenderTarget
{
    public constructor(renderer: Renderer, renderTarget: RenderTarget)
    {
        console.log("Creating render target - WebGL 2.0")
    }

    public dispose(): void
    {
        console.log("Disposing render target")
    }

    public enable(renderer: Renderer): void
    {
        console.log("Enabling render target")
    }

    public disable(renderer: Renderer): void
    {
        console.log("Disabling render target")
    }

    public readColor(i: number, renderer: Renderer, texture: Texture2D): void
    {
        console.log("Read color render target")
    }
}