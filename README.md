# AgroSync

Trabalho de Conclusão de Curso do Ensino Médio Integrado ao Técnico em Desenvolvimento de Sistemas, apresentado à Etec de Hortolândia.

**Autores:** Jean de Melo Prates e Diogo Vieira da Costa

## Descrição

Este repositório contém a aplicação web do AgroSync, sistema de monitoramento agrícola desenvolvido com React e Firebase. A aplicação permite que o usuário se cadastre, faça login e acompanhe, em um painel próprio, informações sobre suas plantações — como leituras de solo, alertas, relatórios e preferências de configuração.

## Estrutura da aplicação

A aplicação é organizada em páginas e componentes reutilizáveis, seguindo uma separação clara entre autenticação, layout geral e funcionalidades específicas do painel agrícola. As páginas públicas incluem a apresentação do sistema, a tela de login/cadastro, a seção "Sobre" e a página de dicas de cultivo. As páginas privadas, acessíveis apenas após login, reúnem o painel principal, alertas, relatórios, configurações e o perfil do usuário.

## Autenticação

O acesso à aplicação é feito por meio de cadastro e login simples, com uso do Firebase Authentication. Para o cadastro, é exigido um nome com entre 2 e 25 caracteres e uma senha de 6 caracteres. Ao concluir o cadastro, uma mensagem de confirmação é exibida e o usuário é direcionado novamente à tela de login.

## Dados agrícolas

As informações do sistema — dados de usuários, configurações e leituras dos sensores de solo (histórico e valores atuais) — são armazenadas no Firebase Realtime Database. O acesso às leituras dos sensores é controlado por permissões associadas a cada usuário.

Os cartões e gráficos apresentados no painel utilizam, nesta versão, dados de demonstração para fins de apresentação, com suporte também a dados reais quando disponíveis. É possível exportar relatórios em formato de planilha (CSV) diretamente pelo navegador.

Vale destacar que, nesta etapa do projeto, o envio de notificações por e-mail e a comunicação direta com o hardware (ESP32) ainda não estão implementados nesta parte web; o firmware do dispositivo e o aplicativo mobile são desenvolvidos separadamente.

## Como executar o projeto

É necessário ter o Node.js instalado (versão 22.12 ou superior) e configurar as credenciais do projeto Firebase em um arquivo de variáveis de ambiente antes de iniciar a aplicação. Após a configuração, as dependências são instaladas e o projeto é executado em ambiente de desenvolvimento por meio dos comandos padrão do gerenciador de pacotes.

## Considerações finais

Esta versão da aplicação web reflete o estágio atual de desenvolvimento do AgroSync, com a estrutura de autenticação, navegação e as principais telas do painel já implementadas. Ajustes nas regras de acesso ao banco de dados e a integração completa com os demais módulos do projeto (hardware e aplicativo mobile) permanecem como próximas etapas.

---

Projeto acadêmico desenvolvido para a Etec de Hortolândia — Centro Paula Souza, 2026.