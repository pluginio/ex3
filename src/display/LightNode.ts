import { Node } from './Node'
import { Light } from './Light'
import { Matrix } from '../geom/Matrix'
import { Point } from '../geom/Point';
import { Vector } from 'geom/Vector';

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
            let columnD = this.worldTransform.getRotate().getColumn(0)
            let columnU = this.worldTransform.getRotate().getColumn(1)
            let columnR = this.worldTransform.getRotate().getColumn(2)

            this._light.position = this.worldTransform.getTranslate()
            this._light.dVector.set(columnD[0], columnD[1], columnD[2], columnD[3])
            this._light.uVector.set(columnU[0], columnU[1], columnU[2], columnU[3])
            this._light.rVector.set(columnR[0], columnR[1], columnR[2], columnR[3])
        }
    }
}
