import { Disposable } from "../core/Disposable";
import { Pool } from "utils/Pool";
import { Constants } from "../core/Constants";
import { Matrix } from "./Matrix";
import { Vector } from "./Vector";
import { AxisAngle } from "./AxisAngle";

export class Quaternion implements Disposable
{
    private static readonly _pool: Pool<Quaternion> = new Pool(
        Constants.DEFAULT_POOL_SIZE,
        Quaternion
    )

    public static get ORIGIN(): Quaternion {
        return Quaternion.new(0, 0, 0, 0)
    }

    public static get IDENTITY(): Quaternion {
        return Quaternion.new(1, 0, 0, 0)
    }
    
    // pool helper function
    public static new(
        w: number = 1,
        x: number = 0,
        y: number = 0,
        z: number = 0
    ): Quaternion {
        return Quaternion._pool.get().set(w, x, y, z)
    }

    public set(w: number, x: number, y: number, z: number): Quaternion {
        this._tuple = [w, x, y, z]

        return this
    }

    private _tuple: number[] = []

    public dispose(): void
    {
        Quaternion._pool.release(this)
    }

    public get w(): number
    {
        return this._tuple[0]
    }

    public set w(value: number)
    {
        this._tuple[0] = value
    }

    public get x(): number
    {
        return this._tuple[1]
    }

    public set x(value: number)
    {
        this._tuple[1] = value
    }

    public get y(): number
    {
        return this._tuple[2]
    }

    public set y(value: number)
    {
        this._tuple[2] = value
    }

    public get z(): number
    {
        return this._tuple[3]
    }

    public set z(value: number)
    {
        this._tuple[3] = value
    }

    public add(q: Quaternion): Quaternion
    {
        return Quaternion.new(this.w + q.w, this.x + q.z, this.y + q.y, this.z + q.z)
    }

    public addEq(q: Quaternion): Quaternion
    {
        return this.set(this.w + q.w, this.x + q.x, this.y + q.y, this.z + q.z)
    }

    public multiply(q: Quaternion): Quaternion
    {
        return Quaternion.new(
            this._tuple[0]*q._tuple[0] -
            this._tuple[1]*q._tuple[1] -
            this._tuple[2]*q._tuple[2] -
            this._tuple[3]*q._tuple[3],

            this._tuple[0]*q._tuple[1] +
            this._tuple[1]*q._tuple[0] +
            this._tuple[2]*q._tuple[3] -
            this._tuple[3]*q._tuple[2],

            this._tuple[0]*q._tuple[2] +
            this._tuple[2]*q._tuple[0] +
            this._tuple[3]*q._tuple[1] -
            this._tuple[1]*q._tuple[3],

            this._tuple[0]*q._tuple[3] +
            this._tuple[3]*q._tuple[0] +
            this._tuple[1]*q._tuple[2] -
            this._tuple[2]*q._tuple[1]
        )
    }

    public scale(scalar: number): Quaternion
    {
        return Quaternion.new(this.w * scalar, this.x * scalar, this.y * scalar, this.z * scalar)
    }

    public scaleEq(scalar: number): Quaternion
    {
        return this.set(this.w * scalar, this.x * scalar, this.y * scalar, this.z * scalar)
    }

    public divide(scalar: number): Quaternion
    {
        if (scalar != 0) {
            let invScalar = 1 / scalar
            return Quaternion.new(
                invScalar * this.x,
                invScalar * this.y,
                invScalar * this.z,
                1
            )
        }
        return Quaternion.new(
            Number.MAX_VALUE,
            Number.MAX_VALUE,
            Number.MAX_VALUE,
            Number.MAX_VALUE
        )
    }

    public divideEq(scalar: number): Quaternion
    {
        if (scalar != 0) {
            let invScalar = 1 / scalar
            return this.set(
                invScalar * this.x,
                invScalar * this.y,
                invScalar * this.z,
                1
            )
        }
        return this.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
    }

    public negate(): Quaternion
    {
        return Quaternion.new(-this.w, - this.x, -this.y, -this.z)
    }

    public negateEq(): Quaternion
    {
        return this.set(-this.w, - this.x, -this.y, -this.z)
    }

    public fromRotationMatrix(m: Matrix): void
    {
        let next: number[] = [1, 2, 0]

        let trace: number = m.getAt(0, 0) + m.getAt(1, 1) + m.getAt(2, 2)
        let root: number = 0

        if(trace > 0)
        {
            root = Math.sqrt(trace + 1)
            this._tuple[0] = 0.5 * root
            root = 0.5 / root
            this._tuple[1] = (m.getAt(2, 1) - m.getAt(1, 2)) * root
            this._tuple[2] = (m.getAt(0, 2) - m.getAt(2, 0)) * root
            this._tuple[3] = (m.getAt(1, 0) - m.getAt(0, 1)) * root
        }
        else
        {
            let i: number = 0
            if(m.getAt(1, 1) > m.getAt(0, 0))
            {
                i = 1
            }
            if(m.getAt(2, 2) > m.getAt(i, i))
            {
                i = 2
            }
            
            let j = next[i]
            let k = next[j]

            root = Math.sqrt(m.getAt(i, i) - m.getAt(j, j) - m.getAt(k, k) + 1)

            let quat: number[] = [this._tuple[1], this._tuple[2], this._tuple[3]]
            quat[i] = 0.5 * root
            root = 0.5 / root
            this._tuple[0] = (m.getAt(k, j) - m.getAt(j, k)) * root
            quat[j] = (m.getAt(j, i) + m.getAt(i, j)) * root
            quat[k] = (m.getAt(k, i) + m.getAt(i, k)) * root
        }
    }

    public toRotationMatrix(): Matrix
    {
        let twoX:number  = 2 * this._tuple[1];
        let twoY:number  = 2 * this._tuple[2];
        let twoZ:number  = 2 * this._tuple[3];
        let twoWX:number = twoX * this._tuple[0];
        let twoWY:number = twoY * this._tuple[0];
        let twoWZ:number = twoZ * this._tuple[0];
        let twoXX:number = twoX * this._tuple[1];
        let twoXY:number = twoY * this._tuple[1];
        let twoXZ:number = twoZ * this._tuple[1];
        let twoYY:number = twoY * this._tuple[2];
        let twoYZ:number = twoZ * this._tuple[2];
        let twoZZ:number = twoZ * this._tuple[3];

        return Matrix.new(
            1 - (twoYY + twoZZ),
            twoXY - twoWZ,
            twoXZ + twoWY,
            0,
            twoXY + twoWZ,
            1 - (twoXX + twoZZ),
            twoYZ - twoWX,
            0,
            twoXZ - twoWY,
            twoYZ + twoWX,
            1 - (twoXX + twoYY),
            0,
            0, 0, 0, 1
        )
    }

    public fromAxisAngle(axis: Vector, angle: number): void
    {
        let halfAngle = 0.5 * angle
        let sn = Math.sin(halfAngle)
        this._tuple[0] = Math.cos(halfAngle)
        this._tuple[1] = sn * axis.x
        this._tuple[2] = sn * axis.y
        this._tuple[3] = sn * axis.z
    }

    public toAxisAngle(): AxisAngle
    {
        let sqrLength = this._tuple[1] * this._tuple[1] + this._tuple[2] * this._tuple[2] +
            this._tuple[3] * this._tuple[3]

        let axis: Vector = Vector.new();
        let angle: number;

        if(sqrLength > 0)
        {
            angle = 2 * Math.acos(this._tuple[0])
            let invLength: number = 1 / Math.sqrt(sqrLength)
            axis.x = this._tuple[1] * invLength
            axis.y = this._tuple[2] * invLength
            axis.z = this._tuple[3] * invLength
        }
        else
        {
            angle = 0
            axis.x = 1
            axis.y = 0
            axis.z = 0
        }

        return new AxisAngle(axis, angle)
    }

    public length(): number
    {
        return Math.sqrt(this._tuple[0] * this._tuple[0] + this._tuple[1] * this._tuple[1] + 
            this._tuple[2] * this._tuple[2] + this._tuple[3] * this._tuple[3])
    }

    public squaredLength(): number
    {
        return this._tuple[0] * this._tuple[0] + this._tuple[1] * this._tuple[1] + 
            this._tuple[2] * this._tuple[2] + this._tuple[3] * this._tuple[3]
    }

    public dot(q: Quaternion): number
    {
        return this._tuple[0] * q._tuple[0] + this._tuple[1] * q._tuple[1] + 
            this._tuple[2] * q._tuple[2] + this._tuple[3] * q._tuple[3]
    }

    public normalize(epsilon: number = Constants.EPSILON)
    {
        let length: number = this.length()

        if (length > epsilon)
        {
            let invLength: number = 1 / length
            this._tuple[0] *= invLength
            this._tuple[1] *= invLength
            this._tuple[2] *= invLength
            this._tuple[3] *= invLength
        }
        else
        {
            length = 0
            this._tuple[0] = 0
            this._tuple[1] = 0
            this._tuple[2] = 0
            this._tuple[3] = 0
        }

        return length;
    }

    public inverse(): Quaternion
    {
        let inverse: Quaternion = Quaternion.new()

        let norm: number = this.squaredLength()

        if (norm > 0)
        {
            let invNorm: number = 1/norm
            inverse._tuple[0] = this._tuple[0]*invNorm
            inverse._tuple[1] = -this._tuple[1]*invNorm
            inverse._tuple[2] = -this._tuple[2]*invNorm
            inverse._tuple[3] = -this._tuple[3]*invNorm
        }
        else
        {
            // Return an invalid result to flag the error.
            for (let i: number = 0; i < 4; ++i)
            {
                inverse._tuple[i] = 0
            }
        }

        return inverse;
    }

    public conjugate(): Quaternion
    {
        return Quaternion.new(this._tuple[0], -this._tuple[1], -this._tuple[2], -this._tuple[3])
    }

    public exp(): Quaternion
    {
        let result: Quaternion = Quaternion.new();

        let angle: number = Math.sqrt(this._tuple[1] * this._tuple[1] +
            this._tuple[2] * this._tuple[2] + this._tuple[3] * this._tuple[3])
    
        let sn: number = Math.sin(angle)
        result._tuple[0] = Math.cos(angle)
    
        let i: number
    
        if (Math.abs(sn) > 0)
        {
            let coeff: number = sn/angle
            for (i = 1; i < 4; ++i)
            {
                result._tuple[i] = coeff * this._tuple[i]
            }
        }
        else
        {
            for (i = 1; i < 4; ++i)
            {
                result._tuple[i] = this._tuple[i]
            }
        }
    
        return result;
    }

    public log(): Quaternion
    {
        let result: Quaternion = Quaternion.new()

        result._tuple[0] = 0

        let i: number

        if (Math.abs(this._tuple[0]) < 1)
        {
            let angle: number = Math.acos(this._tuple[0])
            let sn: number = Math.sin(angle)
            if (Math.abs(sn) > 0)
            {
                let coeff: number = angle/sn;
                for (i = 1; i < 4; ++i)
                {
                    result._tuple[i] = coeff * this._tuple[i]
                }
                return result;
            }
        }

        for (i = 1; i < 4; ++i)
        {
            result._tuple[i] = this._tuple[i]
        }
        return result;
    }

    public rotate(vec: Vector): Vector
    {
        let rot: Matrix = this.toRotationMatrix()
        return rot.multiplyVector(vec)
    }

    public slerp(t: number, p: Quaternion, q: Quaternion): Quaternion
    {
        let cs: number = p.dot(q)
        let angle: number = Math.acos(cs)

        if (Math.abs(angle) > 0)
        {
            let sn: number = Math.sin(angle)
            let invSn: number = 1 / sn
            let tAngle: number = t * angle
            let coeff0: number = Math.sin(angle - tAngle) * invSn
            let coeff1: number = Math.sin(tAngle)*invSn

            this._tuple[0] = coeff0 * p._tuple[0] + coeff1 * q._tuple[0]
            this._tuple[1] = coeff0 * p._tuple[1] + coeff1 * q._tuple[1]
            this._tuple[2] = coeff0 * p._tuple[2] + coeff1 * q._tuple[2]
            this._tuple[3] = coeff0 * p._tuple[3] + coeff1 * q._tuple[3]
        }
        else
        {
            this._tuple[0] = p._tuple[0]
            this._tuple[1] = p._tuple[1]
            this._tuple[2] = p._tuple[2]
            this._tuple[3] = p._tuple[3]
        }

        return this;
    }

    public intermediate(q0: Quaternion, q1: Quaternion, q2: Quaternion): Quaternion
    {
        let q1Inv: Quaternion = q1.conjugate()
        let p0: Quaternion = q1Inv.multiply(q0)
        let p2: Quaternion = q1Inv.multiply(q2)
        let arg: Quaternion = p0.log().add(p2.log()).scale(-0.25)
        let a: Quaternion = q1.multiply(arg.exp())
        
        this.set(a.w, a.x, a.y, a.z)
        
        return this
    }

    public squad(t: number, q0: Quaternion, a0: Quaternion,
        a1: Quaternion, q1: Quaternion): Quaternion
    {
        let slerpT: number = 2 * t * (1 - t);
        let slerpP: Quaternion = this.slerp(t, q0, q1);
        let slerpQ: Quaternion = this.slerp(t, a0, a1);

        return this.slerp(slerpT, slerpP, slerpQ);
    }

    public toString(): string {
        return `[Quaternion]
w: ${this.w.toFixed(8)}, x: ${this.x.toFixed(8)}, y: ${this.y.toFixed(8)}, z: ${this.z.toFixed(8)}`
    }
}