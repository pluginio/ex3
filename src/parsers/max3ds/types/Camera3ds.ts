import { PTrack3ds } from "./PTrack3ds"
import { Vertex3ds } from "./Vertex3ds"
import { XyzTrack3ds } from "./XyzTrack3ds"

export class Camera3ds
{
    public name: String = ""
    public position: Vertex3ds = new Vertex3ds(1, 0, 0)
    public target: Vertex3ds = new Vertex3ds(0, 0, 0)
    public roll: number = 0
    public lens: number = 0
    public nearPlane: number = 0
    public farPlane: number = 0

    public targetNodeId: number = 0
    public targetParentNodeId: number = 0
    public targetNodeFlags: number = 0
    public positionNodeId: number = 0
    public positionParentNodeId: number = 0
    public positionNodeFlags: number = 0
    public positionTrack: XyzTrack3ds = new XyzTrack3ds()
    public targetTrack: XyzTrack3ds = new XyzTrack3ds()
    public fovTrack: PTrack3ds = new PTrack3ds()
    public rollTrack: PTrack3ds = new PTrack3ds()

    public constructor()
    {

    }
}
