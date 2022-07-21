import { RendererInput } from './renderers/webgl_20/RendererInput';
import { TextureFormat } from './resources/TextureFormat';
import { GL20 } from './renderers/webgl_20/GL20';
import { GL20Renderer } from './renderers/webgl_20/GL20Renderer';
import { DefaultEffect } from './effects/local/DefaultEffect';
import { Camera } from './display/Camera';
import { Vector } from './geom/Vector';
import { Point } from './geom/Point';
import { SrcBlendMode } from './shaders/SrcBlendMode';
import { DstBlendMode } from './shaders/DstBlendMode';
import { CameraNode } from './display/CameraNode';
import { Node } from './display/Node';
import { ParserAdapter3ds } from 'parsers/max3ds/ParserAdapter3ds';
import { ByteArray } from './core/ByteArray';
import { AlphaState } from 'shaders/states/AlphaState';
import { CullState } from 'shaders/states/CullState';
import { VertexShader } from 'shaders/VertexShader';
import { VertexShaderProfile } from 'shaders/VertexShaderProfile';
import { PixelShader } from 'shaders/PixelShader';

console.log('Hello EX3')
let fileSelect: HTMLInputElement = document?.getElementById('file-select') as HTMLInputElement

fileSelect?.addEventListener('change', async (e) => {
    let files = (e.target as HTMLInputElement).files
    console.log("Files", files)

    let file = files[0]

    try
    {
        let buffer = await file.arrayBuffer()
        console.log("Length: ", buffer.byteLength)

        let data: ByteArray = ByteArray.fromArrayBuffer(buffer)
        console.log(data.length)
        
        let adapter3ds: ParserAdapter3ds = new ParserAdapter3ds(data, false, false, false, false)
        adapter3ds.parse()

        console.log("Index buffer length: ", adapter3ds.getMeshtAt(0).indexBuffer.numElements)
        console.log("Vertex buffer length: ", adapter3ds.getMeshtAt(0).vertexBuffer.numElements)
        console.log("Vertex format - Mesh 0 :", adapter3ds.getMeshtAt(0).vertexFormat)
    
        const input = new RendererInput()
        input.mContext = GL20.createContext('ex3-root')
        let gl = GL20.gl
        
        let renderer = new GL20Renderer(input, 800, 600,
        TextureFormat.R8G8B8, TextureFormat.D24S8, 4)

        renderer.setDepthRange(0.01, 1000)
        renderer.clearColor =[0.5, 0.6, 0.7, 1.0]
        renderer.clearBuffers()
        
        let mesh = adapter3ds.getMeshtAt(0)
        mesh.effectInstance = new DefaultEffect().createInstance()
        
        // TODO: Move the shader program code to the pass
        let vShader = gl.createShader(gl.VERTEX_SHADER)
        let fShader = gl.createShader(gl.FRAGMENT_SHADER)
        
        gl.shaderSource(vShader, mesh.effectInstance.getPass(0).vertexShader.getProgram(1))
        gl.shaderSource(fShader, mesh.effectInstance.getPass(0).pixelShader.getProgram(1))
        
        gl.compileShader(vShader)
        gl.compileShader(fShader)
        
        let program = gl.createProgram()
        gl.attachShader(program, vShader)
        gl.attachShader(program, fShader)
        gl.linkProgram(program)
        
        if(!gl.getProgramParameter( program, gl.LINK_STATUS) )
        {
            let info = gl.getProgramInfoLog(program)
            throw 'Could not compile WebGL program. \n' + info
        }
        
        gl.useProgram(program)
        // =======
        
        
        
        
        
        let camera = new Camera()
        camera.setFrustumFov(90, 800/600, 0.1, 1000)
        let camPosition = Point.new(-0.5, 0, 0)
        let camDVector = Vector.UNIT_Z
        let camUVector = Vector.UNIT_Y_NEG
        let camRVector = camDVector.cross(camUVector)
        camera.setFrame(camPosition, camDVector, camUVector, camRVector)
        renderer.camera = camera
        
        let scene = new Node()
        let cameraNode = new CameraNode(camera)
        
        console.log(`Renderer viewport: ${renderer.viewport}`)
        console.log("Camera position: ", camera.position)
        console.log("Camera frustum: ", camera.frustum)
        
        console.log("vFormat numAttributes: ", mesh.vertexFormat.numAttributes)
        for(let i = 0; i < mesh.vertexFormat.numAttributes; ++i)
        {
            let attribute = mesh.vertexFormat.attributeAt(i)
            console.log("Attribute type: ", attribute.type)
        }
        
        console.log("vBuffer elements: ",mesh.vertexBuffer.numElements)
        console.log("iBuffer elements: ", mesh.indexBuffer.numElements)
        
        scene.attachChild(cameraNode)
        scene.attachChild(mesh)
        
        console.log("Mesh worldMatrix: ", mesh.worldTransform.matrix)
        
        scene.update(0, false)

        console.log("world bound", mesh.worldBound)
        
        let alphaState = new AlphaState()
        alphaState.constantColor = [0, 0, 0, .1]
        alphaState.srcBlend = SrcBlendMode.DST_COLOR
        alphaState.dstBlend = DstBlendMode.CONSTANT_ALPHA
        alphaState.blendEnabled = true

        let cullState = new CullState()
        cullState.enabled = true
        cullState.ccwOrder = true

        mesh.effectInstance.getPass(0).alphaState = alphaState
        mesh.effectInstance.getPass(0).cullState = cullState
        
        console.log("Updated alpha state: ", mesh.effectInstance.getPass(0).alphaState)
        
        renderer.draw(mesh, mesh.effectInstance)


        /*
        let culler = new Culler(camera)
        culler.computeVisibleSet(scene)

        renderer.clearColor = [1, .3, .6, 1]
        renderer.clearBuffers()
        renderer.drawVisibleSet(culler.visibleSet)
        renderer.postDraw()         
        renderer.displayColorBuffer()  override

        console.log("Cull count: ", culler.visibleSet)
        renderer.draw(mesh, new DefaultEffect().createInstance())

        console.log("Scene: ", scene)
        console.log("Camera: ", camera)
        console.log("Mesh: ", mesh)
        console.log("Culler: ", culler)

        console.log("Mesh modelBound", mesh.modelBound)
        console.log("Mesh worldBound", mesh.worldBound)
        */
    }
    catch(e)
    {
        console.log("Something went wrong: ", e.message)
    }
}, false)
