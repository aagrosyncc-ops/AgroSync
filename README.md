# AgroSync

Trabalho de Conclusão de Curso do Ensino Médio Integrado ao Técnico em Desenvolvimento de Sistemas, apresentado à Etec de Hortolândia.

**Autores:** Jean de Melo Prates e Diogo Vieira da Costa
**Orientação:** Profª. Priscila Batista Martins

## Descrição

O AgroSync é um sistema de monitoramento agrícola baseado em Internet das Coisas (IoT), voltado ao acompanhamento de variáveis do solo e do ambiente em pequenos cultivos. O projeto tem como objetivo auxiliar cultivadores domésticos, urbanos e pequenos produtores a identificar, em tempo real, condições inadequadas de irrigação, luminosidade e nutrientes, contribuindo para a redução do desperdício de água e para um manejo mais eficiente do cultivo.

O trabalho está alinhado aos Objetivos de Desenvolvimento Sustentável (ODS) da ONU, em especial o ODS 2 (Fome Zero e Agricultura Sustentável) e o ODS 13 (Ação Contra a Mudança Global do Clima).

## Funcionamento

Um sensor industrial 7 em 1, conectado ao microcontrolador ESP32 por meio do protocolo RS485 (conversor MAX485), realiza a leitura de nitrogênio, fósforo, potássio, pH, temperatura, umidade e condutividade elétrica do solo. Um sensor LDR complementa a coleta com a medição de luminosidade. Os dados são enviados diretamente do ESP32 ao Firebase, que armazena as informações e as disponibiliza para exibição em tempo real na aplicação.

## Funcionalidades

- Painel com indicadores de NPK, pH, temperatura, umidade e luminosidade
- Gráficos históricos dos parâmetros monitorados
- Sistema de alertas por nível de criticidade
- Geração de relatórios 
- Página de orientações agronômicas por cultura
- Perfil do usuário e configurações da aplicação

## Tecnologias

- **Front-end web:** React.js
- **Front-end mobile:** React Native
- **Banco de dados:** Firebase
- **Hardware:** ESP32, sensor NPK 7 em 1 (RS485/Modbus RTU), conversor MAX485, sensor de luminosidade LDR

## Status

Projeto em desenvolvimento. Já foram concluídas a pesquisa de campo, a fundamentação bibliográfica e o protótipo visual das telas principais. O desenvolvimento do painel funcional e a integração entre o hardware e o Firebase encontram-se parcialmente concluidos.

## Referências

As referências bibliográficas completas encontram-se no relatório do TCC.

---

Projeto acadêmico desenvolvido para a Etec de Hortolândia — Centro Paula Souza, 2026.
