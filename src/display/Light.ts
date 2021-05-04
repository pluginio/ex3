import {LightType} from './LightType'
import { Disposable } from '../core/Disposable';
import { Point } from '../geom/Point';
import { Vector } from '../geom/Vector';

export class Light implements Disposable
{
    public ambient: number[] = [0, 0, 0, 0]
    public diffuse: number[] = [0, 0, 0, 0]
    public specular: number[] = [0, 0, 0, 0]

    public constant: number = 1
    public linear: number = 0
    public quadratic: number = 0
    public intensity: number = 1
    
    private _angle: number = Math.PI
    public cosAngle: number = -1
    public sinAngle: number = 0
    public exponent: number = 1

    public position: Point = Point.ORIGIN
    public dVector: Vector = Vector.UNIT_Z.negate()
    public uVector: Vector = Vector.UNIT_Y
    public rVector: Vector = Vector.UNIT_X

    protected _type: LightType

    public constructor(type: LightType = LightType.AMBIENT)
    {
        this._type = type
    }

    public dispose(): void
    {
        this.position.dispose()
        this.dVector.dispose()
        this.uVector.dispose()
        this.rVector.dispose()
    }

    public set type(type: LightType)
    {
        this._type = type
    }

    public get type(): LightType
    {
        return this._type
    }

    public get angle(): number
    {
        return this._angle
    }

    public set angle(angle: number)
    {
        console.assert(0 < angle && angle <= Math.PI, "Angle out of range in Light::angle")

        this.angle = angle
        this.cosAngle = Math.cos(angle)
        this.sinAngle = Math.sin(angle)
    }

    public set direction(direction: Vector)
    {
        this.dVector = direction
        Vector.generateOthonormalBasis(this.uVector, this.rVector, this.dVector)
    }
}