import { WindowApplication3 } from "../application/WindowApplication3";
import { Node } from "../display/Node";
import { WireState } from "../shaders/states/WireState";
import { Culler } from "../display/Culler";
import { Point } from "../geom/Point";
import { Vector } from "../geom/Vector";
import { Light } from "../display/Light";
import { MathExt } from "../utils/MathExt";
import { LightType } from "../display/LightType";
import { Material } from "../display/Material";

export class Lights extends WindowApplication3
{
    protected _scene: Node
    protected _wireState: WireState
    //protected _plane0: TriMesh
    //protected _plane1: TriMesh
    //protected _plane2: TriMesh
    //protected _plane3: TriMesh
    // protected _sphere: TriMesh
    protected _culler: Culler

    protected _light: Light[][]
    protected _caption: string[]
    protected _currentCaption: string
    protected _activeType: number

    constructor()
    {
        super("SampleGraphics/Lights", 0, 0, 800, 600, [0, .25, .75, 1])
        //this._textColor = [1, 1, 1, 1]
    }

    public onInitialize(): boolean
    {
        if(!super.onInitialize())
        {
            return false
        }

        this._camera.setFrustumFov(60, this.aspectRatio, 0.1, 100)
        let camPosition: Point = Point.new(16, 0, 8)
        let camDVector: Vector = Point.ORIGIN.subtract(camPosition) as Vector
        camDVector.normalize()

        let camUVector: Vector = Vector.new(camDVector.z, 0, -camDVector.x)
        let camRVector: Vector = Vector.new(0, 1, 0)
        this._camera.setFrame(camPosition, camDVector, camUVector, camRVector)

        this.createScene()

        this._scene.update()

        this._culler.camera = this._camera
        this._culler.computeVisibleSet(this._scene)

        this.initializeCameraMotion(0.01, 0.001)
        this.initializeObjectMotion(this._scene)

        this._light = []
        for(let i: number = 0; i < 3; ++i)
        {
            this._light[i] = []
        }
        return true
    }

    public onTerminate(): void
    {
        this._scene = null
        this._wireState = null
        // this._plane0 = null
        // this._plane1 = null
        // this._plane2 = null
        // this._sphere = null

        for(let i: number = 0; i < 3; ++i)
        {
            this._light[i][0] = null
            this._light[i][1] = null
            // TODO instance deletion
        }

        super.onTerminate()
    }

    public onIdle(): void
    {
        this.measureTime()

        if(this.moveCamera())
        {
            this._culler.computeVisibleSet(this._scene)
        }

        if(this.moveObject())
        {
            this._scene.update()
            this._culler.computeVisibleSet(this._scene)
        }

        if(this._renderer.preDraw())
        {
            this._renderer.clearBuffers()
            this._renderer.drawVisibleSet(this._culler.visibleSet)
            // TODO draw frame rate
            this._renderer.postDraw()
            this._renderer.displayColorBuffer()
        }

        this.updateFrameCount()
    }

    public onKeyDown(key: string, x: number, y: number): boolean
    {
        if(super.onKeyDown(key, x, y))
        {
            return true
        }

        switch(key)
        {
            case 'w':
            case 'W':
                this._wireState.enabled = !this._wireState.enabled
                return true
            case 'd':
            case 'D':
                //this._plane0.SetEffectInstance(mInstance[0][0][0]);
                //this._sphere0.SetEffectInstance(mInstance[0][0][1]);
                //this._plane1.SetEffectInstance(mInstance[0][1][0]);
                //this._sphere1.SetEffectInstance(mInstance[0][1][1]);
                this._currentCaption = this._caption[0]
                this._activeType = 0
                return true
            case 'p':
            case 'P':
                // TODO geom
                this._currentCaption = this._caption[1]
                this._activeType = 1
                return true
            case 's':
            case 'S':
                // TODO geom
                this._currentCaption = this._caption[2]
                return true
            case 'i':
                this._light[this._activeType][0].intensity -= 0.125
                this._light[this._activeType][1].intensity -= 0.125
                if(this._light[this._activeType][0].intensity < 0)
                {
                    this._light[this._activeType][0].intensity = 0
                    this._light[this._activeType][1].intensity = 0
                }
                this._light[this._activeType][0].angle = this._light[this._activeType][0].angle
                this._light[this._activeType][1].angle = this._light[this._activeType][1].angle

                return true
            case 'A':

                this._light[this._activeType][0].angle += 0.1
                this._light[this._activeType][1].angle += 0.1
                if(this._light[this._activeType][0].angle > MathExt.HALF_PI)
                {
                    this._light[this._activeType][0].angle = MathExt.HALF_PI
                    this._light[this._activeType][1].angle = MathExt.HALF_PI
                }
                this._light[this._activeType][0].angle = this._light[this._activeType][0].angle
                this._light[this._activeType][1].angle = this._light[this._activeType][1].angle

                return true
            case 'e':
                this._light[this._activeType][0].exponent *= 0.5
                this._light[this._activeType][1].exponent *= 0.5
                return true
        }

        return false
    }

    public createScene()
    {
        this._scene = new Node()
        this._wireState = new WireState() // unsupported
        this._renderer.overrideWireState = this._wireState

        // create lights
        // direction lights
        this._light[0][0] = new Light(LightType.DIRECTIONAL)
        this._light[0][0].ambient = [0.75, 0.75, 0.75, 1.00]
        this._light[0][0].diffuse = [1.00, 1.00, 1.00, 1.00]
        this._light[0][0].specular = [1.00, 1.00, 1.00, 1.00]
        this._light[0][0].direction = Vector.new(-1, -1, -1)

        this._light[0][1] = new Light(LightType.DIRECTIONAL)
        this._light[0][1].ambient = [0.75, 0.75, 0.75, 1.00]
        this._light[0][1].diffuse = [1.00, 1.00, 1.00, 1.00]
        this._light[0][1].specular = [1.00, 1.00, 1.00, 1.00]
        this._light[0][1].direction = Vector.new(-1, -1, -1)

        // point lights
        this._light[1][0] = new Light(LightType.POINT)
        this._light[1][0].ambient = [0.10, 0.10, 0.10, 1.00]
        this._light[1][0].diffuse = [1.00, 1.00, 1.00, 1.00]
        this._light[1][0].specular = [1.00, 1.00, 1.00, 1.00]
        this._light[1][0].position = Point.new(4.0, 4.0 - 8.0, 8.0)

        this._light[1][1] = new Light(LightType.POINT)
        this._light[1][1].ambient = [0.75, 0.75, 0.75, 1.00]
        this._light[1][1].diffuse = [1.00, 1.00, 1.00, 1.00]
        this._light[1][1].specular = [1.00, 1.00, 1.00, 1.00]
        this._light[1][1].position = Point.new(4.0, 4.0 + 8.0, 8.0)

        // spot lights
        this._light[2][0] = new Light(LightType.SPOT)
        this._light[2][0].ambient = [0.10, 0.10, 0.10, 1.00]
        this._light[2][0].diffuse = [1.00, 1.00, 1.00, 1.00]
        this._light[2][0].specular = [1.00, 1.00, 1.00, 1.00]
        this._light[2][0].position = Point.new(4.0, 4.0 - 8.0, 8.0)
        this._light[2][0].direction = Vector.new(-1, -1, -1)
        this._light[2][0].exponent = 1
        this._light[2][0].angle = (0.125 * Math.PI)

        this._light[2][1] = new Light(LightType.SPOT)
        this._light[2][1].ambient = [0.10, 0.10, 0.10, 1.00]
        this._light[2][1].diffuse = [1.00, 1.00, 1.00, 1.00]
        this._light[2][1].specular = [1.00, 1.00, 1.00, 1.00]
        this._light[2][1].position = Point.new(4.0, 4.0 + 8.0, 8.0)
        this._light[2][1].direction = Vector.new(-1, -1, -1)
        this._light[2][1].exponent = 1
        this._light[2][1].angle = (0.125 * Math.PI)

        let copper: Material = new Material()
        copper.emissive = [0, 0, 0, 1]
        copper.ambient = [0.2295, 0.08825, 0.0275, 1]
        copper.diffuse = [0.5508, 0.2118, 0.066, 1]
        copper.specular = [0.580594, 0.223257, 0.0695701, 51.2]

        let gold: Material = new Material()
        gold.emissive = [0, 0, 0, 1]
        gold.ambient = [0.24725, 0.2245, 0.0645, 1]
        gold.diffuse = [0.34615, 0.3143, 0.0903, 1]
        gold.specular = [0.797357, 0.723991, 0.208006, 83.2]

        //let effectDV: LightDir
    }
}