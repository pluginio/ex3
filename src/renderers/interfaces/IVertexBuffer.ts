import { Renderer } from "../Renderer";
import { Disposable } from "../../core/Disposable";
import { BufferLocking } from "../../resources/BufferLocking";

export interface IVertexBuffer extends Disposable
{
    enable(renderer: Renderer, streamIndex: number, offset: number): void
    disable(renderer: Renderer, streamIndex: number): void
    lock(mode: BufferLocking): void
    unlock(): void
}