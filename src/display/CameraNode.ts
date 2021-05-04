import { Node } from "./Node";
import { Camera } from "./Camera";
import { Matrix } from "geom/Matrix";
import { Point } from "geom/Point";
import { Vector } from "geom/Vector";

export class CameraNode extends Node
{
    protected _camera: Camera

    public constructor(camera?: Camera)
    {
        super()
        this._camera = camera

        if(camera != null)
        {
            this.localTransform.setTranslate(this._camera.position)

            let rotate: Matrix = Matrix.fromFrame(this._camera.dVector,
                this._camera.uVector, this._camera.rVector, Point.ORIGIN, true)

            this.localTransform.setRotate(rotate)
        }
    }

    public dispose(): void
    {
        super.dispose()
    }

    public set camera(camera: Camera)
    {
        this._camera = camera

        if(camera != null)
        {
            this.localTransform.setTranslate(this._camera.position)

            let rotate: Matrix = Matrix.fromFrame(this._camera.dVector,
                this._camera.uVector, this._camera.rVector, Point.ORIGIN, true)

            this.localTransform.setRotate(rotate)
        }
    }

    public get camera(): Camera
    {
        return this._camera
    }

    protected updateWorldData(applicationTime: number): void
    {
        super.updateWorldData(applicationTime)

        if(this._camera)
        {
            let camPosition: Point = this.worldTransform.getTranslate()

            let camDVector: Vector = Vector.new()
            let camUVector: Vector = Vector.new()
            let camRVector: Vector = Vector.new()
            this.worldTransform.getRotate().getColumn(0, camDVector)
            this.worldTransform.getRotate().getColumn(1, camUVector)
            this.worldTransform.getRotate().getColumn(2, camRVector)

            this._camera.setFrame(camPosition, camDVector, camUVector, camRVector)
        }
    }
}