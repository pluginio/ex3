import { Face3ds } from "./Face3ds"
import { FaceMaterial3ds } from "./FaceMaterial3ds"
import { HideKeyTrack3ds } from "./HideKeyTrack3ds"
import { MorphTrack3ds } from "./MorphTrack3ds"
import { RotationTrack3ds } from "./RotationTrack3ds"
import { TexCoords3ds } from "./TexCoords3ds"
import { Vertex3ds } from "./Vertex3ds"
import { XyzTrack3ds } from "./XyzTrack3ds"

export class Mesh3ds
{
    public static PLANAR_MAP: number = 0
    public static CYLINDRICAL_MAP: number = 1
    public static SPHERICAL_MAP: number = 2

    public name: string = ""
    public vertices: Vertex3ds[] = []
    public texCoords: TexCoords3ds[] = []
    public texUTile: number = 0
    public texVTile: number = 0
    public texMapType: number = 0
    public faces: Face3ds[] = []
    public smoothGroup: number[] = []
    public localSystem: number [][] = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    public faceMaterials: FaceMaterial3ds[] = []

    public nodeId: number = 0
    public parentNodeId: number = 0
    public nodeFlags: number = 0
    public pivot: Vertex3ds = new Vertex3ds()
    public positionTrack: XyzTrack3ds = new XyzTrack3ds()
    public rotationTrack: RotationTrack3ds = new RotationTrack3ds()
    public scaleTrack: XyzTrack3ds = new XyzTrack3ds()
    public morphTrack: MorphTrack3ds = new MorphTrack3ds()
    public hideTrack: HideKeyTrack3ds = new HideKeyTrack3ds()

    public constructor()
    {

    }

    public addFaceMaterial(m: FaceMaterial3ds): void
    {
        this.faceMaterials.push(m)
    }

    public get numFaces(): number
    {
        return this.faces.length
    }

    public get numVertices(): number
    {
        return this.vertices.length
    }

    public get numIndices(): number
    {
        return this.numFaces * 3
    }
}
