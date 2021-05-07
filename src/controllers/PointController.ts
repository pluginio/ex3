import { Polypoint } from "../display/Polypoint";
import { PooledList } from "../utils/PooledList";
import { Vector } from "../geom/Vector";
import { Controller } from "./Controller";
import { Matrix } from "../geom/Matrix";
import { VertexBufferAccessor } from "resources/VertexBufferAccessor";
import { Point } from "../geom/Point";
import { Renderer } from "../renderers/Renderer";

export class PointController extends Controller
{
    protected _systemLinearSpeed: number = 0;
    protected _systemAngularSpeed: number = 0;
    protected _systemLinearAxis: Vector = Vector.UNIT_Z
    protected _systemAngularAxis: Vector = Vector.UNIT_Z

    protected _numPoints: number = 0;

    protected _pointLinearSpeed: number[] = [];
    protected _pointAngularSpeed: number[] = [];
    protected _pointLinearAxis: PooledList<Vector> = new PooledList(Vector);
    protected _pointAngularAxis: PooledList<Vector> = new PooledList(Vector);

    public dispose()
    {
        this._pointLinearAxis.dispose()
        this._pointAngularAxis.dispose()

        this._pointLinearSpeed = []
        this._pointAngularSpeed = []
    }

    public get numPoints(): number
    {
        return this._numPoints;
    }

    public get pointLinearSpeed(): number[]
    {
        return this._pointLinearSpeed
    }

    public get pointAngularSpeeds(): number []
    {
        return this._pointAngularSpeed
    }

    public get pointLinearAxis(): PooledList<Vector>
    {
        return this._pointLinearAxis
    }

    public get pointAngularAxis(): PooledList<Vector>
    {
        return this._pointAngularAxis
    }

    public update(applicationTime: number): boolean
    {
        if(!super.update(applicationTime))
        {
            return false;
        }
        let ctrlTime = this.getControlTime(applicationTime)

        this.updateSystemMotion(ctrlTime)
        this.updatePointMotion(ctrlTime)

        return true;
    }

    public reallocate(numPoints: number): void
    {
        this._pointLinearSpeed = new Array(numPoints)
        this._pointAngularSpeed = new Array(numPoints)

        if(numPoints > 0)
        {
            this._numPoints = numPoints

            this._pointLinearAxis.reallocate(numPoints)
            this._pointAngularAxis.reallocate(numPoints)

            for(let i: number = 0; i < numPoints; ++i)
            {
                this._pointLinearSpeed[i] = 0
                this._pointAngularSpeed[i] = 0
            }
        }
    }

    public updateSystemMotion(ctrlTime: number): void
    {
        let points = this._object as Polypoint;

        let distance = ctrlTime * this._systemLinearSpeed
        let deltaTrn = this._systemLinearAxis.scale(distance);
        points.localTransform.setTranslate(
            points.localTransform.getTranslate().add( deltaTrn)
        )

        let angle = ctrlTime * this._systemAngularSpeed;
        let deltaRot = Matrix.fromAxisAngle(this._systemAngularAxis, angle)
        points.localTransform.setRotate(
            deltaRot.multiply(points.localTransform.getRotate())
        )
    }

    public updatePointMotion(ctrlTime: number): void
    {
        let points = this._object as Polypoint;

        let vba = VertexBufferAccessor.fromVisual(points)

        let numPoints = points.numPoints
        for(let i = 0; i < numPoints; ++i)
        {
            let distance = ctrlTime * this._pointLinearSpeed[i]
            let positionList = vba.getPositionAt(i)
            let position = Point.new(positionList[0], positionList[1], positionList[2])
            let deltaTrn = this._pointLinearAxis.at(i).scale(distance)

            vba.setPositionAt(i, position.add(deltaTrn).toArray())
        }

        if(vba.hasNormal())
        {
            for(let i = 0; i < numPoints; ++i)
            {
                let angle = ctrlTime * this._pointAngularSpeed[i]
                let x = vba.getNormalAt(i)
                let normal: Vector = Vector.new(x[0], x[1], x[2])
                normal.normalize()

                let deltaRot = Matrix.fromAxisAngle(this._pointAngularAxis.at(i), angle)
                vba.setNormalAt(i, deltaRot.multiplyVector(normal).toArray())
            }
        }

        Renderer.updateAllVertexBuffer(points.vertexBuffer)
    }
}
