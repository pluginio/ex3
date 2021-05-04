import { Constants } from "core/Constants";
import { Pool } from "../utils/Pool";
import { Point } from "./Point";
import { Vector } from "./Vector";

export class Plane
{
    private static readonly _pool: Pool<Plane> = new Pool(
        Constants.DEFAULT_POOL_SIZE,
        Plane
    )

    private _tuple: number[] = []

    public static new(
        x: number = 0,
        y: number = 0,
        z: number = 0,
        w: number = 0
    ): Plane {
        return Plane._pool.get().set(x, y, z, w)
    }

    public set(x: number, y: number, z: number, w: number): Plane {
        this._tuple[0] = x
        this._tuple[1] = y
        this._tuple[2] = z
        this._tuple[3] = w
        
        return this
    }

    public dispose(): void {
        Plane._pool.release(this)
    }

    public static fromPlane(p: Plane) : Plane
    {
        return Plane.new(p._tuple[0], p._tuple[1], p._tuple[2], p.constant)
    }

    public static fromVectorConstant(normal: Vector, constant: number): Plane
    {
        return Plane.new(
            normal.x,
            normal.y,
            normal.z,
            -constant
        )
    }

    public static fromVectorPoint(normal: Vector, p: Point): Plane
    {
        return Plane.new(
            normal.x,
            normal.y,
            normal.z,
            -p.dot(normal)
        )
    }

    public static fromPoints(p0: Point, p1: Point, p2: Point): Plane
    {
        let edge1: Vector = p1.subtract(p0) as Vector
        let edge2: Vector = p2.subtract(p0) as Vector
        let normal = edge1.unitCross(edge2);

        return Plane.new(
            normal.x,
            normal.y,
            normal.z,
            -p0.dot(normal)
        )
    }

    public static fromTuple(tuple: number[])
    {
        return Plane.new(tuple[0], tuple[1], tuple[2], tuple[3])
    }

    public get normal(): Vector
    {
        return Vector.new(this._tuple[0], this._tuple[1], this._tuple[2])
    }

    public set normal(normal: Vector)
    {
        this._tuple[0] = normal.x
        this._tuple[1] = normal.y
        this._tuple[2] = normal.z
    }

    public get constant(): number
    {
        return -this._tuple[3]
    }

    public set constant(constant: number)
    {
        this._tuple[3] = -constant
    }

    public normalize(): number
    {
        let length: number = Math.sqrt(this._tuple[0] * this._tuple[0] + this._tuple[1] * this._tuple[1] +
            this._tuple[2] * this._tuple[2])
    
        if (length > Constants.EPSILON)
        {
            let invLength: number = 1 / length
            this._tuple[0] *= invLength
            this._tuple[1] *= invLength
            this._tuple[2] *= invLength
            this._tuple[3] *= invLength
        }
    
        return length;
    }

    public distanceTo(p: Point)
    {
        return this._tuple[0] * p.x + this._tuple[1] * p.y + this._tuple[2] * p.z + this._tuple[3];
    }

    public whichSide(p: Point): number
    {
        let distance: number = this.distanceTo(p);

        if (distance < 0)
        {
            return -1;
        }
        else if (distance > 0)
        {
            return +1;
        }
        else
        {
            return 0;
        }
    }

    public toString(): string {
        return `[Plane]\nx: ${this.normal.x.toFixed(8)}, y: ${this.normal.y.toFixed(8)}, z: ${this.normal.z.toFixed(8)}, w: ${this.constant.toFixed(8)}`
    }
}