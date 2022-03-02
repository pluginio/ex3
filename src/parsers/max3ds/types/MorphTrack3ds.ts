import { MorphKey3ds } from "./MorphKey3ds";
import { Track3ds } from "./Track3ds";

export class MorphTrack3ds extends Track3ds
{
    public keys: MorphKey3ds[] = []

    public constructor()
    {
        super()
    }
}
