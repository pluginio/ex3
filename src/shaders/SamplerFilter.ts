export enum SamplerFilter
{
    NONE,
    NEAREST,          // nearest neighbor (default)
    LINEAR,           // linear filtering
    NEAREST_NEAREST,  // nearest within image, nearest across images
    NEAREST_LINEAR,   // nearest within image, linear across images
    LINEAR_NEAREST,   // linear within image, nearest across images
    LINEAR_LINEAR,    // linear within image, linear across images
    QUANTITY
}