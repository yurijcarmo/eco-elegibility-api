1. Em nova aba do terminal, navegue até a pasta raiz do projeto.
2. Execute o comando:

```bash
docker-compose --env-file .env.dev.server down (se estiver em execução)
docker-compose --env-file .env.prod.server down (se estiver em execução)
docker-compose --env-file .env.dev.serverless up
```
docker-compose --env-file .env.dev.serverless up --build: Executa a aplicação em modo serverless offline, simulando um ambiente serverless localmente para fins de teste, estabelecendo conexão com o DynamoDB também configurado para operar offline para fins de teste.

3. Utilize uma ferramenta de API testing, como Postman ou Insomnia, para acessar os endpoints:

   - GET [http://localhost:3001/dev/client?documentNumber=11111111111]

   - POST [http://localhost:3001/dev/client]

   **Atenção:** a porta é 3001 e o prefixo é dev.

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