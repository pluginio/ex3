export enum VariableSemantic
{
    NONE,
    POSITION,        // ATTR0
    BLENDWEIGHT,     // ATTR1
    NORMAL,          // ATTR2
    COLOR0,          // ATTR3 (and for render targets)
    COLOR1,          // ATTR4 (and for render targets)
    FOGCOORD,        // ATTR5
    PSIZE,           // ATTR6
    BLENDINDICES,    // ATTR7
    TEXCOORD0,       // ATTR8
    TEXCOORD1,       // ATTR9
    TEXCOORD2,       // ATTR10
    TEXCOORD3,       // ATTR11
    TEXCOORD4,       // ATTR12
    TEXCOORD5,       // ATTR13
    TEXCOORD6,       // ATTR14
    TEXCOORD7,       // ATTR15
    FOG,             // same as VS_FOGCOORD (ATTR5)
    TANGENT,         // same as VS_TEXCOORD6 (ATTR14)
    BINORMAL,        // same as VS_TEXCOORD7 (ATTR15)
    COLOR2,          // support for multiple render targets
    COLOR3,          // support for multiple render targets
    DEPTH0,          // support for multiple render targets
    QUANTITY
}