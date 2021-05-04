import { Point } from "./Point";
import { Transform } from "./Transform";
import { Vector } from "./Vector";
import { Pool } from "../utils/Pool";
import { Constants } from "../core/Constants";
import { Plane } from "./Plane";
import { Disposable } from "../core/Disposable";
import { ByteArray } from "../core/ByteArray";

export class Bound implements Disposable
{
    private static readonly _pool: Pool<Bound> = new Pool(10, Bound)

    private _center: Point = Point.ORIGIN
    private _radius: number = 0

    public static new(
        center: Point = Point.ORIGIN,
        radius: number = 0
    ): Bound {
        return Bound._pool.get().set(center, radius)
    }

    public dispose(): void {
        Bound._pool.release(this)
    }

    public set(center: Point, radius: number): Bound
    {
        this._center = center
        this._radius = radius

        return this
    }

    public set center(center: Point)
    {
        this._center = center
    }

    public get center(): Point
    {
        return this._center
    }

    public set radius(radius: number)
    {
        this._radius = radius
    }

    public get radius(): number
    {
        return this._radius
    }

    public whichSide(plane: Plane): number
    {
        let signedDistance: number = plane.distanceTo(this._center);

        if (signedDistance <= -this._radius)
        {
            return -1
        }
    
        if (signedDistance >= this._radius)
        {
            return +1
        }
    
        return 0
    }

    public growToContain(bound: Bound): void
    {
        if (bound._radius == 0)
        {
            return
        }

        if (this._radius == 0)
        {
            this.set(bound.center, bound.radius)
            return
        }

        let centerDiff: Vector = bound._center.subtract(this._center) as Vector
        let lengthSqr: number = centerDiff.squaredLength
        let radiusDiff: number = bound._radius - this._radius
        let radiusDiffSqr: number = radiusDiff*radiusDiff

        if (radiusDiffSqr >= lengthSqr)
        {
            if (radiusDiff >= 0)
            {
                this._center = bound._center
                this._radius = bound._radius
            }
            return;
        }

        let length: number = Math.sqrt(lengthSqr)
        if (length > Constants.EPSILON)
        {
            let coeff: number = (length + radiusDiff)/(2*length)
            this._center.addEq(centerDiff.scale(coeff))
        }

        this._radius = 0.5*(length + this._radius + bound._radius)
    }

    public transformBy(transform: Transform, bound: Bound): void
    {
        bound._center = transform.multiplyPoint(this._center)
        bound._radius = transform.norm * this._radius;
    }

    // TODO check arraybuffer data type as prefered choice for GLES2
    public computeFromData(numElements: number, stride: number, data: ByteArray): void
    {

    }

    public testIntersectionRay(origin: Point, direction: Vector, tMin: number, tMax: number): boolean
    {
        if (this._radius == 0)
        {
            return false;
        }

        let diff = Vector.new()

        let a0: number = 0
        let a1: number = 0
        let discr: number = 0

        if (tMin == -Number.MAX_VALUE)
        {
            console.assert(tMax == Number.MAX_VALUE, "tMax must be infinity for a line.")

            diff = origin.subtract(this._center) as Vector
            a0 = diff.dot(diff) - this._radius*this._radius
            a1 = direction.dot(diff)
            discr = a1 * a1 - a0
            return discr >= 0
        }

        if (tMax == Number.MAX_VALUE)
        {
            console.assert(tMin == 0, "tMin must be zero for a ray.");

            diff = origin.subtract(this._center) as Vector
            a0 = diff.dot(diff) - this._radius * this._radius
            if (a0 <= 0)
            {
                return true
            }

            a1 = direction.dot(diff)
            if (a1 >= 0)
            {
                return false
            }

            discr = a1*a1 - a0
            return discr >= 0
        }

        console.assert(tMax > tMin, "tMin < tMax is required for a segment.")

        let segExtent: number = 0.5 * (tMin + tMax);

        let segOrigin: Point = origin.add(direction.scale(segExtent)) as Point

        diff = segOrigin.subtract(this._center) as Vector
        a0 = diff.dot(diff) - this._radius * this._radius
        a1 = direction.dot(diff)
        discr = a1*a1 - a0
        if (discr < 0)
        {
            return false;
        }

        let tmp0: number = segExtent*segExtent + a0
        let tmp1: number = 2 * a1 * segExtent
        let qm: number = tmp0 - tmp1
        let qp: number = tmp0 + tmp1
        if (qm*qp <= 0)
        {
            return true;
        }

        return qm > 0 && Math.abs(a1) < segExtent;
    }

    public testIntersection(bound: Bound): boolean
    {
        if (bound._radius == 0 || this._radius == 0)
        {
            // One of the bounds is invalid and cannot be intersected.
            return false;
        }

        let diff: Vector = this._center.subtract(bound._center) as Vector
        let rSum: number = this._radius + bound._radius;
        return diff.squaredLength <= rSum*rSum;
    }

    public testIntersectionMoving(bound: Bound, tMax: number, velocity0: Vector, velocity1: Vector): boolean
    {
        if (bound._radius == 0 || this._radius == 0)
        {
            return false;
        }
    
        let relVelocity: Vector = velocity1.subtract(velocity0)
        let cenDiff: Vector = bound._center.subtract(this._center) as Vector
        let a: number = relVelocity.squaredLength
        let c: number = cenDiff.squaredLength
        let rSum: number = bound._radius + this._radius
        let rSumSqr = rSum*rSum;
    
        if (a > 0)
        {
            let b: number = cenDiff.dot(relVelocity)
            if (b <= 0)
            {
                if (-tMax*a <= b)
                {
                    return a*c - b*b <= a*rSumSqr;
                }
                else
                {
                    return tMax*(tMax*a + 2*b) + c <= rSumSqr;
                }
            }
        }
    
        return c <= rSumSqr;
    }
}