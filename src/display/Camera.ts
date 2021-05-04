import { Point } from "../geom/Point";
import { Vector } from "../geom/Vector";
import { Matrix } from "../geom/Matrix";
import { DepthType } from "../display/DepthType";
import { Disposable } from "../core/Disposable";
import { Constants } from "../core/Constants";

export class Camera implements Disposable
{
    // internal
    public static set defaultDepthType(type: DepthType)
    {
        this.msDefaultDepthType = type
    }

    public static get defaultDepthType(): DepthType
    {
        return this.msDefaultDepthType
    }

    protected _position: Point
    protected _dVector: Vector
    protected _uVector: Vector
    protected _rVector: Vector

    protected _viewMatrix: Matrix
    protected _frustum: number[]
    protected _projectionMatrix: Matrix[]
    protected _projectionViewMatrix: Matrix[]

    protected _preViewMatrix: Matrix
    protected _preViewIsIdentity: boolean

    protected _postProjectionMatrix: Matrix
    protected _postProjectionIsIdentity: boolean

    protected _isPerspective: boolean
    protected _depthType: DepthType

    protected static msDefaultDepthType: DepthType = DepthType.ZERO_TO_ONE

    private _validateCameraFrame: boolean

    public constructor(isPerspective: boolean)
    {
        this._isPerspective = isPerspective
        this._depthType = Camera.msDefaultDepthType
        this._validateCameraFrame = true;

        this._viewMatrix = Matrix.IDENTITY
        this._projectionMatrix = []
        this._projectionViewMatrix = []

        this._preViewMatrix = Matrix.IDENTITY
        this._postProjectionMatrix = Matrix.IDENTITY

        for(let i: number = 0; i < DepthType.QUANTITY; ++i)
        {
            this._projectionMatrix[i] = Matrix.IDENTITY
            this._projectionViewMatrix[i] = Matrix.IDENTITY
        }

        this._frustum = [0, 0, 0, 0, 0, 0]

        this.preViewMatrix = Matrix.IDENTITY
        this.postProjectionMatrix = Matrix.IDENTITY

        this.setFrame(Point.ORIGIN, Vector.UNIT_Z.negate(), Vector.UNIT_Y, Vector.UNIT_X)
        this.setFrustumFov(90, 1, 1, 10000)
    }

    public dispose(): void
    {
        this._position.dispose()
        this._dVector.dispose()
        this._uVector.dispose()
        this.rVector.dispose()

        this._viewMatrix.dispose()

        this._projectionMatrix.forEach(element => {
            element.dispose()
        });
        
        this._projectionViewMatrix.forEach(element => {
            element.dispose()
        });

        this._preViewMatrix.dispose()
        this._postProjectionMatrix.dispose()
    }

    public setFrame(position: Point, dVector: Vector, uVector: Vector, rVector: Vector)
    {
        this._position = position
        this.setAxes(dVector, uVector, rVector)
    }

    public setPosition(position: Point): void
    {
        this._position = position
        this.onFrameChange()
    }

    public setAxes(dVector: Vector, uVector: Vector, rVector: Vector): void
    {
        this._dVector = dVector
        this._uVector = uVector
        this._rVector = rVector

        let det: number = this._dVector.dot(this._uVector.cross(this._rVector))
        let epsilon: number = Constants.EPSILON

        if(Math.abs(1 - det) > epsilon)
        {
            if(this._validateCameraFrame)
            {
                this._validateCameraFrame = false

                let lenD: number = this._dVector.length
                let lenU: number = this._uVector.length
                let lenR: number = this._rVector.length
                let dotDU: number = this.dVector.dot(this._uVector)
                let dotDR: number = this._dVector.dot(this._rVector)
                let dotUR: number = this._uVector.dot(this._rVector)
                if (Math.abs(1 - lenD) > epsilon
                ||  Math.abs(1 - lenU) > epsilon
                ||  Math.abs(1 - lenR) > epsilon
                ||  Math.abs(dotDU) > epsilon
                ||  Math.abs(dotDR) > epsilon
                ||  Math.abs(dotUR) > epsilon)
                {
                    console.assert(false, "Camera frame is not orthonormal.")
                }
            }

            Vector.orthonormalize(this._dVector, this._uVector, this._rVector)
        }

        this.onFrameChange()
    }

    public get position(): Point
    {
        return this._position
    }

    public get dVector(): Vector
    {
        return this._dVector
    }

    public get uVector(): Vector
    {
        return this._uVector
    }

    public get rVector(): Vector
    {
        return this._rVector
    }

    public get viewMatrix(): Matrix
    {
        return this._viewMatrix
    }

    public get isPerspective(): boolean
    {
        return this._isPerspective
    }

    public setFrustum(dMin: number, dMax: number, uMin: number, uMax: number,
        rMin: number, rMax: number): void
    {
        this._frustum[FrustumPlaneType.DMIN] = dMin
        this._frustum[FrustumPlaneType.DMAX] = dMax
        this._frustum[FrustumPlaneType.UMIN] = uMin
        this._frustum[FrustumPlaneType.UMAX] = uMax
        this._frustum[FrustumPlaneType.RMIN] = rMin
        this._frustum[FrustumPlaneType.RMAX] = rMax

        this.onFrustumChange()
    }

    public setFrustumList(frustum: number[]): void
    {
        console.assert(frustum.length == 6, "The frustum length must be 6.")
        
        this._frustum[FrustumPlaneType.DMIN] = frustum[FrustumPlaneType.DMIN]
        this._frustum[FrustumPlaneType.DMAX] = frustum[FrustumPlaneType.DMAX]
        this._frustum[FrustumPlaneType.UMIN] = frustum[FrustumPlaneType.UMIN]
        this._frustum[FrustumPlaneType.UMAX] = frustum[FrustumPlaneType.UMAX]
        this._frustum[FrustumPlaneType.RMIN] = frustum[FrustumPlaneType.RMIN]
        this._frustum[FrustumPlaneType.RMAX] = frustum[FrustumPlaneType.RMAX]

        this.onFrustumChange()
    }

    public setFrustumFov(upFovDegrees: number, aspectRatio: number, dMin: number, dMax: number): void
    {
        let halfAngleRadians: number = 0.5 * upFovDegrees * Constants.DEG_TO_RAD
        this._frustum[FrustumPlaneType.UMAX] = dMin * Math.tan(halfAngleRadians)
        this._frustum[FrustumPlaneType.RMAX] = aspectRatio * this._frustum[FrustumPlaneType.UMAX]
        this._frustum[FrustumPlaneType.UMIN] = -this._frustum[FrustumPlaneType.UMAX]
        this._frustum[FrustumPlaneType.RMIN] = -this._frustum[FrustumPlaneType.RMAX]
        this._frustum[FrustumPlaneType.DMIN] = dMin
        this._frustum[FrustumPlaneType.DMAX] = dMax
    
        this.onFrustumChange();
    }

    public get frustum(): number[]
    {
        return [
            this._frustum[FrustumPlaneType.DMIN],
            this._frustum[FrustumPlaneType.DMAX],
            this._frustum[FrustumPlaneType.UMIN],
            this._frustum[FrustumPlaneType.UMAX],
            this._frustum[FrustumPlaneType.RMIN],
            this._frustum[FrustumPlaneType.RMAX]
        ]
    }

    public get frustumFov(): number[]
    {
        if (this._frustum[FrustumPlaneType.RMIN] == -this._frustum[FrustumPlaneType.RMAX]
            &&  this._frustum[FrustumPlaneType.UMIN] == -this._frustum[FrustumPlaneType.UMAX])
        {
            let tmp: number = this._frustum[FrustumPlaneType.UMAX]/this._frustum[FrustumPlaneType.DMIN]
            
            let upFovDegrees: number = 2 * Math.atan(tmp) * Constants.RAD_TO_DEG
            let aspectRatio: number = this._frustum[FrustumPlaneType.RMAX]/this._frustum[FrustumPlaneType.UMAX]
            let dMin: number = this._frustum[FrustumPlaneType.DMIN]
            let dMax: number = this._frustum[FrustumPlaneType.DMAX]

            return [
                upFovDegrees,
                aspectRatio,
                dMin,
                dMax
            ]
        }
        return null
    }

    public get dMin(): number
    {
        return this._frustum[FrustumPlaneType.DMIN]
    }

    public get dMax(): number
    {
        return this._frustum[FrustumPlaneType.DMAX]
    }

    public get uMin(): number
    {
        return this._frustum[FrustumPlaneType.UMIN]
    }

    public get uMax(): number
    {
        return this._frustum[FrustumPlaneType.UMAX]
    }

    public get rMin(): number
    {
        return this._frustum[FrustumPlaneType.RMIN]
    }

    public get rMax(): number
    {
        return this._frustum[FrustumPlaneType.RMAX]
    }

    public get depthType(): DepthType
    {
        return this._depthType
    }

    public get projectionMatrix(): Matrix
    {
        return this._projectionMatrix[this._depthType]
    }

    public set projectionMatrix(projMatrix: Matrix)
    {
        this._projectionMatrix[this._depthType] = projMatrix
    }

    public setProjectionMatrixPoints(p00: Point, p10: Point, p11: Point, p01: Point, nearExtrude: number,
        farExtrude: number)
    {
        console.assert(nearExtrude > 0, "Invalid nearExtrude.");
        console.assert(farExtrude > nearExtrude, "Invalid farExtrude.");

        // Compute the near face of the view volume.
        let q000: Point = Point.ORIGIN.add(p00.subtract(Point.ORIGIN).scale(nearExtrude))
        let q100: Point = Point.ORIGIN.add(p10.subtract(Point.ORIGIN).scale(nearExtrude))
        let q110: Point = Point.ORIGIN.add(p11.subtract(Point.ORIGIN).scale(nearExtrude))
        let q010: Point = Point.ORIGIN.add(p01.subtract(Point.ORIGIN).scale(nearExtrude))

        // Compute the far face of the view volume.
        let q001: Point = Point.ORIGIN.add(p00.subtract(Point.ORIGIN).scale(farExtrude))
        let q101: Point = Point.ORIGIN.add(p10.subtract(Point.ORIGIN).scale(farExtrude))
        let q111: Point = Point.ORIGIN.add(p11.subtract(Point.ORIGIN).scale(farExtrude))
        let q011: Point = Point.ORIGIN.add(p01.subtract(Point.ORIGIN).scale(farExtrude))

        // Compute the representation of q111.
        let u0: Vector = q100.subtract(q000) as Vector
        let u1: Vector = q010.subtract(q000) as Vector
        let u2: Vector = q001.subtract(q000) as Vector
        let M: Matrix = Matrix.fromFrame(u0, u1, u2, q000, true)
        let invM: Matrix = M.inverse(Constants.EPSILON)
        let a: Point = invM.multiplyPoint(q111)

        // Compute the coeffients in the fractional linear transformation.
        //   y[i] = n[i]*x[i]/(d[0]*x[0] + d[1]*x[1] + d[2]*x[2] + d[3])
        let n0: number = 2 * a.x
        let n1: number = 2 * a.y
        let n2: number = 2 * a.z
        let d0: number = +a.x - a.y - a.z + 1
        let d1: number = -a.x + a.y - a.z + 1
        let d2: number = -a.x - a.y + a.z + 1
        let d3: number = +a.x + a.y + a.z - 1

        // Compute the perspective projection from the canonical cuboid to the
        // canonical cube [-1,1]^2 x [0,1].
        let n2divn0: number = n2/n0;
        let n2divn1: number = n2/n1;
        let project: Matrix = Matrix.new()

        project.setAt(0, 0, n2divn0*(2*d3 + d0))
        project.setAt(0, 1, n2divn1*d1)
        project.setAt(0, 2, d2)
        project.setAt(0, 3, -n2)
        project.setAt(1, 0, n2divn0*d0)
        project.setAt(1, 1, n2divn1*(2*d3 + d1))
        project.setAt(1, 2, d2)
        project.setAt(1, 3, -n2)

        if (this._depthType == DepthType.ZERO_TO_ONE)
        {
            project.setAt(2, 0, 0)
            project.setAt(2, 1, 0)
            project.setAt(2, 2, d3)
            project.setAt(2, 3, 0)
        }
        else
        {
            project.setAt( 2, 0, n2divn0 * d0)
            project.setAt(2, 1, n2divn1 * d1)
            project.setAt(2, 2, 2 * d3 + d2)
            project.setAt(2, 3, -n2)
        }

        project.setAt(3, 0, -n2divn0*d0)
        project.setAt(3, 1, -n2divn1*d1)
        project.setAt(3, 2, -d2)
        project.setAt(3, 3, n2)

        this.projectionMatrix = project.multiply(invM)
    }

    public get projectionViewMatrix(): Matrix
    {
        return this._projectionViewMatrix[this._depthType]
    }

    public set preViewMatrix(preViewMatrix: Matrix)
    {
        this._preViewMatrix = preViewMatrix
        this._preViewIsIdentity = (this._preViewMatrix.equals(Matrix.IDENTITY))
        this.updatePVMatrix()
    }

    public get preViewMatrix(): Matrix
    {
        return this._preViewMatrix
    }

    public get preViewIsIdentity(): boolean
    {
        return this._preViewIsIdentity
    }

    public set postProjectionMatrix(postProjMatrix: Matrix)
    {
        this._postProjectionMatrix = postProjMatrix;
        this._postProjectionIsIdentity = (this._postProjectionMatrix.equals(Matrix.IDENTITY))
        this.updatePVMatrix()
    }

    public get postProjectionMatrix(): Matrix
    {
        return this._postProjectionMatrix
    }

    public get postProjectionIsIdentity(): boolean
    {
        return this._postProjectionIsIdentity
    }

    // TODO check that ArrayBuffer is the prefered GLES2 type
    public computeBoundingAABB(numVertices: number, vertices: ArrayBuffer, stride: number,
        worldMatrix: Matrix): number[]
    {
        // TODO
        return []
    }

    protected onFrameChange(): void
    {
        this._viewMatrix.setAt(0, 0, this._rVector.x)
        this._viewMatrix.setAt(0, 1, this._rVector.y)
        this._viewMatrix.setAt(0, 2, this._rVector.z)
        this._viewMatrix.setAt(0, 3, -this._position.dot(this.rVector))
        this._viewMatrix.setAt(1, 0, this._uVector.x)
        this._viewMatrix.setAt(1, 1, this._uVector.y)
        this._viewMatrix.setAt(1, 2, this._uVector.z)
        this._viewMatrix.setAt(1, 3, -this._position.dot(this._uVector))
        this._viewMatrix.setAt(2, 0, this._dVector.x)
        this._viewMatrix.setAt(2, 1, this._dVector.y)
        this._viewMatrix.setAt(2, 2, this._dVector.z)
        this._viewMatrix.setAt(2, 3, -this._position.dot(this._dVector))
        this._viewMatrix.setAt(3, 0, 0)
        this._viewMatrix.setAt(3, 1, 0)
        this._viewMatrix.setAt(3, 2, 0)
        this._viewMatrix.setAt(3, 3, 1)
    
        this.updatePVMatrix()
    }

    public onFrustumChange(): void
    {
        let dMin: number = this._frustum[FrustumPlaneType.DMIN];
        let dMax: number = this._frustum[FrustumPlaneType.DMAX];
        let uMin: number = this._frustum[FrustumPlaneType.UMIN];
        let uMax: number = this._frustum[FrustumPlaneType.UMAX];
        let rMin: number = this._frustum[FrustumPlaneType.RMIN];
        let rMax: number = this._frustum[FrustumPlaneType.RMAX];
    
        let invDDiff: number = 1/(dMax - dMin);
        let invUDiff: number = 1/(uMax - uMin);
        let invRDiff: number = 1/(rMax - rMin);
        let sumRMinRMaxInvRDiff: number = (rMin + rMax)*invRDiff;
        let sumUMinUMaxInvUDiff: number = (uMin + uMax)*invUDiff;
        let sumDMinDMaxInvDDiff: number = (dMin + dMax)*invDDiff;
    
        if (this._isPerspective)
        {
            let twoDMinInvRDiff: number = 2*dMin*invRDiff;
            let twoDMinInvUDiff: number = 2*dMin*invUDiff;
            let dMaxInvDDiff: number = dMax*invDDiff;
            let dMinDMaxInvDDiff: number = dMin*dMaxInvDDiff;
            let twoDMinDMaxInvDDiff: number = 2*dMinDMaxInvDDiff;
    
            if (this._depthType == DepthType.ZERO_TO_ONE)
            {
                // Map (x,y,z) into [-1,1]x[-1,1]x[0,1].
                this._projectionMatrix[DepthType.ZERO_TO_ONE].set
                (
                    twoDMinInvRDiff, 0, -sumRMinRMaxInvRDiff, 0,
                    0, twoDMinInvUDiff, -sumUMinUMaxInvUDiff, 0,
                    0, 0, dMaxInvDDiff, -dMinDMaxInvDDiff,
                    0, 0, 1, 0
                )
            }
            else
            {
                // Map (x,y,z) into [-1,1]x[-1,1]x[-1,1].
                this._projectionMatrix[DepthType.MINUS_ONE_TO_ONE].set(
                    twoDMinInvRDiff, 0, -sumRMinRMaxInvRDiff, 0,
                    0, twoDMinInvUDiff, -sumUMinUMaxInvUDiff, 0,
                    0, 0, sumDMinDMaxInvDDiff, -twoDMinDMaxInvDDiff,
                    0, 0, 1, 0
                )
            }
        }
        else
        {
            let twoInvRDiff: number = 2*invRDiff;
            let twoInvUDiff: number = 2*invUDiff;
            let twoInvDDiff: number = 2*invDDiff;
            let dMinInvDDiff: number = dMin*invDDiff;
    
            if (this._depthType == DepthType.ZERO_TO_ONE)
            {
                // Map (x,y,z) into [-1,1]x[-1,1]x[0,1].
                this._projectionMatrix[DepthType.ZERO_TO_ONE].set(
                    twoInvRDiff, 0, 0, -sumRMinRMaxInvRDiff,
                    0, twoInvUDiff, 0, -sumUMinUMaxInvUDiff,
                    0, 0, invDDiff, -dMinInvDDiff,
                    0, 0, 0, 1
                )
            }
            else
            {
                // Map (x,y,z) into [-1,1]x[-1,1]x[-1,1].
                this._projectionMatrix[DepthType.MINUS_ONE_TO_ONE].set(
                    twoInvRDiff, 0, 0, -sumRMinRMaxInvRDiff,
                    0, twoInvUDiff, 0, -sumUMinUMaxInvUDiff,
                    0, 0, twoInvDDiff, -sumDMinDMaxInvDDiff,
                    0, 0, 0, 1
                )
            }
        }
    
        this.updatePVMatrix();
    }

    public updatePVMatrix(): void
    {
        let pMatrix: Matrix = this._projectionMatrix[this._depthType]
        let pvMatrix: Matrix = this._projectionViewMatrix[this._depthType]
    
        this._projectionViewMatrix[this._depthType] = pMatrix.multiply(this._viewMatrix)
        if (!this._postProjectionIsIdentity)
        {
            this._projectionViewMatrix[this._depthType] = this._postProjectionMatrix.multiply(pvMatrix)
        }
        if (!this._preViewIsIdentity)
        {
            this._projectionViewMatrix[this._depthType] = pvMatrix.multiply(this._preViewMatrix)
        }
    }
}

export enum FrustumPlaneType
{
    DMIN = 0,
    DMAX = 1,
    UMIN = 2,
    UMAX = 3,
    RMIN = 4,
    RMAX = 5,
    QUANTITY = 6
}