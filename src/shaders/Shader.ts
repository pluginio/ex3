import { VariableType } from "./VariableType";
import { VariableSemantic } from "./VariableSemantic";
import { SamplerType } from "./SamplerType";
import { SamplerFilter } from "./SamplerFilter";
import { SamplerCoordinate } from "./SamplerCoordinate";
import { Disposable } from "../core/Disposable";

export abstract class Shader implements Disposable
{
    public static MAX_PROFILES: number = 5
    public static MAX_ANISOTROPY: number = 16

    protected static msNullString = ""

    protected _numInputs: number
    protected _inputName: string[] = []
    protected _inputType: VariableType[] = []
    protected _inputSemantic: VariableSemantic[] = []

    protected _numOutputs: number
    protected _outputName: string[] = []
    protected _outputType: VariableType[] = []
    protected _outputSemantic: VariableSemantic[] = []

    protected _numConstants: number
    protected _constantName: string[] = []
    protected _numRegistersUsed: number[] = []

    protected _numSamplers: number
    protected _samplerName: string[] = []
    protected _samplerType: SamplerType[] = []
    protected _filter: SamplerFilter[] = []
    protected _coordinate: SamplerCoordinate[][] = []
    protected _lodBias: number[] = []
    protected _anisotropy: number[] = []
    protected _borderColor: number[][] = []

    protected _profileOwner: boolean
    protected _baseRegister: number[][] = []
    protected _textureUnit: number[][] = []
    protected _program: string[] = []

    protected constructor(programName: string, numInputs: number, numOutputs: number,
        numConstants: number, numSamplers: number, profileOwner: boolean)
    {
        this._numInputs = numInputs
        this._numOutputs = numOutputs
        this._numConstants = numConstants
        this._numSamplers = numSamplers
        this._profileOwner = profileOwner

        console.assert(numOutputs > 0, "Shader must have at least one output.")

        let i: number = 0
        let j: number = 0
        //let dim: number = 0

        // inputs
        if(this._numInputs > 0)
        {
            this._inputName = []
            this._inputType = []
            this._inputSemantic = []

            for(i = 0; i < this._numInputs; ++i)
            {
                this._inputName[i] = ""
                this._inputType[i] = VariableType.NONE
                this._inputSemantic[i] = VariableSemantic.NONE
            }
        }

        // constants
        if(this._numConstants > 0)
        {
            if(profileOwner)
            {
                for(i = 0; i < Shader.MAX_PROFILES; ++i)
                {
                    this._baseRegister[i] = []
                    for(j = 0; j < this._numConstants; ++j)
                    {
                        this._baseRegister[i][j] = 0
                    }
                }
            }
        }

        // samplers
        if(this._numSamplers > 0)
        {
            this._coordinate[0] = []
            this._coordinate[1] = []
            this._coordinate[2] = []
            
            for(i = 0; i < this._numSamplers; ++i)
            {
                this._filter[i] = SamplerFilter.NEAREST
                this._coordinate[0][i] = SamplerCoordinate.CLAMP_EDGE
                this._coordinate[1][i] = SamplerCoordinate.CLAMP_EDGE
                this._coordinate[2][i] = SamplerCoordinate.CLAMP_EDGE

                this._lodBias[i] = 0
                this._anisotropy[i] = 1
                this._borderColor[i] = [0, 0, 0, 0]
            }

            if(this._profileOwner)
            {
                for(i = 0; i < Shader.MAX_PROFILES; ++i)
                {
                    this._textureUnit[i] = []
                    for(j = 0; j < this._numSamplers; ++j)
                    {
                        this._textureUnit[i][j] = 0
                    }
                }
            }
        }

        if(this._profileOwner)
        {
            for(i = 0; i < Shader.MAX_PROFILES; ++i)
            {
                this._program[i] = ""
            }
        }
    }

    public dispose(): void
    {
        this._inputName = null
        this._inputType = null
        this._inputSemantic = null
        this._outputName = null
        this._outputType = null
        this._outputSemantic = null
        this._constantName = null
        this._numRegistersUsed = null
        this._samplerName = null
        this._samplerType = null
        this._filter = null
        this._coordinate[0] = null
        this._coordinate[1] = null
        this._coordinate[2] = null
        this._lodBias = null
        this._anisotropy = null
        this._borderColor = null
        
        if(this._profileOwner)
        {
            for(let i: number = 0; i < Shader.MAX_PROFILES; ++i)
            {
                this._baseRegister[i] = null
                this._textureUnit[i] = null
                this._program[i] = null
            }
        }
    }

    public setInput(i: number, name: string, type: VariableType, semantic: VariableSemantic): void
    {
        if(0 <= i && i < this._numInputs)
        {
            this._inputName[i] = name
            this._inputType[i] = type
            this._inputSemantic[i] = semantic
            return
        }
        console.assert(false, "Invalid index")
    }

    public setOutput(i: number, name: string, type: VariableType, semantic: VariableSemantic): void
    {
        if(0 <= i && i < this._numOutputs)
        {
            this._outputName[i] = name
            this._outputType[i] = type
            this._outputSemantic[i] = semantic
            return
        }
        console.assert(false, "Invalid index")
    }

    public setConstant(i: number, name: string, numRegistersUsed: number): void
    {
        if(0 <= i && i < this._numConstants)
        {
            this._constantName[i] = name
            this._numRegistersUsed[i] = numRegistersUsed
            return
        }
        console.assert(false, "Invalid index")
    }

    public setSampler(i: number, name: string, type: SamplerType): void
    {
        if(0 <= i && i < this._numSamplers)
        {
            this._samplerName[i] = name
            this._samplerType[i] = type
            return
        }
        console.assert(false, "Invalid index")
    }

    public setFilter(i: number, filter: SamplerFilter): void
    {
        if(0 <= i && i < this._numSamplers)
        {
            this._filter[i] = filter
            return
        }
        console.assert(false, "Invalid index")
    }

    public setCoordinate(i: number, dim: number, coordinate: SamplerCoordinate): void
    {
        if(0 <= i && i < this._numSamplers)
        {
            if(0 < dim && dim < 3)
            {
                this._coordinate[dim][i] = coordinate
                return
            }
            console.assert(false, "Invalid dimension")
        }
        console.assert(false, "Invalid index")
    }

    public setLodBias(i: number, lodBias: number): void
    {
        if(0 <= i && i < this._numSamplers)
        {
            this._lodBias[i] = lodBias
            return
        }
        console.assert(false, "Invalid index")
    }

    public setAnisotropy(i: number, anisotropy: number): void
    {
        if(0 <= i && i < this._numSamplers)
        {
            this._anisotropy[i] = anisotropy
            return
        }
        console.assert(false, "Invalid index")
    }

    public setBorderColor(i: number, borderColor: number[]): void
    {
        if(0 <= i && i < this._numSamplers)
        {
            this._borderColor[i] = borderColor
            return
        }
        console.assert(false, "Invalid index")
    }

    public setBaseRegister(profile: number, i: number, baseRegisater: number): void
    {
        if(this._profileOwner)
        {
            if(0 <= profile && profile < Shader.MAX_PROFILES)
            {
                if(0 <= i && i < this._numConstants)
                {
                    this._baseRegister[profile][i] = baseRegisater
                }
                console.assert(false, "Invalid index")
            }
            console.assert(false, "Invalid profile")
        }
        console.assert(false, "You may not set profile data you do not own")
    }

    public setTextureUnit(profile: number, i: number, textureUnit: number): void
    {
        if(this._profileOwner)
        {
            if(0 <= profile && profile < Shader.MAX_PROFILES)
            {
                if(0 <= i && i < this._numSamplers)
                {
                    this._textureUnit[profile][i] = textureUnit
                    return
                }
                console.assert(false, "Invalid index")
            }
            console.assert(false, "Invalid profile")
        }
        console.assert(false, "You may not set profile data you do not own")
    }

    public setProgram(profile: number, program: string): void
    {
        if(this._profileOwner)
        {
            if(0 <= profile && profile < Shader.MAX_PROFILES)
            {
                this._program[profile] = program
                return
            }
            console.assert(false, "Invalid profile")
        }
        console.assert(false, "You may not set profile data you do not own")
    }

    public setBaseRegisters(baseRegisters: number[][]): void
    {
        if(!this._profileOwner)
        {
            for(let i: number = 0; i < Shader.MAX_PROFILES; ++i)
            {
                this._baseRegister[i] = baseRegisters[i]
            }
            return
        }
        console.assert(false, "You already own the profile data")
    }

    public setTextureUnits(textureUnits: number[][]): void
    {
        if(!this._profileOwner)
        {
            for(let i: number = 0; i < Shader.MAX_PROFILES; ++i)
            {
                this._textureUnit[i] = textureUnits[i]
            }
            return
        }
        console.assert(false, "You already own the profile data")
    }
    
    public setPrograms(programs:string[]): void
    {
        if(!this._profileOwner)
        {
            for(let i: number = 0; i < Shader.MAX_PROFILES; ++i)
            {
                this._program[i] = programs[i]
            }
            return
        }
        console.assert(false, "You already own the profile data")
    }

    public get numInputs(): number
    {
        return this._numInputs
    }

    public getInputName(i: number): string
    {
        if(0 <= i && i < this._numInputs)
        {
            return this._inputName[i]
        }

        console.assert(false, "Invalid index")
        return Shader.msNullString
    }

    public getInputType(i: number): VariableType
    {
        if(0 <= i && i < this._numInputs)
        {
            return this._inputType[i]
        }

        console.assert(false, "Invalid index")
        return VariableType.NONE
    }

    public getInputSemantic(i: number): VariableSemantic
    {
        if(0 <= i && i < this._numInputs)
        {
            return this._inputSemantic[i]
        }

        console.assert(false, "Invalid index")
        return VariableSemantic.NONE
    }

    public get numOutputs(): number
    {
        return this._numOutputs
    }

    public getOutputName(i: number): string
    {
        if(0 <= i && i < this._numOutputs)
        {
            return this._outputName[i]
        }

        console.assert(false, "Invalid index")
        return Shader.msNullString
    }

    public getOutputType(i: number): VariableType
    {
        if(0 <= i && i < this._numOutputs)
        {
            return this._outputType[i]
        }

        console.assert(false, "Invalid index")
        return VariableType.NONE
    }

    public getOutputSemantic(i: number): VariableSemantic
    {
        if(0 <= i && i < this._numOutputs)
        {
            return this._outputSemantic[i]
        }

        console.assert(false, "Invalid index")
        return VariableSemantic.NONE
    }

    public get numConstants(): number
    {
        return this._numConstants
    }

    public getConstantByName(i: number): string
    {
        if(0 <= i && i < this._numConstants)
        {
            return this._constantName[i]
        }

        console.assert(false, "Invalid index")
        return Shader.msNullString
    }

    public getNumRegistersUsed(i: number): number
    {
        if(0 <= i && i < this._numConstants)
        {
            return this._numRegistersUsed[i]
        }

        console.assert(false, "Invalid index")
        return 0
    }

    public get numSamplers(): number
    {
        return this._numSamplers
    }

    public getSamplerByName(i: number): string
    {
        if(0 <= i && i < this._numSamplers)
        {
            return this._samplerName[i]
        }

        console.assert(false, "Invalid index")
        return Shader.msNullString
    }

    public getSamplerType(i: number): SamplerType
    {
        if(0 <= i && i < this._numSamplers)
        {
            return this._samplerType[i]
        }

        console.assert(false, "Invalid index")
        return SamplerType.NONE
    }

    public getFiler(i: number): SamplerFilter
    {
        if(0 <= i && i < this._numSamplers)
        {
            return this._filter[i]
        }

        console.assert(false, "Invalid index")
        return SamplerFilter.NONE
    }

    public getCoordinate(i: number, dim: number): SamplerCoordinate
    {
        if(0 <= i && i < this._numSamplers)
        {
            if(0 <= dim && dim <3)
            {
                return this._coordinate[dim][i]
            }

            console.assert(false, "Invalid dimension")
            return SamplerCoordinate.NONE
        }

        console.assert(false, "Invalid index")
        return SamplerCoordinate.NONE
    }

    public getLodBias(i: number): number
    {
        if(0 <= i && i < this._numSamplers)
        {
            return this._lodBias[i]
        }

        console.assert(false, "Invalid index")
        return 0
    }

    public getAnisotropy(i: number): number
    {
        if(0 <= i && i < this._numSamplers)
        {
            return this._anisotropy[i]
        }

        console.assert(false, "Invalid index")
        return 1
    }

    public getBorderColor(i: number): number[]
    {
        if(0 <= i && i < this._numSamplers)
        {
            return this._borderColor[i]
        }

        console.assert(false, "Invalid index")
        return [0, 0, 0, 0]
    }

    // profile dependent data
    public getBaseRegister(profile: number, i: number): number
    {
        if(0 <= profile && profile < Shader.MAX_PROFILES)
        {
            if(0 <= i && i < this._numConstants)
            {
                return this._baseRegister[profile][i]
            }

            console.assert(false, "Invalid index")
            return 0
        }

        console.assert(false, "Invalid profile")
        return 0
    }

    public getTextureUnit(profile: number, i: number): number
    {
        if(0 <= profile && profile < Shader.MAX_PROFILES)
        {
            if(0 <= i && i < this._numSamplers)
            {
                return this._textureUnit[profile][i]
            }

            console.assert(false, "Invalid index")
            return 0
        }

        console.assert(false, "Invalid profile")
        return 0
    }

    public getProgram(profile: number): string
    {
        if(0 <= profile && profile < Shader.MAX_PROFILES)
        {
            return this._program[profile]
        }

        console.assert(false, "Invalid index")
        return Shader.msNullString
    }
}