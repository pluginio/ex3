import { WindowApplication3 } from "../application/WindowApplication3";
import { Node } from "../display/Node";
import { WireState } from "../shaders/states/WireState";
import { CameraNode } from "../display/CameraNode";
import { Light } from "../display/Light";
import { Culler } from "../display/Culler";
import { Point } from "../geom/Point";
import { Vector } from "../geom/Vector";
import { TriMesh } from "../display/TriMesh";
import { VertexFormat } from "../resources/VertexFormat";
import { AttributeUsage } from "../resources/AttributeUsage";
import { AttributeType } from "../resources/AttributeType";
import { VertexBuffer } from "../resources/VertexBuffer";
import { VertexBufferAccessor } from "../resources/VertexBufferAccessor";
import { IndexBuffer } from "../resources/IndexBuffer";
import { LightType } from "../display/LightType";
import { Material } from "../display/Material";
import { DefaultEffect } from "../effects/local/DefaultEffect";
import { VisualEffectInstance } from "../shaders/VisualEffectInstance";
import { GL20Renderer } from "../renderers/webgl_20/GL20Renderer";
import { RendererInput } from "../renderers/webgl_20/RendererInput";
import { GL20 } from "../renderers/webgl_20/GL20";
import { TextureFormat } from "../resources/TextureFormat";

export class CameraAndLightNodes extends WindowApplication3
{
    protected _scene: Node
    protected _wireState: WireState
    protected _cNode: CameraNode
    //protected _screenCamera: Camera
    protected _adjustableLight0: Light
    protected _adjustableLight1: Light
    protected _culler: Culler

    constructor()
    {
        super('CameraAndLightNodes', 0, 0,
        640, 480, [0.5, 0.5, 1, 1])

        let input: RendererInput = new RendererInput()
        input.mContext = GL20.createContext('ex3-root')
        this._renderer = new GL20Renderer(input, 800, 600,
            TextureFormat.R8G8B8, TextureFormat.D24S8, 4)

        
        this._culler = new Culler(this._camera)
        
    }

    public onInitialize(): boolean
    {
        if(!super.onInitialize())
        {
            return false
        }

        this._camera.setFrustumFov(60, this.aspectRatio, 1, 1000)
        let camPosition: Point = Point.new(0, -100, 5)
        let camDVector: Vector = Vector.new(0, 1, 0)
        let camUVector: Vector = Vector.new(0, 0, 1)
        let camRVector: Vector = camDVector.cross(camUVector)
        this._camera.setFrame(camPosition, camDVector, camUVector, camRVector)

        this.createScene()

        this._scene.update()

        this._culler.camera = this._camera
        this._culler.computeVisibleSet(this._scene)

        this.initializeCameraMotion(0.01, 0.001)
        return true
    }

    public onTerminate(): void
    {
        this._scene.dispose()
        this._cNode.dispose()
        //this._screenCamera.dispose()
        this._adjustableLight0.dispose()
        this._adjustableLight1.dispose()
        
        this._wireState = null
        this._scene = null
        this._cNode = null
        //this._screenCamera = null
        this._adjustableLight0 = null
        this._adjustableLight1 = null
    }

    protected createScene(): void
    {
        this._scene = new Node()
        this._wireState = new WireState()
        this._renderer.overrideWireState = this._wireState

        let ground: TriMesh = this.createGround()
        this._scene.attachChild(ground)
        this._cNode = new CameraNode(this._camera)
        this._scene.attachChild(this._cNode)
    }

    protected createGround(): TriMesh
    {
        let vformat: VertexFormat = VertexFormat.create(3,
            AttributeUsage.POSITION, AttributeType.FLOAT3, 0,
            AttributeUsage.NORMAL, AttributeType.FLOAT3, 0,
            AttributeUsage.TEXCOORD, AttributeType.FLOAT2, 0)
        
        let vstride: number = vformat.stride

        let vbuffer: VertexBuffer = new VertexBuffer(4, vstride)
        let vba: VertexBufferAccessor = new VertexBufferAccessor(vformat, vbuffer)

        vba.setPositionAt(0, [-100, -100, 0])
        vba.setPositionAt(1, [ 100, -100, 0])
        vba.setPositionAt(2, [ 100,  100, 0])
        vba.setPositionAt(3, [-100,  100, 0])

        vba.setNormalAt(0, [0, 0, 1])
        vba.setNormalAt(1, [0, 0, 1])
        vba.setNormalAt(2, [0, 0, 1])
        vba.setNormalAt(3, [0, 0, 1])

        vba.setTCoordAt(0, 0, [0, 0])
        vba.setTCoordAt(0, 1, [8, 0])
        vba.setTCoordAt(0, 2, [8, 8])
        vba.setTCoordAt(0, 3, [0, 8])

        let ibuffer: IndexBuffer = new IndexBuffer(6, 2)
        ibuffer.data.position = 0
        ibuffer.data.writeInt16(0)
        ibuffer.data.writeInt16(1)
        ibuffer.data.writeInt16(2)
        ibuffer.data.writeInt16(0)
        ibuffer.data.writeInt16(2)
        ibuffer.data.writeInt16(3)

        let mesh: TriMesh = new TriMesh(vformat, vbuffer, ibuffer)

        let light: Light = new Light(LightType.AMBIENT)
        light.ambient = [0.2, 0.2, 0.2, 1]

        let material: Material = new Material()
        material.ambient = [0.2, 0.2, 0.2, 1]

        let effectInstance: VisualEffectInstance = new DefaultEffect().createInstance()

        mesh.effectInstance = effectInstance

        return mesh
    }

    public onIdle(): void
    {
        this.measureTime()

        if(this.moveCamera())
        {
            this._culler.computeVisibleSet(this._scene)
        }

        if(this._renderer.preDraw())
        {
            this._renderer.clearBuffers()
            //this._renderer.camera = this._screenCamera
            this._renderer.camera = this._camera
            this._renderer.drawVisibleSet(this._culler.visibleSet)

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
            case '+':
            case '=':
                this._adjustableLight0.intensity += 0.1
                this._adjustableLight1.intensity += 0.1
                return true
            case '-':
            case '_':
                if(this._adjustableLight0.intensity >= 0.1)
                {
                    this._adjustableLight0.intensity -= 0.1
                }
                if(this._adjustableLight1.intensity >= 0.1)
                {
                    this._adjustableLight1.intensity -= 0.1
                }
                return true
        }
        return false
    }
}