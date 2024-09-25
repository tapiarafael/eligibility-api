import { Injectable } from '@nestjs/common';
import {
  CheckEligibilityRequest,
  CheckEligibilityResponse,
  ConnectionTypeEnum,
  ConsumptionClassEnum,
  IneligibleReasonEnum,
  TariffModalityEnum,
} from './types/check-eligibility';

@Injectable()
export class EligibilityService {
  check({
    connectionType,
    consumptionClass,
    tariffModality,
    consumptionHistory,
  }: CheckEligibilityRequest): CheckEligibilityResponse {
    const ineligibilityReasons: IneligibleReasonEnum[] = this.validate([
      () => this.checkConsumptionClass(consumptionClass),
      () => this.checkTariffModality(tariffModality),
      () => this.checkConsumptionHistory(connectionType, consumptionHistory),
    ]);

    if (ineligibilityReasons.length > 0) {
      return {
        eligible: false,
        ineligibilityReason: ineligibilityReasons,
      };
    }

    return {
      eligible: true,
      anualCO2Savings: this.getAnualCO2Savings(consumptionHistory),
    };
  }

  private validate(
    validations: Array<() => IneligibleReasonEnum | null>,
  ): Array<IneligibleReasonEnum> {
    return validations
      .map((validation) => validation())
      .filter((reason) => reason);
  }

  private checkConsumptionClass(
    consumptionClass: ConsumptionClassEnum,
  ): IneligibleReasonEnum | null {
    const validConsumptionClasses = [
      ConsumptionClassEnum.COMMERCIAL,
      ConsumptionClassEnum.RESIDENTIAL,
      ConsumptionClassEnum.INDUSTRIAL,
    ];

    if (!validConsumptionClasses.includes(consumptionClass)) {
      return IneligibleReasonEnum.FORBIDDEN_CONSUMPTION_CLASS;
    }
  }

  private checkTariffModality(
    tariffModality: TariffModalityEnum,
  ): IneligibleReasonEnum | null {
    const validTariffModalities = [
      TariffModalityEnum.CONVENTIONAL,
      TariffModalityEnum.WHITE,
    ];

    if (!validTariffModalities.includes(tariffModality)) {
      return IneligibleReasonEnum.FORBIDDEN_TARIFF_MODALITY;
    }
  }

  private checkConsumptionHistory(
    connectionType: ConnectionTypeEnum,
    consumptionHistory: number[],
  ): IneligibleReasonEnum | null {
    const averageConsumption =
      consumptionHistory.reduce((a, b) => a + b, 0) / consumptionHistory.length;

    const consumptionMinimum = this.getMinimumConsumption(connectionType);

    if (consumptionMinimum >= averageConsumption) {
      return IneligibleReasonEnum.LOW_CONSUMPTION;
    }
  }

  private getAnualCO2Savings(consumptionHistory: number[]) {
    const CO2_EMISSION_FACTOR = 0.084;
    const anualConsumption = consumptionHistory.reduce((a, b) => a + b, 0);

    return anualConsumption * CO2_EMISSION_FACTOR;
  }

  // this could be stored in a database to avoid changing code
  private getMinimumConsumption(connectionType: ConnectionTypeEnum): number {
    const consumptionMinimumMap = new Map<ConnectionTypeEnum, number>();

    consumptionMinimumMap.set(ConnectionTypeEnum.SINGLE_PHASE, 400);
    consumptionMinimumMap.set(ConnectionTypeEnum.TWO_PHASE, 500);
    consumptionMinimumMap.set(ConnectionTypeEnum.THREE_PHASE, 750);

    return consumptionMinimumMap.get(connectionType);
  }
}
