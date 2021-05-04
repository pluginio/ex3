export class MathExt
{
    public static HALF_PI: number = 1.5707964

    public static log2OfPowerOfTwo(powerOfTwo: number): number
    {
        var log2: number = ((powerOfTwo & 0xAAAAAAAA) != 0 ? 1 : 0 );
			log2 |= ((( powerOfTwo & 0xFFFF0000 ) != 0 ) ? 1 : 0 ) << 4;
			log2 |= ((( powerOfTwo & 0xFF00FF00 ) != 0 ) ? 1 : 0 ) << 3;
			log2 |= ((( powerOfTwo & 0xF0F0F0F0 ) != 0 ) ? 1 : 0 ) << 2;
			log2 |= ((( powerOfTwo & 0xCCCCCCCC ) != 0 ) ? 1 : 0 ) << 1;
			return log2
    }

    public static isPowerOfTwo(value:number): boolean
    {
        return (value>0) && ((value &(value-1)) == 0)
    }
}