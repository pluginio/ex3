import { Matrix } from "./Matrix";
import { Point } from "./Point";
import { Vector } from "./Vector";
import { Pool } from "../utils/Pool";
import { Constants } from "../core/Constants";
import { Disposable } from "../core/Disposable";

export class Transform implements Disposable
{
    private static readonly _pool: Pool<Transform> = new Pool(
        Constants.DEFAULT_POOL_SIZE,
        Transform
    )
    
    public static new(): Transform {
        let t: Transform = Transform._pool.get()
        t.makeIdentity()
        return t
    }

    public static get IDENTITY(): Transform
    {
        return Transform.new()
    }

    private _HMatrix: Matrix = Matrix.IDENTITY
    private _invHMatrix: Matrix = Matrix.IDENTITY

    private _matrix: Matrix = Matrix.IDENTITY
    private _translate: Point = Point.new(0, 0, 0)
    private _scale: Point = Point.new(1, 1, 1)

    private _isIdentity: boolean = true
    private _isRSMatrix: boolean = true
    private _isUniformScale: boolean = true
    
    private _inverseNeedsUpdate: boolean = false


    public dispose(): void
    {
        Transform._pool.release(this)
    }

    public makeIdentity(): void
    {
        this._matrix.toIdentity()
        this._translate.set(0, 0, 0)
        this._scale.set(1, 1, 1)
        this._isIdentity = true
        this._isRSMatrix = true
        this._isUniformScale = true
    }

    public makeUnitScale(): void
    {
        console.assert(this._isRSMatrix, "Matrix is not a rotation")

        this._scale.set(1, 1, 1)
        this._isUniformScale = true
        this.updateHMatrix()
    }

    public get isIdentity(): boolean
    {
        return this._isIdentity
    }

    public get isRSMatrix(): boolean
    {
        return this._isRSMatrix
    }

    public get isUniformScale(): boolean
    {
        return this._isUniformScale
    }

    public getRotate(): Matrix
    {
        console.assert(this._isRSMatrix, "Matrix is not a rotation")
        return this._matrix
    }

    public setRotate(matrix: Matrix)
    {
        this._matrix = matrix
        this._isIdentity = false
        this._isRSMatrix = false
        this._isUniformScale = false
    }

    public getMatrix(): Matrix
    {
        return this._matrix
    }

    public setMatrix(matrix: Matrix)
    {
        this._matrix = matrix
        this._isIdentity = false
        this._isRSMatrix = false
        this._isUniformScale = false
        this.updateHMatrix()
    }

    public getTranslate(): Point
    {
        return this._translate
    }

    public setTranslate(translate: Point)
    {
        this._translate = translate
        this._isIdentity = false
        this.updateHMatrix()
    }

    public getScale(): Point
    {
        console.assert(this._isRSMatrix, "Matrix is not a rotation-scale")
        return this._scale
    }

    public setScale(scale: Point)
    {
        console.assert(this._isRSMatrix, "Matrix is not a rotation")
        console.assert(scale.x != 0 && scale.y != 0 && scale.z != 0, "Scales must be nonzero")

        this._scale = scale
        this._isIdentity = false
        this._isUniformScale = false
        this.updateHMatrix()
    }

    private getUniformScale(): number
    {
        console.assert(this._isRSMatrix, "Matrix is not a rotation-scale")
        console.assert(this._isUniformScale, "Matrix is not uniform scale")
        return this._scale.x
    }

    public setUniformScale(scale: number)
    {
        console.assert(this._isRSMatrix, "Matrix is not a rotation")
        console.assert(scale != 0, "Scale must be nonzero")

        this._scale = Point.new(scale, scale, scale)
        this._isIdentity = false
        this._isUniformScale = true
        this.updateHMatrix()
    }

    public get norm(): number
    {
        if (this._isRSMatrix)
        {
            let maxValue: number = Math.abs(this._scale.x)
            if (Math.abs(this._scale.y) > maxValue)
            {
                maxValue = Math.abs(this._scale.y)
            }
            if (Math.abs(this._scale.z) > maxValue)
            {
                maxValue = Math.abs(this._scale.z)
            }
            return maxValue;
        }

        let maxRowSum: number =
            Math.abs(this._matrix.getAt(0, 0)) +
            Math.abs(this._matrix.getAt(0, 1)) +
            Math.abs(this._matrix.getAt(0, 2))
    
        let rowSum: number =
            Math.abs(this._matrix.getAt(1, 0)) +
            Math.abs(this._matrix.getAt(1, 1)) +
            Math.abs(this._matrix.getAt(1, 2))
    
        if (rowSum > maxRowSum)
        {
            maxRowSum = rowSum
        }
    
        rowSum =
            Math.abs(this._matrix.getAt(2, 0)) +
            Math.abs(this._matrix.getAt(2, 1)) +
            Math.abs(this._matrix.getAt(2, 2))
    
        if (rowSum > maxRowSum)
        {
            maxRowSum = rowSum
        }
    
        return maxRowSum
    }

    public multiplyPoint(p: Point): Point
    {
        return this._HMatrix.multiplyPoint(p)
    }

    public multiplyVector(v: Vector): Vector
    {
        return this._HMatrix.multiplyVector(v)
    }

    public multiply(transform: Transform): Transform
    {
        if (this.isIdentity)
        {
            return transform;
        }

        if (transform.isIdentity)
        {
            return this
        }

        let product: Transform = Transform.new()

        if (this._isRSMatrix && transform._isRSMatrix)
        {
            if (this._isUniformScale)
            {
                product.setRotate(this._matrix.multiply(transform._matrix));

                product.setTranslate(this._matrix.multiplyPoint(transform._translate).add(this._translate).scale(this.getUniformScale()))

                if (transform.isUniformScale)
                {
                    product.setUniformScale(this.getUniformScale()*transform.getUniformScale())
                }
                else
                {
                    product.setScale(transform.getScale().scale(this.getUniformScale()))
                }

                return product
            }
        }

        let matMA: Matrix = this._isRSMatrix ? this._matrix.timesDiagonal(this._scale) : this._matrix
        let matMB: Matrix = transform._isRSMatrix ?
            transform._matrix.timesDiagonal(transform._scale) :
            transform._matrix

        product.setMatrix(matMA.multiply(matMB))
        product.setTranslate(matMA.multiplyPoint(transform._translate).add(this._translate))
        
        return product
    }

    public get matrix(): Matrix
    {
        return this._HMatrix
    }

    public get inverse(): Matrix
    {
        if (this._inverseNeedsUpdate)
        {
            if (this._isIdentity)
            {
                this._invHMatrix = Matrix.IDENTITY
            }
            else
            {
                if (this._isRSMatrix)
                {
                    if (this._isUniformScale)
                    {
                        let invScale: number = 1 / this._scale.x;
                        this._invHMatrix.setAt(0, 0, invScale*this._matrix.getAt(0, 0))
                        this._invHMatrix.setAt(0, 1, invScale*this._matrix.getAt(1, 0))
                        this._invHMatrix.setAt(0, 2, invScale*this._matrix.getAt(2, 0))
                        this._invHMatrix.setAt(1, 0, invScale*this._matrix.getAt(0, 1))
                        this._invHMatrix.setAt(1, 1, invScale*this._matrix.getAt(1, 1))
                        this._invHMatrix.setAt(1, 2, invScale*this._matrix.getAt(2, 1))
                        this._invHMatrix.setAt(2, 0, invScale*this._matrix.getAt(0, 2))
                        this._invHMatrix.setAt(2, 1, invScale*this._matrix.getAt(1, 2))
                        this._invHMatrix.setAt(2, 2, invScale*this._matrix.getAt(2, 2))
                    }
                    else
                    {
                        let s01: number = this._scale.x * this._scale.y
                        let s02 = this._scale.x * this._scale.z
                        let s12 = this._scale.y * this._scale.z
                        let invs012 = 1 / (s01 * this._scale.z)
                        let invS0 = s12 * invs012
                        let invS1 = s02 * invs012
                        let invS2 = s01 * invs012

                        this._invHMatrix.setAt(0, 0, invS0 * this._matrix.getAt(0, 0))
                        this._invHMatrix.setAt(0, 1, invS0 * this._matrix.getAt(1, 0))
                        this._invHMatrix.setAt(0, 2, invS0 * this._matrix.getAt(2, 0))
                        this._invHMatrix.setAt(1, 0, invS1 * this._matrix.getAt(0, 1))
                        this._invHMatrix.setAt(1, 1, invS1 * this._matrix.getAt(1, 1))
                        this._invHMatrix.setAt(1, 2, invS1 * this._matrix.getAt(2, 1))
                        this._invHMatrix.setAt(2, 0, invS2 * this._matrix.getAt(0, 2))
                        this._invHMatrix.setAt(2, 1, invS2 * this._matrix.getAt(1, 2))
                        this._invHMatrix.setAt(2, 2, invS2 * this._matrix.getAt(2, 2))
                    }
                }
                else
                {
                    Transform.invert3x3(this._HMatrix, this._invHMatrix)
                }
    
                this._invHMatrix.setAt(0, 3, -(
                    this._invHMatrix.getAt(0, 0) * this._translate.x +
                    this._invHMatrix.getAt(0, 1) * this._translate.y +
                    this._invHMatrix.getAt(0, 2) * this._translate.z
                ));
    
                this._invHMatrix.setAt(1, 3, -(
                    this._invHMatrix.getAt(1, 0) * this._translate.x +
                    this._invHMatrix.getAt(1, 1) * this._translate.y +
                    this._invHMatrix.getAt(1, 2) * this._translate.z
                ));
    
                this._invHMatrix.setAt(2, 3, -(
                    this._invHMatrix.getAt(2, 0) * this._translate.x +
                    this._invHMatrix.getAt(2, 1) * this._translate.y +
                    this._invHMatrix.getAt(2, 2) * this._translate.z
                ));
            }
    
            this._inverseNeedsUpdate = false;
        }
    
        return this._invHMatrix
    }

    public get inverseTransform(): Transform
    {
        if (this._isIdentity)
        {
            return Transform.IDENTITY
        }
    
        let inverse: Transform = Transform.new()
        let invTrn: Point = Point.new()
        if (this._isRSMatrix)
        {
            let invRot: Matrix = this._matrix.transpose()
            inverse.setRotate(invRot)
            if (this._isUniformScale)
            {
                let invScale: number = 1 / this._scale.x
                inverse.setUniformScale(invScale)
                invTrn = (invRot.multiplyPoint(this._translate)).scale(-invScale)
            }
            else
            {
                let invScale: Point = Point.new(1 / this._scale.x, 1 / this._scale.y, 1 / this._scale.z)
                inverse.setScale(invScale)
                invTrn = invRot.multiplyPoint(this._translate)
                invTrn.x *= -invScale.x
                invTrn.y *= -invScale.y
                invTrn.z *= -invScale.z
            }
        }
        else
        {
            let invMat: Matrix = Matrix.new()
            Transform.invert3x3(this._matrix, invMat)
            inverse.setMatrix(invMat)
            invTrn = (invMat.multiplyPoint(this._translate)).negate()
        }
        inverse.setTranslate(invTrn)
    
        return inverse
    }

    private updateHMatrix(): void
    {
        if (this._isIdentity)
        {
            this._HMatrix = Matrix.IDENTITY
        }
        else
        {
            if (this._isRSMatrix)
            {
                this._HMatrix.setAt(0, 0, this._matrix.getAt(0, 0) * this._scale.x)
                this._HMatrix.setAt(0, 1, this._matrix.getAt(0, 1) * this._scale.y)
                this._HMatrix.setAt(0, 2, this._matrix.getAt(0, 2) * this._scale.z)
                this._HMatrix.setAt(1, 0, this._matrix.getAt(1, 0) * this._scale.x)
                this._HMatrix.setAt(1, 1, this._matrix.getAt(1, 1) * this._scale.y)
                this._HMatrix.setAt(1, 2, this._matrix.getAt(1, 2) * this._scale.z)
                this._HMatrix.setAt(2, 0, this._matrix.getAt(2, 0) * this._scale.x)
                this._HMatrix.setAt(2, 1, this._matrix.getAt(2, 1) * this._scale.y)
                this._HMatrix.setAt(2, 2, this._matrix.getAt(2, 2) * this._scale.z)
            }
            else
            {
                this._HMatrix.setAt(0, 0, this._matrix.getAt(0, 0))
                this._HMatrix.setAt(0, 1, this._matrix.getAt(0, 1))
                this._HMatrix.setAt(0, 2, this._matrix.getAt(0, 2))
                this._HMatrix.setAt(1, 0, this._matrix.getAt(1, 0))
                this._HMatrix.setAt(1, 1, this._matrix.getAt(1, 1))
                this._HMatrix.setAt(1, 2, this._matrix.getAt(1, 2))
                this._HMatrix.setAt(2, 0, this._matrix.getAt(2, 0))
                this._HMatrix.setAt(2, 1, this._matrix.getAt(2, 1))
                this._HMatrix.setAt(2, 2, this._matrix.getAt(2, 2))
            }
    
            this._HMatrix.setAt(0, 3, this._translate.x)
            this._HMatrix.setAt(1, 3, this._translate.y)
            this._HMatrix.setAt(2, 3, this._translate.z)
        }
    
        this._inverseNeedsUpdate = true;
    }

    private static invert3x3(mat: Matrix, invMat: Matrix): void
    {
        invMat.setAt(0, 0, mat.getAt(1, 1) * mat.getAt(2, 2) - mat.getAt(1, 2) * mat.getAt(2, 1))
        invMat.setAt(0, 1, mat.getAt(0, 2) * mat.getAt(2, 1) - mat.getAt(0, 1) * mat.getAt(2, 2))
        invMat.setAt(0, 2, mat.getAt(0, 1) * mat.getAt(1, 2) - mat.getAt(0, 2) * mat.getAt(1, 1))
        invMat.setAt(1, 0, mat.getAt(1, 2) * mat.getAt(2, 0) - mat.getAt(1, 0) * mat.getAt(2, 2))
        invMat.setAt(1, 1, mat.getAt(0, 0) * mat.getAt(2, 2) - mat.getAt(0, 2) * mat.getAt(2, 0))
        invMat.setAt(1, 2, mat.getAt(0, 2) * mat.getAt(1, 0) - mat.getAt(0, 0) * mat.getAt(1, 2))
        invMat.setAt(2, 0, mat.getAt(1, 0) * mat.getAt(2, 1) - mat.getAt(1, 1) * mat.getAt(2, 0))
        invMat.setAt(2, 1, mat.getAt(0, 1) * mat.getAt(2, 0) - mat.getAt(0, 0) * mat.getAt(2, 1))
        invMat.setAt(2, 2, mat.getAt(0, 0) * mat.getAt(1, 1) - mat.getAt(0, 1) * mat.getAt(1, 0))

        let invDet: number = 1 / (
            mat.getAt(0, 0) * invMat.getAt(0, 0) +
            mat.getAt(0, 1) * invMat.getAt(1, 0) +
            mat.getAt(0, 2) * invMat.getAt(2, 0)
        )

        invMat.setAt(0, 0, invMat.getAt(0, 0) * invDet)
        invMat.setAt(0, 1, invMat.getAt(0, 1) * invDet)
        invMat.setAt(0, 2, invMat.getAt(0, 2) * invDet)
        invMat.setAt(1, 0, invMat.getAt(1, 0) * invDet)
        invMat.setAt(1, 1, invMat.getAt(1, 1) * invDet)
        invMat.setAt(1, 2, invMat.getAt(1, 2) * invDet)
        invMat.setAt(2, 0, invMat.getAt(2, 0) * invDet)
        invMat.setAt(2, 1, invMat.getAt(2, 1) * invDet)
        invMat.setAt(2, 2, invMat.getAt(2, 2) * invDet)
    }
}