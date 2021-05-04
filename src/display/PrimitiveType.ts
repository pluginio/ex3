export enum PrimitiveType
{
    NONE, // default constructor
    POLYPOINT,
    POLYSEGMENTS_DISJOINT,
    POLYSEGMENTS_CONTIGUOUS,
    TRIANGLES,  // abstract
    TRIMESH,
    TRISTRIP,
    TRIFAN,
    MAX_QUANTITY
}