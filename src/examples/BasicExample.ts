import { WindowApplication3 } from "../application/WindowApplication3";

export class BasicExample extends WindowApplication3
{
    constructor()
    {
        super("SampleGraphics/BasicExample", 0, 0, 800, 600, [0, .25, .75, 1])
    }
}