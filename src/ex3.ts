import { IndexBuffer } from 'resources/IndexBuffer';
import { BufferUsage } from 'resources/BufferUsage';
import { RendererInput } from 'renderers/webgl_20/RendererInput';
import { TextureFormat } from 'resources/TextureFormat';
import { GL20 } from 'renderers/webgl_20/GL20';
import { GL20Renderer } from 'renderers/webgl_20/GL20Renderer';
import { VertexBufferAccessor } from 'resources/VertexBufferAccessor';
import { VertexFormat } from 'resources/VertexFormat';
import { AttributeUsage } from 'resources/AttributeUsage';
import { AttributeType } from 'resources/AttributeType';
import { VertexBuffer } from 'resources/VertexBuffer';
import { TriMesh } from 'display/TriMesh';
import { DefaultEffect } from 'effects/local/DefaultEffect';
import { VisualEffectInstance } from 'shaders/VisualEffectInstance';
import { CameraAndLightNodes } from 'examples/CameraAndLightNodes';
import { Camera } from 'display/Camera';

console.log('Hello EX3')

/*
// setup testing
let input: RendererInput = new RendererInput()
input.mContext = GL20.createContext('ex3-root')

let renderer:GL20Renderer = new GL20Renderer(input, 800, 600,
    TextureFormat.R8G8B8, TextureFormat.D24S8, 4)
renderer.setDepthRange(0.01, 1)

renderer.clearColor = [0, 0.3, 0.5, 1]
renderer.clearBuffers()

renderer.clearColor = [0.3, 1, 0.2, 1]
renderer.clearColorBufferRect(50, 100, 200, 120)

renderer.resize(700, 400)
renderer.reverseCullOrder = true

renderer.camera = new Camera(true)

let vFormat: VertexFormat = VertexFormat.create(3,
    AttributeUsage.POSITION, AttributeType.FLOAT3, 0,
    AttributeUsage.NORMAL, AttributeType.FLOAT3, 0,
    AttributeUsage.TEXCOORD, AttributeType.FLOAT3, 1)

console.log(`Stride: ${vFormat.stride}`)

let vBuffer: VertexBuffer = new VertexBuffer(4, vFormat.stride, BufferUsage.STATIC)
let iBuffer: IndexBuffer = new IndexBuffer(6, 2, BufferUsage.STATIC)

let vba: VertexBufferAccessor = new VertexBufferAccessor(vFormat, vBuffer)
vba.setPositionAt(0, [-1, -1, 0])
vba.setPositionAt(1, [ 1, -1, 0])
vba.setPositionAt(2, [ 1,  1, 0])
vba.setPositionAt(3, [-1,  1, 0])

vba.setNormalAt(0, [0, 0, 1])
vba.setNormalAt(1, [0, 0, 2])
vba.setNormalAt(2, [0, 0, 3])
vba.setNormalAt(3, [0, 0, 4])

vba.setTCoordAt(1, 0, [0, 4, 0])
vba.setTCoordAt(1, 1, [5, 0, 0])
vba.setTCoordAt(1, 2, [0, 0, 6])
vba.setTCoordAt(1, 3, [0, 7, 0])

iBuffer.data.position = 0
iBuffer.data.writeInt16(0)
iBuffer.data.writeInt16(1)
iBuffer.data.writeInt16(3)
iBuffer.data.writeInt16(1)
iBuffer.data.writeInt16(2)
iBuffer.data.writeInt16(3)

console.log(`Viewport: ${renderer.viewport}`)
console.log(`Width: ${renderer.width}`)
console.log(`Height: ${renderer.height}`)
console.log(`Depth range: ${renderer.depthRange}`)

console.log(`Position 0: ${vba.getPositionAt(0)}`)
console.log(`Position 1: ${vba.getPositionAt(1)}`)
console.log(`Position 2: ${vba.getPositionAt(2)}`)
console.log(`Position 3: ${vba.getPositionAt(3)}`)

console.log(`Normal 0: ${vba.getNormalAt(0)}`)
console.log(`Normal 1: ${vba.getNormalAt(1)}`)
console.log(`Normal 2: ${vba.getNormalAt(2)}`)
console.log(`Normal 3: ${vba.getNormalAt(3)}`)

console.log(`TCoord 0: ${vba.getTCoordAt(1, 0)}`)
console.log(`TCoord 1: ${vba.getTCoordAt(1, 1)}`)
console.log(`TCoord 2: ${vba.getTCoordAt(1, 2)}`)
console.log(`TCoord 3: ${vba.getTCoordAt(1, 3)}`)


let mesh: TriMesh = new TriMesh(vFormat, vBuffer, iBuffer)
console.log("numTriangles: " + mesh.numTriangles)
let effectInstance: VisualEffectInstance = new DefaultEffect().createInstance()
renderer.draw(mesh, effectInstance)
*/

/*
let example: CameraAndLightNodes = new CameraAndLightNodes()
example.onInitialize()
*/