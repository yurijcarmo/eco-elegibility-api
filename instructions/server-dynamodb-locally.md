1. Em nova aba do terminal, navegue até a pasta raiz do projeto.
2. Execute o comando:

```bash
docker-compose --env-file .env.dev.server down (se estiver em execução)
docker-compose --env-file .env.prod.server down (se estiver em execução)
docker-compose --env-file .env.dev.server up
```
docker-compose --env-file .env.dev.server up: Executa a aplicação em um servidor tradicional, conectando-se ao DynamoDB configurado em modo local (offline).

3. Utilize uma ferramenta de API testing, como Postman ou Insomnia, para acessar os endpoints:

- GET [http://localhost:3000/client?documentNumber=11111111111]

- POST [http://localhost:3000/client]

#### Cliente Elegível:
**Entrada de Dados:**
```json
{
  "documentNumber": "13444262710"
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