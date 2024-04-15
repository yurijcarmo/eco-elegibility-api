# Instruções para Usuários do Linux

Atualizando o Sistema.
```bash
sudo apt update && apt upgrade
```

Instalando as Dependências.
```bash
sudo apt install apt-transport-https curl gnupg-agent ca-certificates software-properties-common -y
```

Instalando o Docker no Ubuntu 22.04.
Com os requisitos instalados, a próxima etapa é instalar o Docker. Instalaremos o Docker Community Edition (Docker CE), que é de código aberto e gratuito para download e uso.

Para fazer isso, adicionaremos a chave GPG:
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Como o Ubuntu 22.04 ainda não foi lançado oficialmente, adicione o repositório para o Ubuntu 20.04 Stable:
```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu focal stable"
```

Com a chave GPG e o repositório adicionados, execute o seguinte comando para instalar o Docker e os pacotes associados:
```bash
sudo apt install docker-ce docker-ce-cli containerd.io -y
```

# Permissões

Isso instala o Docker e todos os pacotes, bibliotecas e dependências adicionais exigidos pelo Docker e pacotes associados.

Se você está cansado de digitar `sudo` antes de cada comando Docker, você pode configurar as permissões adequadas para evitar isso. Siga os passos abaixo:

1. Se o grupo do Docker não existir, você pode criá-lo usando:
    ```bash
    sudo groupadd docker
    ```

2. Adicione seu usuário ao grupo do Docker para permitir o acesso:
    ```bash
    sudo usermod -aG docker $USER
    newgrp docker
    ```

3. Verificando a versão do Docker.
    ```bash
    docker --version
    ```

4. Verifique as permissões do socket do Docker:
    ```bash
    ls -l /var/run/docker.sock
    ```

5. Se necessário, ajuste as permissões do socket do Docker:
    ```bash
    sudo chmod 666 /var/run/docker.sock
    ```

6. Instalando Docker Compose

O Docker Compose é uma ferramenta simples que fornece uma maneira de orquestrar vários contêineres para trabalharem juntos, o que torna a implantação usando um arquivo YAML.
Depois de instalar o Docker, você pode prosseguir com a instalação do Docker Compose.

javascript
Copy code
```bash
sudo curl -L https://github.com/docker/compose/releases/download/v2.5.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
```

Configure as permissões corretas para o arquivo baixado.
```bash
sudo chmod +x /usr/local/bin/docker-compose
```

Verifique a instalação usando o comando a seguir.
```bash
docker-compose --version
```

É necessário reiniciar sua sessão ou fazer logout e login novamente para que as alterações de permissão entrem em vigor.