# Especificação do Weather App

## Overview

Aplicação web de previsão do tempo para consulta pessoal rápida. A pessoa usuária pesquisa uma cidade e consulta as condições atuais e a previsão para cinco dias, podendo alternar a unidade de temperatura entre Celsius e Fahrenheit.

**Objetivos do produto**
- Ajudar a tomar decisões cotidianas com informações meteorológicas atuais e fáceis de localizar.
- Permitir planejamento dos próximos dias com uma previsão de cinco dias.
- Oferecer uma experiência prioritariamente mobile, clara e resiliente a falhas externas.

**Público-alvo**
- **Decisor do dia a dia:** consulta principalmente no celular para decidir o que vestir ou levar.
- **Viajante planejador:** consulta no celular ou desktop para organizar os próximos dias.

## Functional Requirements

- **RF1 — Busca e seleção de cidade:** permitir enviar uma busca por nome de cidade pelo botão de busca ou pela tecla Enter; exibir localidades encontradas com nome, país e região/estado quando disponível; permitir selecionar uma única localidade antes de consultar seu clima.
- **RF2 — Condições atuais:** para a localidade selecionada, apresentar temperatura, condição meteorológica, umidade relativa, velocidade do vento, pressão atmosférica, precipitação e horário de referência local.
- **RF3 — Previsão de cinco dias:** apresentar cinco datas locais consecutivas, incluindo o dia atual da localidade selecionada, com temperaturas mínima e máxima, condição meteorológica, precipitação total e velocidade máxima do vento por dia.
- **RF4 — Unidade de temperatura:** permitir alternar entre Celsius e Fahrenheit e atualizar todas as temperaturas atuais e previstas sem alterar outros dados ou fazer nova consulta.
- **RF5 — Estados da experiência:** apresentar estados inicial, carregamento, resultados, sem resultados, sem dados e erro; falhas devem informar a ação de recuperação disponível e não atribuir dados antigos à cidade selecionada.

## User Stories

- **US1 (RF1) — Decisor do dia a dia:** Como decisor do dia a dia, quero buscar minha cidade e escolher a localidade correta entre as sugestões para consultar o clima do lugar onde estou ou para onde vou.
- **US2 (RF2) — Decisor do dia a dia:** Como decisor do dia a dia, quero ver as condições meteorológicas atuais da cidade selecionada para decidir rapidamente que roupa usar ou se devo levar um guarda-chuva.
- **US3 (RF3) — Viajante planejador:** Como viajante planejador, quero consultar as condições previstas para hoje e os quatro dias seguintes para organizar minha semana.
- **US4 (RF4) — Viajante planejador:** Como viajante planejador, quero alternar entre Celsius e Fahrenheit para interpretar as temperaturas na unidade que prefiro.
- **US5 (RF5) — Decisor do dia a dia:** Como decisor do dia a dia, quero saber quando a busca está carregando, falhou ou não encontrou dados e poder tentar novamente para concluir minha consulta.

## Acceptance Criteria

### US1 e US2 — Busca e condições atuais

- **AC1.1 (RF1): Given** uma busca enviada com texto após remover espaços externos; **When** o geocoding retorna localidades; **Then** cada opção mostra nome da cidade e país e, quando disponível, estado ou região; opções com o mesmo nome de cidade podem ser distinguidas pelo contexto geográfico.
- **AC1.2 (RF1): Given** uma ou mais localidades encontradas; **When** a pessoa seleciona uma opção; **Then** a opção fica identificada como selecionada e a consulta meteorológica é feita para essa localidade, não para outra opção da lista.
- **AC1.3 (RF1): Given** uma busca sem localidades correspondentes; **When** a busca termina; **Then** a aplicação informa que não encontrou resultados e não apresenta dados meteorológicos de outra localidade.
- **AC1.4 (RF1): Given** o campo de busca vazio ou contendo somente espaços; **When** a pessoa envia a busca; **Then** nenhuma busca de localidade ou consulta meteorológica é iniciada e a aplicação solicita um nome de cidade.
- **AC1.5 (RF2): Given** uma resposta completa de condições atuais; **When** os dados são exibidos; **Then** são apresentados temperatura em °C ou °F, condição em pt-BR, umidade relativa em %, velocidade do vento em km/h, pressão em hPa, precipitação em mm e horário de referência no fuso local da cidade.
- **AC1.6 (RF2): Given** uma localidade selecionada e uma resposta meteorológica correspondente; **When** as condições atuais são exibidas; **Then** a identificação da cidade corresponde à seleção e os valores exibidos pertencem a essa resposta, não a uma consulta anterior.
- **AC1.7 (RF1): Given** uma busca com letras acentuadas, espaços internos, hífen ou apóstrofo, como “São Paulo” ou “L'Haÿ-les-Roses”; **When** a pessoa envia a busca; **Then** o texto é enviado sem remover esses caracteres, e a aplicação exibe os resultados correspondentes ou o estado sem resultados, sem travar.

### US3 — Previsão

- **AC2.1 (RF3): Given** a data local atual D da cidade selecionada e uma resposta de previsão; **When** a previsão é exibida; **Then** há exatamente cinco datas consecutivas de D a D+4, inclusive, determinadas pelo fuso horário da cidade selecionada.
- **AC2.2 (RF3): Given** dados de previsão para uma data; **When** a data é exibida; **Then** são apresentados temperaturas mínima e máxima com a unidade selecionada, condição em pt-BR, precipitação total em mm e velocidade máxima do vento em km/h.
- **AC2.3 (RF3): Given** uma previsão para cinco datas; **When** os dias são exibidos; **Then** suas datas aparecem identificadas em ordem cronológica.
- **AC2.4 (RF3): Given** um ou mais valores ausentes na resposta de previsão; **When** a previsão é exibida; **Then** cada valor ausente é identificado como indisponível e nenhum valor meteorológico é inventado para completá-lo.

### US4 — Unidade de temperatura

- **AC3.1 (RF4): Given** uma sessão sem unidade escolhida anteriormente; **When** temperaturas são exibidas pela primeira vez; **Then** todas são apresentadas em Celsius e identificadas com °C.
- **AC3.2 (RF4): Given** valores de origem em Celsius; **When** a pessoa seleciona Fahrenheit; **Then** todas as temperaturas atuais e previstas exibem round_half_away_from_zero(C × 9/5 + 32) e o rótulo °F.
- **AC3.3 (RF4): Given** valores de origem em Celsius e Fahrenheit selecionado; **When** a pessoa seleciona Celsius; **Then** todas as temperaturas exibem round_half_away_from_zero(C) e o rótulo °C; a conversão usa o valor de origem, não o valor Fahrenheit já arredondado.
- **AC3.4 (RF4): Given** cidade, datas e dados meteorológicos exibidos; **When** a pessoa alterna a unidade; **Then** somente os valores de temperatura e seus rótulos de unidade mudam; cidade, datas, condição, umidade, vento, pressão e precipitação permanecem iguais.

### US5 — Carregamento, erros e ausência de dados

- **AC4.1 (RF5): Given** uma busca ou consulta iniciada; **When** a resposta ainda não foi recebida; **Then** o estado de carregamento aparece em até 100 ms após o envio.
- **AC4.2 (RF5): Given** uma busca ou consulta que falhou ou excedeu 10 segundos; **When** a falha é apresentada; **Then** a mensagem identifica que a consulta não foi concluída e oferece nova tentativa para o mesmo texto de busca ou cidade selecionada.
- **AC4.3 (RF5): Given** uma resposta sem nenhum campo meteorológico válido; **When** a aplicação apresenta o resultado; **Then** informa que não há dados disponíveis e não exibe valores meteorológicos nem dados de outra localidade.
- **AC4.4 (RF5): Given** uma consulta com erro para uma cidade selecionada; **When** a pessoa aciona a nova tentativa; **Then** uma nova consulta para a mesma cidade começa, o carregamento aparece e o erro anterior deixa de ser apresentado como resultado atual.
- **AC4.5 (RF2, RF3, RF5): Given** uma resposta com pelo menos um campo meteorológico válido e outros campos ausentes; **When** os dados são exibidos; **Then** cada valor disponível é apresentado, cada campo ausente recebe o rótulo “Indisponível” e nenhum valor é inferido; datas conhecidas da previsão continuam identificadas.
- **AC4.6 (RF5): Given** uma consulta para uma nova cidade enquanto dados de outra cidade estão visíveis; **When** a nova cidade é selecionada; **Then** dados anteriores não são apresentados como pertencentes à nova seleção, inclusive durante carregamento ou erro.
- **AC4.7 (RF5): Given** uma sessão sem cidade selecionada; **When** a aplicação é aberta; **Then** apresenta o campo de busca e uma solicitação para pesquisar uma cidade, não inicia geolocalização nem consulta meteorológica e não exibe valores meteorológicos.

## Non-Functional Requirements

- **RNF1 — Performance:** em teste com cache frio, perfil Lighthouse mobile padrão e rede simulada de 1,6 Mbps de download, 750 Kbps de upload e 150 ms de latência, o LCP deve ser ≤ 2,5 s no percentil 75 de 20 execuções. Após envio de busca, o estado de carregamento deve aparecer em ≤ 100 ms; cada solicitação externa deve terminar em resposta ou timeout em até 10 s.
- **RNF2 — Responsividade:** a interface deve funcionar em viewports de 320 px, 768 px e 1280 px, sem rolagem horizontal da página nem perda de conteúdo ou ações essenciais.
- **RNF3 — Acessibilidade:** atender WCAG 2.2 nível AA. Busca, seleção de resultado, alternância de unidade e nova tentativa devem funcionar somente por teclado, com foco visível; campos devem ter nome acessível e mudanças de carregamento, erro e resultado devem ser anunciadas por tecnologia assistiva.
- **RNF4 — Resiliência:** falhas de rede ou do serviço de dados não devem deixar a interface sem resposta; apresentar erro e recuperação conforme RF5 e AC4.2–AC4.6.
- **RNF5 — Fonte pública sem chave:** usar Open-Meteo para geocoding e dados meteorológicos sem exigir chave de API. As unidades apresentadas devem seguir RF2, RF3 e RF4, independentemente das unidades retornadas pela fonte.
- **RNF6 — Comunicação de erros:** mensagens devem estar em pt-BR, indicar que a operação não foi concluída e oferecer nova tentativa quando aplicável; não expor detalhes técnicos da API.
- **RNF7 — Idioma e formatação:** interface em pt-BR; datas e horários devem usar formatação pt-BR e o fuso horário da cidade selecionada.
- **RNF8 — Compatibilidade:** suportar as duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari, em desktop e dispositivos móveis.
- **RNF9 — Privacidade:** não exigir conta nem persistir consultas ou localidades entre sessões; a busca enviada é usada somente para obter resultados do serviço de geocoding.

## Rastreabilidade

A matriz associa cada história aos critérios que a verificam e aos RNFs que condicionam sua implementação e validação. Critérios compartilhados aparecem em mais de uma história quando cobrem partes distintas da jornada.

| User Story | Acceptance Criteria | Requisitos não funcionais relevantes |
| --- | --- | --- |
| **US1 — Busca e seleção de cidade** | AC1.1–AC1.4, AC1.7, AC4.1–AC4.2, AC4.6–AC4.7 | RNF1 (tempo de resposta), RNF2 (viewports), RNF3 (teclado e anúncios), RNF5 (geocoding), RNF6 (mensagens de erro), RNF7 (idioma), RNF8 (navegadores), RNF9 (privacidade). |
| **US2 — Condições atuais** | AC1.5–AC1.6, AC4.1–AC4.6 | RNF1 (tempo de resposta), RNF2 (viewports), RNF3 (acessibilidade), RNF4 (recuperação), RNF5 (fonte e unidades), RNF6 (mensagens de erro), RNF7 (idioma, data e fuso), RNF8 (navegadores). |
| **US3 — Previsão de cinco dias** | AC2.1–AC2.4, AC4.1–AC4.6 | RNF1 (tempo de resposta), RNF2 (viewports), RNF3 (acessibilidade), RNF4 (recuperação), RNF5 (fonte e unidades), RNF6 (mensagens de erro), RNF7 (idioma, data e fuso), RNF8 (navegadores). |
| **US4 — Unidade de temperatura** | AC3.1–AC3.4 | RNF2 (viewports), RNF3 (teclado e foco), RNF5 (unidades), RNF7 (rótulos e formatação), RNF8 (navegadores). |
| **US5 — Estados, erros e nova tentativa** | AC4.1–AC4.7 | RNF1 (limites de resposta), RNF2 (viewports), RNF3 (foco e anúncios), RNF4 (resiliência), RNF6 (mensagens e recuperação), RNF7 (idioma), RNF8 (navegadores). |

**Uso para testes:** cada AC deve ter ao menos um teste que verifique seu resultado observável. Validar RNF1 com medições sob as condições definidas; RNF2 e RNF8 com a matriz de viewports e navegadores; RNF3 por teclado, foco, nomes acessíveis e anúncios; RNF9 verificando ausência de persistência entre sessões.

## Edge Cases

- **Busca vazia:** aplicar AC1.4; nenhum pedido externo é iniciado.
- **Cidade inexistente ou geocoding sem resultados:** aplicar AC1.3; não iniciar consulta meteorológica sem uma localidade selecionada.
- **Nomes com caracteres válidos:** aplicar AC1.7; em consultas sem correspondência, exibir o estado sem resultados.
- **Localidades homônimas:** exibir país e, quando disponível, região/estado para distinguir as opções antes da seleção.
- **Erro de rede, API ou limite de uso:** aplicar AC4.2; não mostrar valores antigos como atuais e permitir tentativa manual.
- **Timeout:** após 10 s sem resposta, encerrar o carregamento e oferecer nova tentativa, conforme AC4.2.
- **Resposta parcial ou sem dados utilizáveis:** aplicar AC4.3 e AC4.5. Zero é um valor válido; campo ausente, nulo ou não numérico é indisponível.
- **Código meteorológico não reconhecido:** mostrar “Condição indisponível” para esse campo e manter os demais dados válidos.
- **Troca de cidade durante uma consulta:** aplicar AC4.6; somente resultados da seleção mais recente podem ser apresentados.
- **Fuso horário ausente na resposta:** não inferir o fuso pelo dispositivo; mostrar erro de dados indisponíveis e permitir nova tentativa.
- **Temperaturas negativas ou extremas:** converter usando os valores de origem e o arredondamento definido em AC3.2–AC3.3.
- **Viewport mínimo:** em 320 px, controles e resultados permanecem visíveis e operáveis por toque e teclado, sem sobreposição.

## Assumptions

- A consulta meteorológica depende de conexão com a internet; não há funcionamento offline garantido.
- O produto é para uso individual; não requer conta, autenticação ou persistência em servidor.
- Os navegadores utilizados são versões modernas evergreen.
- A fonte de dados do produto é o Open-Meteo, sem chave de API.
- A previsão inclui hoje e os quatro dias seguintes no fuso horário da cidade selecionada.
- Celsius é a unidade padrão inicial.
- As unidades fixas são: umidade relativa em %, vento em km/h, pressão em hPa e precipitação em mm. Alternar temperatura não altera essas unidades.
- A regra de arredondamento para temperaturas é para o inteiro mais próximo, com empate afastando-se de zero; os valores originais em Celsius são preservados para conversão.
- A interface será apresentada em pt-BR.
- Não haverá geolocalização automática na primeira versão; a pessoa usuária escolhe a cidade pela busca.

## Risks

| Risco | Probabilidade | Impacto | Mitigação |
| --- | --- | --- | --- |
| Limitação de uso ou indisponibilidade da API | Média | Alto | Aplicar timeout, comunicar falhas, permitir nova tentativa e não apresentar dados incorretos como atuais. |
| Ambiguidade entre cidades homônimas | Alta | Médio | Exibir país e, quando disponíveis, estado ou região nas opções de busca. |
| Inconsistência da experiência entre dispositivos | Média | Médio | Priorizar mobile e verificar a experiência em larguras mobile e desktop. |
| Falha na conexão da pessoa usuária | Média | Médio | Encerrar o carregamento em até 10 s com estado de erro e oferecer nova tentativa. |
| Conversão ou rotulagem de unidade incorreta | Baixa | Alto | Exigir que todas as temperaturas mudem juntas e que a unidade exibida corresponda ao valor. |

## Out of Scope

- Geolocalização automática.
- Login, autenticação, perfis ou persistência de dados no servidor.
- Histórico de consultas e lista de cidades favoritas.
- Suporte offline, cache de dados meteorológicos ou garantia de consulta sem rede.
- Idiomas além de pt-BR nesta versão.
- Previsões para períodos além de hoje e dos quatro dias seguintes.

## Open Questions

Não há decisões bloqueantes em aberto para o escopo desta versão. Melhorias fora do escopo estão listadas em Out of Scope.