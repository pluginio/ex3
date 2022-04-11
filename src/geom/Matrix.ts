import { Pool } from "../utils/Pool";
import { Disposable } from "../core/Disposable";
import { Vector } from "./Vector";
import { Point } from "./Point";
import { Constants } from "../core/Constants";

export class Matrix implements Disposable {
    private static readonly _pool: Pool<Matrix> = new Pool(10, Matrix)

    public static get TEST(): Matrix {
        return Matrix.new(
            0, 1, 2, 3,
            4, 5, 6, 7,
            8, 9, 10, 11,
            12, 13, 14, 15
        )
    }

    public static get ZERO(): Matrix {
        return Matrix.new(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
        )
    }

    public static get IDENTITY(): Matrix {
        return Matrix.new(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1,
        )
    }

    private _tuple: number[] = []

    public constructor(
        m00: number = 1, m01: number = 0, m02: number = 0, m03: number = 0,
        m10: number = 0, m11: number = 1, m12: number = 0, m13: number = 0,
        m20: number = 0, m21: number = 0, m22: number = 1, m23: number = 0,
        m30: number = 0, m31: number = 0, m32: number = 0, m33: number = 1
    ) {
        this.set(
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33
        )
    }

    public static fromBool(isIdentity: boolean = true): Matrix {
        if (isIdentity) {
            return this.IDENTITY
        }
        return this.ZERO
    }

    public static fromTuple(tuple: number[], rowMajor: boolean = true): Matrix {
        if (rowMajor) {
            return this.new(
                tuple[0],  tuple[1],  tuple[2],  tuple[3],
                tuple[4],  tuple[5],  tuple[6],  tuple[7],
                tuple[8],  tuple[9],  tuple[10], tuple[11],
                tuple[12], tuple[13], tuple[14], tuple[15]
            )
        }
        else {
            return this.new(
                tuple[0], tuple[4], tuple[8],  tuple[12],
                tuple[1], tuple[5], tuple[9],  tuple[13],
                tuple[2], tuple[6], tuple[10], tuple[14],
                tuple[3], tuple[7], tuple[11], tuple[15],
            )
        }
    }

    public static fromFrame(tuple0: Vector, tuple1: Vector, tuple2: Vector, tuple3: Point, 
        columns: boolean): Matrix 
    {
        if (columns)
        {
            return this.new(
                tuple0.x, tuple1.x, tuple2.x, tuple3.x,
                tuple0.y, tuple1.y, tuple2.y, tuple3.y,
                tuple0.z, tuple1.z, tuple2.z, tuple3.z,
                tuple0.w, tuple1.w, tuple2.w, tuple3.w
            )
        }
        else
        {
            return this.new(
                tuple0.x, tuple0.y, tuple0.z, tuple0.w,
                tuple1.x, tuple1.y, tuple1.z, tuple1.w,
                tuple2.x, tuple2.y, tuple2.z, tuple2.w,
                tuple3.x, tuple3.y, tuple3.z, tuple3.w
            )
        }
    }

    public static fromFloats(m00: number, m11: number, m22: number): Matrix {
        return this.new(
            m00, 0, 0, 0,
            0, m11, 0, 0,
            0, 0, m22, 0,
            0, 0, 0,   1
        )
    }

    public static fromAxisAngle(axis: Vector, angle: number): Matrix {
        let m: Matrix = this.new()
        m.toRotation(axis, angle)
        return m
    }

    public dispose(): void {
        Matrix._pool.release(this)
    }

    // pool helper function
    public static new(
        m00: number = 1, m01: number = 0, m02: number = 0, m03: number = 0,
        m10: number = 0, m11: number = 1, m12: number = 0, m13: number = 0,
        m20: number = 0, m21: number = 0, m22: number = 1, m23: number = 0,
        m30: number = 0, m31: number = 0, m32: number = 0, m33: number = 1
    ): Matrix {
        return Matrix._pool.get().set(
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33
        )
    }

    public set(
        m00: number = 1, m01: number = 0, m02: number = 0, m03: number = 0,
        m10: number = 0, m11: number = 1, m12: number = 0, m13: number = 0,
        m20: number = 0, m21: number = 0, m22: number = 1, m23: number = 0,
        m30: number = 0, m31: number = 0, m32: number = 0, m33: number = 1
    ): Matrix {
        this._tuple[0] = m00
        this._tuple[1] = m01
        this._tuple[2] = m02
        this._tuple[3] = m03

        this._tuple[4] = m10
        this._tuple[5] = m11
        this._tuple[6] = m12
        this._tuple[7] = m13

        this._tuple[8] = m20
        this._tuple[9] = m21
        this._tuple[10] = m22
        this._tuple[11] = m23

        this._tuple[12] = m30
        this._tuple[13] = m31
        this._tuple[14] = m32
        this._tuple[15] = m33

        return this
    }

    public getAtIndex(index: number)
    {
        return this._tuple[index]
    }

    public getAt(row: number, column: number): number
    {
        let i: number = Math.floor(row * 4)
        return this._tuple[i + Math.floor(column)]
    }

    public setAt(row: number, column: number, value: number): void
    {
        let i: number = Math.floor(row * 4)
        this._tuple[i + Math.floor(column)] = value
    }

    public setRow(row: number, data:Point): void
    {
        let i: number = Math.floor(row * 4);

        this._tuple[0 + i] = data.x
        this._tuple[1 + i] = data.y
        this._tuple[2 + i] = data.z
        this._tuple[3 + i] = data.w
    }

    public getRow(row: number, data: Point): void
    {
        let i: number = Math.floor(row * 4)

        data.set(
            this._tuple[0 + i],
            this._tuple[1 + i],
            this._tuple[2 + i],
            this._tuple[3 + i]
        )
    }

    public setColumn(column: number, data: Vector): void
    {
        let i: number = Math.floor(column)

        this._tuple[i] = data.x
        this._tuple[i + 4] = data.y
        this._tuple[i + 8] = data.z
        this._tuple[i + 12] = data.w
    }

    public getColumn(column: number, data: Vector): void
    {
        let i: number = Math.floor(column)

        data.set(
            this._tuple[i],
            this._tuple[i + 4],
            this._tuple[i + 8],
            this._tuple[i + 12]
        )
    }

    public add(mat: Matrix): Matrix
    {
        let result: Matrix = Matrix.new()
        for(let i: number = 0; i < 16; ++i)
        {
            result._tuple[i] = this._tuple[i] + mat._tuple[i]
        }

        return result;
    }

    public addEq(mat: Matrix): Matrix
    {
        for(let i: number = 0; i < 16; ++i)
        {
            this._tuple[i] += mat._tuple[i]
        }

        return this
    }

    public subtract(mat: Matrix): Matrix
    {
        let result: Matrix = Matrix.new()
        for(let i: number = 0; i < 16; ++i)
        {
            result._tuple[i] = this._tuple[i] - mat._tuple[i]
        }

        return result;
    }

    public subtractEq(mat: Matrix): Matrix
    {
        for(let i: number = 0; i < 16; ++i)
        {
            this._tuple[i] -= mat._tuple[i]
        }

        return this
    }

    public scale(scalar: number): Matrix
    {
        let result: Matrix = Matrix.new()
        for(let i: number = 0; i < 16; ++i)
        {
            result._tuple[i] = this._tuple[i] * scalar
        }

        return result;
    }

    public scaleEq(scalar: number): Matrix
    {
        for(let i: number = 0; i < 16; ++i)
        {
            this._tuple[i] *= scalar
        }

        return this
    }

    public divide(scalar: number): Matrix
    {
        let result: Matrix = Matrix.new();
        let i: number;

        if(scalar != 0)
        {
            let invScaler: number = 1 / scalar;

            for(i = 0; i < 16; ++i)
            {
                result._tuple[i] = this._tuple[i] * invScaler
            }
        }
        else
        {
            for(i = 0; i < 16; ++i)
            {
                result._tuple[i] = Number.MAX_VALUE
            }
        }

        return result
    }

    public divideEq(scalar: number): Matrix
    {
        let i: number

        if(scalar != 0)
        {
            let invScaler: number = 1 / scalar
            for(i = 0; i < 16; ++i)
            {
                this._tuple[i] *= invScaler
            }
        }
        else
        {
            for(i = 0; i < 16; ++i)
            {
                this._tuple[i] = Number.MAX_VALUE
            }
        }

        return this
    }

    public negate(): Matrix
    {
        let result: Matrix = Matrix.new()
        for(let i: number = 0; i < 16; ++i)
        {
            result._tuple[i] = -this._tuple[i]
        }

        return result;
    }

    public toZero(): void
    {
        this.set(
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0,
            0, 0, 0, 0
        )
    }

    public toIdentity(): void
    {
        this.set(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        )
    }

    public toDiagonal(m00: number, m11: number, m22: number): void
    {
        this.set(
            m00, 0, 0, 0,
            0, m11, 0, 0,
            0, 0, m22, 0,
            0, 0, 0,   1
        )
    }

    public toRotation(axis: Vector, angle: number): void
    {
        let cs = Math.cos(angle)
        let sn = Math.sin(angle)
        let oneMinusCos = 1 - cs
        let x2 = axis.x*axis.x
        let y2 = axis.y*axis.y
        let z2 = axis.z*axis.z
        let xym = axis.x*axis.y*oneMinusCos
        let xzm = axis.x*axis.z*oneMinusCos
        let yzm = axis.y*axis.z*oneMinusCos
        let xSin = axis.x*sn
        let ySin = axis.y*sn
        let zSin = axis.z*sn

        this._tuple[ 0] = x2*oneMinusCos + cs
        this._tuple[ 1] = xym - zSin
        this._tuple[ 2] = xzm + ySin
        this._tuple[ 3] = 0
        this._tuple[ 4] = xym + zSin
        this._tuple[ 5] = y2*oneMinusCos + cs
        this._tuple[ 6] = yzm - xSin
        this._tuple[ 7] = 0
        this._tuple[ 8] = xzm - ySin
        this._tuple[ 9] = yzm + xSin
        this._tuple[10] = z2*oneMinusCos + cs
        this._tuple[11] = 0
        this._tuple[12] = 0
        this._tuple[13] = 0
        this._tuple[14] = 0
        this._tuple[15] = 1
    }

    public transpose(): Matrix
    {
        return Matrix.new(
            this._tuple[0],
            this._tuple[4],
            this._tuple[8],
            this._tuple[12],

            this._tuple[1],
            this._tuple[5],
            this._tuple[9],
            this._tuple[13],

            this._tuple[2],
            this._tuple[6],
            this._tuple[10],
            this._tuple[14],

            this._tuple[3],
            this._tuple[7],
            this._tuple[11],
            this._tuple[15]
        )
    }

    public inverse(epsilon: number = 0): Matrix
    {
        let a0: number = this._tuple[ 0]*this._tuple[ 5] - this._tuple[ 1]*this._tuple[ 4]
        let a1: number = this._tuple[ 0]*this._tuple[ 6] - this._tuple[ 2]*this._tuple[ 4]
        let a2: number = this._tuple[ 0]*this._tuple[ 7] - this._tuple[ 3]*this._tuple[ 4]
        let a3: number = this._tuple[ 1]*this._tuple[ 6] - this._tuple[ 2]*this._tuple[ 5]
        let a4: number = this._tuple[ 1]*this._tuple[ 7] - this._tuple[ 3]*this._tuple[ 5]
        let a5: number = this._tuple[ 2]*this._tuple[ 7] - this._tuple[ 3]*this._tuple[ 6]
        let b0: number = this._tuple[ 8]*this._tuple[13] - this._tuple[ 9]*this._tuple[12]
        let b1: number = this._tuple[ 8]*this._tuple[14] - this._tuple[10]*this._tuple[12]
        let b2: number = this._tuple[ 8]*this._tuple[15] - this._tuple[11]*this._tuple[12]
        let b3: number = this._tuple[ 9]*this._tuple[14] - this._tuple[10]*this._tuple[13]
        let b4: number = this._tuple[ 9]*this._tuple[15] - this._tuple[11]*this._tuple[13]
        let b5: number = this._tuple[10]*this._tuple[15] - this._tuple[11]*this._tuple[14]

        let det = a0*b5 - a1*b4 + a2*b3 + a3*b2 - a4*b1 + a5*b0
        if (Math.abs(det) <= epsilon)
        {
            return Matrix.ZERO
        }

        let inverse = Matrix.new()

        inverse._tuple[ 0] = + this._tuple[ 5]*b5 - this._tuple[ 6]*b4 + this._tuple[ 7]*b3
        inverse._tuple[ 4] = - this._tuple[ 4]*b5 + this._tuple[ 6]*b2 - this._tuple[ 7]*b1
        inverse._tuple[ 8] = + this._tuple[ 4]*b4 - this._tuple[ 5]*b2 + this._tuple[ 7]*b0
        inverse._tuple[12] = - this._tuple[ 4]*b3 + this._tuple[ 5]*b1 - this._tuple[ 6]*b0
        inverse._tuple[ 1] = - this._tuple[ 1]*b5 + this._tuple[ 2]*b4 - this._tuple[ 3]*b3
        inverse._tuple[ 5] = + this._tuple[ 0]*b5 - this._tuple[ 2]*b2 + this._tuple[ 3]*b1
        inverse._tuple[ 9] = - this._tuple[ 0]*b4 + this._tuple[ 1]*b2 - this._tuple[ 3]*b0
        inverse._tuple[13] = + this._tuple[ 0]*b3 - this._tuple[ 1]*b1 + this._tuple[ 2]*b0
        inverse._tuple[ 2] = + this._tuple[13]*a5 - this._tuple[14]*a4 + this._tuple[15]*a3
        inverse._tuple[ 6] = - this._tuple[12]*a5 + this._tuple[14]*a2 - this._tuple[15]*a1
        inverse._tuple[10] = + this._tuple[12]*a4 - this._tuple[13]*a2 + this._tuple[15]*a0
        inverse._tuple[14] = - this._tuple[12]*a3 + this._tuple[13]*a1 - this._tuple[14]*a0
        inverse._tuple[ 3] = - this._tuple[ 9]*a5 + this._tuple[10]*a4 - this._tuple[11]*a3
        inverse._tuple[ 7] = + this._tuple[ 8]*a5 - this._tuple[10]*a2 + this._tuple[11]*a1
        inverse._tuple[11] = - this._tuple[ 8]*a4 + this._tuple[ 9]*a2 - this._tuple[11]*a0
        inverse._tuple[15] = + this._tuple[ 8]*a3 - this._tuple[ 9]*a1 + this._tuple[10]*a0

        let invDet: number = 1/det;
        inverse._tuple[ 0] *= invDet
        inverse._tuple[ 1] *= invDet
        inverse._tuple[ 2] *= invDet
        inverse._tuple[ 3] *= invDet
        inverse._tuple[ 4] *= invDet
        inverse._tuple[ 5] *= invDet
        inverse._tuple[ 6] *= invDet
        inverse._tuple[ 7] *= invDet
        inverse._tuple[ 8] *= invDet
        inverse._tuple[ 9] *= invDet
        inverse._tuple[10] *= invDet
        inverse._tuple[11] *= invDet
        inverse._tuple[12] *= invDet
        inverse._tuple[13] *= invDet
        inverse._tuple[14] *= invDet
        inverse._tuple[15] *= invDet

        return inverse
    }

    public adjoint(): Matrix
    {
        let a0: number = this._tuple[ 0]*this._tuple[ 5] - this._tuple[ 1]*this._tuple[ 4]
        let a1: number = this._tuple[ 0]*this._tuple[ 6] - this._tuple[ 2]*this._tuple[ 4]
        let a2: number = this._tuple[ 0]*this._tuple[ 7] - this._tuple[ 3]*this._tuple[ 4]
        let a3: number = this._tuple[ 1]*this._tuple[ 6] - this._tuple[ 2]*this._tuple[ 5]
        let a4: number = this._tuple[ 1]*this._tuple[ 7] - this._tuple[ 3]*this._tuple[ 5]
        let a5: number = this._tuple[ 2]*this._tuple[ 7] - this._tuple[ 3]*this._tuple[ 6]
        let b0: number = this._tuple[ 8]*this._tuple[13] - this._tuple[ 9]*this._tuple[12]
        let b1: number = this._tuple[ 8]*this._tuple[14] - this._tuple[10]*this._tuple[12]
        let b2: number = this._tuple[ 8]*this._tuple[15] - this._tuple[11]*this._tuple[12]
        let b3: number = this._tuple[ 9]*this._tuple[14] - this._tuple[10]*this._tuple[13]
        let b4: number = this._tuple[ 9]*this._tuple[15] - this._tuple[11]*this._tuple[13]
        let b5: number = this._tuple[10]*this._tuple[15] - this._tuple[11]*this._tuple[14]

        return Matrix.new(
            + this._tuple[ 5]*b5 - this._tuple[ 6]*b4 + this._tuple[ 7]*b3,
            - this._tuple[ 1]*b5 + this._tuple[ 2]*b4 - this._tuple[ 3]*b3,
            + this._tuple[13]*a5 - this._tuple[14]*a4 + this._tuple[15]*a3,
            - this._tuple[ 9]*a5 + this._tuple[10]*a4 - this._tuple[11]*a3,
            - this._tuple[ 4]*b5 + this._tuple[ 6]*b2 - this._tuple[ 7]*b1,
            + this._tuple[ 0]*b5 - this._tuple[ 2]*b2 + this._tuple[ 3]*b1,
            - this._tuple[12]*a5 + this._tuple[14]*a2 - this._tuple[15]*a1,
            + this._tuple[ 8]*a5 - this._tuple[10]*a2 + this._tuple[11]*a1,
            + this._tuple[ 4]*b4 - this._tuple[ 5]*b2 + this._tuple[ 7]*b0,
            - this._tuple[ 0]*b4 + this._tuple[ 1]*b2 - this._tuple[ 3]*b0,
            + this._tuple[12]*a4 - this._tuple[13]*a2 + this._tuple[15]*a0,
            - this._tuple[ 8]*a4 + this._tuple[ 9]*a2 - this._tuple[11]*a0,
            - this._tuple[ 4]*b3 + this._tuple[ 5]*b1 - this._tuple[ 6]*b0,
            + this._tuple[ 0]*b3 - this._tuple[ 1]*b1 + this._tuple[ 2]*b0,
            - this._tuple[12]*a3 + this._tuple[13]*a1 - this._tuple[14]*a0,
            + this._tuple[ 8]*a3 - this._tuple[ 9]*a1 + this._tuple[10]*a0
        )
    }

    public determinant(): number
    {
        let a0: number = this._tuple[ 0] * this._tuple[ 5] - this._tuple[ 1] * this._tuple[ 4]
        let a1: number = this._tuple[ 0] * this._tuple[ 6] - this._tuple[ 2] * this._tuple[ 4]
        let a2: number = this._tuple[ 0] * this._tuple[ 7] - this._tuple[ 3] * this._tuple[ 4]
        let a3: number = this._tuple[ 1] * this._tuple[ 6] - this._tuple[ 2] * this._tuple[ 5]
        let a4: number = this._tuple[ 1] * this._tuple[ 7] - this._tuple[ 3] * this._tuple[ 5]
        let a5: number = this._tuple[ 2] * this._tuple[ 7] - this._tuple[ 3] * this._tuple[ 6]
        let b0: number = this._tuple[ 8] * this._tuple[13] - this._tuple[ 9] * this._tuple[12]
        let b1: number = this._tuple[ 8] * this._tuple[14] - this._tuple[10] * this._tuple[12]
        let b2: number = this._tuple[ 8] * this._tuple[15] - this._tuple[11] * this._tuple[12]
        let b3: number = this._tuple[ 9] * this._tuple[14] - this._tuple[10] * this._tuple[13]
        let b4: number = this._tuple[ 9] * this._tuple[15] - this._tuple[11] * this._tuple[13]
        let b5: number = this._tuple[10] * this._tuple[15] - this._tuple[11] * this._tuple[14]
        let det = a0 * b5 - a1 * b4 + a2 * b3 + a3 * b2 - a4 * b1 + a5 * b0

        return det
    }

    public multiply(mat: Matrix): Matrix
    {
        return Matrix.new(
            this._tuple[ 0] * mat._tuple[ 0] +
            this._tuple[ 1] * mat._tuple[ 4] +
            this._tuple[ 2] * mat._tuple[ 8] +
            this._tuple[ 3] * mat._tuple[12],

            this._tuple[ 0] * mat._tuple[ 1] +
            this._tuple[ 1] * mat._tuple[ 5] +
            this._tuple[ 2] * mat._tuple[ 9] +
            this._tuple[ 3] * mat._tuple[13],

            this._tuple[ 0] * mat._tuple[ 2] +
            this._tuple[ 1] * mat._tuple[ 6] +
            this._tuple[ 2] * mat._tuple[10] +
            this._tuple[ 3] * mat._tuple[14],

            this._tuple[ 0] * mat._tuple[ 3] +
            this._tuple[ 1] * mat._tuple[ 7] +
            this._tuple[ 2] * mat._tuple[11] +
            this._tuple[ 3] * mat._tuple[15],

            this._tuple[ 4] * mat._tuple[ 0] +
            this._tuple[ 5] * mat._tuple[ 4] +
            this._tuple[ 6] * mat._tuple[ 8] +
            this._tuple[ 7] * mat._tuple[12],

            this._tuple[ 4] * mat._tuple[ 1] +
            this._tuple[ 5] * mat._tuple[ 5] +
            this._tuple[ 6] * mat._tuple[ 9] +
            this._tuple[ 7] * mat._tuple[13],

            this._tuple[ 4] * mat._tuple[ 2] +
            this._tuple[ 5] * mat._tuple[ 6] +
            this._tuple[ 6] * mat._tuple[10] +
            this._tuple[ 7] * mat._tuple[14],

            this._tuple[ 4] * mat._tuple[ 3] +
            this._tuple[ 5] * mat._tuple[ 7] +
            this._tuple[ 6] * mat._tuple[11] +
            this._tuple[ 7] * mat._tuple[15],

            this._tuple[ 8] * mat._tuple[ 0] +
            this._tuple[ 9] * mat._tuple[ 4] +
            this._tuple[10] * mat._tuple[ 8] +
            this._tuple[11] * mat._tuple[12],

            this._tuple[ 8] * mat._tuple[ 1] +
            this._tuple[ 9] * mat._tuple[ 5] +
            this._tuple[10] * mat._tuple[ 9] +
            this._tuple[11] * mat._tuple[13],

            this._tuple[ 8] * mat._tuple[ 2] +
            this._tuple[ 9] * mat._tuple[ 6] +
            this._tuple[10] * mat._tuple[10] +
            this._tuple[11] * mat._tuple[14],

            this._tuple[ 8] * mat._tuple[ 3] +
            this._tuple[ 9] * mat._tuple[ 7] +
            this._tuple[10] * mat._tuple[11] +
            this._tuple[11] * mat._tuple[15],

            this._tuple[12] * mat._tuple[ 0] +
            this._tuple[13] * mat._tuple[ 4] +
            this._tuple[14] * mat._tuple[ 8] +
            this._tuple[15] * mat._tuple[12],

            this._tuple[12] * mat._tuple[ 1] +
            this._tuple[13] * mat._tuple[ 5] +
            this._tuple[14] * mat._tuple[ 9] +
            this._tuple[15] * mat._tuple[13],

            this._tuple[12] * mat._tuple[ 2] +
            this._tuple[13] * mat._tuple[ 6] +
            this._tuple[14] * mat._tuple[10] +
            this._tuple[15] * mat._tuple[14],

            this._tuple[12] * mat._tuple[ 3] +
            this._tuple[13] * mat._tuple[ 7] +
            this._tuple[14] * mat._tuple[11] +
            this._tuple[15] * mat._tuple[15]
        )
    }

    public multiplyPoint(p: Point): Point
    {
        return Point.new(
            this._tuple[ 0] * p.x +
            this._tuple[ 1] * p.y +
            this._tuple[ 2] * p.z +
            this._tuple[ 3] * p.w,

            this._tuple[ 4] * p.x +
            this._tuple[ 5] * p.y +
            this._tuple[ 6] * p.z +
            this._tuple[ 7] * p.w,

            this._tuple[ 8] * p.x +
            this._tuple[ 9] * p.y +
            this._tuple[10] * p.z +
            this._tuple[11] * p.w,

            this._tuple[12] * p.x +
            this._tuple[13] * p.y +
            this._tuple[14] * p.z +
            this._tuple[15] * p.w
        )
    }

    public multiplyVector(v: Vector): Vector
    {
        return Vector.new(
            this._tuple[ 0] * v.x +
            this._tuple[ 1] * v.y +
            this._tuple[ 2] * v.z,
    
            this._tuple[ 4] * v.x +
            this._tuple[ 5] * v.y +
            this._tuple[ 6] * v.z,
    
            this._tuple[ 8] * v.x +
            this._tuple[ 9] * v.y +
            this._tuple[10] * v.z);
    }

    public transposeTimes(mat: Matrix): Matrix
    {
        return Matrix.new(
            this._tuple[ 0]*mat._tuple[ 0] +
            this._tuple[ 4]*mat._tuple[ 4] +
            this._tuple[ 8]*mat._tuple[ 8] +
            this._tuple[12]*mat._tuple[12],

            this._tuple[ 0]*mat._tuple[ 1] +
            this._tuple[ 4]*mat._tuple[ 5] +
            this._tuple[ 8]*mat._tuple[ 9] +
            this._tuple[12]*mat._tuple[13],

            this._tuple[ 0]*mat._tuple[ 2] +
            this._tuple[ 4]*mat._tuple[ 6] +
            this._tuple[ 8]*mat._tuple[10] +
            this._tuple[12]*mat._tuple[14],

            this._tuple[ 0]*mat._tuple[ 3] +
            this._tuple[ 4]*mat._tuple[ 7] +
            this._tuple[ 8]*mat._tuple[11] +
            this._tuple[12]*mat._tuple[15],

            this._tuple[ 1]*mat._tuple[ 0] +
            this._tuple[ 5]*mat._tuple[ 4] +
            this._tuple[ 9]*mat._tuple[ 8] +
            this._tuple[13]*mat._tuple[12],

            this._tuple[ 1]*mat._tuple[ 1] +
            this._tuple[ 5]*mat._tuple[ 5] +
            this._tuple[ 9]*mat._tuple[ 9] +
            this._tuple[13]*mat._tuple[13],

            this._tuple[ 1]*mat._tuple[ 2] +
            this._tuple[ 5]*mat._tuple[ 6] +
            this._tuple[ 9]*mat._tuple[10] +
            this._tuple[13]*mat._tuple[14],

            this._tuple[ 1]*mat._tuple[ 3] +
            this._tuple[ 5]*mat._tuple[ 7] +
            this._tuple[ 9]*mat._tuple[11] +
            this._tuple[13]*mat._tuple[15],

            this._tuple[ 2]*mat._tuple[ 0] +
            this._tuple[ 6]*mat._tuple[ 4] +
            this._tuple[10]*mat._tuple[ 8] +
            this._tuple[14]*mat._tuple[12],

            this._tuple[ 2]*mat._tuple[ 1] +
            this._tuple[ 6]*mat._tuple[ 5] +
            this._tuple[10]*mat._tuple[ 9] +
            this._tuple[14]*mat._tuple[13],

            this._tuple[ 2]*mat._tuple[ 2] +
            this._tuple[ 6]*mat._tuple[ 6] +
            this._tuple[10]*mat._tuple[10] +
            this._tuple[14]*mat._tuple[14],

            this._tuple[ 2]*mat._tuple[ 3] +
            this._tuple[ 6]*mat._tuple[ 7] +
            this._tuple[10]*mat._tuple[11] +
            this._tuple[14]*mat._tuple[15],

            this._tuple[ 3]*mat._tuple[ 0] +
            this._tuple[ 7]*mat._tuple[ 4] +
            this._tuple[11]*mat._tuple[ 8] +
            this._tuple[15]*mat._tuple[12],

            this._tuple[ 3]*mat._tuple[ 1] +
            this._tuple[ 7]*mat._tuple[ 5] +
            this._tuple[11]*mat._tuple[ 9] +
            this._tuple[15]*mat._tuple[13],

            this._tuple[ 3]*mat._tuple[ 2] +
            this._tuple[ 7]*mat._tuple[ 6] +
            this._tuple[11]*mat._tuple[10] +
            this._tuple[15]*mat._tuple[14],

            this._tuple[ 3]*mat._tuple[ 3] +
            this._tuple[ 7]*mat._tuple[ 7] +
            this._tuple[11]*mat._tuple[11] +
            this._tuple[15]*mat._tuple[15]
        )
    }

    public timesTranspose(mat: Matrix): Matrix
    {
        return Matrix.new(
            this._tuple[ 0]*mat._tuple[ 0] +
            this._tuple[ 1]*mat._tuple[ 1] +
            this._tuple[ 2]*mat._tuple[ 2] +
            this._tuple[ 3]*mat._tuple[ 3],

            this._tuple[ 0]*mat._tuple[ 4] +
            this._tuple[ 1]*mat._tuple[ 5] +
            this._tuple[ 2]*mat._tuple[ 6] +
            this._tuple[ 3]*mat._tuple[ 7],

            this._tuple[ 0]*mat._tuple[ 8] +
            this._tuple[ 1]*mat._tuple[ 9] +
            this._tuple[ 2]*mat._tuple[10] +
            this._tuple[ 3]*mat._tuple[11],

            this._tuple[ 0]*mat._tuple[12] +
            this._tuple[ 1]*mat._tuple[13] +
            this._tuple[ 2]*mat._tuple[14] +
            this._tuple[ 3]*mat._tuple[15],

            this._tuple[ 4]*mat._tuple[ 0] +
            this._tuple[ 5]*mat._tuple[ 1] +
            this._tuple[ 6]*mat._tuple[ 2] +
            this._tuple[ 7]*mat._tuple[ 3],

            this._tuple[ 4]*mat._tuple[ 4] +
            this._tuple[ 5]*mat._tuple[ 5] +
            this._tuple[ 6]*mat._tuple[ 6] +
            this._tuple[ 7]*mat._tuple[ 7],

            this._tuple[ 4]*mat._tuple[ 8] +
            this._tuple[ 5]*mat._tuple[ 9] +
            this._tuple[ 6]*mat._tuple[10] +
            this._tuple[ 7]*mat._tuple[11],

            this._tuple[ 4]*mat._tuple[12] +
            this._tuple[ 5]*mat._tuple[13] +
            this._tuple[ 6]*mat._tuple[14] +
            this._tuple[ 7]*mat._tuple[15],

            this._tuple[ 8]*mat._tuple[ 0] +
            this._tuple[ 9]*mat._tuple[ 1] +
            this._tuple[10]*mat._tuple[ 2] +
            this._tuple[11]*mat._tuple[ 3],

            this._tuple[ 8]*mat._tuple[ 4] +
            this._tuple[ 9]*mat._tuple[ 5] +
            this._tuple[10]*mat._tuple[ 6] +
            this._tuple[11]*mat._tuple[ 7],

            this._tuple[ 8]*mat._tuple[ 8] +
            this._tuple[ 9]*mat._tuple[ 9] +
            this._tuple[10]*mat._tuple[10] +
            this._tuple[11]*mat._tuple[11],

            this._tuple[ 8]*mat._tuple[12] +
            this._tuple[ 9]*mat._tuple[13] +
            this._tuple[10]*mat._tuple[14] +
            this._tuple[11]*mat._tuple[15],

            this._tuple[12]*mat._tuple[ 0] +
            this._tuple[13]*mat._tuple[ 1] +
            this._tuple[14]*mat._tuple[ 2] +
            this._tuple[15]*mat._tuple[ 3],

            this._tuple[12]*mat._tuple[ 4] +
            this._tuple[13]*mat._tuple[ 5] +
            this._tuple[14]*mat._tuple[ 6] +
            this._tuple[15]*mat._tuple[ 7],

            this._tuple[12]*mat._tuple[ 8] +
            this._tuple[13]*mat._tuple[ 9] +
            this._tuple[14]*mat._tuple[10] +
            this._tuple[15]*mat._tuple[11],

            this._tuple[12]*mat._tuple[12] +
            this._tuple[13]*mat._tuple[13] +
            this._tuple[14]*mat._tuple[14] +
            this._tuple[15]*mat._tuple[15]
        )
    }

    public transposeTimesTranspose(mat: Matrix): Matrix
    {
        return Matrix.new(
            this._tuple[ 0]*mat._tuple[ 0] +
            this._tuple[ 4]*mat._tuple[ 1] +
            this._tuple[ 8]*mat._tuple[ 2] +
            this._tuple[12]*mat._tuple[ 3],

            this._tuple[ 0]*mat._tuple[ 4] +
            this._tuple[ 4]*mat._tuple[ 5] +
            this._tuple[ 8]*mat._tuple[ 6] +
            this._tuple[12]*mat._tuple[ 7],

            this._tuple[ 0]*mat._tuple[ 8] +
            this._tuple[ 4]*mat._tuple[ 9] +
            this._tuple[ 8]*mat._tuple[10] +
            this._tuple[12]*mat._tuple[11],

            this._tuple[ 0]*mat._tuple[12] +
            this._tuple[ 4]*mat._tuple[13] +
            this._tuple[ 8]*mat._tuple[14] +
            this._tuple[12]*mat._tuple[15],

            this._tuple[ 1]*mat._tuple[ 0] +
            this._tuple[ 5]*mat._tuple[ 1] +
            this._tuple[ 9]*mat._tuple[ 2] +
            this._tuple[13]*mat._tuple[ 3],

            this._tuple[ 1]*mat._tuple[ 4] +
            this._tuple[ 5]*mat._tuple[ 5] +
            this._tuple[ 9]*mat._tuple[ 6] +
            this._tuple[13]*mat._tuple[ 7],

            this._tuple[ 1]*mat._tuple[ 8] +
            this._tuple[ 5]*mat._tuple[ 9] +
            this._tuple[ 9]*mat._tuple[10] +
            this._tuple[13]*mat._tuple[11],

            this._tuple[ 1]*mat._tuple[12] +
            this._tuple[ 5]*mat._tuple[13] +
            this._tuple[ 9]*mat._tuple[14] +
            this._tuple[13]*mat._tuple[15],

            this._tuple[ 2]*mat._tuple[ 0] +
            this._tuple[ 6]*mat._tuple[ 1] +
            this._tuple[10]*mat._tuple[ 2] +
            this._tuple[14]*mat._tuple[ 3],

            this._tuple[ 2]*mat._tuple[ 4] +
            this._tuple[ 6]*mat._tuple[ 5] +
            this._tuple[10]*mat._tuple[ 6] +
            this._tuple[14]*mat._tuple[ 7],

            this._tuple[ 2]*mat._tuple[ 8] +
            this._tuple[ 6]*mat._tuple[ 9] +
            this._tuple[10]*mat._tuple[10] +
            this._tuple[14]*mat._tuple[11],

            this._tuple[ 2]*mat._tuple[12] +
            this._tuple[ 6]*mat._tuple[13] +
            this._tuple[10]*mat._tuple[14] +
            this._tuple[14]*mat._tuple[15],

            this._tuple[ 3]*mat._tuple[ 0] +
            this._tuple[ 7]*mat._tuple[ 1] +
            this._tuple[11]*mat._tuple[ 2] +
            this._tuple[15]*mat._tuple[ 3],

            this._tuple[ 3]*mat._tuple[ 4] +
            this._tuple[ 7]*mat._tuple[ 5] +
            this._tuple[11]*mat._tuple[ 6] +
            this._tuple[15]*mat._tuple[ 7],

            this._tuple[ 3]*mat._tuple[ 8] +
            this._tuple[ 7]*mat._tuple[ 9] +
            this._tuple[11]*mat._tuple[10] +
            this._tuple[15]*mat._tuple[11],

            this._tuple[ 3]*mat._tuple[12] +
            this._tuple[ 7]*mat._tuple[13] +
            this._tuple[11]*mat._tuple[14] +
            this._tuple[15]*mat._tuple[15]
        )
    }

    public timesDiagonal(diag: Point): Matrix
    {
        return Matrix.new(
            this._tuple[ 0]*diag.x, this._tuple[ 1]*diag.y, this._tuple[ 2]*diag.z, this._tuple[ 3],
            this._tuple[ 4]*diag.x, this._tuple[ 5]*diag.y, this._tuple[ 6]*diag.z, this._tuple[ 7],
            this._tuple[ 8]*diag.x, this._tuple[ 9]*diag.y, this._tuple[10]*diag.z, this._tuple[11],
            this._tuple[12]*diag.x, this._tuple[13]*diag.y, this._tuple[14]*diag.z, this._tuple[15]
        )
    }

    public diagonalTimes(diag: Point): Matrix
    {
        return Matrix.new(
            diag.x*this._tuple[ 0], diag.x*this._tuple[ 1], diag.x*this._tuple[ 2], this._tuple[ 3],
            diag.y*this._tuple[ 4], diag.y*this._tuple[ 5], diag.y*this._tuple[ 6], this._tuple[ 7],
            diag.z*this._tuple[ 8], diag.z*this._tuple[ 9], diag.z*this._tuple[10], this._tuple[11],
            this._tuple[12], this._tuple[13], this._tuple[14], this._tuple[15]
        )
    }

    public orthonormalize(): void
    {
        let invLength: number = 1/Math.sqrt(this._tuple[0]*this._tuple[0] +
            this._tuple[4]*this._tuple[4] + this._tuple[8]*this._tuple[8]);

        this._tuple[0] *= invLength
        this._tuple[4] *= invLength
        this._tuple[8] *= invLength

        let dot0: number = this._tuple[0]*this._tuple[1] + this._tuple[4]*this._tuple[5] +
            this._tuple[8]*this._tuple[9]

        this._tuple[1] -= dot0*this._tuple[0]
        this._tuple[5] -= dot0*this._tuple[4]
        this._tuple[9] -= dot0*this._tuple[8]

        invLength = 1/Math.sqrt(this._tuple[1]*this._tuple[1] +
            this._tuple[5]*this._tuple[5] + this._tuple[9]*this._tuple[9]);
    
        this._tuple[1] *= invLength
        this._tuple[5] *= invLength
        this._tuple[9] *= invLength

        let dot1:number = this._tuple[1]*this._tuple[2] + this._tuple[5]*this._tuple[6] +
            this._tuple[9]*this._tuple[10]

        dot0 = this._tuple[0]*this._tuple[2] + this._tuple[4]*this._tuple[6] +
            this._tuple[8]*this._tuple[10]

        this._tuple[ 2] -= dot0*this._tuple[0] + dot1*this._tuple[1]
        this._tuple[ 6] -= dot0*this._tuple[4] + dot1*this._tuple[5]
        this._tuple[10] -= dot0*this._tuple[8] + dot1*this._tuple[9]

        invLength = 1/Math.sqrt(this._tuple[2]*this._tuple[2] +
            this._tuple[6]*this._tuple[6] + this._tuple[10]*this._tuple[10])

        this._tuple[ 2] *= invLength
        this._tuple[ 6] *= invLength
        this._tuple[10] *= invLength
    }

    public QForm(p0: Point, p1: Point): number
    {
        let mp1: Matrix = Matrix.new(
            this._tuple[ 0]*p1.x +
            this._tuple[ 1]*p1.y +
            this._tuple[ 2]*p1.z +
            this._tuple[ 3]*p1.w,
    
            this._tuple[ 4]*p1.x +
            this._tuple[ 5]*p1.y +
            this._tuple[ 6]*p1.z +
            this._tuple[ 7]*p1.w,
    
            this._tuple[ 8]*p1.x +
            this._tuple[ 9]*p1.y +
            this._tuple[10]*p1.z +
            this._tuple[11]*p1.w,
    
            this._tuple[12]*p1.x +
            this._tuple[13]*p1.y +
            this._tuple[14]*p1.z +
            this._tuple[15]*p1.w  
        )

        let dot: number = p0.x*mp1._tuple[0] + p0.y*mp1._tuple[1] + p0.z*mp1._tuple[2] + p0.w*mp1._tuple[3]
        return dot
    }

    public toObliqueProjection(origin: Point, normal: Vector, direction: Vector) : void
    {
        let dotND: number = normal.dot(direction)
        let dotNO:number = origin.dot(normal)
    
        this._tuple[ 0] = direction.x*normal.x - dotND
        this._tuple[ 1] = direction.x*normal.y
        this._tuple[ 2] = direction.x*normal.z
        this._tuple[ 3] = -dotNO*direction.x
        this._tuple[ 4] = direction.y*normal.x
        this._tuple[ 5] = direction.y*normal.y - dotND
        this._tuple[ 6] = direction.y*normal.z
        this._tuple[ 7] = -dotNO*direction.y
        this._tuple[ 8] = direction.z*normal.x
        this._tuple[ 9] = direction.z*normal.y
        this._tuple[10] = direction.z*normal.z - dotND
        this._tuple[11] = -dotNO*direction.z
        this._tuple[12] = 0
        this._tuple[13] = 0
        this._tuple[14] = 0
        this._tuple[15] = -dotND
    }

    public toPerspectiveMatrix(origin: Point, normal: Vector, eye: Point) :void
    {
        let eyeSubOrigin = eye.subtract(origin) as Vector
        let dotND = normal.dot(eyeSubOrigin)

        this._tuple[ 0] = dotND - eye.x*normal.x
        this._tuple[ 1] = -eye.x*normal.y
        this._tuple[ 2] = -eye.x*normal.z
        this._tuple[ 3] = -(this._tuple[0]*eye.x + this._tuple[1]*eye.y + this._tuple[2]*eye.z)
        this._tuple[ 4] = -eye.y*normal.x
        this._tuple[ 5] = dotND - eye.y*normal.y
        this._tuple[ 6] = -eye.y*normal.z
        this._tuple[ 7] = -(this._tuple[4]*eye.x + this._tuple[5]*eye.y + this._tuple[6]*eye.z)
        this._tuple[ 8] = -eye.z*normal.x
        this._tuple[ 9] = -eye.z*normal.y
        this._tuple[10] = dotND- eye.z*normal.z
        this._tuple[11] = -(this._tuple[8]*eye.x + this._tuple[9]*eye.y + this._tuple[10]*eye.z)
        this._tuple[12] = -normal.x
        this._tuple[13] = -normal.y
        this._tuple[14] = -normal.z
        this._tuple[15] = eye.dot(normal)
    }

    public toReflection(origin: Point, normal: Vector): void
    {
        let twoDotNO: number = 2*origin.dot(normal)

        this._tuple[ 0] = 1 - 2*normal.x*normal.x
        this._tuple[ 1] = -2*normal.x*normal.y
        this._tuple[ 2] = -2*normal.x*normal.z
        this._tuple[ 3] = twoDotNO*normal.x
        this._tuple[ 4] = -2*normal.y*normal.x
        this._tuple[ 5] = 1 - 2*normal.y*normal.y
        this._tuple[ 6] = -2*normal.x*normal.z
        this._tuple[ 7] = twoDotNO*normal.y
        this._tuple[ 8] = -2*normal.z*normal.x
        this._tuple[ 9] = -2*normal.z*normal.y
        this._tuple[10] = 1 - 2*normal.z*normal.z
        this._tuple[11] = twoDotNO*normal.z
        this._tuple[12] = 0
        this._tuple[13] = 0
        this._tuple[14] = 0
        this._tuple[15] = 1
    }

    public toArray(): number[]
    {
        return this._tuple
    }

    public equals(m: Matrix): boolean
    {
        let i;
        for(i = 0; i < 16; ++i)
        {
            if(Math.abs(this._tuple[i] - m._tuple[i]) > Constants.EPSILON)
            {
                return false
            }
        }

        return true
    }

    public toString(): string {
        return `[Matrix]
m00: ${this._tuple[0 ].toFixed(8)}, m01: ${this._tuple[1 ].toFixed(8)}, m02: ${this._tuple[2 ].toFixed(8)}, m03: ${this._tuple[3 ].toFixed(8)}
m10: ${this._tuple[4 ].toFixed(8)}, m11: ${this._tuple[5 ].toFixed(8)}, m12: ${this._tuple[6 ].toFixed(8)}, m13: ${this._tuple[7 ].toFixed(8)}
m20: ${this._tuple[8 ].toFixed(8)}, m21: ${this._tuple[9 ].toFixed(8)}, m22: ${this._tuple[10].toFixed(8)}, m23: ${this._tuple[11].toFixed(8)}
m30: ${this._tuple[12].toFixed(8)}, m31: ${this._tuple[13].toFixed(8)}, m32: ${this._tuple[14].toFixed(8)}, m33: ${this._tuple[15].toFixed(8)}`
    }
}
