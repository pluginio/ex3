import { Renderer } from "../Renderer";
import { Disposable } from "../../core/Disposable";
import { BufferLocking } from "../../resources/BufferLocking";

export interface ITexture2D extends Disposable
{
    enable(renderer: Renderer, textureUnit: number): void
    disable(renderer: Renderer, textureUnit: number): void
    lock(level: number, mode: BufferLocking): void
    unlock(level: number): void
}