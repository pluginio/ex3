import { Renderer } from "../Renderer";
import { Disposable } from "../../core/Disposable";
import { BufferLocking } from "../../resources/BufferLocking";

export interface IIndexBuffer extends Disposable
{
    enable(renderer: Renderer): void
    disable(renderer: Renderer): void
    lock(mode: BufferLocking): void
    unlock(): void
}