import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('/eligibility', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('POST /check', () => {
    it('should return 200 and the eligibility data when the request is valid', async () => {
      return request(app.getHttpServer())
        .post('/eligibility/check')
        .send({
          documentNumber: '14041737706',
          connectionType: 'bifasico',
          consumptionClass: 'comercial',
          tariffModality: 'convencional',
          consumptionHistory: [
            3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
            4597,
          ],
        })
        .then(({ status, body }) => {
          expect(status).toBe(200);
          expect(body).toHaveProperty('eligible');
          expect(body).toHaveProperty('anualCO2Savings');
        });
    });

    it('should return 200 when the documentNumber is a valid CPF', async () => {
      return request(app.getHttpServer())
        .post('/eligibility/check')
        .send({
          documentNumber: '14041737706',
          connectionType: 'bifasico',
          consumptionClass: 'comercial',
          tariffModality: 'convencional',
          consumptionHistory: [
            3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
            4597,
          ],
        })
        .then(({ status, body }) => {
          expect(status).toBe(200);
          expect(body.eligible).toBe(true);
        });
    });

    it('should return 200 when the documentNumber is a valid CNPJ', async () => {
      return request(app.getHttpServer())
        .post('/eligibility/check')
        .send({
          documentNumber: '10237481000101',
          connectionType: 'bifasico',
          consumptionClass: 'comercial',
          tariffModality: 'convencional',
          consumptionHistory: [
            3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941,
            4597,
          ],
        })
        .then(({ status, body }) => {
          expect(status).toBe(200);
          expect(body.eligible).toBe(true);
        });
    });

    describe('Field Validation', () => {
      describe('documentNumber', () => {
        it('should return 400 when the documentNumber is smaller than 11 characters', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '1404173770',
              connectionType: 'bifasico',
              consumptionClass: 'comercial',
              tariffModality: 'convencional',
              consumptionHistory: [
                3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
                6941, 4597,
              ],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'documentNumber must be a valid CPF or CNPJ',
              );
            });
        });

        it('should return 400 when the documentNumber is bigger than 14 characters', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '140417377013245',
              connectionType: 'bifasico',
              consumptionClass: 'comercial',
              tariffModality: 'convencional',
              consumptionHistory: [
                3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
                6941, 4597,
              ],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'documentNumber must be a valid CPF or CNPJ',
              );
            });
        });

        it('should return 400 when the documentNumber contain invalid characters', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '1234567891b',
              connectionType: 'bifasico',
              consumptionClass: 'comercial',
              tariffModality: 'convencional',
              consumptionHistory: [
                3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
                6941, 4597,
              ],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'documentNumber must be a valid CPF or CNPJ',
              );
            });
        });

        it('should return 400 when the documentNumber is not a string', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: 12341231,
              connectionType: 'bifasico',
              consumptionClass: 'comercial',
              tariffModality: 'convencional',
              consumptionHistory: [
                3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
                6941, 4597,
              ],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'documentNumber must be a valid CPF or CNPJ',
              );
            });
        });
      });

      describe('connectionType', () => {
        it('should return 400 when the connectionType is not a valid option of enum', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '14041737706',
              connectionType: 'invalid',
              consumptionClass: 'comercial',
              tariffModality: 'convencional',
              consumptionHistory: [
                3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
                6941, 4597,
              ],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'connectionType must be one of the following values: monofasico, bifasico, trifasico',
              );
            });
        });

        it('should return 400 when the connectionType is not a string', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '14041737706',
              connectionType: true,
              consumptionClass: 'comercial',
              tariffModality: 'convencional',
              consumptionHistory: [
                3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
                6941, 4597,
              ],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'connectionType must be one of the following values: monofasico, bifasico, trifasico',
              );
            });
        });
      });

      describe('consumptionClass', () => {
        it('should return 400 when the consumptionClass is not a valid option of enum', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '14041737706',
              connectionType: 'bifasico',
              consumptionClass: 'invalid',
              tariffModality: 'convencional',
              consumptionHistory: [
                3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
                6941, 4597,
              ],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'consumptionClass must be one of the following values: residencial, industrial, comercial, rural, poderPublico',
              );
            });
        });

        it('should return 400 when the consumptionClass is not a string', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '14041737706',
              connectionType: 'bifasico',
              consumptionClass: 1,
              tariffModality: 'convencional',
              consumptionHistory: [
                3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
                6941, 4597,
              ],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'consumptionClass must be one of the following values: residencial, industrial, comercial, rural, poderPublico',
              );
            });
        });
      });

      describe('tariffModality', () => {
        it('should return 400 when the tariffModality is not a valid option of enum', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '14041737706',
              connectionType: 'bifasico',
              consumptionClass: 'comercial',
              tariffModality: 'invalid',
              consumptionHistory: [
                3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
                6941, 4597,
              ],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'tariffModality must be one of the following values: azul, branca, verde, convencional',
              );
            });
        });

        it('should return 400 when the tariffModality is not a string', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '14041737706',
              connectionType: 'bifasico',
              consumptionClass: 'comercial',
              tariffModality: 10.3,
              consumptionHistory: [
                3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
                6941, 4597,
              ],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'tariffModality must be one of the following values: azul, branca, verde, convencional',
              );
            });
        });
      });

      describe('consumptionHistory', () => {
        it('should return 400 when the consumptionHistory is not an array of numbers', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '14041737706',
              connectionType: 'bifasico',
              consumptionClass: 'comercial',
              tariffModality: 'convencional',
              consumptionHistory: [true, 'true', {}],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'each value in consumptionHistory must be an integer number',
              );
            });
        });

        it('should return 400 when the consumptionHistory have at least 3 elements', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '14041737706',
              connectionType: 'bifasico',
              consumptionClass: 'comercial',
              tariffModality: 'convencional',
              consumptionHistory: [3878, 9760],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'consumptionHistory must contain at least 3 elements',
              );
            });
        });

        it('should return 400 when the consumptionHistory have more than 12 elements', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '14041737706',
              connectionType: 'bifasico',
              consumptionClass: 'comercial',
              tariffModality: 'convencional',
              consumptionHistory: [
                3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160,
                6941, 4597, 100, 100, 100, 100, 100, 100, 100, 100, 100,
              ],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'consumptionHistory must contain no more than 12 elements',
              );
            });
        });

        it('should return 400 when the consumptionHistory have values less than 0', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '14041737706',
              connectionType: 'bifasico',
              consumptionClass: 'comercial',
              tariffModality: 'convencional',
              consumptionHistory: [-100, -100, -100, -100, -100, -100, -100],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'each value in consumptionHistory must not be less than 0',
              );
            });
        });

        it('should return 400 when the consumptionHistory have values more than 99999', async () => {
          return request(app.getHttpServer())
            .post('/eligibility/check')
            .send({
              documentNumber: '14041737706',
              connectionType: 'bifasico',
              consumptionClass: 'comercial',
              tariffModality: 'convencional',
              consumptionHistory: [100000, 100000, 100000, 100000, 100000],
            })
            .then(({ status, body }) => {
              expect(status).toBe(400);
              expect(body.error).toEqual('Bad Request');
              expect(body.message).toContain(
                'each value in consumptionHistory must not be greater than 9999',
              );
            });
        });
      });
    });
  });
});
