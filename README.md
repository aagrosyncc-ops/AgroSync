# AgroSync

Monitoramento agrícola com React, TypeScript, Vite, Firebase Authentication e Realtime Database. Integrantes: Diogo Vieira da Costa e Jean de Melo Prates.

## Executar

Use Node.js 22.12+ ou 24. Crie `.env.local` na raiz com os valores do seu projeto Firebase:

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_MEASUREMENTID=
```

Confira os nomes em `src/firebase/FirebaseConexao.tsx`. Execute:

```sh
npm install --legacy-peer-deps --package-lock=false
npm run dev
```

As versões seguem o package.json do Cinefilia, com Recharts acrescentado para os gráficos do AgroSync. O parâmetro `--legacy-peer-deps` é necessário porque o exemplo declara @rolldown/plugin-babel 0.2.0, enquanto @vitejs/plugin-react 6.0.0 declara compatibilidade opcional com a série 0.1.7. Não há package-lock.json nesta entrega, seguindo a estrutura fornecida do professor.

## Organização

`main.tsx` renderiza FirebaseConexao e App. App envolve Rotas com AutenticacaoProvider e LayoutProvider. Rotas reúne BrowserRouter, Routes e Route. Principal compõe o menu e Outlet. RotaProtegida recebe children e redireciona visitantes sem sessão para `/`.

```text
src/
  assets/imagens/
  componentes/
    layout/
  contextos/
  firebase/
  hooks/
  paginas/
  rotas/
  tipos/
  App.tsx
  main.tsx
  global.css
```

Os componentes e as páginas usam funções nomeadas e CSS Modules importado como `estilos`; App usa export default. Os tipos de domínio ficam em tipos, e os hooks concentram acesso aos dados. As páginas, textos, imagens, gráficos e estilos agrícolas pertencem ao AgroSync.

## Autenticação conforme Cinefilia

Somente cadastro, login e logout. useAutenticacao expõe criarAutenticacaoUsuario, validarUsuario e deslogar, retornando Promise<string> com `sucesso` ou mensagem de erro. AutenticacaoContexto usa onAuthStateChanged e UsuarioTipo com codigo e email. Os formulários usam FormValues explícito, React Hook Form, Zod, dadosUsuario e ModalMensagem.

O cadastro exige nome entre 2 e 25 caracteres e senha de exatamente 6 caracteres; ao fechar o modal, encerra a sessão e volta ao login, como no exemplo. O nome informado aparece na mensagem; o cadastro básico do professor não grava um perfil no Realtime Database. O perfil agrícola pode ser preenchido na página Perfil.

Rotas públicas: `/`, `/usuario`, `/sobre`, `/dicas`. Rotas privadas: `/principal`, `/principal/alertas`, `/principal/relatorios`, `/principal/configuracoes`, `/principal/perfil`.

FirebaseConexao reproduz o teste do exemplo com uma tentativa de login inválida e uma tela de conexão. Esse comportamento também foi mantido deliberadamente.

## Dados agrícolas

O backend é Firebase; não existe servidor Express nesta pasta. Os caminhos preservados são `usuarios/{codigo}`, `usuarios/{codigo}/configuracoes`, `sensores/solo/atual` e `sensores/solo/historico/{timestamp}`. codigo corresponde ao uid do Firebase. As permissões administrativas dos sensores dependem de `acessosSensores/{uid}`.

Cartões e gráficos mantêm a fonte estática da apresentação original. Alertas e relatórios usam o hook de dados reais; a variante simulada também foi mantida. CSV é gerado no navegador. Preferências de notificações não implementam envio de emails, e o intervalo configurado não programa o ESP32. Firmware e aplicativo mobile não foram fornecidos nesta pasta.

Os arquivos locais de Firebase CLI e regras foram retirados para seguir a estrutura solicitada. Isso não altera regras já publicadas. As regras fornecidas na base exigiam email verificado e não contemplavam configuracoes: precisam ser ajustadas no backend para permitir este fluxo, mantendo acesso restrito ao proprietário e as permissões dos sensores. Nenhuma regra remota foi publicada nesta refatoração.

## Como rodar os testes

Execute `npm run build` para compilar o projeto e `npm run lint` para checar o ESLint.
