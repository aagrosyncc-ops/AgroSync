# AgroSync Mobile

Esse é o app mobile do AgroSync, feito em React Native com Expo. É a versão pra celular do projeto AgroSync (que também tem uma versão web), um sistema de monitoramento de solo pra plantação usando sensores (NPK, pH, temperatura, umidade, luminosidade).

Projeto feito pro TCC.

## O que já tem no app

- Login e cadastro de usuário (usando Firebase)
- Dashboard inicial com o nome do usuário
- Menu embaixo com Dashboard, Sensores, Alertas, Configurações e Perfil
- Uma tela "Sobre" contando um pouco do projeto e quem fez (prelog)

Ainda não tem os dados reais dos sensores, por enquanto as telas de Sensores/Alertas/Configurações estão só de placeholder mesmo, vou preencher depois.

## Tecnologias usadas

- Expo / React Native
- Expo Router (pra navegação, usando o sistema de pastas dele)
- Firebase (só o Authentication por enquanto)
- TypeScript
- AsyncStorage (pra salvar o login no celular)

## Estrutura das pastas

Segui um padrão parecido com um projeto de referência que usei de base (eureca), organizando assim:

```
src/
  app/            -> as telas em si (o expo-router usa essa pasta pra criar as rotas)
    index.tsx      -> tela de login
    cadastro.tsx     -> tela de cadastro
    sobre.tsx          -> tela sobre o projeto
    (auth)/              -> telas que só aparecem depois de logado (tem o menu)
      dashboard.tsx
      sensores.tsx
      alertas.tsx
      configuracoes.tsx
      perfil.tsx
  components/    -> componentes que uso em mais de um lugar
  constants/      -> arquivo de cores e fontes do app
  contexto/         -> guarda o usuário logado (pra qualquer tela acessar)
  hooks/            -> funções de login/cadastro/logout
  servicos/          -> configuração do firebase
  tipos/               -> os tipos do typescript (tipo o formato do usuário)
```

## Como rodar

Primeiro instala as dependências:

```
npm install
```

Depois cria um arquivo `.env` na raiz com as chaves do firebase (as chaves estão com os integrantes):

```
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

E roda:

```
npx expo start
```

Aí é só escanear o QR code com o Expo Go no celular.

## Sobre o login

Uso o Firebase só pra validar email/senha (login e criar conta) por enquanto. Depois que confirma, e salvo os dados do usuário no AsyncStorage do celular (por conta própria, não é automático do firebase), pra não precisar logar toda hora que abre o app.

Basicamente: `useAutenticacao()` é o hook que tem as funções de login/cadastro/sair, e o `AutenticacaoContexto` é quem guarda se tem usuário logado ou não, disponível em qualquer tela do app.

## Integrantes

- Diogo Vieira da Costa
- Jean de Melo Prates