import { Renderer } from "../Renderer";
import { Disposable } from "../../core/Disposable";
import { Texture2D } from "../../resources/Texture2D";

export interface IRenderTarget extends Disposable
{
    enable(renderer: Renderer): void
    disable(renderer: Renderer): void
    readColor(i: number, renderer: Renderer, texture: Texture2D): void
}