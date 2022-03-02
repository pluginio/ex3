export class Track3ds
{
    public static SINGLE: number = 0
    public static REPEAT: number = 2
    public static LOOP: number = 3

    public static LOCK_X: number = 0x008
    public static LOCK_Y: number = 0x010
    public static LOCK_Z: number = 0x020

    public static UNLINK_X: number = 0x080
    public static UNLINK_Y: number = 0x100
    public static UNLINK_Z: number = 0x200

    public flags: number = 0

    public constructor()
    {

    }

    public get loopType()
    {
        return (this.flags & 0x3)
    }
}
