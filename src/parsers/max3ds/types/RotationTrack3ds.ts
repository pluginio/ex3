import { RotationKey3ds } from "./RotationKey3ds"
import { Track3ds } from "./Track3ds"

export class RotationTrack3ds extends Track3ds
{
    public keys: RotationKey3ds[] = []

    public constructor()
    {
        super()
    }
}
