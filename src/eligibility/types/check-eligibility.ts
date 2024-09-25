import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsEnum,
  IsInt,
  Max,
  Min,
} from 'class-validator';
import { IsValidDocument } from 'src/custom-validators/is-valid-document';

export enum ConnectionTypeEnum {
  'SINGLE_PHASE' = 'monofasico',
  'TWO_PHASE' = 'bifasico',
  'THREE_PHASE' = 'trifasico',
}

export enum ConsumptionClassEnum {
  'RESIDENTIAL' = 'residencial',
  'INDUSTRIAL' = 'industrial',
  'COMMERCIAL' = 'comercial',
  'RURAL' = 'rural',
  'PUBLIC_AUTHORITIES' = 'poderPublico',
}

export enum TariffModalityEnum {
  'BLUE' = 'azul',
  'WHITE' = 'branca',
  'GREEN' = 'verde',
  'CONVENTIONAL' = 'convencional',
}

export class CheckEligibilityRequest {
  @IsValidDocument({ message: 'CPF ou CNPJ inválido' })
  documentNumber: string;

  @IsEnum(ConnectionTypeEnum)
  connectionType: ConnectionTypeEnum;

  @IsEnum(ConsumptionClassEnum)
  consumptionClass: ConsumptionClassEnum;

  @IsEnum(TariffModalityEnum)
  tariffModality: TariffModalityEnum;

  @IsInt({ each: true })
  @ArrayMinSize(3)
  @ArrayMaxSize(12)
  @Min(0, { each: true })
  @Max(9999, { each: true })
  @Type(() => Number)
  consumptionHistory: Array<number>;
}

export interface CheckEligibilityResponse {
  eligible: boolean;
}

export interface EligibleResponse extends CheckEligibilityResponse {
  anualCO2Savings: number;
}

export interface IneligibleResponse extends CheckEligibilityResponse {
  ineligibilityReason: IneligibleReasonEnum[];
}

export enum IneligibleReasonEnum {
  'FORBIDDEN_CONSUMPTION_CLASS' = 'Classe de consumo não aceita',
  'FORBIDDEN_TARIFF_MODALITY' = 'Modalidade tarifária não aceita',
  'LOW_CONSUMPTION' = 'Consumo muito baixo para o tipo de conexão',
}