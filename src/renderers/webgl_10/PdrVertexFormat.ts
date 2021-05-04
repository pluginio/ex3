import { IVertexFormat } from "../../renderers/interfaces/IVertexFormat";
import { Renderer } from "../Renderer";
import { VertexFormat } from "resources/VertexFormat";

export class PdrVertexFormat implements IVertexFormat
{
    public constructor(renderer: Renderer, vFormat: VertexFormat)
    {
        console.log("Creating vertex format - WebGL 1.0")
    }

    public dispose(): void
    {

    }
    public enable(renderer: Renderer): void
    {

    }

    public disable(renderer: Renderer): void
    {
        
    }
}