import { TriMesh } from "../../display/TriMesh";
import { Material } from "../../display/Material";
import { Texture2D } from "../../resources/Texture2D";
import { Max3dsParser } from "./Max3dsParser";
import { Camera } from "../../display/Camera";
import { Light } from "../../display/Light";
import { ByteArray } from "../../core/ByteArray";
import { Scene3ds } from "./types/Scene3ds";
import { Camera3ds } from "./types/Camera3ds";
import { Vector } from "geom/Vector";
import { Light3ds } from "./types/Light3ds";
import { Material3ds } from "./types/Material3ds";
import { Color3ds } from "./types/Color3ds";
import { Mesh3ds } from "./types/Mesh3ds";
import { VertexFormat } from "../../resources/VertexFormat";
import { AttributeUsage } from "../../resources/AttributeUsage";
import { AttributeType } from "../../resources/AttributeType";
import { VertexBuffer } from "../../resources/VertexBuffer";
import { BufferUsage } from "../../resources/BufferUsage";
import { IndexBuffer } from "../../resources/IndexBuffer";
import { VertexBufferAccessor } from "../../resources/VertexBufferAccessor";
import { Vertex3ds } from "./types/Vertex3ds";
import { TexCoords3ds } from "./types/TexCoords3ds";
import { Face3ds } from "./types/Face3ds";
import { UpdateType } from "../../display/UpdateType";

export class ParserAdapter3ds
{
    private _parser: Max3dsParser

    private _textureList: Texture2D[]
    private _materialList: Material[]

    private _meshList: TriMesh[]
    private _cameraList: Camera[]
    private _lightList: Light[]

    private _useMaterials: boolean = true
    private _useTexCoords: boolean
    private _useNormals: boolean
    private _useBinormals: boolean
    private _useTangents: boolean

    public constructor(data: ByteArray, 
        useTexCoords: boolean = true, 
        useNormals: boolean = true, 
        useBinormals: boolean = true, 
        useTangents: boolean = true)
    {
        this._useTexCoords = useTexCoords
        this._useNormals = useNormals
        this._useBinormals = useBinormals
        this._useTangents = useTangents
        this._parser = new Max3dsParser(data)
    }

    public parse(): void
    {
        this._parser.parse()

        this.parseCameras()
        this.parseLights()
        this.parseMaterials()
        this.parseMeshes()
    }

    public getTextureAt(index: number): Texture2D
    {
        if( 0 <= index && index < this._textureList.length)
        {
            return this._textureList[index]
        }
        else
        {
            throw new RangeError("Out of range")
        }
    }

    public get textures(): Texture2D[]
    {
        return this._textureList
    }

    public getCameraAt(index: number): Camera
    {
        if( 0 <= index && index < this._cameraList.length)
        {
            return this._cameraList[index]
        }
        else
        {
            throw new RangeError("Out of range")
        }
    }

    public get cameras(): Camera[]
    {
        return this._cameraList
    }

    public getMaterialAt(index: number): Material
    {
        if( 0 <= index && index < this._materialList.length)
        {
            return this._materialList[index]
        }
        else
        {
            throw new RangeError("Out of range")
        }
    }

    public get materials(): Material[]
    {
        return this._materialList
    }

    public getLightAt(index: number): Light
    {
        if( 0 <= index && index < this._lightList.length)
        {
            return this._lightList[index]
        }
        else
        {
            throw new RangeError("Out of range")
        }
    }

    public get lights(): Light[]
    {
        return this._lightList
    }

    public getMeshtAt(index: number): TriMesh
    {
        if( 0 <= index && index < this._meshList.length)
        {
            return this._meshList[index]
        }
        else
        {
            throw new RangeError("Out of range")
        }
    }

    public get meshes(): TriMesh[]
    {
        return this._meshList
    }



    private parseMeshes()
    {
        this._meshList = []
        let scene3ds: Scene3ds = this._parser.scene

        for(let i: number = 0; i < scene3ds.meshList.length; ++i)
        {
            let mesh3ds: Mesh3ds = scene3ds.getMeshAt(i)

            // TODO: Add materials
            let numAttributes: number = 0
            let offset: number = 0
            let attributeIndex: number = 0

            let hasPosition: boolean = mesh3ds.vertices.length > 0
            let hasTexCoords: boolean = mesh3ds.texCoords.length > 0

            hasPosition === true ? numAttributes++ : null
            hasTexCoords === true ? numAttributes++ : null

            this._useBinormals === true ? numAttributes++ : null
            this._useTangents === true ? numAttributes++ : null

            let vFormat: VertexFormat = new VertexFormat(numAttributes + 1)
            if(hasPosition)
            {
                vFormat.setAttribute(attributeIndex++, 0, offset, AttributeType.FLOAT3, AttributeUsage.POSITION, 0)
                offset += 12
            }

            if(this._useTexCoords && !hasTexCoords)
            {
                throw new Error("Texture coordinates are not available")
            }

            if(hasTexCoords && this._useTexCoords)
            {
                vFormat.setAttribute(attributeIndex++, 0, offset, AttributeType.FLOAT2, AttributeUsage.TEXCOORD, 0)
                offset += 8
            }

            if(this._useNormals)
            {
                vFormat.setAttribute(attributeIndex++, 0, offset, AttributeType.FLOAT3, AttributeUsage.NORMAL, 0)
                offset += 12
            }

            if(this._useBinormals)
            {
                vFormat.setAttribute(attributeIndex++, 0, offset, AttributeType.FLOAT3, AttributeUsage.BINORMAL, 0)
                offset += 12
            }

            if(this._useTangents)
            {
                vFormat.setAttribute(attributeIndex++, 0, offset, AttributeType.FLOAT3, AttributeUsage.TANGENT, 0)
                offset += 12
            }

            // TODO: See code

            vFormat.stride = offset

            let vBuffer: VertexBuffer = new VertexBuffer(mesh3ds.numVertices, vFormat.stride, BufferUsage.STATIC)
            let iBuffer: IndexBuffer = new IndexBuffer(mesh3ds.numIndices, 2, BufferUsage.STATIC)
            let vba: VertexBufferAccessor = new VertexBufferAccessor(vFormat, vBuffer)

            for(let vIndex: number = 0; vIndex < mesh3ds.numVertices; ++vIndex)
            {
                if(hasPosition)
                {
                    let vertex3ds: Vertex3ds = mesh3ds.vertices[vIndex]
                    vba.setPositionAt(vIndex, [vertex3ds.x, vertex3ds.y, vertex3ds.z])
                }
                if(hasTexCoords)
                {
                    let tCoord: TexCoords3ds = mesh3ds.texCoords[vIndex]
                    vba.setTCoordAt(0, vIndex, [tCoord.u, 1 - tCoord.v])
                }
            }

            let iPointer: number = 0
            for(let iIndex: number = 0; iIndex < mesh3ds.numFaces; ++iIndex)
            {
                let face: Face3ds = mesh3ds.faces[iIndex]
                iBuffer.setIndexAt(iPointer++, face.p0)
                iBuffer.setIndexAt(iPointer++, face.p1)
                iBuffer.setIndexAt(iPointer++, face.p2)
            }

            let mesh: TriMesh = new TriMesh(vFormat, vBuffer, iBuffer)
            if(this._useNormals)
            {
                mesh.updateModelSpace(UpdateType.NORMALS)
            }

            if( (this._useBinormals || this._useTangents) && this._useTexCoords)
            {
                mesh.updateModelSpace(UpdateType.USE_TCOORD_CHANNEL)
            }
            else if(this._useBinormals || this._useTangents)
            {
                mesh.updateModelSpace(UpdateType.USE_GEOMETRY)
            }

            this._meshList.push(mesh)
        }
    }

    private parseCameras()
    {
        this._cameraList = []

        let scene3ds: Scene3ds = this._parser.scene
        for(let i: number = 0; i < scene3ds.numCameras; ++i)
        {
            let camera3ds: Camera3ds = scene3ds.getCameraAt(i)
            let cam: Camera = new Camera()

            cam.position.set(camera3ds.position.x,
                camera3ds.position.y,
                camera3ds.position.z)

            let dVector: Vector = Vector.new(camera3ds.target.x,
                camera3ds.target.y,
                camera3ds.target.z)
            let uVector: Vector = Vector.UNIT_Y
            let rVector: Vector = dVector.cross(uVector)

            cam.setAxes(dVector, uVector, rVector)

            // TODO: roll the camera
            // TODO: create lookAt

            this._cameraList.push(cam)
        }
    }

    private parseLights()
    {
        this._lightList = []
        
        let scene3ds: Scene3ds = this._parser.scene
        for(let i: number = 0; i < scene3ds.lightList.length; ++i)
        {
            let light3ds: Light3ds = scene3ds.getLightAt(i)

            let light: Light = new Light()
            light.position.set(light3ds.position.x,
                light3ds.position.y,
                light3ds.position.z)
            
            // TODO: create looAt

            light.direction.set(light3ds.target.x,
                light3ds.target.y,
                light3ds.target.z)
            
            light.diffuse = [light3ds.color.red,
                light3ds.color.green,
                light3ds.color.blue
            ]

            this._lightList.push(light)
        }
    }

    private parseMaterials()
    {
        this._materialList = []

        let scene3ds: Scene3ds = this._parser.scene
        
        // materials
        let matPrev: Material
        for(let i: number = 0; i < scene3ds.numMaterials; ++i)
        {
            let mat3ds: Material3ds = scene3ds.getMaterialAt(i)
            let ambient: Color3ds = mat3ds.ambient
            let diffuse: Color3ds = mat3ds.diffuse
            let specular: Color3ds = mat3ds.specular

            let mat: Material = new Material()
            mat.ambient = [ambient.red, ambient.green, ambient.blue]
            mat.diffuse = [diffuse.red, diffuse.green, diffuse.blue]
            mat.specular = [specular.red, specular.green, specular.blue]

            // TODO: Set material name
            if(mat3ds.mapName.length > 0)
            {
                // TODO: load the texture
            }

            matPrev = null
            this._materialList.push(mat)
        }
    }
}
