1. Em nova aba do terminal, navegue até a pasta raiz do projeto.
2. Atualize o .env.prod com suas credenciais da AWS:

```bash
DYNAMO_DB_REGION=us-east-1
DYNAMO_DB_ACCESS_KEY_ID=fakeMyKeyId
DYNAMO_DB_SECRET_ACCESS_KEY=fakeSecretAccessKey
```

3. Execute o comando:

```bash
docker-compose --env-file .env.dev.serverless down (se estiver em execução)
docker-compose --env-file .env.dev.server down (se estiver em execução)
docker-compose --env-file .env.prod.server up
```

docker-compose --env-file .env.prod up --build: Executa a aplicação em um servidor, conectando-se ao DynamoDB hospedado na nuvem AWS.

4. Utilize uma ferramenta de API testing, como Postman ou Insomnia, para acessar os endpoints:

- GET [http://localhost:3000/client?documentNumber=11111111111]

- POST [http://localhost:3000/client]

#### Cliente Elegível:
**Entrada de Dados:**
```json
{
  "documentNumber": "11111111111"
}
```

**Saída de Dados:**
```json
{
    "annualCo2Savings": 496.272,
    "eligible": true
}
```

#### Cliente Inelegível:
**Entrada de Dados:**
```json
{
  "documentNumber": "11111111111",
  "connectionType": "monofasico",
  "consumptionClass": "residencial",
  "tariffModality": "azul",
  "consumptionHistory": {
      "values": [200, 300, 100]
  }
}
```

**Saída de Dados:**
```json
{
    "reasons": [
        "Consumption too low for connection type"
    ],
    "eligible": false
}
```