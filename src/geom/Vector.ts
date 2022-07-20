import {Constants} from '../core/Constants'
import {Pool} from '../utils/Pool'
import {Point} from './Point'
import {Disposable} from '../core/Disposable'

// TODO Vector extends Point - Matrix getColumn(Point...)
export class Vector implements Disposable {
    private static readonly _pool: Pool<Vector> = new Pool(
        Constants.DEFAULT_POOL_SIZE,
        Vector
    )

    public static get ZERO(): Vector {
        return Vector.new(0, 0, 0)
    }

    public static get UNIT_X(): Vector {
        return Vector.new(1, 0, 0)
    }

    public static get UNIT_Y(): Vector {
        return Vector.new(0, 1, 0)
    }

    public static get UNIT_Z(): Vector {
        return Vector.new(0, 0, 1)
    }

    public static get UNIT_X_NEG(): Vector {
        return Vector.new(-1, 0, 0)
    }

    public static get UNIT_Y_NEG(): Vector {
        return Vector.new(0, -1, 0)
    }

    public static get UNIT_Z_NEG(): Vector {
        return Vector.new(0, 0, -1)
    }



    private _tuple: number[]

    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        this._tuple = [x, y, z, 0]
    }

    public dispose(): void {
        Vector._pool.release(this)
    }

    public static new(x: number = 0, y: number = 0, z: number = 0): Vector {
        return Vector._pool.get().set(x, y, z, 0)
    }

    public static fromTuple(data: number[])
    {
        return Vector._pool.get().set(data[0], data[1], data[2], data[3])
    }

    public get x(): number {
        return this._tuple[0]
    }

    public set x(value: number) {
        this._tuple[0] = value
    }

    public get y(): number {
        return this._tuple[1]
    }

    public set y(value: number) {
        this._tuple[1] = value
    }

    public get z(): number {
        return this._tuple[2]
    }

    public set z(value: number) {
        this._tuple[2] = value
    }

    public get w(): number {
        return this._tuple[3]
    }

    public set w(value: number) {
        this._tuple[3] = value
    }

    public set(x: number, y: number, z: number, w: number = 0): Vector {
        this._tuple = [x, y, z, w]

        return this
    }

    public clone(v: Vector): void {
        this.set(v.x, v.y, v.z, v.w)
    }

    public add(v: Vector): Vector {
        return Vector.new(this.x + v.x, this.y + v.y, this.z + v.z)
    }

    public addEq(v: Vector): Vector {
        return this.set(this.x + v.x, this.y + v.y, this.z + v.z)
    }

    public subtract(v: Vector): Vector {
        return Vector.new(this.x - v.x, this.y - v.y, this.z - v.z)
    }

    public subtractEq(v: Vector): Vector {
        return this.set(this.x - v.x, this.y - v.y, this.z - v.z)
    }

    public divide(scalar: number): Vector {
        if (scalar != 0) {
            let invScalar: number = 1 / scalar
            return Vector.new(
                this.x * invScalar,
                this.y * invScalar,
                this.z * invScalar
            )
        }
        return Vector.new(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
    }

    public divideEq(scalar: number): Vector {
        if (scalar != 0) {
            let invScalar: number = 1 / scalar
            return this.set(
                this.x * invScalar,
                this.y * invScalar,
                this.z * invScalar
            )
        }
        return this.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
    }

    public scale(scalar: number): Vector {
        return Vector.new(this.x * scalar, this.y * scalar, this.z * scalar)
    }

    public scaleEq(scaler: number): Vector {
        return this.set(this.x * scaler, this.y * scaler, this.z * scaler)
    }

    public negate(): Vector {
        return Vector.new(-this.x, -this.y, -this.z)
    }

    public get length(): number {
        let sqrLength: number =
            this.x * this.x + this.y * this.y + this.z * this.z
        return Math.sqrt(sqrLength)
    }

    public get squaredLength(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z
    }

    public normalize(): number {
        let length: number = this.length

        console.log(length)
        if (length > Constants.EPSILON) {
            let invLength: number = 1 / length
            this.set(this.x * invLength, this.y * invLength, this.z * invLength)
        } else {
            length = 0
            this.set(0, 0, 0)
        }
        return length
    }

    public dot(v: Vector): number {
        return this.x * v.x + this.y * v.y + this.z * v.z
    }

    public cross(v: Vector): Vector {
        return Vector.new(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        )
    }

    public unitCross(v: Vector): Vector {
        let cross: Vector = this.cross(v)
        cross.normalize()

        return cross
    }

    public static orthonormalize(v0: Vector, v1: Vector, v2: Vector): void {
        v0.normalize()

        let dot0: number = v0.dot(v1)
        v1.subtractEq(v0.scale(dot0))
        v1.normalize()

        let dot1: number = v1.dot(v2)
        dot0 = v0.dot(v2)

        let mul0: Vector = v0.scale(dot0)
        let mul1: Vector = v1.scale(dot1)
        v2.subtractEq(mul0.add(mul1))
        v2.normalize()
    }

    public static generateOrthonormalBasis(
        v0: Vector,
        v1: Vector,
        v2: Vector
    ): void {
        v2.normalize()
        this.generateComplementBasis(v0, v1, v2)
    }

    public static generateComplementBasis(
        v0: Vector,
        v1: Vector,
        v2: Vector
    ): void {
        let invLength: number

        if (Math.abs(v2.x) >= Math.abs(v2.y)) {
            invLength = 1 / Math.sqrt(v2.x * v2.x + v2.z * v2.z)
            v0.x = -v2.z * invLength
            v0.y = 0
            v0.z = v2.x * invLength
            v1.x = v2.y * v0.z
            v1.y = v2.z * v0.x - v2.x * v0.z
            v1.z = -v2.y * v0.x
        } else {
            invLength = 1 / Math.sqrt(v2.y * v2.y + v2.z * v2.z)
            v0.x = 0
            v0.y = v2.z * invLength
            v0.z = -v2.y * invLength
            v1.x = v2.y * v0.z - v2.z * v0.y
            v1.y = -v2.x * v0.z
            v1.z = v2.x * v0.y
        }
    }

    public toPoint(): Point {
        return Point.new(this.x, this.y, this.z)
    }

    public toArray(): number[] {
        return this._tuple
    }

    public toString(): string {
        return `[Vector]
x: ${this.x.toFixed(8)}, y: ${this.y.toFixed(8)}, z: ${this.z.toFixed(8)}, w: ${this.w.toFixed(8)}`
    }
}
