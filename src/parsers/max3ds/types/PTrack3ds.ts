import { PKey3ds } from "./PKey3ds";
import { Track3ds } from "./Track3ds";

export class PTrack3ds extends Track3ds
{
    public keys: PKey3ds[] = []

    public constructor()
    {
        super()
    }
}
