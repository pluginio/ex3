export enum TextureFormat
{
    NONE,

    // Small-bit color formats.
    R5G6B5,
    A1R5G5B5,
    A4R4G4B4,

    // 8-bit integer formats.
    A8,
    L8,
    A8L8,
    R8G8B8,
    A8R8G8B8,
    A8B8G8R8,

    // 16-bit integer formats.
    L16,
    G16R16,
    A16B16G16R16,

    // 16-bit floating-point formats ('half float' channels).
    R16F,
    G16R16F,
    A16B16G16R16F,

    // 32-bit floating-point formats ('float' channels).
    R32F,
    G32R32F,
    A32B32G32R32F,

    // DXT compressed formats.
    DXT1,
    DXT3,
    DXT5,

    // Depth-stencil format.
    D24S8,
    QUANTITY
}