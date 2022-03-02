import { Track3ds } from "./Track3ds";
import { XyzKey3ds } from "./XyzKey3ds";

export class XyzTrack3ds extends Track3ds
{
    public keys: XyzKey3ds[] = []

    public constructor()
    {
        super()
    }
}
