import { Renderer } from "../Renderer";
import { Disposable } from "../../core/Disposable";
import { BufferLocking } from "../../resources/BufferLocking";

export interface ITextureCube extends Disposable
{
    enable(renderer: Renderer, textureUnit: number): void
    disable(renderer: Renderer, textureUnit: number): void
    lock(face: number, level: number, mode: BufferLocking): void
    unlock(face: number, level: number): void
}