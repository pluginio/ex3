import { SamplerType } from "../../shaders/SamplerType"
import { GL20 } from "./GL20"

export class GL20Mapping
{
    public static readonly AlphaSrcBlend: number[] =
    [
        WebGL2RenderingContext.ZERO,
        WebGL2RenderingContext.ONE,
        WebGL2RenderingContext.DST_COLOR,
        WebGL2RenderingContext.ONE_MINUS_DST_COLOR,
        WebGL2RenderingContext.SRC_ALPHA,
        WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA,
        WebGL2RenderingContext.DST_ALPHA,
        WebGL2RenderingContext.ONE_MINUS_DST_ALPHA,
        WebGL2RenderingContext.SRC_ALPHA_SATURATE,
        WebGL2RenderingContext.CONSTANT_COLOR,
        WebGL2RenderingContext.ONE_MINUS_CONSTANT_COLOR,
        WebGL2RenderingContext.CONSTANT_ALPHA,
        WebGL2RenderingContext.ONE_MINUS_CONSTANT_ALPHA
    ]

    public static readonly AlphaDstBlend: number[] =
    [
        WebGL2RenderingContext.ZERO,
        WebGL2RenderingContext.ONE,
        WebGL2RenderingContext.SRC_COLOR,
        WebGL2RenderingContext.ONE_MINUS_SRC_COLOR,
        WebGL2RenderingContext.SRC_ALPHA,
        WebGL2RenderingContext.ONE_MINUS_SRC_ALPHA,
        WebGL2RenderingContext.DST_ALPHA,
        WebGL2RenderingContext.ONE_MINUS_DST_ALPHA,
        WebGL2RenderingContext.CONSTANT_COLOR,
        WebGL2RenderingContext.ONE_MINUS_CONSTANT_COLOR,
        WebGL2RenderingContext.CONSTANT_ALPHA,
        WebGL2RenderingContext.ONE_MINUS_CONSTANT_ALPHA
    ]

    public static readonly AlphaCompare: number[] =
    [
        WebGL2RenderingContext.NEVER,
        WebGL2RenderingContext.LESS,
        WebGL2RenderingContext.EQUAL,
        WebGL2RenderingContext.LEQUAL,
        WebGL2RenderingContext.GREATER,
        WebGL2RenderingContext.NOTEQUAL,
        WebGL2RenderingContext.GEQUAL,
        WebGL2RenderingContext.ALWAYS
    ]

    public static readonly DepthCompare: number[] =
    [
        WebGL2RenderingContext.NEVER,
        WebGL2RenderingContext.LESS,
        WebGL2RenderingContext.EQUAL,
        WebGL2RenderingContext.LEQUAL,
        WebGL2RenderingContext.GREATER,
        WebGL2RenderingContext.NOTEQUAL,
        WebGL2RenderingContext.GEQUAL,
        WebGL2RenderingContext.ALWAYS
    ]

    public static readonly StencilCompare: number[] =
    [
        WebGL2RenderingContext.NEVER,
        WebGL2RenderingContext.LESS,
        WebGL2RenderingContext.EQUAL,
        WebGL2RenderingContext.LEQUAL,
        WebGL2RenderingContext.GREATER,
        WebGL2RenderingContext.NOTEQUAL,
        WebGL2RenderingContext.GEQUAL,
        WebGL2RenderingContext.ALWAYS
    ]

    public static readonly StencilOperation: number[] =
    [
        WebGL2RenderingContext.KEEP,
        WebGL2RenderingContext.ZERO,
        WebGL2RenderingContext.REPLACE,
        WebGL2RenderingContext.INCR,
        WebGL2RenderingContext.DECR,
        WebGL2RenderingContext.INVERT
    ]

    public static readonly AttributeChannels: number[] =
    [
        0,  // AT_NONE (unsupported)
        1,  // AT_FLOAT1
        2,  // AT_FLOAT2
        3,  // AT_FLOAT3
        4,  // AT_FLOAT4
        1,  // AT_HALF1
        2,  // AT_HALF2
        3,  // AT_HALF3
        4,  // AT_HALF4
        4,  // AT_UBYTE4
        1,  // AT_SHORT1
        2,  // AT_SHORT2
        4   // AT_SHORT4
    ]

    public static readonly AttributeType: number[] =
    [
        0,
        WebGL2RenderingContext.FLOAT,
        WebGL2RenderingContext.FLOAT,
        WebGL2RenderingContext.FLOAT,
        WebGL2RenderingContext.FLOAT,
        WebGL2RenderingContext.HALF_FLOAT,
        WebGL2RenderingContext.HALF_FLOAT,
        WebGL2RenderingContext.HALF_FLOAT,
        WebGL2RenderingContext.HALF_FLOAT,
        WebGL2RenderingContext.UNSIGNED_BYTE,
        WebGL2RenderingContext.SHORT,
        WebGL2RenderingContext.SHORT,
        WebGL2RenderingContext.SHORT
    ]

    public static readonly BufferLocking: number[] =
    [
        0, // (unsupported)
        0, // (unsupported)
        0  // (unsupported)
    ]

    public static readonly BufferUsage: number[] =
    [
        WebGL2RenderingContext.STATIC_DRAW,
        WebGL2RenderingContext.DYNAMIC_DRAW,
        WebGL2RenderingContext.DYNAMIC_DRAW,
        WebGL2RenderingContext.DYNAMIC_DRAW,
        WebGL2RenderingContext.DYNAMIC_DRAW
    ]

    public static readonly MinFilter: number[] =
    [
        WebGL2RenderingContext.NEAREST,
        WebGL2RenderingContext.LINEAR,
        WebGL2RenderingContext.NEAREST_MIPMAP_NEAREST,
        WebGL2RenderingContext.NEAREST_MIPMAP_LINEAR,
        WebGL2RenderingContext.LINEAR_MIPMAP_NEAREST,
        WebGL2RenderingContext.LINEAR_MIPMAP_LINEAR
    ]

    public static readonly TextureInternalFormat: number[] =
    [
        WebGL2RenderingContext.NONE,
        WebGL2RenderingContext.RGB565,
        WebGL2RenderingContext.RGB5_A1,
        WebGL2RenderingContext.RGBA4,
        WebGL2RenderingContext.SRGB8_ALPHA8,
        WebGL2RenderingContext.LUMINANCE,       // L8
        WebGL2RenderingContext.LUMINANCE_ALPHA, // A8L8
        WebGL2RenderingContext.RGB8,
        WebGL2RenderingContext.RGBA8,
        WebGL2RenderingContext.RGBA8,
        WebGL2RenderingContext.LUMINANCE,       // L16
        WebGL2RenderingContext.RG16UI,
        WebGL2RenderingContext.RGB16UI,
        WebGL2RenderingContext.R16F,
        WebGL2RenderingContext.RG16F,
        WebGL2RenderingContext.RGBA16F,
        WebGL2RenderingContext.R32F,
        WebGL2RenderingContext.RG32F,
        WebGL2RenderingContext.RGBA32F,
        WebGL2RenderingContext.R32F,
        WebGL2RenderingContext.RG32F,
        WebGL2RenderingContext.RGBA32F,
        0, // TODO DXT1
        0, // TODO DXT3
        0, // TODO DXT3
        WebGL2RenderingContext.DEPTH24_STENCIL8
    ]

    public static readonly TextureFormat: number[] =
    [
        WebGL2RenderingContext.NONE,
        WebGL2RenderingContext.RGB565,
        WebGL2RenderingContext.RGB5_A1,
        WebGL2RenderingContext.RGBA4,
        WebGL2RenderingContext.SRGB8_ALPHA8,
        WebGL2RenderingContext.LUMINANCE,       // L8
        WebGL2RenderingContext.LUMINANCE_ALPHA, // A8L8
        WebGL2RenderingContext.RGB8,
        WebGL2RenderingContext.RGBA8,
        WebGL2RenderingContext.RGBA8,
        WebGL2RenderingContext.LUMINANCE,       // L16
        WebGL2RenderingContext.RG16UI,
        WebGL2RenderingContext.RGB16UI,
        WebGL2RenderingContext.R16F,
        WebGL2RenderingContext.RG16F,
        WebGL2RenderingContext.RGBA16F,
        WebGL2RenderingContext.R32F,
        WebGL2RenderingContext.RG32F,
        WebGL2RenderingContext.RGBA32F,
        WebGL2RenderingContext.R32F,
        WebGL2RenderingContext.RG32F,
        WebGL2RenderingContext.RGBA32F,
        0, // TODO DXT1
        0, // TODO DXT3
        0, // TODO DXT3
        WebGL2RenderingContext.DEPTH24_STENCIL8
    ]

    public static readonly TextureTarget:number [] =
    [
        WebGL2RenderingContext.NONE,
        WebGL2RenderingContext.TEXTURE_2D, // 1D unsupported
        WebGL2RenderingContext.TEXTURE_2D,
        WebGL2RenderingContext.TEXTURE_3D,
        WebGL2RenderingContext.TEXTURE_CUBE_MAP
    ]

    public static readonly TextureTargetBinding:number[] =
    [
        WebGL2RenderingContext.NONE,
        WebGL2RenderingContext.TEXTURE_BINDING_2D, // 1D unsupported
        WebGL2RenderingContext.TEXTURE_BINDING_2D,
        WebGL2RenderingContext.TEXTURE_BINDING_3D,
        WebGL2RenderingContext.TEXTURE_BINDING_CUBE_MAP
    ]

    public static readonly TextureType: number[] =
    [
        WebGL2RenderingContext.NONE,                    // TF_NONE
        WebGL2RenderingContext.UNSIGNED_SHORT_5_6_5,    // TF_R5G6B5
        WebGL2RenderingContext.UNSIGNED_SHORT_4_4_4_4,  // TF_A1R5G5B5
        WebGL2RenderingContext.UNSIGNED_BYTE,           // TF_A8
        WebGL2RenderingContext.UNSIGNED_BYTE,           // TF_L8
        WebGL2RenderingContext.UNSIGNED_BYTE,           // TF_A8L8
        WebGL2RenderingContext.UNSIGNED_BYTE,           // TF_R8G8B8
        WebGL2RenderingContext.UNSIGNED_BYTE,           // TF_A8R8G8B8
        WebGL2RenderingContext.UNSIGNED_BYTE,           // TF_B8G8R8A8
        WebGL2RenderingContext.UNSIGNED_SHORT,          // TF_L16
        WebGL2RenderingContext.UNSIGNED_SHORT,          // TF_G16R16
        WebGL2RenderingContext.UNSIGNED_SHORT,          // TF_A16B16G16R16
        WebGL2RenderingContext.HALF_FLOAT,              // TF_R16F
        WebGL2RenderingContext.HALF_FLOAT,              // TF_G16R16F
        WebGL2RenderingContext.HALF_FLOAT,              // TF_A16B16G16R16F
        WebGL2RenderingContext.FLOAT,                   // TF_R32F
        WebGL2RenderingContext.FLOAT,                   // TF_G32R32F
        WebGL2RenderingContext.FLOAT,                   // TF_A32B32G32R32F
        WebGL2RenderingContext.NONE,                    // TF_DXT1 (not needed)
        WebGL2RenderingContext.NONE,                    // TF_DXT3 (not needed)
        WebGL2RenderingContext.NONE,                    // TF_DXT5 (not needed)
        WebGL2RenderingContext.UNSIGNED_INT_24_8        // TF_D24S8
    ]

    public static readonly WrapMode: number[] =
    [
        WebGL2RenderingContext.CLAMP_TO_EDGE,           // SC_CLAMP (unsupported)
        WebGL2RenderingContext.CLAMP_TO_EDGE,           // SC_CLAMP (unsupported)
        WebGL2RenderingContext.REPEAT,                  // SC_REPEAT
        WebGL2RenderingContext.MIRRORED_REPEAT,         // SC_MIRRORED_REPEAT
        WebGL2RenderingContext.CLAMP_TO_EDGE,           // SC_CLAMP_BORDER (unsupported)
        WebGL2RenderingContext.CLAMP_TO_EDGE            // SC_CLAMP_EDGE
    ]

    public static readonly PrimitiveType: number[] =
    [
        WebGL2RenderingContext.NONE,                    // PT_NONE
        WebGL2RenderingContext.POINTS,                  // PT_POLYPOINT
        WebGL2RenderingContext.LINES,                   // PT_POLYSEGMENTS_DISJOINT
        WebGL2RenderingContext.LINE_STRIP,              // PT_POLYSEGMENTS_CONTIGUOUS
        WebGL2RenderingContext.NONE,                    // PT_TRIANGLES
        WebGL2RenderingContext.TRIANGLES,               // PT_TRIMESH
        WebGL2RenderingContext.TRIANGLE_STRIP,          // PT_TRISTRIP
        WebGL2RenderingContext.TRIANGLE_FAN             // PT_TRIFAN
    ]

    public static BindTexture(target: SamplerType, texture: number): number
    {
        GL20.gl.bindTexture(GL20Mapping.TextureTarget[target], texture)
        return this.GetBoundTexture(target)
    }

    public static GetBoundTexture(target: SamplerType): number
    {
        return GL20.gl.getParameter(GL20Mapping.TextureTargetBinding[target])
    }
}