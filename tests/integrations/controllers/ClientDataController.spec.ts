import request from 'supertest';
import { ClientDataService } from '../../../src/services';
import { ClientDataController } from '../../../src/controllers';
import { ClientDataServiceMock } from '../../../tests/mocks';
import { ClientDataDto } from '../../../src/dtos';
import {
    Test,
    TestingModule
} from '@nestjs/testing';
import {
    INestApplication,
    ValidationPipe
} from '@nestjs/common';
import {
    ConnectionTypeEnum,
    ConsumptionClassEnum,
    IneligibilityReasonEnum,
    TariffModalityEnum
} from '../../../src/enums';

describe('ClientDataController (integration)', () => {
    let app: INestApplication;
    let service: ClientDataService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ClientDataController],
            providers: [
                {
                    provide: ClientDataService,
                    useClass: ClientDataServiceMock
                },
            ],
        }).compile();

        app = module.createNestApplication();
        service = module.get<ClientDataService>(ClientDataService);
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('POST /client - should correctly evaluate eligibility for a biphasic, '
        + 'eligible client',
        async () => {
            const clientData: ClientDataDto = {
                documentNumber: '72639218000100',
                connectionType: ConnectionTypeEnum.BIPHASE,
                consumptionHistory: {
                    values: [100, 200, 300]
                },
                consumptionClass: ConsumptionClassEnum.RESIDENTIAL,
                tariffModality: TariffModalityEnum.GREEN
            };

            await request(app.getHttpServer())
                .post('/client')
                .send(clientData)
                .expect(201)
                .expect(response => {
                    expect(response.body.eligible).toBeTruthy();
                    expect(response.body.co2Savings).toEqual(444);
                });
        });

    it('POST /client - should identify ineligibility due to unacceptable '
        + 'consumption class',
        async () => {
            const clientData: ClientDataDto = {
                documentNumber: '34427742092',
                connectionType: ConnectionTypeEnum.TRIPHASE,
                consumptionHistory: {
                    values: [100, 200, 300]
                },
                consumptionClass: ConsumptionClassEnum.RESIDENTIAL,
                tariffModality: TariffModalityEnum.GREEN
            };

            await request(app.getHttpServer())
                .post('/client')
                .send(clientData)
                .expect(201)
                .expect(response => {
                    expect(response.body.eligible).toBeFalsy();
                    expect(response.body.reasons).toContain(
                        IneligibilityReasonEnum.CONSUMPTION_CLASS_NOT_ACCEPTED
                    );
                });
        });


    it('POST /client - should return error when essential client data is missing',
        async () => {
            const clientData = {};

            await request(app.getHttpServer())
                .post('/client')
                .send(clientData)
                .expect(400)
                .expect(res => {
                    expect(res.body.message).toEqual([
                        'The document number must be a valid CPF with '
                        + '11 digits or a valid CNPJ with 14 digits',
                        'documentNumber should not be empty',
                        'documentNumber must be a string',
                        'Invalid or missing connection type',
                        'connectionType should not be empty',
                        'Invalid or missing consumption class',
                        'consumptionClass should not be empty',
                        'Invalid or missing tariff modality',
                        'tariffModality should not be empty',
                        'consumptionHistory should not be empty'
                    ]);
                });
        });

    it('GET /client - should retrieve detailed client data using document number',
        async () => {
            const documentNumber = '34427742092';
            await request(app.getHttpServer())
                .get(`/client?documentNumber=${documentNumber}`)
                .expect(200)
                .expect(response => {
                    expect(response.body.documentNumber).toEqual(
                        documentNumber
                    );
                    expect(response.body.connectionType).toEqual(
                        ConnectionTypeEnum.BIPHASE
                    );
                });
        });

    it('GET /client - should return error for invalid document number format',
        async () => {
            const documentNumber = '12345';
            await request(app.getHttpServer())
                .get(`/client?documentNumber=${documentNumber}`)
                .expect(400)
                .expect(res => {
                    expect(res.body.message).toEqual(
                        'The document number must be a valid CPF with 11 '
                        + 'digits or a valid CNPJ with 14 digits'
                    );
                });
        });

    it('GET /client - should handle missing document number in query',
        async () => {
            await request(app.getHttpServer())
                .get('/client')
                .expect(400)
                .expect(res => {
                    expect(res.body.message).toEqual(
                        'Validation failed: Document number must not be empty'
                    );
                });
        });
});
