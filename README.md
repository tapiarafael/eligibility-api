## Description

A POC of a backend API to check if a customer is eligible to use a determined service based on the consumption history, connection type, consumption class and tariff modality.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

### Endpoints
[POST] `/eligibility/check`

#### Request

| Name | Type | Description |
| --- | --- | --- |
| documentNumber | string | The customer's document number (CPF or CNPJ) |
| connectionType | string | The connection type of the customer (monofasico, bifasico, trifasico) |
| consumptionClass | string | The consumption class of the customer (residencial, industrial, comercial, rural, poderPublico) |
| tariffModality | string | The tariff modality of the customer (azul, branca, verde, convencional) |
| consumptionHistory | number[] | The consumption history of the customer (in kilowatt hours) |

<details>
<summary>Request example:</summary>

```json
{
  "documentNumber": "14041737706",
  "connectionType": "bifasico",
  "consumptionClass": "comercial",
  "tariffModality": "convencional",
  "consumptionHistory": [
    3878, 9760, 5976, 2797, 2481, 5731, 7538, 4392, 7859, 4160, 6941, 4597
  ]
}
```
</details>

#### Response

| Name | Type | Description |
| --- | --- | --- |
| eligible | boolean | Whether the customer is eligible to use the service |
| anualCO2Savings | number | The annual CO2 savings of the customer |
| ineligibilityReason | string[] | The reasons why the customer is ineligible |

<details>
<summary>Successful response example:</summary>

```json
{
  "eligible": true,
  "anualCO2Savings": 5553.24,
}
```
</details>

<details>
<summary>Failed response example:</summary>

```json
{
  "eligible": false,
  "ineligibilityReason": [
    "Classe de consumo não aceita",
    "Modalidade tarifária não aceita"
  ]
}
```
</details>

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

