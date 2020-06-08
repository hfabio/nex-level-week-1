# nex-level-week-1
Projeto construído durante a semana "Next level week" com algumas modificações feitas por mim em algumas áreas do projeto.

# Índice

1. [Tecnologias utilizadas](#tecnologias-utilizadas)
    1. [Back-end](#back-end)
    2. [Frond-end](#front-end)
    3. [Mobile](#mobile)
2. [Como rodar/executar o projeto](#como-rodar-o-projeto)
3. [Agradecimentos](#agradecimentos)
___

Este projeto consiste numa stack utilizando `TypeScript` em todas as pontas.

## Tecnologias utilizadas

### Back-end

- [x] Node.js
- [x] TypeScript
- [x] Celebrate - para verificação de formulário
- [x] Express - para criação e gerenciamento do servidor, rotas etc
- [x] knex - para gestão de banco de dados (conexão, migrations, seeds)
- [x] multer - para lidar com o upload de imagem
- [x] sqlite3 - banco de dados utilizado no projeto

### Front-end

- [x] ReactJs utilizando componentes funcionais
- [x] TypeScript
- [x] Axios - requisições HTTP
- [x] Leaflet - criação do mapa e gerenciamento de geolocalização
- [x] Dropzone - upload da imagem
- [x] react-icons - lib que contém icons muito utilizados como do `FontAwesome`, `Feather` (muito utilizados neste projeto), `Ionicons`, `Ant`, `Material Icons`, `Bootstrap icons` etc
- [x] react-router-dom - para lidar com as rotas do front-end e mudar programaticamente entre os componentes

### Mobile

- [x] React Native
- [x] Expo
- [x] Axios
- [x] expo-google-fonts/roboto
- [x] expo-google-fonts/ubuntu
- [x] React-navigation - (native e stack) para lidar com as rotas e mudar programaticamente entre os componentes
- [x] expo-constants - para utilizar algumas informações do device e algumas funcionalidades a mais
- [x] expo-location - para obter dados de geolocalização
- [x] react-native-maps - para adicionar o mapa nativo no app
- [x] react-native-picker-select - para criar um select assim como do HTML, porém com comportamento nativo
- [x] react-native-gesture-handler - normalmente utilizada para lidar com os gestos do usuário, neste projeto utilizada para criar os botões interativos
- [x] react-native-safe-area-context - para criar uma view que não sobreponha áreas não utilizáveis da tela do dispositivo (como sob os controles ou abaixo do notch/statusbar)
- [x] react-native-svg - para utilizar imagens .svg
- [x] expo-mail-composer - para poder enviar um e-mail de dentro da aplicação


**É importante pontuar também o uso do `Linking` da biblioteca padrão do `react-native` para o envio do Whatsapp**


## Como rodar o projeto

1. - [Clone o projeto](#clone-o-projeto)
2. - [Configure o back-end](#configure-o-backend)
2. - [Configure o mobile](#configure-o-mobile)

### Clone o projeto

```bash
  git clone https://github.com/hfabio/next-level-week-1.git

  cd next-level-week-1
```

### Configure o backend

```bash
  cd back-end

  yarn run-db #para rodar as migrations e seeds do backend

  mv .env.example .env
```

>**Modifique o ip dentro do .env para o ip do seu computador**

Inicie o servidor
```bash
  yarn dev
```

### Configure o frontend

>**Modifique o ip dentro do arquivo da api para o ip do seu computador caso não esteja sendo utilizado no mesmo computador do backend ou caso a porta do backend tenha sido modificada**

path para o arquivo da api: `./front-end/src/services/api.ts`

```bash
cd back-end

yarn start
```

### Configure o mobile

>**Modifique o ip dentro do arquivo da api para o ip do seu computador**

path para o arquivo da api: `./mobile/src/services/api.ts`

```bash
cd mobile

yarn yarn start
```

# Agradecimentos

Aqui deixo uma mensagem de gratidão pela quantidade enorme de conhecimento adquirida com o desenvolvimento do projeto e por me possibilitar uma oportunidade de mergulhar mais a fundo no `react-native` com `expo`:

Muito obrigado a toda staff da [RocketSeat](http://rocketseat.com.br/), vocês são demais.

Em particular meus agradecimentos e congratulações ao @diego3g por todo o empenho e conseguir tornar horas de aula em algo leve e divertido e ao @maykbrito por trazer tambem algumns sneak peeks no css e dando dicas excelentes.

| [<img src="https://avatars0.githubusercontent.com/u/28929274?v=4" width="200px"><br><sub>@rocketseat</sub>](https://github.com/Rocketseat) | [<img src="https://avatars0.githubusercontent.com/u/2254731?&u=c34dfbafb54d6bb7c3f715ebe93a811cc7355771&v=4" width="200px"><br><small>@diego3g</small>](https://github.com/diego3g) | [<img src="https://avatars2.githubusercontent.com/u/6643122?u=1e9e1f04b76fb5374e6a041f5e41dce83f3b5d92&v=4" width="200px"><br><sub>@maykbrito</sub>](https://github.com/maykbrito) |
| :---: | :---: | :---: |
