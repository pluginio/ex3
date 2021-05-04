import { Node } from './Node'
import { Light } from './Light'
import { Matrix } from '../geom/Matrix'
import { Point } from '../geom/Point';

export class LightNode extends Node
{
    protected _light: Light

    public constructor(light: Light)
    {
        super()

        this._light = light

        if(this._light)
        {
            this.localTransform.setTranslate(this._light.position)

            let rotate: Matrix = Matrix.fromFrame(this._light.dVector, this._light.uVector,
                this._light.rVector, Point.ORIGIN, true)
            this.localTransform.setRotate(rotate)
        }
    }

    public dispose(): void
    {
        super.dispose()
    }

    public get light(): Light
    {
        return this._light
    }

    public set light(light: Light)
    {
        this._light = light

        if(this._light)
        {
            this.localTransform.setTranslate(this._light.position)

            let rotate: Matrix = Matrix.fromFrame(this._light.dVector, this._light.uVector,
                this._light.rVector, Point.ORIGIN, true)
            this.localTransform.setRotate(rotate)

            this.update()
        }
    }

    // override
    protected updateWorldData(applicationTime: number): void
    {
        super.updateWorldData(applicationTime)

        if(this._light)
        {
            this._light.position = this.worldTransform.getTranslate()
            this.worldTransform.getRotate().getColumn(0, this._light.dVector)
            this.worldTransform.getRotate().getColumn(1, this._light.uVector)
            this.worldTransform.getRotate().getColumn(2, this._light.rVector)
        }
    }
}