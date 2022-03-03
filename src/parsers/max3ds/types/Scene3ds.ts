import { ByteArray } from "core/ByteArray"
import { Parser3dsError } from "../errors/Parser3dsError"
import { Camera3ds } from "./Camera3ds"
import { Color3ds } from "./Color3ds"
import { Decode3ds } from "./Decode3ds"
import { Face3ds } from "./Face3ds"
import { FaceMaterial3ds } from "./FaceMaterial3ds"
import { HideKey3ds } from "./HideKey3ds"
import { HideKeyTrack3ds } from "./HideKeyTrack3ds"
import { Light3ds } from "./Light3ds"
import { Material3ds } from "./Material3ds"
import { Mesh3ds } from "./Mesh3ds"
import { MorphKey3ds } from "./MorphKey3ds"
import { MorphTrack3ds } from "./MorphTrack3ds"
import { PKey3ds } from "./PKey3ds"
import { PTrack3ds } from "./PTrack3ds"
import { RotationKey3ds } from "./RotationKey3ds"
import { RotationTrack3ds } from "./RotationTrack3ds"
import { SplineKey3ds } from "./SplineKey3ds"
import { TexCoords3ds } from "./TexCoords3ds"
import { Track3ds } from "./Track3ds"
import { Vertex3ds } from "./Vertex3ds"
import { XyzKey3ds } from "./XyzKey3ds"
import { XyzTrack3ds } from "./XyzTrack3ds"

class Head
{
	public id: number = 0;
	public length: number = 0;
	
	public constructor( id: number, length: number )
	{
		this.id = id;
		this.length = length;
	}
}

export class Scene3ds
{
    public static CHUNK_COL_RGB: number = 0x0010;
    public static CHUNK_COL_TRU: number = 0x0011;
    public static CHUNK_COL_LINRGB: number = 0x0012;
    public static CHUNK_COL_LINTRU: number = 0x0013;
    
    public static CHUNK_PERCENTW: number = 0x0030;		// int2   percentage
    public static CHUNK_PERCENTF: number = 0x0031;		// float4  percentage
    
    public static CHUNK_M3DMAGIC: number = 0x4D4D;
    public static CHUNK_MDATA: number = 0x3D3D;
    public static CHUNK_MAT_ENTRY: number = 0xAFFF;
    public static CHUNK_MAT_NAME: number = 0xA000;
    public static CHUNK_MAT_AMBIENT: number = 0xA010;
    public static CHUNK_MAT_DIFFUSE: number = 0xA020;
    public static CHUNK_MAT_SPECULAR: number = 0xA030;
    public static CHUNK_MAT_SHININESS: number = 0xA041;
    public static CHUNK_MAT_TRANSPARENCY: number = 0xA050;
    public static CHUNK_MAT_MAP: number = 0xA200;
    public static CHUNK_MAT_MAPNAME: number = 0xA300;
    public static CHUNK_NAMED_OBJECT: number = 0x4000;
    public static CHUNK_N_TRI_OBJECT: number = 0x4100;
    public static CHUNK_POINT_ARRAY: number = 0x4110;
    public static CHUNK_TEX_VERTS: number = 0x4140;
    public static CHUNK_MESH_TEXTURE_INFO: number = 0x4170;
    public static CHUNK_MESH_MATRIX: number = 0x4160;
    public static CHUNK_MESH_COLOR: number = 0x4165;
    public static CHUNK_FACE_ARRAY: number = 0x4120;
    public static CHUNK_MSH_MAT_GROUP: number = 0x4130;
    public static CHUNK_SMOOTH_GROUP: number = 0x4150;
    public static CHUNK_N_LIGHT: number = 0x4600;
    public static CHUNK_LIT_SPOT: number = 0x4610;
    public static CHUNK_LIT_OFF: number = 0x4620;
    public static CHUNK_LIT_ATTENUATE: number = 0x4625;
    public static CHUNK_LIT_RAYSHAD: number = 0x4627;
    public static CHUNK_LIT_SHADOWED: number = 0x4630;
    public static CHUNK_LIT_LOCAL_SHADOW: number = 0x4640;
    public static CHUNK_LIT_LOCAL_SHADOW2: number = 0x4641;
    public static CHUNK_LIT_SEE_CONE: number = 0x4650;
    public static CHUNK_LIT_SPOT_RECTANGULAR: number = 0x4651;
    public static CHUNK_LIT_SPOT_OVERSHOOT: number = 0x4652;
    public static CHUNK_LIT_SPOT_PROJECTOR: number = 0x4653;
    public static CHUNK_LIT_SPOT_RANGE: number = 0x4655;
    public static CHUNK_LIT_SPOT_ROLL: number = 0x4656;
    public static CHUNK_LIT_SPOT_ASPECT: number = 0x4657;
    public static CHUNK_LIT_RAY_BIAS: number = 0x4658;
    public static CHUNK_LIT_INNER_RANGE: number = 0x4659;
    public static CHUNK_LIT_OUTER_RANGE: number = 0x465A;
    public static CHUNK_LIT_MULTIPLIER: number = 0x465B;
    public static CHUNK_N_CAMERA: number = 0x4700;
    public static CHUNK_CAM_SEE_CONE: number = 0x4710;
    public static CHUNK_CAM_RANGES: number = 0x4720;
    public static CHUNK_KFDATA: number = 0xB000;
    public static CHUNK_KFSEG: number = 0xB008;
    public static CHUNK_OBJECT_NODE_TAG: number = 0xB002;
    public static CHUNK_NODE_ID: number = 0xB030;
    public static CHUNK_NODE_HDR: number = 0xB010;
    public static CHUNK_PIVOT: number = 0xB013;
    public static CHUNK_POS_TRACK_TAG: number = 0xB020;
    public static CHUNK_ROT_TRACK_TAG: number = 0xB021;
    public static CHUNK_SCL_TRACK_TAG: number = 0xB022;
    public static CHUNK_MORPH_TRACK_TAG: number = 0xB026;
    public static CHUNK_HIDE_TRACK_TAG: number = 0xB029;
    public static CHUNK_TARGET_NODE_TAG: number = 0xB004;
    public static CHUNK_CAMERA_NODE_TAG: number = 0xB003;
    public static CHUNK_FOV_TRACK_TAG: number = 0xB023;
    public static CHUNK_ROLL_TRACK_TAG: number = 0xB024;
    // public static CHUNK_AMBIENT_NODE_TAG: number = 0xB001;
    
    public static DECODE_ALL: number = 3
    public static DECODE_USED_PARAMS: number = 2
    public static DECODE_USED_PARAMS_AND_CHUNKS: number = 1

    private _meshList: Mesh3ds[] = []
    private _cameraList: Camera3ds[] = []
    private _materialList: Material3ds[] = []
    private _lightList: Light3ds[] = []
    private _startFrame: number = 0
    private _endFrame: number = 0

    private _fileData: ByteArray
    private _decode: Decode3ds

    public get meshList(): Mesh3ds[]
    {
        return this._meshList
    }

    public get cameraList(): Camera3ds[]
    {
        return this._cameraList
    }

    public get materialList(): Material3ds[]
    {
        return this._materialList
    }

    public get lightList(): Light3ds[]
    {
        return this._lightList
    }

    public get startFrame(): number
    {
        return this._startFrame
    }

    public endFrame(): number
    {
        return this._endFrame
    }

    public constructor(data: ByteArray)
    {
        this._fileData = data
        this._fileData.position = 0

        try
        {
            this.read3ds()
        }
        catch(e)
        {
            throw new Parser3dsError("3DS parser: " + e.message)
        }
        finally
        {
            this._fileData = null
            this._decode = null
        }
    }

    public addMesh( m: Mesh3ds ): void
    {
        this._meshList.push( m );
    }
    
    public addCamera( c: Camera3ds ): void
    {
        this._cameraList.push( c );
    }
    
    public addMaterial( m: Material3ds ): void
    {
        this._materialList.push( m );
    }
    
    public addLight( l: Light3ds ): void
    {
        this._lightList.push( l );
    }
    
    public get numMeshes(): number
    {
        return this._meshList.length;
    }
    
    public getMeshAt( index: number ): Mesh3ds
    {
        return this._meshList[ index ];
    }
    
    public get numCameras(): number
    {
        return this._cameraList.length;
    }
    
    public getCameraAt( index: number ): Camera3ds
    {
        return this._cameraList[ index ];
    }
    
    public get numMaterials(): number
    {
        return this._materialList.length;
    }
    
    public getMaterialAt( index: number ): Material3ds
    {
        return this._materialList[ index ];
    }
    
    public get numLights(): number
    {
        return this._lightList.length;
    }
    
    public getLightAt( index: number ): Light3ds
    {
        return this._lightList[ index ];
    }


    private skipBytes(n: number): number
    {
        if ( n < 0)
        {
            throw new Parser3dsError( "Negative chunk size! File is probably corrupt." );
        }
        else if ( this._fileData.position + n > this._fileData.length )
        {
            throw new Parser3dsError( "Read out of bounds! File is probably corrupt." );
        }
        this._fileData.position += n;
        return n;
    }

    private skipChunk( chunkLength: number ): void
    {
        if ( this._decode )
        {
            this._decode.enter();
        }
        this.skipBytes( chunkLength );
        if ( this._decode )
        {
            this._decode.exit();
        }
    }

    private read_HEAD(): Head
    {
        let id: number = this._fileData.readUint16();
        let length: number = this._fileData.readInt32();
        
        if (this._decode)
        {
            this._decode.printHead( id, length );
        }
        
        return new Head( id, length );
    }

    private read_NAME(length: number = 32): string
    {
        let str: string = "";
        let terminated: boolean = false;
        let n: number = 0;
        
        let ch: number;
        
        for (let i: number = 0; i < length; ++i )
        {
            ch = this._fileData.readInt8();
            if ( ch == 0 )
            {
                terminated = true;
                break;
            }
            else
            {
                str += String.fromCharCode( ch );
            }
        }
        
        if ( terminated == false )
        {
            throw new Parser3dsError( "Name not terminated! File is probably corrupt." );
        }
        
        if ( this._decode )
        {
            this._decode.enter();
            this._decode.println( "Name: " + str + "." );
            this._decode.exit();
        }
        
        return str;
    }

    private read3ds(): void
    {
        let head: Head = this.read_HEAD();
        
        if ( head.id != Decode3ds.CHUNK_M3DMAGIC )
        {
            throw new Parser3dsError( "Bad signature! This is not a 3D Studio R4 .3ds file." );
        }
        
        this.read_M3DMAGIC( head.length - 6 );
    }

    private read_M3DMAGIC( chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        if ( this._decode )
        {
            this._decode.enter();
        }
        
        while ( this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Decode3ds.CHUNK_MDATA:
                        this.read_MDATA( head.length - 6 );
                    break;
                case Decode3ds.CHUNK_KFDATA:
                        this.read_KFDATA( head.length - 6 );
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if ( this._decode )
        {
           this. _decode.exit();
        }
    }

    private read_MDATA( chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        if ( this._decode )
        {
            this._decode.enter();
        }
        
        while (this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Decode3ds.CHUNK_NAMED_OBJECT:
                        this.read_NAMED_OBJECT( head.length - 6 );
                    break;
                case Decode3ds.CHUNK_MAT_ENTRY:
                        this.read_MAT_ENTRY( head.length - 6 );
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if (this._decode)
        {
            this._decode.exit();
        }
    }

    private readColor( chunkLength: number ): Color3ds
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        if (this._decode )
        {
            this._decode.enter();
        }
        
        let lvColor: Color3ds = new Color3ds();
        
        while(this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            
            switch(head.id)
            {
                case Scene3ds.CHUNK_COL_RGB:
                        lvColor = this.readRGBColor();
                    break;
                case Scene3ds.CHUNK_COL_TRU:
                        lvColor = this.readTrueColor();
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if (this._decode)
        {
            this._decode.exit();
        }
        
        return lvColor;
    }

    private readPercentage( chunkLength: number ): number
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        if (this._decode)
        {
            this._decode.enter();
        }
        
        let val: number = 0;
        
        while (this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch(  head.id )
            {
                case Scene3ds.CHUNK_PERCENTW:
                        let trans: number = this._fileData.readUint16();
                        val = ( trans / 100 );
                    break;
                case Scene3ds.CHUNK_PERCENTF:
                        val = this._fileData.readFloat32()
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if (this._decode )
        {
            this._decode.exit();
        }
        
        return val;
    }

    private read_MAT_ENTRY( chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        let mat: Material3ds = new Material3ds();
        this.addMaterial( mat );
        
        if (this._decode )
        {
            this._decode.enter();
        }
        
        while (this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Scene3ds.CHUNK_MAT_NAME:
                        mat.name = this.read_NAME();
                    break;
                case Scene3ds.CHUNK_MAT_AMBIENT:
                        mat.ambient = this.readColor( head.length - 6 );
                    break;
                case Scene3ds.CHUNK_MAT_SPECULAR:
                        mat.specular = this.readColor( head.length - 6 );
                    break;
                case Scene3ds.CHUNK_MAT_DIFFUSE:
                        mat.diffuse = this.readColor( head.length - 6 );
                    break;
                case Scene3ds.CHUNK_MAT_MAPNAME:
                        mat.mapName = this.read_NAME();
                    break;
                case Scene3ds.CHUNK_MAT_MAP:
                        this.read_MAT_ENTRY( head.length - 6 );
                    break;
                //case Scene3ds.CHUNK_MAT_SHININESS:
                        //mat._shininess = readFloat();
                    //break;
                case Scene3ds.CHUNK_MAT_TRANSPARENCY:
                        mat.transparency = this.readPercentage( head.length - 6 );
                        mat.transparency = 1 - mat.transparency;
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
            
            if(this._decode )
            {
                this._decode.exit();
            }
        }
    }

    private read_NAMED_OBJECT( chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        let name: string = this.read_NAME();
        
        if (this._decode )
        {
            this._decode.enter();
        }
        
        while (this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Scene3ds.CHUNK_N_TRI_OBJECT:
                    this.read_N_TRI_OBJECT( name, head.length - 6 );
                    break;
                case Scene3ds.CHUNK_N_LIGHT:
                    this.read_N_LIGHT( name, head.length - 6 );
                    break;
                case Scene3ds.CHUNK_N_CAMERA:
                    this.read_N_CAMERA( name, head.length - 6 );
                    break;
                default:
                    this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if (this._decode )
        {
            this._decode.exit();
        }
    }

    private readSpotChunk(pLight: Light3ds, chunkLength: number): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        pLight.target.x = this._fileData.readFloat32();
        pLight.target.y = this._fileData.readFloat32();
        pLight.target.z = this._fileData.readFloat32();
        
        pLight.hotspot = this._fileData.readFloat32();
        pLight.falloff = this._fileData.readFloat32();
        
        if (this._decode )
        {
            this._decode.println( "Target: " + pLight.target );
            this._decode.println( "Hotspot: " + pLight.hotspot );
            this._decode.println( "Falloff: " + pLight.falloff );
        }
        
        while (this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Scene3ds.CHUNK_LIT_RAYSHAD:
                    // (readUnsignedShort() > 0);
                        pLight.rayShadows = true;
                    break;
                case Scene3ds.CHUNK_LIT_SHADOWED:
                    // (readUnsignedShort() > 0);
                        pLight.shadowed = true;
                    break;
                case Scene3ds.CHUNK_LIT_LOCAL_SHADOW:
                        this._fileData.readFloat32();
                        this._fileData.readFloat32();
                        this._fileData.readFloat32();
                    break;
                case Scene3ds.CHUNK_LIT_LOCAL_SHADOW2:
                        pLight.shadowBias = this._fileData.readFloat32();
                        pLight.shadowFilter = this._fileData.readFloat32();
                        pLight.shadowSize = this._fileData.readFloat32();
                    break;
                case Scene3ds.CHUNK_LIT_SEE_CONE:
                    // (readUnsignedShort() > 0);
                        pLight.cone = true;
                    break;
                case Scene3ds.CHUNK_LIT_SPOT_RECTANGULAR:
                    // (readUnsignedShort() > 0);
                        pLight.rectangular = true;
                    break;
                case Scene3ds.CHUNK_LIT_SPOT_OVERSHOOT:
                    // (readUnsignedShort() > 0);
                    pLight.overshoot = true;
                    break;
                case Scene3ds.CHUNK_LIT_SPOT_PROJECTOR:
                    // (readUnsignedShort() > 0);
                        pLight.projector = true;
                        pLight.name = this.read_NAME( 64 );
                    break;
                case Scene3ds.CHUNK_LIT_SPOT_RANGE:
                    this._fileData.readFloat32();
                    break;
                case Scene3ds.CHUNK_LIT_SPOT_ROLL:
                        pLight.aspect = this._fileData.readFloat32();
                    break;
                case Scene3ds.CHUNK_LIT_SPOT_ASPECT:
                        pLight.rayBias = this._fileData.readFloat32();
                    break;
                case Scene3ds.CHUNK_LIT_RAY_BIAS:
                        pLight.rayBias = this._fileData.readFloat32();
                    break;
                default:
                    this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if (this._decode )
        {
            this._decode.exit();
        }
    }

    private read_N_LIGHT( name: string, chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        let lit: Light3ds = new Light3ds();
        lit.name = name;
        
        this.addLight( lit );
        
        lit.position.x = this._fileData.readFloat32();
        lit.position.y = this._fileData.readFloat32();
        lit.position.z = this._fileData.readFloat32();
        
        if (this._decode )
        {
            this._decode.enter();
            this._decode.println( "Position: " + lit.position );
        }
        
        while (this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Scene3ds.CHUNK_LIT_OFF:
                        lit.off = (this._fileData.readUint16() > 0 );
                    break;
                case Scene3ds.CHUNK_LIT_SPOT:
                        this.readSpotChunk( lit, head.length - 6 );
                    break;
                case Scene3ds.CHUNK_COL_RGB:
                case Scene3ds.CHUNK_COL_LINRGB:
                        lit.color = this.readRGBColor();
                    break;
                case Scene3ds.CHUNK_COL_TRU:
                case Scene3ds.CHUNK_COL_LINTRU:
                        lit.color = this.readTrueColor();
                    break;
                case Scene3ds.CHUNK_LIT_ATTENUATE:
                        lit.attenuation = this._fileData.readFloat32();
                    break;
                case Scene3ds.CHUNK_LIT_INNER_RANGE:
                        lit.innerRange = this._fileData.readFloat32();
                    break;
                case Scene3ds.CHUNK_LIT_OUTER_RANGE:
                        lit.outerRange = this._fileData.readFloat32();
                    break;
                case Scene3ds.CHUNK_LIT_MULTIPLIER:
                        lit.multiplexer = this._fileData.readFloat32();
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if (this._decode )
        {
            this._decode.exit();
        }
    }

    private readRGBColor(): Color3ds
    {
        let lvColor: Color3ds = new Color3ds();
        lvColor.red = this._fileData.readFloat32();
        lvColor.green = this._fileData.readFloat32();
        lvColor.blue = this._fileData.readFloat32();
        
        return lvColor;
    }

    private readTrueColor(): Color3ds
    {
        let lvColor: Color3ds = new Color3ds();
        // TODO: readInt8 or readUint8? Docs might be incorrect
        lvColor.red = (this._fileData.readInt8() & 0xFF) / 255;
        lvColor.green = (this._fileData.readInt8() & 0xFF) / 255;
        lvColor.blue = (this._fileData.readInt8() & 0xFF) / 255;
        
        return lvColor;
    }

    private read_N_CAMERA( name: string, chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        let cam: Camera3ds = new Camera3ds();
        cam.name = name;
        
        this.addCamera( cam );
        
        cam.position.x = this._fileData.readFloat32();
        cam.position.y = this._fileData.readFloat32();
        cam.position.z = this._fileData.readFloat32();
        
        cam.target.x = this._fileData.readFloat32();
        cam.target.y = this._fileData.readFloat32();
        cam.target.z = this._fileData.readFloat32();
        
        cam.roll = this._fileData.readFloat32();
        cam.lens = this._fileData.readFloat32();
        
        if(this._decode)
        {
            this._decode.enter();
            this._decode.println( "Position: " + cam.position );
            this._decode.println( "Target:   " + cam.target );
            this._decode.println( "Roll: " + cam.roll );
            this._decode.println( "Lens: " + cam.lens );
        }
        
        while (this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Scene3ds.CHUNK_CAM_RANGES:
                        this.read_CAM_RANGES( cam );
                    break;
                case Scene3ds.CHUNK_CAM_SEE_CONE:
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if(this._decode )
        {
            this._decode.exit();
        }
    }

    private read_CAM_RANGES( cam: Camera3ds ): void
    {
        cam.nearPlane = this._fileData.readFloat32();
        cam.farPlane = this._fileData.readFloat32();
        
        if (this._decode)
        {
            this._decode.enter();
            this._decode.println( "Near plane:" + cam.nearPlane );
            this._decode.println( "Far plane: " + cam.farPlane );
            this._decode.exit();
        }
    }

    private read_N_TRI_OBJECT( name: string, chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        let mes: Mesh3ds = new Mesh3ds();
        mes.name = name;
        
        this.addMesh( mes );
        
        if(this._decode)
        {
            this._decode.enter();
        }
        
        while (this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Scene3ds.CHUNK_POINT_ARRAY:
                        mes.vertices = this.read_POINT_ARRAY();
                    break;
                case Scene3ds.CHUNK_TEX_VERTS:
                        mes.texCoords = this.read_TEX_VERTS();
                    break;
                case Scene3ds.CHUNK_MESH_TEXTURE_INFO:
                        this.read_MESH_TEXTURE_INFO( mes );
                    break;
                case Scene3ds.CHUNK_MESH_MATRIX:
                        this.readMatrix( mes.localSystem );
                    break;
                case Scene3ds.CHUNK_FACE_ARRAY:
                        this.read_FACE_ARRAY( mes, head.length - 6 );
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if (this._decode )
        {
            this._decode.exit();
        }
    }

    private read_POINT_ARRAY(): Vertex3ds[]
    {
        let verts: number = this._fileData.readUint16();
        let v: Vertex3ds[] = []
        
        let n: number = 0;
        let x: number = 0;
        let y: number = 0;
        let z: number = 0;
        for ( n = 0; n < verts; ++n )
        {
            x = this._fileData.readFloat32();
            y = this._fileData.readFloat32();
            z = this._fileData.readFloat32();
            v[ n ] = new Vertex3ds( x, y, z );
        }
        
        if (this._decode)
        {
            this._decode.enter();
            this._decode.println( "Vertices: " + verts );
            this._decode.exit();
        }
        
        return v;
    }

    private read_TEX_VERTS(): TexCoords3ds[]
    {
        let coords: number = this._fileData.readUint16();
        let tc: TexCoords3ds[] = []
        
        let n: number = 0;
        let u: number = 0;
        let v: number = 0;
        
        for ( n = 0; n < coords; ++n )
        {
            u = this._fileData.readFloat32();
            v = this._fileData.readFloat32();
            if ( u < -100 || u > 100 )
            {
                u = 0;
            }
            if ( v < -100 || v > 100 )
            {
                v = 0;
            }
            tc[ n ] = new TexCoords3ds( u, v );
        }
        
        if (this._decode)
        {
            this._decode.enter();
            this._decode.println( "Coords: " + coords );
            this._decode.exit();
        }
        
        return tc;
    }

    private read_MESH_TEXTURE_INFO( mesh: Mesh3ds ): void
    {
        mesh.texMapType = this._fileData.readUint16();
        mesh.texUTile = this._fileData.readFloat32();
        mesh.texVTile = this._fileData.readFloat32();
        
        if (this._decode )
        {
            this._decode.enter();
            let type: String = "";
            switch( mesh.texMapType )
            {
                case Mesh3ds.PLANAR_MAP:
                        type = "PLANAR";
                    break;
                case Mesh3ds.CYLINDRICAL_MAP:
                        type = "CYLINDRICAL";
                    break;
                case Mesh3ds.SPHERICAL_MAP:
                        type = "SPHERICAL";
                    break;
                default:
                        type = "" + mesh.texMapType;
                    break;
            }
            
            this._decode.println( "Texture mapping type: " + type );
            this._decode.println( "Texture U tiling: " + mesh.texUTile );
            this._decode.println( "Texture V tiling: " + mesh.texVTile );
            
        }
        
        this.skipBytes( 4 * 4 + ( 3 * 4 + 3 ) * 4 );
        
        if ( this._decode )
        {
            this._decode.exit();
        }
    }

    private readMatrix( matrix: number[][] ): void
    {
        matrix[ 0 ][ 0 ] = this._fileData.readFloat32();
        matrix[ 0 ][ 2 ] = this._fileData.readFloat32();
        matrix[ 0 ][ 1 ] = this._fileData.readFloat32();
        
        matrix[ 2 ][ 0 ] = this._fileData.readFloat32();
        matrix[ 2 ][ 2 ] = this._fileData.readFloat32();
        matrix[ 2 ][ 1 ] = this._fileData.readFloat32();
        
        matrix[ 1 ][ 0 ] = this._fileData.readFloat32();
        matrix[ 1 ][ 2 ] = this._fileData.readFloat32();
        matrix[ 1 ][ 1 ] = this._fileData.readFloat32();
        
        matrix[ 0 ][ 3 ] = this._fileData.readFloat32();
        matrix[ 2 ][ 3 ] = this._fileData.readFloat32();
        matrix[ 3 ][ 3 ] = this._fileData.readFloat32();
        
        if(this._decode)
        {
            this._decode.enter();
            this._decode.println( "Matrix: " + matrix );
            this._decode.exit();
        }
    }

    private read_FACE_ARRAY( mesh: Mesh3ds, chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        let faces: number = this._fileData.readUint16();
        mesh.faces = []
        
        let n: number = 0;
        let p0: number = 0;
        let p1: number = 0;
        let p2: number = 0;
        let flags: number = 0;
        
        for ( n = 0; n < faces; ++n )
        {
            p0 = this._fileData.readUint16();
            p1 = this._fileData.readUint16();
            p2 = this._fileData.readUint16();
            flags = this._fileData.readUint16();
            mesh.faces[ n ] = new Face3ds( p0, p1, p2, flags );
        }
        
        if ( this._decode )
        {
            this._decode.enter();
            this._decode.println( "Faces: " + faces );
        }
        
        while ( this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Scene3ds.CHUNK_MSH_MAT_GROUP:
                        this.read_MSH_MAT_GROUP( mesh );
                    break;
                case Scene3ds.CHUNK_SMOOTH_GROUP:
                        this.read_SMOOTH_GROUP( mesh, head.length - 6 );
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if (this._decode)
        {
            this._decode.exit();
        }
    }

    private read_MSH_MAT_GROUP(mes: Mesh3ds): void
    {
        let name: string = this.read_NAME();
        
        let fm: FaceMaterial3ds = new FaceMaterial3ds();
        mes.addFaceMaterial( fm );
        
        let i: number = 0;
        
        for ( i = 0; i < this._materialList.length; ++i )
        {
            if (this._materialList[ i ].name == name )
            {
                fm.matIndex = i;
                break;
            }
        }
        
        let indexes: number = this._fileData.readUint16();
        fm.faceIndices = []
        
        for ( i = 0; i < indexes; ++i )
        {
            fm.faceIndices[ i ] = this._fileData.readUint16();
        }
        
        if (this._decode)
        {
            this._decode.enter();
            this._decode.println( "Faces: " + indexes );
            this._decode.exit();
        }
    }

    private read_SMOOTH_GROUP( mesh: Mesh3ds, chunkLength: number ): void
    {
        let entries: number = chunkLength / 4;
        mesh.smoothGroup = []
        
        let n: number = 0;
        for ( n = 0; n < entries; ++n )
        {
            mesh.smoothGroup[ n ] = this._fileData.readInt32();
        }
        
        if (this._decode )
        {
            this._decode.enter();
            this._decode.println( "Entries: " + entries );
            this._decode.exit();
        }
        
        if ( entries != mesh.numFaces )
        {
            throw new Parser3dsError( "SMOOTH_GROUP entries != faces. File is probably corrupt!" );
        }
    }

    private read_KFDATA( chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        if(this._decode )
        {
            this._decode.enter();
        }
        
        while (this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Scene3ds.CHUNK_KFSEG:
                        this._startFrame = this._fileData.readInt32();
                        this._endFrame = this._fileData.readInt32();
                        if (this._decode)
                        {
                            this._decode.enter();
                            this._decode.println( "Start frame: " + this._startFrame );
                            this._decode.println( "End frame: " + this._endFrame );
                            this._decode.exit();
                        }
                    break;
                case Scene3ds.CHUNK_OBJECT_NODE_TAG:
                        this.read_OBJECT_NODE_TAG( head.length - 6 );
                    break;
                case Scene3ds.CHUNK_TARGET_NODE_TAG:
                        this.read_TARGET_NODE_TAG(head.length - 6);
                    break;
                case Scene3ds.CHUNK_CAMERA_NODE_TAG:
                        this.read_CAMERA_NODE_TAG(head.length - 6);
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if (this._decode)
        {
            this._decode.exit();
        }
    }

    private read_OBJECT_NODE_TAG( chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        if ( this._decode )
        {
            this._decode.enter();
        }
        
        let nodeId: number = 0;
        let name: string = "";
        let meshIndex: number = 0;
        let mes: Mesh3ds;
        
        while ( this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Scene3ds.CHUNK_NODE_ID:
                        nodeId = this.read_NODE_ID();
                    break;
                case Scene3ds.CHUNK_NODE_HDR:
                        name = this.read_NAME()
                        for ( let i: number = 0; i < this.numMeshes; ++i )
                        {
                            if (this.getMeshAt( i ).name == name )
                            {
                                meshIndex = i;
                                break;
                            }
                        }
                        mes = this.getMeshAt( meshIndex );
                        mes.nodeId = nodeId;
                        mes.nodeFlags = this._fileData.readInt32();
                        mes.parentNodeId = this._fileData.readUint16();
                        if ( this._decode )
                        {
                            this._decode.enter();
                            this._decode.println( "Node flags: 0x" + mes.nodeFlags );
                            this._decode.println( "Parent node id: " + mes.parentNodeId );
                            this._decode.exit();
                        }
                        //FIXME Build hierarchy here...
                    break;
                case Scene3ds.CHUNK_PIVOT:
                        mes.pivot.x = this._fileData.readFloat32()
                        mes.pivot.y = this._fileData.readFloat32()
                        mes.pivot.z = this._fileData.readFloat32()
                        if (this._decode)
                        {
                            this._decode.enter();
                            this._decode.println( "Pivot: " + mes.pivot );
                            this._decode.exit();
                        }
                    break;
                case Scene3ds.CHUNK_POS_TRACK_TAG:
                        this.read_POS_TRACK_TAG( mes.positionTrack );
                    break;
                case Scene3ds.CHUNK_ROT_TRACK_TAG:
                        this.read_ROT_TRACK_TAG( mes.rotationTrack );
                    break;
                case Scene3ds.CHUNK_SCL_TRACK_TAG:
                        this.read_POS_TRACK_TAG( mes.scaleTrack );
                    break;
                case Scene3ds.CHUNK_MORPH_TRACK_TAG:
                        this.read_MORPH_TRACK_TAG( mes.morphTrack );
                    break;
                case Scene3ds.CHUNK_HIDE_TRACK_TAG:
                        this.read_HIDE_TRACK_TAG( mes.hideTrack );
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
        
        if (this._decode)
        {
            this._decode.exit();
        }
    }

    private read_TARGET_NODE_TAG( chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        if ( this._decode )
        {
            this._decode.enter();
        }
        
        let targetNodeId: number = 0;
        let name: string = "";
        let cameraIndex: number = 0;
        let cam: Camera3ds;
        
        while (this._fileData.position < chunkEnd)
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Scene3ds.CHUNK_NODE_ID:
                        targetNodeId = this.read_NODE_ID();
                    break;
                case Scene3ds.CHUNK_NODE_HDR:
                        name = this.read_NAME();
                        for ( let i: number = 0; i < this.numCameras; ++i )
                        {
                            if (this.getCameraAt( i ).name == name )
                            {
                                cameraIndex = i;
                                break;
                            }
                        }
                        cam = this.getCameraAt( cameraIndex );
                        cam.targetNodeId = targetNodeId;
                        cam.targetNodeFlags = this._fileData.readInt32();
                        cam.targetParentNodeId = this._fileData.readUint16();
                        if ( this._decode )
                        {
                            this._decode.enter();
                            this._decode.println( "Target node flags: 0x" + cam.targetNodeFlags );
                            this._decode.println( "Target parent node id: " + cam.targetParentNodeId );
                            this._decode.exit();
                        }
                        // FIXME  Build hierarchy here...
                    break;
                case Scene3ds.CHUNK_POS_TRACK_TAG:
                        this.read_POS_TRACK_TAG( cam.targetTrack );
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
    }

    private read_CAMERA_NODE_TAG( chunkLength: number ): void
    {
        let chunkEnd: number = this._fileData.position + chunkLength;
        
        if(this._decode )
        {
            this._decode.enter();
        }
        
        let positionNodeId: number = 0;
        let name: string = "";
        let cameraIndex: number = 0;
        let cam: Camera3ds;
        
        while (this._fileData.position < chunkEnd )
        {
            let head: Head = this.read_HEAD();
            switch( head.id )
            {
                case Scene3ds.CHUNK_NODE_ID:
                        positionNodeId = this.read_NODE_ID();
                    break;
                case Scene3ds.CHUNK_NODE_HDR:
                        name = this.read_NAME();
                        for ( let i: number = 0; i < this.numCameras; ++i )
                        {
                            if (this.getCameraAt( i ).name == name )
                            {
                                cameraIndex = i;
                                break;
                            }
                        }
                        cam = this.getCameraAt( cameraIndex );
                        cam.positionNodeId = positionNodeId;
                        cam.positionNodeFlags = this._fileData.readInt32();
                        cam.positionParentNodeId = this._fileData.readUint16();
                        if ( this._decode )
                        {
                            this._decode.enter();
                            this._decode.println( "Position node flags: 0x" + cam.positionNodeFlags.toString( 16 ) );
                            this._decode.println( "Position parent node id: " + cam.positionParentNodeId );
                            this._decode.exit();
                        }
                    // FIXME Build hierarchy here...
                    break;
                case Scene3ds.CHUNK_POS_TRACK_TAG:
                        this.read_POS_TRACK_TAG( cam.positionTrack );
                    break;
                case Scene3ds.CHUNK_FOV_TRACK_TAG:
                        this.readPTrack( cam.fovTrack );
                    break;
                case Scene3ds.CHUNK_ROLL_TRACK_TAG:
                        this.readPTrack( cam.rollTrack );
                    break;
                default:
                        this.skipChunk( head.length - 6 );
                    break;
            }
        }
    }

    private read_NODE_ID(): number
    {
        let id: number = this._fileData.readUint16();
        
        if(this._decode)
        {
            this._decode.enter();
            this._decode.println( "Node id: " + id );
            this._decode.exit();
        }
        
        return id;
    }

    private readTrackHead(track: Track3ds): number
    {
        let keys: number = 0;
        let flags: number = 0;
        
        track.flags = flags = this._fileData.readUint16();
        
        if ( this._decode )
        {
            let loop: String = "";
            switch( track.loopType )
            {
                case Track3ds.SINGLE:
                        loop = "SINGLE";
                    break;
                case Track3ds.REPEAT:
                        loop = "REPEAT";
                    break;
                case Track3ds.LOOP:
                        loop = "LOOP";
                    break;
                default:
                        loop = "" + track.loopType;
                    break;
            }
            this._decode.println( "Loop type: " + loop );
        }
        
        this.skipBytes( 2 * 4 );
        
        keys = this._fileData.readInt32();
        
        if (this._decode)
        {
            this._decode.println( " Keys: " + keys );
        }
        
        return keys;
    }

    private readSplineParams( key: SplineKey3ds ): void
    {
        let flags: number = this._fileData.readUint16();
        
        if ( flags != 0 )
        {
            if ( (flags & 0x01 ) != 0 )
            {
                key.tension = this._fileData.readFloat32();
                if ( this._decode )
                {
                    this._decode.println( "\tTension:    " + key.tension )
                }
            }
            if ( (flags & 0x02 ) != 0 )
            {
                key.bias = this._fileData.readFloat32();
                if ( this._decode )
                {
                    this._decode.println( "    Bias:       " + key.bias );
                }
            }
            if ( (flags & 0x04 ) != 0 )
            {
                key.continuity = this._fileData.readFloat32();
                if ( this._decode )
                {
                    this._decode.println( "    Continuity: " + key.continuity );
                }
            }
            if ( (flags & 0x08 ) != 0 )
            {
                key.easeTo = this._fileData.readFloat32();
                if ( this._decode )
                {
                    this._decode.println( "    Ease to:    " + key.easeTo );
                }
            }
            if ( (flags & 0x10 ) != 0 )
            {
                key.easeFrom = this._fileData.readFloat32();
                if ( this._decode )
                {
                    this._decode.println( "    Ease from:  " + key.easeFrom );
                }
            }
        }
    }

    private readPTrack(track: PTrack3ds): void
    {
        if ( this._decode )
        {
            this._decode.enter();
        }
        
        let keys: number = this.readTrackHead( track );
        track.keys = []
        
        for ( let i: number = 0; i < keys; ++i )
        {
            let key: PKey3ds = new PKey3ds();
            key.frame = this._fileData.readInt32();
            if ( this._decode )
            {
                this._decode.println( "  Frame: " + key.frame );
            }
            
            this.readSplineParams( key );
            
            key.p = this._fileData.readFloat32();
            
            if ( this._decode )
            {
                this._decode.println( "  " + key.p );
            }
            track.keys[ i ] = key;
        }
        
        if ( this._decode )
        {
            this._decode.exit();
        }
    }

    private read_POS_TRACK_TAG( track: XyzTrack3ds ): void
    {
        if ( this._decode )
        {
            this._decode.enter();
        }
        
        let keys: number = this.readTrackHead( track );
        track.keys = []
        
        for ( let i: number = 0; i < keys; ++i )
        {
            let key: XyzKey3ds = new XyzKey3ds();
            key.frame = this._fileData.readInt32();
            if ( this._decode )
            {
                this._decode.println( "  Frame: " + key.frame );
            }
            
            this.readSplineParams( key );
            key.x = this._fileData.readFloat32();
            key.y = this._fileData.readFloat32();
            key.z = this._fileData.readFloat32();
            
            if ( this._decode )
            {
                this._decode.println( "key x: " + key.x );
                this._decode.println( "key y: " + key.y );
                this._decode.println( "key z: " + key.z );
            }
            
            track.keys[ i ] = key;
        }
        
        if ( this._decode )
        {
            this._decode.exit();
        }
    }

    private read_ROT_TRACK_TAG( track: RotationTrack3ds ): void
    {
        if ( this._decode )
        {
            this._decode.enter();
        }
        
        let keys: number = this.readTrackHead( track );
        track.keys = []
        
        for ( let i: number = 0; i < keys; ++i )
        {
            let key: RotationKey3ds = new RotationKey3ds();
            key.frame = this._fileData.readInt32();
            if ( this._decode )
            {
                this._decode.println( "  Frame: " + key.frame );
            }
            
            this.readSplineParams( key );
            key.a = this._fileData.readFloat32();
            key.x = this._fileData.readFloat32();
            key.z = this._fileData.readFloat32();
            key.y = this._fileData.readFloat32();
            
            if ( this._decode )
            {
                this._decode.println( "     A: " + key.a );
                this._decode.println( "     X: " + key.x );
                this._decode.println( "     Y: " + key.y );
                this._decode.println( "     Z: " + key.z );
            }
            
            track.keys[ i ] = key;
        }
        
        if ( this._decode )
        {
            this._decode.exit();
        }
    }

    private read_MORPH_TRACK_TAG( track: MorphTrack3ds ): void
    {
        if ( this._decode )
        {
            this._decode.enter();
        }
        
        let keys: number = this.readTrackHead( track );
        track.keys = []
        
        for ( let i: number = 0; i < keys; ++i )
        {
            let key: MorphKey3ds = new MorphKey3ds();
            key.frame = this._fileData.readInt32();
            
            if ( this._decode )
            {
                this._decode.println( "  Frame: " + key.frame );
            }
            this.readSplineParams( key );
            let name: String = this.read_NAME();
            
            for ( let n: number = 0; n < this.numMeshes; ++n )
            {
                if (this.getMeshAt( n ).name == name )
                {
                    key.mesh = n;
                    break;
                }
            }
            
            track.keys[ i ] = key;
        }
        
        if ( this._decode )
        {
            this._decode.exit();
        }
    }

    private read_HIDE_TRACK_TAG( track: HideKeyTrack3ds ): void
    {
        if ( this._decode )
        {
            this._decode.enter();
        }
        
        var dummy: SplineKey3ds = new SplineKey3ds();
        var keys: number = this.readTrackHead( track );
        track.keys = []
        
        for ( var i: number = 0; i < keys; ++i )
        {
            var key: HideKey3ds = new HideKey3ds();
            key.frame = this._fileData.readInt32();
            if ( this._decode )
            {
                this._decode.println( "  Frame: " + key.frame );
            }
            this.readSplineParams( dummy );
            track.keys[ i ] = key;
        }
        
        if ( this._decode )
        {
            this._decode.exit();
        }
    }
}
