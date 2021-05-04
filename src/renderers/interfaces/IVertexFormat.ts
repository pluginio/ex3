import { Renderer } from "../Renderer";
import { Disposable } from "../../core/Disposable";

export interface IVertexFormat extends Disposable
{
    enable(renderer: Renderer): void
    disable(renderer: Renderer): void
}