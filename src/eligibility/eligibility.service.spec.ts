import { Test, TestingModule } from '@nestjs/testing';
import { EligibilityService } from './eligibility.service';
import {
  ConnectionTypeEnum,
  ConsumptionClassEnum,
  IneligibleReasonEnum,
  TariffModalityEnum,
} from './types/check-eligibility';

describe('EligibilityService', () => {
  let service: EligibilityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EligibilityService],
    }).compile();

    service = module.get<EligibilityService>(EligibilityService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return eligible when is a valid request using', () => {
    const response = service.check({
      documentNumber: '14041737706',
      connectionType: ConnectionTypeEnum.TWO_PHASE,
      consumptionClass: ConsumptionClassEnum.COMMERCIAL,
      tariffModality: TariffModalityEnum.CONVENTIONAL,
      consumptionHistory: [
        3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597,
      ],
    });

    expect(response).toEqual({
      eligible: true,
      anualCO2Savings: 5553.240000000001,
    });
  });

  it('should calculate the anual CO2 savings correctly when is eligible', () => {
    const response = service.check({
      documentNumber: '14041737706',
      connectionType: ConnectionTypeEnum.TWO_PHASE,
      consumptionClass: ConsumptionClassEnum.COMMERCIAL,
      tariffModality: TariffModalityEnum.CONVENTIONAL,
      consumptionHistory: [
        3878, 9760, 5976, 2797, 2481, 8000, 7538, 4392, 7859, 4160, 3219, 6000,
      ],
    });

    expect(response).toEqual({
      eligible: true,
      anualCO2Savings: 5549.04,
    });
  });

  describe('Consumption Class', () => {
    it('should return ineligible when consumption class is Rural', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.TWO_PHASE,
        consumptionClass: ConsumptionClassEnum.RURAL,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      });

      expect(response).toEqual({
        eligible: false,
        ineligibilityReason: [IneligibleReasonEnum.FORBIDDEN_CONSUMPTION_CLASS],
      });
    });

    it('should return ineligible when consumption class is Public Authorities', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.TWO_PHASE,
        consumptionClass: ConsumptionClassEnum.PUBLIC_AUTHORITIES,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      });

      expect(response).toEqual({
        eligible: false,
        ineligibilityReason: [IneligibleReasonEnum.FORBIDDEN_CONSUMPTION_CLASS],
      });
    });

    it('should return eligible when consumption class is Industrial', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.TWO_PHASE,
        consumptionClass: ConsumptionClassEnum.INDUSTRIAL,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      });

      expect(response).toEqual({
        eligible: true,
        anualCO2Savings: 5553.240000000001,
      });
    });

    it('should return eligible when consumption class is Residential', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.TWO_PHASE,
        consumptionClass: ConsumptionClassEnum.RESIDENTIAL,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      });

      expect(response).toEqual({
        eligible: true,
        anualCO2Savings: 5553.240000000001,
      });
    });

    it('should return eligible when consumption class is Commercial', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.TWO_PHASE,
        consumptionClass: ConsumptionClassEnum.COMMERCIAL,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      });

      expect(response).toEqual({
        eligible: true,
        anualCO2Savings: 5553.240000000001,
      });
    });
  });

  describe('Tariff Modality', () => {
    it('should return ineligible when tariff modality is Blue', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.TWO_PHASE,
        consumptionClass: ConsumptionClassEnum.COMMERCIAL,
        tariffModality: TariffModalityEnum.BLUE,
        consumptionHistory: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      });

      expect(response).toEqual({
        eligible: false,
        ineligibilityReason: [IneligibleReasonEnum.FORBIDDEN_TARIFF_MODALITY],
      });
    });

    it('should return ineligible when tariff modality is Green', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.TWO_PHASE,
        consumptionClass: ConsumptionClassEnum.COMMERCIAL,
        tariffModality: TariffModalityEnum.GREEN,
        consumptionHistory: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      });

      expect(response).toEqual({
        eligible: false,
        ineligibilityReason: [IneligibleReasonEnum.FORBIDDEN_TARIFF_MODALITY],
      });
    });

    it('should return eligible when tariff modality is Conventional', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.TWO_PHASE,
        consumptionClass: ConsumptionClassEnum.COMMERCIAL,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [
          3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
          4597,
        ],
      });

      expect(response).toEqual({
        eligible: true,
        anualCO2Savings: 5553.240000000001,
      });
    });
  });

  describe('Consumption History', () => {
    it('should return ineligible when average consumption is less than 300khw for single phase', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.SINGLE_PHASE,
        consumptionClass: ConsumptionClassEnum.COMMERCIAL,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [100, 100, 100, 100, 100, 100, 100, 100],
      });

      expect(response).toEqual({
        eligible: false,
        ineligibilityReason: [IneligibleReasonEnum.LOW_CONSUMPTION],
      });
    });

    it('should return eligible when average consumption is more than 300khw for single phase', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.SINGLE_PHASE,
        consumptionClass: ConsumptionClassEnum.COMMERCIAL,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [
          3878, 9760, 5976, 2797, 2481, 8000, 7538, 4392, 7859, 4160, 3219,
          6000,
        ],
      });

      expect(response).toEqual({
        eligible: true,
        anualCO2Savings: 5549.04,
      });
    });

    it('should return ineligible when average consumption is less than 500khw for two phase', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.TWO_PHASE,
        consumptionClass: ConsumptionClassEnum.COMMERCIAL,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [100, 100, 100, 100, 100, 100, 100, 100],
      });
      expect(response).toEqual({
        eligible: false,
        ineligibilityReason: [IneligibleReasonEnum.LOW_CONSUMPTION],
      });
    });

    it('should return eligible when average consumption is more than 500khw for two phase', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.TWO_PHASE,
        consumptionClass: ConsumptionClassEnum.COMMERCIAL,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [
          3878, 9760, 5976, 2797, 2481, 8000, 7538, 4392, 7859, 4160, 3219,
          6000,
        ],
      });

      expect(response).toEqual({
        eligible: true,
        anualCO2Savings: 5549.04,
      });
    });

    it('should return ineligible when average consumption is less than 750khw for three phase', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.THREE_PHASE,
        consumptionClass: ConsumptionClassEnum.COMMERCIAL,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [100, 100, 100, 100, 100, 100, 100, 100],
      });
      expect(response).toEqual({
        eligible: false,
        ineligibilityReason: [IneligibleReasonEnum.LOW_CONSUMPTION],
      });
    });

    it('should return eligible when average consumption is more than 750khw for three phase', () => {
      const response = service.check({
        documentNumber: '14041737706',
        connectionType: ConnectionTypeEnum.THREE_PHASE,
        consumptionClass: ConsumptionClassEnum.COMMERCIAL,
        tariffModality: TariffModalityEnum.CONVENTIONAL,
        consumptionHistory: [
          3878, 9760, 5976, 2797, 2481, 8000, 7538, 4392, 7859, 4160, 3219,
          6000,
        ],
      });
      expect(response).toEqual({
        eligible: true,
        anualCO2Savings: 5549.04,
      });
    });
  });
});
