import { Color3ds } from "./Color3ds"
import { Vertex3ds } from "./Vertex3ds"

export class Light3ds
{
    public name: string = ""
    public off: boolean = false
    public position: Vertex3ds = new Vertex3ds(1, 0, 0)
    public target: Vertex3ds = new Vertex3ds(0, 0, 0)
    public color: Color3ds = new Color3ds()
    public hotspot: number = 0
    public falloff: number = 0
    public outerRange: number = 0
    public innerRange: number = 0
    public multiplexer: number = 0
    public attenuation: number = 0
    public roll: number = 0
    public shadowed: boolean = false
    public shadowBias: number = 0
    public shadowFilter: number = 0
    public shadowSize: number = 0
    public cone: boolean = false
    public rectangular: boolean = false
    public aspect: number = 0
    public projector: boolean = false
    public projectorName: string = ""
    public overshoot: boolean = false
    public rayBias: number = 0
    public rayShadows: boolean = false

    public constructor()
    {

    }
}
