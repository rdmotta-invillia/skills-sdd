# Tarefas — Weather App

Entrada: [plano técnico](../plans/weather-app-plan.md). Aceite: [especificação](../specs/weather-app-spec.md).

Todas as tarefas estão pendentes. Os IDs são estáveis e não representam posição de execução; seguir a ordem das entregas abaixo. O mapa ao final preserva a correspondência com a primeira versão. Tarefas independentes da mesma etapa podem ser paralelizadas, evitando edição simultânea do mesmo arquivo.

**Dependências efetivas:** cada tarefa exige suas dependências explícitas e o pré-requisito obrigatório da etapa na tabela. Uma etapa só termina quando todas as suas tarefas têm aceite aprovado. Isso mantém a ordem solicitada sem repetir todas as dependências transitivas em cada item.

| Etapa | Tarefas na ordem de execução | Pré-requisito obrigatório |
| --- | --- | --- |
| Preparação documental | T-01, T-02 | Nenhum; T-02 exige T-01. |
| Tipos | T-03 | Preparação documental concluída. |
| Funções puras | T-04, T-05, T-06 | Tipos concluídos. |
| Services | T-07, T-08, T-10, T-12, T-14, T-16 | Funções puras concluídas. |
| Hook | T-18, T-20, T-22, T-24 | Services concluídos. |
| Componentes | T-26, T-27, T-29, T-30, T-31, T-34, T-35, T-36, T-37 | Hook concluído. |
| Integração | T-39, T-41, T-55 | Componentes concluídos. |
| Testes | T-57, T-09, T-11, T-13, T-15, T-17, T-19, T-21, T-23, T-25, T-28, T-32, T-33, T-38, T-58, T-59, T-60, T-40, T-42, T-43, T-44, T-45, T-46, T-47 | Integração concluída, inclusive T-55. |
| Hardening | T-48, T-49, T-50, T-51, T-52, T-53, T-54, T-56 | Todas as tarefas da etapa Testes concluídas. |

Os testes coesos de formatação/WMO T-05–T-06, as verificações focadas e os gates por tarefa não são adiados. T-04 mantém a implementação da conversão e T-57 concentra sua cobertura unitária dedicada. A etapa Testes cobre também serviços, hook, componentes, integração e E2E. T-01/T-02 são preparação necessária antes de implementar tipos.

**Granularidade:** uma responsabilidade e um ou dois arquivos relevantes por tarefa. Adaptar arquivos existentes. Testes novos de hook só são necessários se não houver cobertura equivalente; testes isolados de apresentação podem reutilizar o arquivo de testes do App. Utilitário puro e seu teste permanecem juntos quando formam uma unidade coesa de dois arquivos.

**Conclusão:** mudanças em `src/` ou `tests/` exigem `pnpm lint`, `pnpm build` e `pnpm test`, além da verificação focada. O segundo arquivo de uma tarefa de implementação pode ser o teste existente diretamente afetado, somente para adaptação do contrato; a tarefa Test seguinte adiciona os novos cenários. Se forem necessários mais arquivos relevantes, dividir novamente antes de implementar. Documentação não exige build/testes. Não criar backend, cache, store global ou bibliotecas adicionais sem necessidade demonstrada.

**Evidência de aceite:** cada checkbox abaixo deve apontar para teste/asserção, resultado de comando ou registro manual com cenário, resultado esperado, resultado obtido e ambiente/versão. Critérios documentais apontam para a seção/contrato revisado. Falha ou ausência de evidência mantém o item pendente; uma tarefa futura de teste não comprova automaticamente a tarefa atual. Referências AC/RNF vêm da spec; regras de arquitetura, migração, tema e tooling vêm do plano ou das instruções do projeto, sem criar requisitos funcionais novos.

## Preparação — Decisões documentais

### T-01 — Resolver disponibilidade e datas no plano
- **ID:** T-01
- **Tipo:** Infra
- **Descrição:** fechar a interpretação de respostas parciais antes de alterar os tipos.
- **Rastreabilidade:** RF2–RF3, RF5; AC2.1, AC4.3, AC4.5.
- **Dependências:** nenhuma.
- **Arquivos prováveis:** `plans/weather-app-plan.md`; `specs/weather-app-spec.md` somente se uma alteração for explicitamente aprovada.
- **Critérios de aceite:**
	- [ ] O plano contém uma tabela com entrada e saída para: resposta completa, somente atuais, somente previsão, horário ausente, data ausente e nenhuma medida válida. Cada caso aponta para AC2.1, AC4.3 ou AC4.5 e declara quais dados ficam visíveis/indisponíveis.
	- [ ] A tabela define D pelo fuso da cidade e cinco datas D a D+4 para cobertura completa (AC2.1). Qualquer conflito de interpretação da cobertura parcial tem decisão registrada; se exigir alterar a spec, há aprovação explícita e atualização correspondente. Sem decisão, T-01 e suas dependentes permanecem bloqueadas.

### T-02 — Consolidar contratos de operações e estado
- **ID:** T-02
- **Tipo:** Infra
- **Descrição:** documentar assinaturas e responsabilidades pendentes no plano.
- **Rastreabilidade:** RF1, RF4–RF5; AC4.2, AC4.6; RNF3–RNF4, RNF6.
- **Dependências:** T-01.
- **Arquivos prováveis:** `plans/weather-app-plan.md`.
- **Critérios de aceite:**
	- [ ] Revisão do plano encontra um único nome `Unit`, assinaturas de busca/forecast com `AbortSignal` e categorias distintas para rede, HTTP, timeout, payload e cancelamento; nenhuma assinatura exige mensagem de UI (RF1–RF5, RNF6; decisão arquitetural).
	- [ ] Seções de estado/erros exigem verificar identidade antes de publicar dados, erro e fim de loading, mesmo após abort (AC4.6). O plano registra conversão derivada sem request (RF4) e tema dark glassmorphism com verificação WCAG 2.2 AA (RNF3 e instruções do projeto).

## Entrega 1 — Tipos

### T-03 — Introduzir contratos de domínio sem migração ampla
- **ID:** T-03
- **Tipo:** Data
- **Descrição:** introduzir tipos normalizados de cidade, condições, previsão e unidade.
- **Rastreabilidade:** RF1–RF4; AC1.5, AC2.2, AC4.5; RNF5.
- **Dependências:** T-02.
- **Arquivos prováveis:** `src/types/weather.ts`.
- **Critérios de aceite:**
	- [ ] Inspeção dos tipos confirma `Unit = 'celsius' | 'fahrenheit'`, cidade/coordenadas, fuso e medidas em Celsius, %, km/h, hPa e mm; ausência por campo/seção é representável conforme a tabela aprovada de T-01 (AC1.5, AC2.2, AC4.5).
	- [ ] `pnpm build` passa com consumidores existentes; símbolos temporários são listados no registro da tarefa para retirada em T-55. Não há migração de consumidores fora do arquivo previsto (decisão de migração do plano).

## Entrega 2 — Funções puras

### T-04 — Implementar conversão de temperatura
- **ID:** T-04
- **Tipo:** Data
- **Descrição:** converter e arredondar por funções puras; cobertura unitária dedicada em T-57.
- **Rastreabilidade:** RF4; AC3.1–AC3.4.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/temperature.ts`; `tests/unit/temperature.test.ts` somente para adaptar o contrato de testes existentes.
- **Critérios de aceite:**
	- [ ] Verificação focada de entrada/saída comprova 0 °C → 32 °F, 100 °C → 212 °F e −40 °C → −40 °F; arredondamento de 2,5 e −2,5 produz 3 e −3. Registrar resultado, sem declarar T-57 concluída (AC3.2–AC3.3).
	- [ ] Inspeção confirma entrada de origem Celsius, ausência de mutação/I/O e preservação de `null`; gates e testes existentes passam. A suíte dedicada e os casos de repetição pertencem a T-57 (AC3.2–AC3.4; funções puras do plano).

### T-05 — Implementar e testar formatação local
- **ID:** T-05
- **Tipo:** Data
- **Descrição:** formatar datas/horários pt-BR a partir de fuso explícito.
- **Rastreabilidade:** RF2–RF3; AC1.5, AC2.1, AC2.3; RNF7.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/format.ts`, `tests/unit/format.test.ts`.
- **Critérios de aceite:**
	- [ ] Com relógio em `2026-01-01T01:00:00Z` e cidade `America/Sao_Paulo`, teste identifica D como `2025-12-31`, independentemente do fuso do dispositivo. Saídas seguem pt-BR e preservam datas de calendário sem conversão UTC implícita (AC2.1, RNF7).
	- [ ] Testes preservam o horário local `2026-10-20T14:00` como 14:00 e exibem ausência conforme T-01; cobrem transição de horário de verão de `America/New_York` em `2026-03-08`, sem datas/horários inválidos (AC1.5, AC2.3, AC4.5).

### T-06 — Implementar e testar rótulos WMO
- **ID:** T-06
- **Tipo:** Data
- **Descrição:** traduzir códigos meteorológicos sem estado ou rede.
- **Rastreabilidade:** RF2–RF3; AC1.5, AC2.2, AC4.5; RNF7.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/lib/weatherCodes.ts`, `tests/unit/weatherCodes.test.ts`.
- **Critérios de aceite:**
	- [ ] Teste parametrizado compara rótulos pt-BR esperados para 0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96 e 99 (AC1.5, AC2.2; códigos da API previstos no plano).
	- [ ] `null` e 999 retornam “Condição indisponível”; 0 retorna a condição de céu limpo, não o fallback. Nenhum caso dispara I/O ou altera entrada (AC4.5; Edge Cases da spec e funções puras do plano).

## Entrega 3 — Transporte e serviços

### T-07 — Tipar operações e erros do serviço
- **ID:** T-07
- **Tipo:** Data
- **Descrição:** aplicar contratos de operações antes de alterar comportamento.
- **Rastreabilidade:** RF1–RF3, RF5; AC4.2; RNF5–RNF6.
- **Dependências:** T-03.
- **Arquivos prováveis:** `src/services/weatherService.ts`, `src/types/weather.ts`.
- **Critérios de aceite:**
	- [ ] Inspeção/checagem de tipos confirma operações com entrada de busca/cidade, retorno normalizado e sinal de abort; erro pode ser discriminado em rede, HTTP, timeout, payload e cancelamento (RF1–RF3, AC4.2; contrato aprovado em T-02).
	- [ ] Build strict passa sem migração de UI/hook; contrato não exige texto de interface e eventuais símbolos/adaptadores temporários estão registrados para T-55 (RNF6; decisão arquitetural).

### T-08 — Implementar transporte cancelável e timeout
- **ID:** T-08
- **Tipo:** Data
- **Descrição:** limitar a solicitação HTTP no serviço existente.
- **Rastreabilidade:** RF5; AC4.2; RNF1, RNF4.
- **Dependências:** T-07.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Critérios de aceite:**
	- [ ] Com resposta pendente ou corpo pendente, verificação com relógio controlado não gera timeout em 9.999 ms e gera abort/erro de timeout em 10.000 ms desde o início do request (AC4.2, RNF1).
	- [ ] Sucesso, HTTP 429/500, rede, JSON inválido e abort externo terminam com resultado/categoria de T-02; abort externo não vira timeout. Contagem de timers e registro de listeners comprovam limpeza após cada caminho (RNF4; ciclo de recursos do plano).

### T-10 — Adaptar geocoding
- **ID:** T-10
- **Tipo:** Data
- **Descrição:** mapear busca para localidades selecionáveis.
- **Rastreabilidade:** RF1; AC1.1, AC1.3–AC1.4, AC1.7; RNF5.
- **Dependências:** T-08.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Critérios de aceite:**
	- [ ] Inspeção do request para `  São Paulo  ` comprova host/caminho de geocoding, `name=São Paulo`, `count=5`, `language=pt` e `format=json`; entrada só de espaços causa zero chamadas (AC1.4, AC1.7; External APIs do plano).
	- [ ] `{}` e `{"results":[]}` retornam lista vazia; resultados válidos preservam nome/país/região/coordenadas. Envelope de tipo inválido produz erro de payload; registros sem campos obrigatórios não são selecionáveis (AC1.1, AC1.3; validação do plano).

### T-12 — Mapear condições atuais do forecast
- **ID:** T-12
- **Tipo:** Data
- **Descrição:** montar a solicitação de forecast e normalizar apenas sua seção atual.
- **Rastreabilidade:** RF2; AC1.5–AC1.6, AC4.5; RNF5.
- **Dependências:** T-08.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Critérios de aceite:**
	- [ ] Request capturado usa latitude/longitude da cidade selecionada, `forecast_days=5`, `timezone=auto`, `temperature_unit=celsius`, `wind_speed_unit=kmh`, `precipitation_unit=mm` e conjuntos `current`/`daily` exatamente iguais aos do plano (AC1.6, RNF5).
	- [ ] Fixture atual com temperatura 22,4, umidade 61, vento 8,3, pressão 925,1 e precipitação 0 mantém os mesmos números e unidades no domínio. Ausências seguem T-01, sem arredondar a origem ou implementar o calendário diário nesta tarefa (AC1.5, AC4.5).

### T-14 — Mapear previsão e validar datas locais
- **ID:** T-14
- **Tipo:** Data
- **Descrição:** normalizar arrays diários independentemente da seção atual.
- **Rastreabilidade:** RF3; AC2.1–AC2.4; RNF7.
- **Dependências:** T-05, T-12.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Critérios de aceite:**
	- [ ] Fixture diária com datas e valores distintos em cada índice produz dias com a mínima/máxima, condição, `precipitation_sum` e `wind_speed_10m_max` desse mesmo índice, sem usar probabilidade como volume (AC2.2).
	- [ ] Verificação com relógio fixo aceita como completa somente sequência única D a D+4 no fuso IANA da cidade. Data duplicada/faltante, fuso inválido e array mais curto produzem o resultado documentado em T-01; não deslocam medidas entre datas nem preenchem ausências com zero (AC2.1, AC2.3–AC2.4, RNF7).

### T-16 — Classificar agregado completo, parcial ou sem dados
- **ID:** T-16
- **Tipo:** Data
- **Descrição:** combinar mapeamentos sem descartar uma seção válida por ausência de outra.
- **Rastreabilidade:** RF2–RF3, RF5; AC4.3, AC4.5.
- **Dependências:** T-12, T-14.
- **Arquivos prováveis:** `src/services/weatherService.ts`.
- **Critérios de aceite:**
	- [ ] Verificação com fixtures retorna dados utilizáveis quando somente atuais, somente previsão ou uma medida válida estão presentes; preserva cidade/fuso e todos os campos válidos. Precipitação 0 conta como dado; cidade, data e fuso isolados não contam (AC4.3, AC4.5).
	- [ ] Payload sem medida válida é classificado como sem dados; fuso ausente/identificador inválido produz erro de payload recuperável, sem usar fuso do dispositivo (AC4.3 e Edge Cases da spec).

## Entrega 4 — Orquestração por comportamento

### T-18 — Orquestrar busca sem seleção automática
- **ID:** T-18
- **Tipo:** Data
- **Descrição:** adaptar somente a etapa de busca do hook.
- **Rastreabilidade:** RF1, RF5; AC1.1–AC1.4, AC1.7, AC4.1, AC4.7.
- **Dependências:** T-10, T-16.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Critérios de aceite:**
	- [ ] Ao montar, hook expõe `idle` e chamadas a busca/forecast são zero; enviar `''` ou espaços mantém zero chamadas e retorna indicação de validação. Com promise pendente, expõe `searching` (AC1.4, AC4.1, AC4.7).
	- [ ] Busca com 1 ou 2 opções termina em `cities` sem chamada a forecast; lista vazia termina em `empty` e falha em `error`. Somente ação explícita de seleção poderá consultar clima (AC1.2–AC1.3).

### T-20 — Orquestrar seleção e resultado meteorológico
- **ID:** T-20
- **Tipo:** Data
- **Descrição:** conectar seleção explícita ao agregado do serviço.
- **Rastreabilidade:** RF2–RF3, RF5; AC1.2, AC1.6, AC4.1, AC4.3, AC4.5–AC4.6.
- **Dependências:** T-16, T-18.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Critérios de aceite:**
	- [ ] Selecionar cidade B depois de A atualiza a seleção para B, inicia `loading-weather` e chama forecast uma vez com B; dados de A não são expostos como resultado de B (AC1.2, AC1.6, AC4.6).
	- [ ] Resolver com agregado válido/parcial gera `success` preservando campos; sem medidas gera `no-data`; rejeição gera `error`. Verificar os três caminhos com respostas controladas, sem implementar retry/concorrência nesta tarefa (AC4.1, AC4.3, AC4.5).

### T-22 — Implementar retry do alvo que falhou
- **ID:** T-22
- **Tipo:** Data
- **Descrição:** guardar operação e alvo de recuperação no hook.
- **Rastreabilidade:** RF5; AC4.2, AC4.4; RNF4.
- **Dependências:** T-20.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Critérios de aceite:**
	- [ ] Após falha de geocoding para “Recife”, retry chama novamente busca com “Recife”; após falha de forecast de B, chama forecast com B. Cada acionamento inicia exatamente uma nova operação do tipo que falhou (AC4.2, AC4.4).
	- [ ] No cenário sucesso de A → busca “Recife” falha → retry, não há nova consulta de A. Erro anterior é limpo e loading fica observável antes da resposta (AC4.4, RNF4).

### T-24 — Proteger estado contra respostas obsoletas
- **ID:** T-24
- **Tipo:** Data
- **Descrição:** controlar identidade de requests e cancelamento no hook.
- **Rastreabilidade:** RF1–RF3, RF5; AC1.6, AC4.6; RNF4.
- **Dependências:** T-22.
- **Arquivos prováveis:** `src/hooks/useWeather.ts`.
- **Critérios de aceite:**
	- [ ] Com requests A e B pendentes, resolver B antes de A e depois resolver/rejeitar A não altera cidade, dados, erro ou loading de B. Mesmo mock que ignora abort deve respeitar essa invariância (AC1.6, AC4.6).
	- [ ] Substituir operação ou desmontar o hook sinaliza abort da operação anterior; nenhuma conclusão posterior publica resultado/erro nem encerra loading da operação atual. Evidência identifica os caminhos de sucesso, erro e finalização protegidos (RNF4; decisão de concorrência do plano).

## Entrega 5 — Componentes isolados

### T-26 — Ajustar tema e base responsiva
- **ID:** T-26
- **Tipo:** UI
- **Descrição:** limitar decisões visuais globais aos estilos.
- **Rastreabilidade:** RNF2–RNF3; instruções de dark glassmorphism.
- **Dependências:** T-02, T-24.
- **Arquivos prováveis:** `src/styles/index.css`, `tailwind.config.js` se necessário.
- **Critérios de aceite:**
	- [ ] Inspeção de estilos confirma superfícies escuras/translúcidas do tema do projeto; medição sobre o fundo composto registra contraste mínimo 4,5:1 para texto normal e 3:1 para texto grande e indicadores/controles aplicáveis, com foco visível (RNF3 e instruções do projeto).
	- [ ] Em viewport de 320 px, medição da página confirma `scrollWidth <= clientWidth` e controles globais sem corte; registrar screenshot e ambiente. Não há alteração de serviço/hook (RNF2; separação do plano).

### T-27 — Adaptar formulário e seleção controlada
- **ID:** T-27
- **Tipo:** UI
- **Descrição:** fazer SearchBar consumir props e emitir eventos, sem chamar serviços.
- **Rastreabilidade:** RF1; AC1.1–AC1.4, AC1.7; RNF3, RNF7.
- **Dependências:** T-03, T-26.
- **Arquivos prováveis:** `src/components/SearchBar.tsx`.
- **Critérios de aceite:**
	- [ ] Em componente com callbacks espiados, botão e Enter emitem uma submissão cada; vazio/espaços exibem pedido de cidade associado ao campo e não emitem busca válida. Campo tem nome acessível localizável por role/label (AC1.4, RNF3).
	- [ ] Com duas homônimas, opções mostram país e região recebida; teclado seleciona a opção pretendida, identifica-a por semântica de seleção e emite seu ID. Renderização de 1 ou 2 resultados não emite seleção automaticamente (AC1.1–AC1.2).

### T-29 — Adaptar apresentação de condições atuais
- **ID:** T-29
- **Tipo:** UI
- **Descrição:** renderizar condições com props normalizadas e unidade recebida.
- **Rastreabilidade:** RF2, RF4; AC1.5, AC4.5; RNF3, RNF7.
- **Dependências:** T-04, T-05, T-06.
- **Arquivos prováveis:** `src/components/CurrentWeather.tsx`.
- **Critérios de aceite:**
	- [ ] Renderização com fixture de cidade/condições mostra nome, condição pt-BR, temperatura/unidade e cada medida com %, km/h, hPa e mm; horário `14:00` local não muda pelo fuso do dispositivo. Temperatura 0 °C com prop Fahrenheit aparece como 32 °F (AC1.5, AC3.2, RNF7).
	- [ ] Cada campo nulo é identificado conforme T-01, precipitação 0 continua visível e não aparecem `NaN`, `undefined` ou data inválida. Re-render com outra unidade deriva da mesma origem sem serviço ou persistência (AC4.5, RF4).

### T-30 — Adaptar cartão diário
- **ID:** T-30
- **Tipo:** UI
- **Descrição:** apresentar um ForecastDay com unidade recebida.
- **Rastreabilidade:** RF3–RF4; AC2.2, AC2.4, AC4.5; RNF7.
- **Dependências:** T-04, T-05, T-06.
- **Arquivos prováveis:** `src/components/ForecastCard.tsx`.
- **Critérios de aceite:**
	- [ ] Fixture diária com mínima 0 °C, máxima 10 °C, precipitação 1,2 mm e vento máximo 18 km/h apresenta essas medidas; prop Fahrenheit exibe 32 °F/50 °F e mantém data/medidas não térmicas iguais (AC2.2, AC3.2, AC3.4).
	- [ ] Precipitação 0 aparece como volume válido; campo nulo mostra “Indisponível” e código WMO desconhecido mostra “Condição indisponível”. Rótulo de precipitação não usa % nem probabilidade (AC2.4, AC4.5).

### T-31 — Adaptar lista de previsão
- **ID:** T-31
- **Tipo:** UI
- **Descrição:** compor cartões mantendo ordem e cobertura recebidas.
- **Rastreabilidade:** RF3; AC2.1, AC2.3–AC2.4; RNF2.
- **Dependências:** T-30.
- **Arquivos prováveis:** `src/components/ForecastList.tsx`.
- **Critérios de aceite:**
	- [ ] Com cinco dias D a D+4 normalizados, renderização produz exatamente cinco datas em ordem cronológica; todos os cartões recebem a unidade da lista (AC2.1, AC2.3, RF4).
	- [ ] Para cada caso de cobertura parcial aprovado em T-01, asserção de datas/rótulos confere a saída prevista na tabela; nenhum valor meteorológico é inventado e datas recebidas continuam identificadas (AC2.4, AC4.5).

### T-34 — Adaptar indicador de carregamento
- **ID:** T-34
- **Tipo:** UI
- **Descrição:** deixar loading controlado pela apresentação.
- **Rastreabilidade:** RF5; AC4.1; RNF3.
- **Dependências:** T-26.
- **Arquivos prováveis:** `src/components/states/LoadingState.tsx`.
- **Critérios de aceite:**
	- [ ] Renderizar loading de busca e de clima permite localizar status por semântica acessível e obter texto pt-BR que identifica a operação; atualização é exposta em região de anúncio (AC4.1, RNF3).
	- [ ] Renderizar/desmontar o componente gera zero chamadas a serviço e zero timers de rede; inspeção confirma que ele recebe a operação por props, sem coordenar estado do hook (separação de responsabilidades do plano).

### T-35 — Distinguir inicial, sem localidades e sem dados
- **ID:** T-35
- **Tipo:** UI
- **Descrição:** apresentar variantes vazias sem coordenar a jornada.
- **Rastreabilidade:** RF1, RF5; AC1.3, AC4.3, AC4.7; RNF3, RNF7.
- **Dependências:** T-26.
- **Arquivos prováveis:** `src/components/states/EmptyState.tsx`.
- **Critérios de aceite:**
	- [ ] Renderização das três variantes produz textos pt-BR distintos: inicial solicita pesquisar cidade; sem localidades informa nenhuma correspondência; sem dados informa ausência de dados meteorológicos (AC4.7, AC1.3, AC4.3, respectivamente).
	- [ ] Cada variante é identificável por texto acessível e não renderiza medidas/cidade anterior; mudança de resultado vazio é anunciável, sem disparar serviço pelo componente (RNF3; apresentação do plano).

### T-36 — Adaptar mensagem de erro e ação de retry
- **ID:** T-36
- **Tipo:** UI
- **Descrição:** apresentar mensagem segura e callback de recuperação.
- **Rastreabilidade:** RF5; AC4.2, AC4.4; RNF3, RNF6.
- **Dependências:** T-07, T-26.
- **Arquivos prováveis:** `src/components/states/ErrorState.tsx`.
- **Critérios de aceite:**
	- [ ] Para rede, HTTP, timeout e payload, renderização mostra mensagem pt-BR de consulta não concluída e botão “Tentar novamente”; uma exceção contendo URL/stack sentinela não expõe esses conteúdos no DOM (AC4.2, RNF6).
	- [ ] Tab/Enter no botão emite uma chamada ao callback por ativação; callback é recebido por props e o componente não escolhe cidade/texto nem chama o serviço (AC4.4, RNF3; arquitetura do plano).

### T-37 — Adaptar controle de unidade
- **ID:** T-37
- **Tipo:** UI
- **Descrição:** manter UnitToggle controlado por props.
- **Rastreabilidade:** RF4; AC3.1–AC3.3; RNF3.
- **Dependências:** T-03, T-26.
- **Arquivos prováveis:** `src/components/UnitToggle.tsx`.
- **Critérios de aceite:**
	- [ ] Com prop Celsius/Fahrenheit, exatamente uma opção tem seleção semanticamente identificável; ativação por teclado emite o literal `celsius`/`fahrenheit` correspondente e exibe foco visível (RF4, RNF3).
	- [ ] Renderização/interação não chama serviço, não grava armazenamento e não altera medidas; seleção exibida só muda quando recebe a prop atualizada pelo pai (decisão de componente controlado do plano).

## Entrega 6 — Integração da tela

### T-39 — Conectar jornada e estados no App
- **ID:** T-39
- **Tipo:** UI
- **Descrição:** compor componentes e ações do hook sem reimplementar dados.
- **Rastreabilidade:** RF1–RF3, RF5; AC1.2, AC1.6, AC4.1–AC4.7.
- **Dependências:** T-24, T-27, T-29, T-31, T-34, T-35, T-36.
- **Arquivos prováveis:** `src/App.tsx`.
- **Critérios de aceite:**
	- [ ] Com hook controlado, disparar envio, escolher cidade B e acionar retry chama a ação correspondente com texto/ID esperado; cada estado documentado apresenta sua UI e parcial mantém medidas disponíveis (AC1.2, AC4.1–AC4.5, AC4.7).
	- [ ] Transição de sucesso de A para loading/erro de B não apresenta valores A como de B. Inspeção do App encontra composição/props, sem `fetch`, payload Open-Meteo ou lógica de identidade de request (AC1.6, AC4.6; arquitetura do plano).

### T-41 — Conectar unidade local à renderização
- **ID:** T-41
- **Tipo:** UI
- **Descrição:** manter unidade no ancestral comum e repassá-la aos componentes preparados.
- **Rastreabilidade:** RF4; AC3.1–AC3.4; RNF9.
- **Dependências:** T-37, T-39.
- **Arquivos prováveis:** `src/App.tsx`.
- **Critérios de aceite:**
	- [ ] Primeira exibição da sessão usa Celsius; alterar o controle repassa a mesma unidade às condições atuais e a todos os dias, mantendo a referência dos dados de origem quando não há outro evento (AC3.1–AC3.3).
	- [ ] Verificação de interação mantém a contagem de chamadas ao serviço e não grava preferência entre sessões; inspeção de estado encontra apenas unidade escolhida, não cópias convertidas das temperaturas (RF4; decisão do plano).

### T-55 — Retirar compatibilidade temporária dos tipos
- **ID:** T-55
- **Tipo:** Data
- **Descrição:** remover somente contratos antigos sem consumidores, após integrar todos os consumidores de produção.
- **Rastreabilidade:** RF2–RF4; AC1.5, AC2.2, AC3.1–AC3.4; RNF5.
- **Dependências:** T-07, T-16, T-24, T-39, T-41.
- **Arquivos prováveis:** `src/types/weather.ts`, `src/services/weatherService.ts` somente para remover adaptadores legados sem uso.
- **Critérios de aceite:**
	- [ ] Lista de símbolos/adaptadores temporários de T-03/T-07 tem, para cada item, busca de referências sem consumidor ativo antes da remoção. Ausência de compatibilidade criada é registrada como não aplicável, não induz criação de abstração (decisão de migração do plano).
	- [ ] Após remover somente itens sem uso, `pnpm build` e suítes existentes passam; domínio mantém unidades/ausências exigidas pela spec (AC1.5, AC2.2, AC4.5). Consumidor ativo, inclusive teste existente, bloqueia sua remoção e gera migração própria de até dois arquivos, antes de encerrar esta etapa. A cobertura dedicada posterior não é dependência desta tarefa.

## Entrega 7 — Testes dedicados e E2E

### T-57 — Testar conversão de unidade com Vitest
- **ID:** T-57
- **Tipo:** Test
- **Descrição:** cobrir exclusivamente as funções puras de conversão e arredondamento, sem React, hook ou rede.
- **Rastreabilidade:** RF4; AC3.2–AC3.4.
- **Dependências:** T-04, T-55.
- **Arquivos prováveis:** `tests/unit/temperature.test.ts`.
- **Critérios de aceite:**
	- [ ] Testes parametrizados aprovam 0 °C → 32 °F, 100 °C → 212 °F e −40 °C → −40 °F; Celsius 2,5/−2,5 é exibido como 3/−3 e Fahrenheit calculado antes do arredondamento usa a regra de empate afastado de zero (AC3.2–AC3.3).
	- [ ] `null` continua indisponível e dez alternâncias usam a origem fracionária preservada, sem mutação nem deriva. Casos negativos/fracionários são comparados à fórmula da spec; execução focada passa sem montar componentes ou fazer requests (AC3.2–AC3.4). Unidade inicial da sessão é verificada em T-42.

### T-09 — Testar transporte e cancelamento com mock de fetch
- **ID:** T-09
- **Tipo:** Test
- **Descrição:** testar o serviço real com `fetch` substituído por mock do Vitest, sem substituir o próprio serviço.
- **Rastreabilidade:** RF5; AC4.2; RNF1, RNF4.
- **Dependências:** T-08, T-55.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Critérios de aceite:**
	- [ ] Mock de `fetch` instalado com `vi.stubGlobal` ou equivalente observa `AbortSignal` e retorna respostas controladas; testes aprovam timeout de conexão/corpo aos 10.000 ms, sem erro em 9.999 ms. Sucesso antes do prazo não deixa timer ativo (AC4.2, RNF1).
	- [ ] Testes parametrizados para 429, 500, rejeição de rede, JSON inválido e abort solicitado verificam categorias distintas de T-02. Hooks de limpeza restauram mocks/timers; chamadas não interceptadas falham o teste (RNF4 e estratégia do plano).

### T-11 — Testar geocoding com mock de fetch
- **ID:** T-11
- **Tipo:** Test
- **Descrição:** chamar o serviço real com respostas de geocoding fornecidas por mock de `fetch`.
- **Rastreabilidade:** RF1; AC1.1, AC1.3–AC1.4, AC1.7.
- **Dependências:** T-09, T-10.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Critérios de aceite:**
	- [ ] Testes com `URL`/`URLSearchParams` verificam os parâmetros de T-10 para “São Paulo” e “L'Haÿ-les-Roses”; `''` e espaços geram zero chamadas a `fetch` (AC1.4, AC1.7).
	- [ ] Fixtures de homônimas preservam IDs/contexto distintos; região ausente é aceita. Ausência/lista vazia retorna `[]`, enquanto erro HTTP/JSON/envelope não resolve como `[]`; registro inválido não aparece como opção válida (AC1.1, AC1.3).

### T-13 — Testar forecast atual com mock de fetch
- **ID:** T-13
- **Tipo:** Test
- **Descrição:** comprovar parâmetros e normalização atual no serviço real com mock de `fetch`.
- **Rastreabilidade:** RF2; AC1.5–AC1.6, AC4.5; RNF5.
- **Dependências:** T-09, T-12.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Critérios de aceite:**
	- [ ] Testes conferem host/caminho, coordenadas, conjuntos de campos e parâmetros de unidade de T-12; temperatura 22,4 permanece 22,4 no domínio, sem arredondamento (AC1.5–AC1.6, RNF5).
	- [ ] Casos parametrizados cobrem 0, `null`, campo ausente e texto onde deveria haver número; seção/horário ausente segue a tabela T-01. Nenhuma ausência gera medida 0 ou `NaN` (AC4.5).

### T-15 — Testar previsão e limites de calendário
- **ID:** T-15
- **Tipo:** Test
- **Descrição:** comprovar normalização diária e cobertura parcial aprovada.
- **Rastreabilidade:** RF3; AC2.1–AC2.4, AC4.5.
- **Dependências:** T-14.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Critérios de aceite:**
	- [ ] Com relógio em `2026-01-01T01:00:00Z` e fuso `America/Sao_Paulo`, teste completo espera exatamente `2025-12-31` a `2026-01-04`, nessa ordem; valores sentinela distintos comprovam associação por índice (AC2.1–AC2.3).
	- [ ] Casos com data repetida, dia ausente, array curto, zero e `null` comparam a saída à tabela aprovada de T-01; nenhuma ausência vira medida inventada ou valor do dia vizinho (AC2.4, AC4.5).

### T-17 — Testar disponibilidade do agregado
- **ID:** T-17
- **Tipo:** Test
- **Descrição:** validar a classificação consumida pelo hook.
- **Rastreabilidade:** RF2–RF3, RF5; AC4.3, AC4.5.
- **Dependências:** T-13, T-15, T-16.
- **Arquivos prováveis:** `tests/unit/weatherService.test.ts`.
- **Critérios de aceite:**
	- [ ] Testes de somente atuais, somente previsão e ambos parciais comparam os campos preservados à fixture; um único valor 0 ainda gera dados utilizáveis para a cidade consultada (AC4.5).
	- [ ] Somente metadados/medidas todas nulas gera sem dados; fuso ausente ou `Invalid/Zone` gera categoria de payload. Testes não aceitam dados de outra cidade ou fallback para o dispositivo (AC4.3 e Edge Cases da spec).

### T-19 — Testar transições da busca
- **ID:** T-19
- **Tipo:** Test
- **Descrição:** isolar o hook com serviço mockado e promises controladas.
- **Rastreabilidade:** RF1, RF5; AC1.1–AC1.4, AC1.7, AC4.1, AC4.7.
- **Dependências:** T-11, T-18.
- **Arquivos prováveis:** `tests/unit/useWeather.test.tsx` (novo se não houver equivalente).
- **Critérios de aceite:**
	- [ ] Testes com serviço mockado verificam `idle` e zero chamadas na montagem, validação para vazio/espaços e `searching` antes de resolver promise controlada (AC1.4, AC4.1, AC4.7).
	- [ ] Resolver com 1 e 2 localidades produz `cities`, com `[]` produz `empty`, rejeitar produz `error`; contagem de forecast continua zero em todos esses cenários (AC1.2–AC1.3).

### T-21 — Testar resultados da seleção
- **ID:** T-21
- **Tipo:** Test
- **Descrição:** verificar seleção sem UI ou rede.
- **Rastreabilidade:** RF2–RF3, RF5; AC1.2, AC1.6, AC4.1, AC4.3, AC4.5–AC4.6.
- **Dependências:** T-17, T-19, T-20.
- **Arquivos prováveis:** `tests/unit/useWeather.test.tsx`.
- **Critérios de aceite:**
	- [ ] Teste A → selecionar B verifica argumento B, `loading-weather` antes da resolução e ausência de dados A associados à seleção B (AC1.2, AC1.6, AC4.6).
	- [ ] Fixtures completa, parcial, sem medidas e rejeição produzem respectivamente `success`, `success`, `no-data` e `error`; campos parciais preservados são comparados à origem (AC4.1, AC4.3, AC4.5).

### T-23 — Testar retry de busca e forecast
- **ID:** T-23
- **Tipo:** Test
- **Descrição:** comprovar recuperação do hook.
- **Rastreabilidade:** RF5; AC4.2, AC4.4.
- **Dependências:** T-21, T-22.
- **Arquivos prováveis:** `tests/unit/useWeather.test.tsx`.
- **Critérios de aceite:**
	- [ ] Testes independentes de geocoding e forecast simulam rejeição → retry → resolução; verificam o mesmo texto/cidade, uma chamada adicional e transições `error → loading correspondente → resultado` (AC4.2, AC4.4).
	- [ ] Teste com A carregada e nova busca falha comprova que retry repete a busca, não forecast de A; erro anterior fica ausente enquanto aguarda promise controlada (AC4.4).

### T-25 — Testar concorrência e desmontagem
- **ID:** T-25
- **Tipo:** Test
- **Descrição:** resolver/rejeitar promises em ordem adversa.
- **Rastreabilidade:** RF1–RF3, RF5; AC1.6, AC4.6.
- **Dependências:** T-23, T-24.
- **Arquivos prováveis:** `tests/unit/useWeather.test.tsx`.
- **Critérios de aceite:**
	- [ ] Testes de busca e de seleção iniciam A/B, concluem B e depois resolvem ou rejeitam A; estado completo de B permanece igual. Variante em que B continua pendente comprova que A não retira seu loading (AC1.6, AC4.6).
	- [ ] Testes verificam `signal.aborted` após substituição/desmontagem e ausência de erro de cancelamento na UI/estado; promises são controladas sem sleeps, inclusive com serviço que ignora abort (RNF4).

### T-28 — Testar formulário e opções
- **ID:** T-28
- **Tipo:** Test
- **Descrição:** verificar componente com dados/callbacks controlados.
- **Rastreabilidade:** RF1; AC1.1–AC1.4, AC1.7; RNF3.
- **Dependências:** T-27.
- **Arquivos prováveis:** `tests/unit/SearchBar.test.tsx`.
- **Critérios de aceite:**
	- [ ] Testes com `user-event` verificam uma submissão por botão/Enter, zero buscas válidas para espaços e preservação de “São Paulo”/“L'Haÿ-les-Roses”; mensagem de validação está associada ao campo (AC1.4, AC1.7, RNF3).
	- [ ] Fixtures com 1 e 2 localidades não chamam seleção ao renderizar; escolher a segunda homônima por teclado chama callback com seu ID e atualiza a indicação controlada de seleção. Asserções verificam país/região e usam role/nome acessível (AC1.1–AC1.2).

### T-32 — Testar apresentação atual completa e parcial
- **ID:** T-32
- **Tipo:** Test
- **Descrição:** exercitar CurrentWeather isoladamente com fixtures de domínio.
- **Rastreabilidade:** RF2; AC1.5, AC4.5.
- **Dependências:** T-29.
- **Arquivos prováveis:** `tests/unit/App.test.tsx` (bloco isolado de apresentação).
- **Critérios de aceite:**
	- [ ] Teste de fixture completa verifica individualmente temperatura, condição, umidade, vento, pressão, precipitação e horário com unidades/rótulos esperados; re-render em Fahrenheit confere a fórmula de AC3.2 (AC1.5).
	- [ ] Testes parametrizam zero, cada campo nulo, horário/seção ausente e código desconhecido; comparam saídas com T-01 e verificam permanência das outras medidas válidas. Não basta snapshot ou presença de um painel (AC4.5).

### T-33 — Testar cartões e lista de previsão
- **ID:** T-33
- **Tipo:** Test
- **Descrição:** verificar apresentação diária sem fluxo de busca.
- **Rastreabilidade:** RF3; AC2.1–AC2.4, AC4.5.
- **Dependências:** T-31.
- **Arquivos prováveis:** `tests/unit/App.test.tsx` (bloco isolado de previsão).
- **Critérios de aceite:**
	- [ ] Fixture de cinco datas com valores distintos por dia verifica sequência exata, mínima/máxima, condição, precipitação mm e vento máximo km/h; Fahrenheit confere a conversão de cada temperatura (AC2.1–AC2.3, AC3.2).
	- [ ] Casos de zero/nulos e cobertura parcial da tabela T-01 verificam valores/rótulos por data; não há medida inventada ou emprestada do cartão vizinho. Asserções não se limitam à quantidade de cartões (AC2.4, AC4.5).

### T-38 — Testar interação do controle de unidade
- **ID:** T-38
- **Tipo:** Test
- **Descrição:** verificar semântica e eventos do controle isolado.
- **Rastreabilidade:** RF4; AC3.1–AC3.3; RNF3.
- **Dependências:** T-37.
- **Arquivos prováveis:** `tests/unit/UnitToggle.test.tsx`.
- **Critérios de aceite:**
	- [ ] Testes por role/nome acessível verificam seleção única para cada prop e callback com literal correto após Tab/ativação; re-render confirma atualização controlada pelo pai (RF4, RNF3).
	- [ ] Testes não montam hook nem dependem de fixture de clima; interação não chama serviço nem APIs de armazenamento. O padrão Celsius inicial é validado na integração T-42, não atribuído a este componente controlado (AC3.1; arquitetura do plano).

### T-58 — Testar componente no estado loading
- **ID:** T-58
- **Tipo:** Test
- **Descrição:** renderizar LoadingState isoladamente com Testing Library, sem fluxo de busca ou hook.
- **Rastreabilidade:** RF5; AC4.1; RNF3, RNF7.
- **Dependências:** T-34, T-55.
- **Arquivos prováveis:** `tests/unit/App.test.tsx` (bloco isolado de LoadingState).
- **Critérios de aceite:**
	- [ ] Com props de busca e de clima, testes localizam status por role/nome acessível e verificam texto pt-BR que identifica a operação; mudança da prop atualiza o conteúdo exposto na região de anúncio (AC4.1, RNF3, RNF7).
	- [ ] Renderizar, atualizar e desmontar gera zero chamadas a serviços/`fetch` e nenhum timer de rede; testes não montam `useWeather`. Presença de live region não é apresentada como auditoria de leitor de tela nem prova do limite de 100 ms (arquitetura do plano; medição em T-53).

### T-59 — Testar componente no estado erro
- **ID:** T-59
- **Tipo:** Test
- **Descrição:** renderizar ErrorState isoladamente e verificar mensagem e callback de retry.
- **Rastreabilidade:** RF5; AC4.2, AC4.4; RNF3, RNF6.
- **Dependências:** T-36, T-55.
- **Arquivos prováveis:** `tests/unit/App.test.tsx` (bloco isolado de ErrorState).
- **Critérios de aceite:**
	- [ ] Casos de rede, HTTP, timeout e payload mostram mensagem pt-BR de falha e botão “Tentar novamente”; URL/stack sentinela não aparece no DOM. Semântica acessível permite localizar mensagem e ação (AC4.2, RNF3, RNF6).
	- [ ] Ativação do botão por Enter chama o callback uma vez, sem serviço/`fetch`; renderização inicial não chama retry. Repetição do alvo correto e transição de volta ao loading são verificadas na integração T-40, não exigidas deste componente isolado (AC4.4; arquitetura do plano).

### T-60 — Testar componente no estado vazio
- **ID:** T-60
- **Tipo:** Test
- **Descrição:** verificar isoladamente variantes inicial, sem localidades e sem dados de EmptyState.
- **Rastreabilidade:** RF1, RF5; AC1.3, AC4.3, AC4.7; RNF3, RNF7.
- **Dependências:** T-35, T-55.
- **Arquivos prováveis:** `tests/unit/App.test.tsx` (bloco isolado de EmptyState).
- **Critérios de aceite:**
	- [ ] Teste parametrizado compara textos acessíveis distintos das três variantes: solicitação de cidade, nenhuma localidade encontrada e nenhum dado meteorológico. Re-render entre variantes atualiza a informação sem manter o texto anterior (AC1.3, AC4.3, AC4.7).
	- [ ] Nenhuma variante exibe medidas fictícias, cidade anterior ou erro técnico; montagem/re-render não chama serviço/`fetch` nem geolocalização. Testes usam props e asserções de conteúdo/semântica, sem montar hook (RNF3; arquitetura do plano).

### T-40 — Testar jornada e estados da tela
- **ID:** T-40
- **Tipo:** Test
- **Descrição:** comprovar composição com serviços mockados.
- **Rastreabilidade:** RF1–RF3, RF5; AC1.2, AC1.6, AC4.1–AC4.7; RNF3, RNF6.
- **Dependências:** T-25, T-28, T-32, T-33, T-39, T-58, T-59, T-60.
- **Arquivos prováveis:** `tests/unit/App.test.tsx`.
- **Critérios de aceite:**
	- [ ] Testes de integração verificam abertura com campo de busca e zero chamadas, envio → loading → opções → seleção explícita → sucesso, além de vazio, sem dados e parcial com as saídas de T-01 (AC1.2, AC4.1, AC4.3, AC4.5, AC4.7).
	- [ ] Falha → retry verifica mesmo alvo, retirada do erro durante loading e resultado novo; A → B com resposta tardia não mostra dados A como B. Asserções verificam nomes acessíveis/regiões de anúncio, sem declarar comprovação de leitor de tela (AC1.6, AC4.2, AC4.4, AC4.6, RNF3).

### T-42 — Testar conversão integrada sem request
- **ID:** T-42
- **Tipo:** Test
- **Descrição:** validar efeito simultâneo da unidade nas temperaturas da tela.
- **Rastreabilidade:** RF4; AC3.1–AC3.4.
- **Dependências:** T-04, T-38, T-40, T-41, T-57.
- **Arquivos prováveis:** `tests/unit/App.test.tsx`.
- **Critérios de aceite:**
	- [ ] Teste por teclado inicia em Celsius e alterna C → F → C; compara temperatura atual e cada mínima/máxima com a fórmula e arredondamento da spec, usando origem fracionária, negativa e nula (AC3.1–AC3.3).
	- [ ] Antes/depois, asserções comparam cidade, datas, condição, umidade, vento, pressão e precipitação por igualdade; número de chamadas ao serviço não aumenta e ausências continuam indicadas (AC3.4, RF4).

### T-43 — Preparar execução E2E nos três motores
- **ID:** T-43
- **Tipo:** Infra
- **Descrição:** reutilizar configuração existente para execução determinística.
- **Rastreabilidade:** RNF8; estratégia de testes do plano.
- **Dependências:** T-02, T-55.
- **Arquivos prováveis:** `playwright.config.ts`.
- **Critérios de aceite:**
	- [ ] `pnpm exec playwright test --list` lista a suíte existente para projetos Chromium, Firefox e WebKit; configuração define URL/base e inicialização/reuso do servidor local sem editar serviços/componentes (estratégia do plano; suporte à verificação RNF8).
	- [ ] Registro da tarefa identifica nomes dos projetos e declara que emulação/motores não comprovam versões reais. Interceptação por cenário será verificada em T-44; configurar projetos não encerra RNF8.

### T-44 — Testar jornada principal E2E em desktop e mobile
- **ID:** T-44
- **Tipo:** Test
- **Descrição:** executar com Playwright a mesma jornada completa em desktop e viewport mobile, não apenas redimensionar uma tela já carregada.
- **Rastreabilidade:** RF1–RF4; AC1.1–AC1.2, AC1.5–AC1.7, AC2.1–AC2.3, AC3.1–AC3.4; RNF2.
- **Dependências:** T-42, T-43.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Critérios de aceite:**
	- [ ] Com relógio fixo e endpoints interceptados, cenário envia por botão/Enter, escolhe a segunda homônima e compara cidade, medidas/unidades e sequência D a D+4 com a fixture; nenhuma chamada de forecast ocorre antes da seleção (AC1.1–AC1.2, AC1.5–AC1.7, AC2.1–AC2.3).
	- [ ] C → F → C compara todas as temperaturas e mantém contagem de requests; suíte falha diante de chamada Open-Meteo não interceptada e sincroniza por eventos/asserções, não sleeps. Registrar resultado E2E (AC3.1–AC3.4, RF4; estratégia do plano).
	- [ ] Executar a jornada desde a abertura em desktop de 1280 × 800 px e em contexto Chromium mobile de 320 × 780 px com toque habilitado. Em mobile, buscar, selecionar e alternar unidade pelos controles visíveis; verificar `scrollWidth <= clientWidth` e registrar resultado/captura dos dois perfis. T-48 amplia a matriz de layout/estados, mas não substitui esta execução mobile (RNF2).

### T-45 — Testar ausência e parcialidade em E2E
- **ID:** T-45
- **Tipo:** Test
- **Descrição:** verificar respostas sem correspondências ou incompletas.
- **Rastreabilidade:** RF1–RF3, RF5; AC1.3–AC1.4, AC2.4, AC4.3, AC4.5.
- **Dependências:** T-44.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Critérios de aceite:**
	- [ ] Cenário de espaços exibe pedido de cidade e zero requests; geocoding `[]` informa nenhuma localidade e zero forecast, sem apresentar clima anterior como resultado da nova busca (AC1.3–AC1.4).
	- [ ] Fixtures parcial e sem medidas geram as saídas exatas de T-01: valores recebidos permanecem, nulos são “Indisponível” e ausência total não mostra números meteorológicos. Comparar dados por campo/data e registrar execução (AC2.4, AC4.3, AC4.5).

### T-46 — Testar recuperação em E2E
- **ID:** T-46
- **Tipo:** Test
- **Descrição:** validar falha → retry → sucesso de cada operação.
- **Rastreabilidade:** RF5; AC4.2, AC4.4; RNF4, RNF6.
- **Dependências:** T-44.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Critérios de aceite:**
	- [ ] Cenários separados falham geocoding e forecast com HTTP/rede controlados; cada um exibe mensagem pt-BR sem detalhes sentinela da API e botão de retry acessível (AC4.2, RNF6).
	- [ ] Acionar retry produz exatamente uma nova operação com texto/coordenadas do alvo que falhou; erro anterior sai durante loading e resposta interceptada seguinte produz sucesso da cidade correta. Registrar resultados de ambos os cenários (AC4.4, AC1.6).

### T-47 — Testar seleções concorrentes em E2E
- **ID:** T-47
- **Tipo:** Test
- **Descrição:** comprovar proteção contra respostas atrasadas entre camadas.
- **Rastreabilidade:** RF1–RF3, RF5; AC1.6, AC4.6.
- **Dependências:** T-44.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Critérios de aceite:**
	- [ ] Rotas controladas mantêm A pendente, permitem selecionar B e concluir B; liberar sucesso/erro de A depois disso não muda nome, valores ou mensagem de B. Se A for abortada, registrar o abort como caminho esperado (AC1.6, AC4.6).
	- [ ] Antes de B concluir e após falha de B, nenhuma medida de A aparece atribuída a B; teste sincroniza por resposta/estado observável, não tempo fixo. Registrar o resultado E2E (AC4.6).

## Entrega 8 — Hardening e evidências

### T-48 — Validar layout mobile e viewports
- **ID:** T-48
- **Tipo:** Test
- **Descrição:** verificar responsividade sem misturar auditoria com correções de UI.
- **Rastreabilidade:** RF1–RF5; RNF2.
- **Dependências:** T-45, T-46, T-47.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Critérios de aceite:**
	- [ ] Para larguras 320, 768 e 1280 px, com altura registrada, testes em loading/sucesso/erro verificam `documentElement.scrollWidth <= clientWidth`. Capturas e caixas dos controles confirmam ausência de sobreposição/recorte que impeça ações essenciais (RNF2).
	- [ ] Em 320 px com toque habilitado, completar busca, seleção, unidade e retry pelos controles visíveis. Registrar capturas/resultados; defeito aberto impede aceite e gera tarefa UI separada, sem ampliar esta tarefa Test (RNF2).

### T-49 — Validar navegação por teclado em E2E
- **ID:** T-49
- **Tipo:** Test
- **Descrição:** exercitar interações acessíveis em navegador real.
- **Rastreabilidade:** RF1, RF4–RF5; RNF3.
- **Dependências:** T-44, T-46.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Critérios de aceite:**
	- [ ] Sem mouse, teste percorre busca → resultados → seleção → unidade → erro → retry usando Tab/Shift+Tab e teclas do padrão semântico adotado; cada ação é ativável e a ordem de foco é registrada (RNF3).
	- [ ] Após atualizar resultados ou remover erro, foco permanece em controle existente ou destino explícito documentado; não cai em elemento removido nem cria armadilha. Evidência visual comprova foco visível em cada etapa (RNF3).

### T-50 — Auditar WCAG e anúncios com leitor de tela
- **ID:** T-50
- **Tipo:** Test
- **Descrição:** registrar verificação manual que DOM/screenshots não comprovam.
- **Rastreabilidade:** RNF3, RNF7; instruções de tema visual.
- **Dependências:** T-48, T-49.
- **Arquivos prováveis:** `tasks/weather-app-tasks.md` (evidências).
- **Critérios de aceite:**
	- [ ] Registro manual contém sistema, navegador/versão, leitor de tela/versão e texto anunciado para loading, lista de resultados, vazio e erro; pessoa consegue identificar operação/resultado e acionar recuperação sem informação apenas visual (RNF3, RNF7).
	- [ ] Checklist WCAG 2.2 A/AA registra cada critério aplicável, método, evidência e resultado; não aplicáveis têm justificativa. Medições de contraste sobre fundos compostos respeitam 4,5:1/3:1 conforme categoria; falhas e itens aplicáveis não avaliados impedem aceite (RNF3). Correções exigem tarefas próprias.

### T-51 — Verificar privacidade e nova sessão
- **ID:** T-51
- **Tipo:** Test
- **Descrição:** confirmar que a jornada permanece em memória.
- **Rastreabilidade:** RF4–RF5; AC3.1, AC4.7; RNF9.
- **Dependências:** T-44.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Critérios de aceite:**
	- [ ] Após buscar cidade e escolher Fahrenheit, teste inspeciona localStorage, IndexedDB e cookies da aplicação e confirma ausência de consulta/localidade persistidas; contexto novo mostra busca inicial, nenhuma cidade/medida e Celsius ao exibir temperaturas pela primeira vez (RNF9, AC3.1, AC4.7).
	- [ ] Spies/registro de rede comprovam zero chamadas de geolocalização e de geocoding/forecast na abertura; após busca, texto só é enviado ao geocoding previsto, não a destinos adicionais. Registrar armazenamento e destinos observados (AC4.7, RNF9).

### T-52 — Medir LCP do build de produção
- **ID:** T-52
- **Tipo:** Test
- **Descrição:** produzir evidência do desempenho inicial, sem corrigir gargalos nesta tarefa.
- **Rastreabilidade:** RNF1.
- **Dependências:** T-44.
- **Arquivos prováveis:** `tasks/weather-app-tasks.md` (evidências).
- **Critérios de aceite:**
	- [ ] Registro contém 20 valores de LCP do build de produção com cache frio, perfil Lighthouse mobile, download 1,6 Mbps, upload 750 Kbps e latência 150 ms; versões, CPU/perfil e comando/configuração usados são informados (RNF1).
	- [ ] Ordenar os 20 valores e calcular p75 pelo posto mais próximo: valor da posição 15, com posições iniciadas em 1. Aceite exige p75 ≤ 2.500 ms; falha exige correção separada e nova amostra, sem excluir medições lentas para aprovação (RNF1; método reprodutível de medição).

### T-53 — Medir loading e timeout no navegador
- **ID:** T-53
- **Tipo:** Test
- **Descrição:** validar tempos da interação separadamente do benchmark LCP.
- **Rastreabilidade:** RF5; AC4.1–AC4.2; RNF1.
- **Dependências:** T-46.
- **Arquivos prováveis:** `tests/e2e/weather.spec.ts`.
- **Critérios de aceite:**
	- [ ] Instrumentação com relógio real do navegador mede tempo entre envio/seleção e primeiro estado de loading renderizado; cada cenário de busca e forecast registra valor ≤ 100 ms, junto ao ambiente/configuração (AC4.1, RNF1).
	- [ ] Com endpoint pendente, registrar início do request, prazo de timeout de 10.000 ms, abort e apresentação de erro com retry. Latência da instrumentação é registrada separadamente, não usada para ampliar o limite da spec; extrapolação não justificada ou ambiente inconclusivo mantém item pendente (AC4.2, RNF1).

### T-54 — Validar versões reais dos navegadores
- **ID:** T-54
- **Tipo:** Test
- **Descrição:** registrar compatibilidade distinta dos motores do Playwright.
- **Rastreabilidade:** RNF8.
- **Dependências:** T-48, T-49.
- **Arquivos prováveis:** `tasks/weather-app-tasks.md` (matriz de evidências).
- **Critérios de aceite:**
	- [ ] Matriz datada lista sistema/dispositivo e números das duas versões estáveis mais recentes de Chrome, Edge, Firefox e Safari por plataforma suportada; para cada combinação registra jornada principal, erro/retry, teclado ou toque, resultado e evidência (RNF8).
	- [ ] Cada célula exigida tem aprovação; combinações inexistentes são justificadas como não aplicáveis e ambientes indisponíveis permanecem pendentes. Chromium/WebKit/emulação não são registrados como validação de versão real; falha/pendência impede encerrar RNF8.

### T-56 — Consolidar gates e rastreabilidade
- **ID:** T-56
- **Tipo:** Test
- **Descrição:** conferir evidências existentes, sem implementar correções ou novos testes.
- **Rastreabilidade:** RF1–RF5; RNF1–RNF9; todos os ACs.
- **Dependências:** T-50, T-51, T-52, T-53, T-54, T-55, T-57, T-58, T-59, T-60.
- **Arquivos prováveis:** `tasks/weather-app-tasks.md`.
- **Critérios de aceite:**
	- [ ] Para a mesma revisão do código, registrar comando, data, ambiente e resultado aprovado de `pnpm lint`, `pnpm build`, `pnpm test` e E2E nos projetos Chromium/Firefox/WebKit; execução ausente ou falha impede conclusão (gates das instruções e do plano).
	- [ ] Matriz final enumera AC1.1–AC1.7, AC2.1–AC2.4, AC3.1–AC3.4 e AC4.1–AC4.7, cada um com teste/asserção e resultado; RNF1–RNF9 apontam para evidência correspondente. Zero requisitos aplicáveis sem verificação aprovada; bloqueios de T-01 e tarefas dependentes não são apresentados como concluídos.

## Prioridade e tamanho

Esta classificação não altera IDs, aceite ou dependências. Prioridade indica valor/risco e não permite executar uma tarefa antes de seus pré-requisitos.

- **P0:** desbloqueia a primeira jornada confiável de busca e clima ou protege sua corretude básica.
- **P1:** completa a experiência e verifica sua qualidade, recuperação e requisitos não funcionais.
- **P2:** consolida migração, compatibilidade ampliada e evidências finais; não significa opcional. Todos os requisitos da versão continuam obrigatórios antes de declarar produção.
- **P:** alteração localizada ou poucos cenários diretos, com solução conhecida.
- **M:** múltiplos caminhos, integração ou casos de borda no limite de um ou dois arquivos.
- **G:** validação extensa entre ambientes ou necessidade de decisão externa. Requer reservar ambiente/revisão e pode ser repartida em execuções menores, sem aprovar o conjunto parcialmente.

Tamanho é relativo, não prazo em horas. Poucos arquivos não tornam uma auditoria de navegadores ou acessibilidade pequena.

| Tarefa | Prioridade | Tamanho | Justificativa curta |
| --- | --- | --- | --- |
| T-01 | P0 | M | Fecha decisões que bloqueiam os contratos. |
| T-02 | P0 | M | Define operações e invariantes de estado. |
| T-03 | P0 | M | Contratos compartilhados e migração aditiva. |
| T-04 | P0 | P | Cálculo determinístico usado para exibir temperaturas. |
| T-05 | P0 | M | Fuso, datas locais e limites de calendário. |
| T-06 | P0 | P | Tabela finita de códigos e fallback. |
| T-07 | P0 | M | Tipos de erro e compatibilidade de assinaturas. |
| T-08 | P0 | M | Abort, timeout do corpo e limpeza de recursos. |
| T-09 | P0 | M | Falhas e timers exigem mocks controlados. |
| T-10 | P0 | P | Primeiro endpoint da jornada de busca. |
| T-11 | P0 | P | Fixtures e parâmetros do geocoding. |
| T-12 | P0 | M | Request e normalização de condições atuais. |
| T-13 | P0 | P | Contrato atual com valores e ausências controlados. |
| T-14 | P0 | M | Arrays, cinco datas e fuso correto. |
| T-15 | P0 | M | Calendário e resposta diária parcial. |
| T-16 | P0 | M | Classificação de disponibilidade entre seções. |
| T-17 | P0 | M | Combinações de dados válidos e ausentes. |
| T-18 | P0 | M | Busca explícita e transições de estado. |
| T-19 | P0 | P | Hook de busca com serviço simulado. |
| T-20 | P0 | M | Cidade selecionada, dados e estados de resultado. |
| T-21 | P0 | P | Asserções de seleção e disponibilidade. |
| T-22 | P0 | P | Recupera exatamente a operação que falhou. |
| T-23 | P0 | P | Retry de busca e forecast com alvo conhecido. |
| T-24 | P0 | M | Evita exibir dados da cidade errada. |
| T-25 | P0 | M | Respostas fora de ordem e desmontagem. |
| T-26 | P0 | M | Base visual utilizável no viewport mínimo. |
| T-27 | P0 | M | Busca e seleção operáveis por teclado. |
| T-28 | P0 | P | Callbacks e semântica do formulário. |
| T-29 | P0 | M | Medidas atuais, unidades e disponibilidade. |
| T-30 | P0 | P | Um dia de previsão com campos definidos. |
| T-31 | P0 | P | Composição cronológica da lista. |
| T-32 | P0 | P | Medidas atuais completas e parciais. |
| T-33 | P0 | M | Cinco dias com valores distintos e ausências. |
| T-34 | P0 | P | Feedback acessível de carregamento. |
| T-35 | P0 | P | Diferencia inicial, sem localidades e sem dados. |
| T-36 | P0 | P | Mensagem segura e ação de recuperação. |
| T-37 | P1 | P | Controle de unidade sem lógica de rede. |
| T-38 | P1 | P | Seleção controlada e teclado. |
| T-39 | P0 | M | Conecta a primeira jornada visível de ponta a ponta. |
| T-40 | P0 | M | Integra estados, recuperação e resultados. |
| T-41 | P1 | P | Unidade local compartilhada pela tela. |
| T-42 | P1 | M | Conversão simultânea e ausência de requests extras. |
| T-43 | P0 | P | Habilita execução reproduzível da jornada E2E. |
| T-44 | P0 | M | Principal evidência desktop/mobile; exige também RF4. |
| T-45 | P1 | M | Ausência e parcialidade na aplicação integrada. |
| T-46 | P0 | M | Recuperação real entre camadas. |
| T-47 | P0 | M | Corretude da cidade em respostas concorrentes. |
| T-48 | P1 | M | Viewports e estados com evidência visual. |
| T-49 | P1 | M | Fluxo de foco no navegador. |
| T-50 | P1 | G | Auditoria WCAG e leitor de tela com ambiente real. |
| T-51 | P1 | M | Armazenamento, nova sessão e destinos de rede. |
| T-52 | P1 | M | Vinte execuções e medição reprodutível de LCP. |
| T-53 | P1 | M | Instrumentação de tempos reais da interação. |
| T-54 | P2 | G | Matriz de versões reais e dispositivos disponíveis. |
| T-55 | P2 | P | Retira somente compatibilidade já sem uso. |
| T-56 | P2 | M | Consolida todos os gates e evidências da versão. |
| T-57 | P0 | P | Prova cálculo e arredondamento usados na UI. |
| T-58 | P0 | P | Componente loading isolado. |
| T-59 | P0 | P | Erro seguro e callback de retry isolados. |
| T-60 | P0 | P | Variantes vazias isoladas. |

**Inversões de prioridade na ordem vigente:** T-55 é P2 por seu valor próprio, mas hoje bloqueia a etapa Testes; portanto, precisa ser antecipada se a ordem por camadas for mantida. T-44 é P0, mas depende da conversão P1 via T-42: o E2E completo só recebe aceite após RF4. Não ignorar essas dependências para seguir apenas o rótulo de prioridade.

## Fatias verticais propostas

**Proposta, não mudança da ordem vigente:** a execução por camadas no início do arquivo continua obrigatória até aprovação desta alternativa. Não é possível obter busca real cedo respeitando os bloqueios globais atuais. Para adotar as fatias, revisar primeiro o plano/backlog para usar dependências técnicas por tarefa, em vez de exigir conclusão de todas as tarefas da camada anterior. Os gates de lint/build/test e os critérios da spec permanecem obrigatórios em cada incremento.

| Sequência | Fatia e resultado demonstrável | Tarefas envolvidas | Testes e condição de saída |
| --- | --- | --- | --- |
| 0 | **Preparação mínima:** decisões e contratos; ainda sem resultado novo de UI. | T-01 → T-02 → T-03. | Contratos aprovados, sem conflito pendente entre datas e resposta parcial. |
| 1 | **Primeiro resultado visível:** formulário de cidade em layout mobile, opções controladas, loading e mensagens vazias/erro. Pode ser demonstrado com fixtures, sem alegar integração real. | T-26, T-27, T-34–T-36 e incremento de composição de T-39. | T-28, T-58–T-60; abrir em 320 px, enviar texto e selecionar uma opção da fixture. Registrar este incremento separadamente; não marcar T-39 nem RF1 como concluídos. |
| 2 | **Busca real de cidades:** entrada → geocoding → lista distinguível → seleção explícita, com loading e ausência de resultados. Ainda não entrega clima. | T-07, T-08, T-10, T-18 e incremento de T-39, reutilizando a UI da fatia 1. | T-09, T-11, T-19, T-28; busca com caracteres especiais e busca sem resultados. Erro de busca fica visível; recuperação completa permanece na fatia 5. |
| 3 | **Clima útil em Celsius:** cidade escolhida mostra condições atuais e previsão de cinco dias locais, inclusive campos indisponíveis. | T-04–T-06, T-12, T-14, T-16, T-20, T-29–T-31 e incremento de T-39. | T-57, T-13, T-15, T-17, T-21, T-32–T-33; conferir dados conhecidos e D a D+4. Corretude em trocas concorrentes e aceite integral de T-39 ficam para fatia 5; demonstração não equivale a liberação de produção. |
| 4 | **Unidade escolhida:** todas as temperaturas alternam C/F sem rede extra. | T-37, T-41 e apresentação já preparada em T-29/T-30. | T-38 e cenários de conversão de T-42; comparar medidas e contagem de requests. T-41/T-42 só recebem aceite integral quando as dependências restantes forem verificadas na fatia 5. |
| 5 | **Jornada confiável desktop/mobile:** recuperar falhas, trocar cidade durante consulta e concluir o fluxo principal desde a abertura em mobile. | T-22, T-24, conclusão de T-39/T-41, T-43; T-55 após retirar seus consumidores legados. | T-23, T-25, T-40, conclusão de T-42 e T-44–T-47. Rodar fluxo completo em 1280 × 800 e 320 × 780 px; abort/resultado tardio não muda a cidade vigente. |
| 6 | **Candidato a produção:** evidências de responsividade, a11y, privacidade, tempos e navegadores reais. | T-48–T-54 e T-56; confirmar T-55 concluída ou ausência justificada de compatibilidade temporária. | Todos os ACs/RNFs com evidência e gates aprovados. Ambiente indisponível ou falha mantém a versão pendente, mesmo sendo atividade P2. |

### Ajustes necessários para adotar as fatias

- Substituir os pré-requisitos globais de etapa por dependências técnicas explícitas, somente após aprovação; manter tipos/contratos antes de seus consumidores.
- T-26 usa o tema aprovado em T-02 e não precisa tecnicamente de T-24; T-18 precisa do geocoding T-10, não do agregado de forecast T-16. As dependências atuais só podem ser removidas ao atualizar formalmente o backlog.
- Desdobrar a integração T-39 em busca, clima e recuperação, com tarefas próprias de até dois arquivos. A tabela de fatias indica incrementos, não cria aceite parcial da tarefa original. Tratar T-41/T-42 da mesma forma se a alternância for entregue antes da jornada robusta.
- Desvincular testes isolados e configuração E2E de T-55 quando não consumirem contratos antigos; T-57 depende tecnicamente de T-04, T-09 de T-08, T-58–T-60 de seus componentes e T-43 da configuração/ambiente. Não adiar testes por uma limpeza sem relação com seu contrato.
- Reaproveitar os mesmos testes/fixtures entre incrementos; antecipar cenários de busca/clima não conclui T-44, cujo aceite inclui a jornada completa com unidade e mobile.
- Reservar ambientes para T-50/T-54 desde a preparação, embora suas evidências completas venham ao final. Se uma auditoria revelar defeito, criar correção focada e repetir a verificação correspondente.

## Correspondência dos IDs anteriores

IDs da primeira coluna são históricos, não dependências do backlog novo. Testes extensos também foram separados por comportamento, mesmo quando estavam em um arquivo único.

| Tarefa anterior | Tarefas desta revisão | Motivo |
| --- | --- | --- |
| T-01 | T-01, T-02 | Separar disponibilidade/datas das operações e responsabilidades. |
| T-02 | T-03, T-07, T-55; consumidores migrados nas tarefas próprias | Evitar mudança transversal de tipos, serviço, hook, UI e testes. |
| T-03 | T-04, T-57 | Separar implementação da conversão e suíte unitária dedicada. |
| T-04 | T-05 | Manter formatação e seu teste isolado. |
| T-05 | T-06 | Manter códigos WMO e teste isolado. |
| T-06 | T-08 | Transporte somente; assinaturas/categorias em T-07. |
| T-07 | T-09 | Manter teste focado de transporte. |
| T-08 | T-10 | Manter geocoding como operação única. |
| T-09 | T-11 | Manter teste de geocoding em um arquivo. |
| T-10 | T-12, T-14, T-16 | Separar atuais/request, calendário e disponibilidade do agregado. |
| T-11 | T-13, T-15, T-17 | Testar os três contratos de forecast separadamente. |
| T-12 | T-18 | Manter estado de busca isolado. |
| T-13 | T-19, T-25 | Separar transições de corrida entre requests. |
| T-14 | T-20, T-22, T-24 | Separar seleção, retry e concorrência. |
| T-15 | T-21, T-23, T-25 | Separar testes de resultado, recuperação e respostas obsoletas. |
| T-16 | T-26, T-27, T-39 | Separar estilos, formulário e composição. |
| T-17 | T-28, T-40 | Separar teste de componente da integração da tela. |
| T-18 | T-29, T-39 | Condições recebem props; estado é conectado no App. |
| T-19 | T-30, T-31, T-39 | Separar cartão, lista e conexão com estado. |
| T-20 | T-34, T-35, T-36, T-39 | Separar loading, vazio, erro e composição. |
| T-21 | T-29, T-30, T-37, T-41 | Apresentadores recebem unidade; controle e estado têm tarefas próprias. |
| T-22 | T-32, T-33 | Separar testes de atuais e previsão. |
| T-23 | T-58, T-59, T-60, T-40 | Testar loading, erro e vazio isoladamente antes da composição. |
| T-24 | T-38, T-42 | Separar teste de controle e conversão integrada. |
| T-25 | T-43, T-44 | Separar configuração E2E e jornada. |
| T-26 | T-45, T-46, T-47 | Separar ausência/parcialidade, recuperação e concorrência. |
| T-27 | T-48, T-49, T-50 | Separar viewports, teclado e auditoria; sem correções embutidas. |
| T-28 | T-51 | Manter ciclo de sessão/privacidade como unidade. |
| T-29 | T-52, T-53 | Separar LCP e tempos da interação; correções têm tarefas próprias. |
| T-30 | T-43, T-54, T-56 | Separar motores, navegadores reais e gates. |

## Mapa de cobertura

### Requisitos funcionais

Cobertura abaixo significa **tarefa prevista**, não funcionalidade implementada ou teste executado. T-03 (tipos), T-07 (contratos de serviço) e T-08 (transporte) são infraestrutura compartilhada; a tabela identifica as tarefas que entregam cada comportamento observável. Os testes estão separados para não serem contabilizados como implementação.

| Requisito da spec | Tarefas de implementação e responsabilidade | Verificações explícitas | Situação no backlog |
| --- | --- | --- | --- |
| **RF1 — Busca e seleção de cidade (US1)** | T-10: geocoding e caracteres; T-18: busca sem seleção automática; T-27: envio por botão/Enter, validação e opções distinguíveis; T-20: seleção explícita inicia forecast; T-24: descartar buscas obsoletas; T-35: ausência de localidades; T-39: integrar a jornada. | T-11, T-19, T-21, T-25, T-28, T-40, T-44–T-47, T-60. | Com tarefas correspondentes. |
| **RF2 — Condições atuais (US2)** | T-12: temperatura, condição, umidade, vento, pressão, precipitação e horário; T-16: preservar dados atuais parciais; T-20/T-24: carregar somente a seleção vigente; T-04–T-06: temperatura, horário local e rótulos WMO; T-29: exibir medidas/unidades; T-39: integrar resultado. | T-13, T-17, T-21, T-25, T-32, T-40, T-44–T-47. | Com tarefas; contrato de ausência de atuais/horário depende de T-01. |
| **RF3 — Previsão de cinco dias (US3)** | T-14: cinco datas D a D+4, mínima/máxima, condição, precipitação total e vento máximo; T-16: preservar seção diária válida; T-20/T-24: vincular à seleção vigente; T-04–T-06: temperatura, datas locais e rótulos WMO; T-30/T-31: cartões e lista cronológica; T-39: integrar resultado. | T-15, T-17, T-21, T-25, T-33, T-40, T-44–T-47. | Com tarefas; regra para datas ausentes depende de T-01. |
| **RF4 — Unidade de temperatura (US4)** | T-04: converter/arredondar a partir do Celsius original; T-29/T-30: derivar todas as temperaturas na apresentação; T-31: repassar unidade aos dias; T-37: controle de unidade; T-41: estado local e alternância sem request ou alteração das demais medidas. | T-57, T-38, T-42, T-44, T-51. | Com tarefas correspondentes. |
| **RF5 — Estados da experiência (US5)** | T-08: timeout e falhas de transporte; T-10/T-16: distinguir ausência de resultados/dados e parcialidade; T-18/T-20: transições de busca/clima; T-22: retry do alvo que falhou; T-24: proteção contra resultados antigos; T-27: entrada vazia; T-34–T-36: loading, inicial/vazio/sem dados e erro com recuperação; T-39: compor os estados. | T-09, T-17, T-19, T-21, T-23, T-25, T-40, T-45–T-47, T-53, T-58–T-60. | Com tarefas; classificação de resposta parcial segue a decisão de T-01. |

**Requisitos sem tarefa correspondente: nenhum.** RF1–RF5 têm implementação prevista e testes associados. Isso não elimina o bloqueio documental de T-01: sua decisão deve ser aprovada antes das tarefas dependentes; não se presume que os contratos pendentes estejam resolvidos.

### Requisitos não funcionais

| Requisito | Implementação principal | Verificações explícitas |
| --- | --- | --- |
| RNF1 | T-08, T-18, T-20, T-34, T-39 | T-09, T-40, T-52–T-53 |
| RNF2 | T-26–T-27, T-29–T-31, T-34–T-37, T-39 | T-44, T-48 |
| RNF3 | T-26–T-27, T-29–T-31, T-34–T-37 | T-28, T-38, T-58–T-60, T-40, T-49–T-50 |
| RNF4–RNF6 | T-07–T-08, T-10, T-12, T-14, T-16, T-22, T-24, T-36 | T-09, T-11, T-13, T-15, T-17, T-23, T-25, T-40, T-46 |
| RNF7 | T-05–T-06, T-27, T-29–T-31, T-35–T-36 | T-05–T-06, T-28, T-32–T-33, T-50 |
| RNF8 | T-43; stack existente | T-44–T-49, T-54, T-56 |
| RNF9 | T-18, T-41; estado em memória | T-51 |