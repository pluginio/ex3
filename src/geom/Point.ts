import {Disposable} from '../core/Disposable'
import {Pool} from '../utils/Pool'
import {Vector} from './Vector'
import {Constants} from '../core/Constants'

export class Point implements Disposable {
    private static readonly _pool: Pool<Point> = new Pool(
        Constants.DEFAULT_POOL_SIZE,
        Point
    )

    public static get ORIGIN(): Point {
        return Point.new(0, 0, 0, 1)
    }

    private _tuple: number[]

    public get tuple()
    {
        return this._tuple
    }

    public dispose(): void {
        Point._pool.release(this)
    }

    // pool helper function
    public static new(
        x: number = 0,
        y: number = 0,
        z: number = 0,
        w: number = 1
    ): Point {
        return Point._pool.get().set(x, y, z, w)
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

    public set(x: number, y: number, z: number, w: number = 1): Point {
        this._tuple = [x, y, z, w]

        return this
    }

    public add(p: Point | Vector): Point {
        return Point.new(this.x + p.x, this.y + p.y, this.z + p.z)
    }

    public addEq(p: Point | Vector): Point {
        return this.set(this.x + p.x, this.y + p.y, this.z + p.z)
    }

    public subtract(p: Point | Vector): Vector | Point {
        if (p instanceof Point) {
            return Vector.new(this.x - p.x, this.y - p.y, this.z - p.z)
        }
        return Point.new(this.x - p.x, this.y - p.y, this.z - p.z)
    }

    public subtractEq(p: Point | Vector): Point {
        return this.set(this.x - p.x, this.y - p.y, this.z - p.z)
    }

    public scale(scalar: number): Point {
        return Point.new(scalar * this.x, scalar * this.y, scalar * this.z, 1)
    }

    public scaleEq(scalar: number): Point {
        return this.set(this.x * scalar, this.y * scalar, this.z * scalar)
    }

    public divide(scalar: number): Point {
        if (scalar != 0) {
            let invScalar = 1 / scalar
            return Point.new(
                invScalar * this.x,
                invScalar * this.y,
                invScalar * this.z,
                1
            )
        }
        return Point.new(
            Number.MAX_VALUE,
            Number.MAX_VALUE,
            Number.MAX_VALUE,
            1
        )
    }

    public divideEq(scalar: number): Point {
        if (scalar != 0) {
            let invScalar = 1 / scalar
            return this.set(
                invScalar * this.x,
                invScalar * this.y,
                invScalar * this.z,
                1
            )
        }
        return this.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, 1)
    }

    public negate(): Point {
        return Point.new(-this.x, -this.y, -this.z, 1)
    }

    public negateEq(): Point {
        return this.set(-this.x, -this.y, -this.z)
    }

    public dot(p: Point | Vector): number {
        return this.x * p.x + this.y * p.y + this.z * p.z
    }

    public toString(): string {
        return `[Point]
x: ${this.x.toFixed(8)}, y: ${this.y.toFixed(8)}, z: ${this.z.toFixed(8)}, w: ${this.w.toFixed(8)}`
    }
}
