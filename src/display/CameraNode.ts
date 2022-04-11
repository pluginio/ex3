import { Node } from "./Node";
import { Camera } from "./Camera";
import { Matrix } from "../geom/Matrix";
import { Point } from "../geom/Point";
import { Vector } from "../geom/Vector";

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

            let rotate = Matrix.fromFrame(
                this._camera.dVector,
                this._camera.uVector, 
                this._camera.rVector, 
                Point.ORIGIN,
                true
            )

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
            let columnD = this.worldTransform.getRotate().getColumn(0)
            let columnU = this.worldTransform.getRotate().getColumn(1)
            let columnR = this.worldTransform.getRotate().getColumn(2)

            let camDVector = Vector.fromTuple(columnD)
            let camUVector = Vector.fromTuple(columnU)
            let camRVector = Vector.fromTuple(columnR)

            let camPosition = this.worldTransform.getTranslate()
            this._camera.setFrame(camPosition, camDVector, camUVector, camRVector)
        }
    }
}
