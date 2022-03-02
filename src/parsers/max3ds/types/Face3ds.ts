export class Face3ds
{
    public static AB_VISIBLE: number = 0x04
    public static BC_VISIBLE: number = 0x02
    public static CA_VISIBLE: number = 0x01
    public static U_WRAP: number = 0x08
    public static V_WRAP: number = 0x10

    public p0: number = 0
    public p1: number = 0
    public p2: number = 0

    public flags: number = 0

    public constructor(p0: number, p1: number, p2: number, flags: number)
    {
        this.p0 = p0
        this.p1 = p1
        this.p2 = p2
        this.flags = flags
    }
}
