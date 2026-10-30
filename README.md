# Painel Escolar — POO

Mini-projeto de Programação Orientada a Objetos em JavaScript (Oficina PBL), com tela em
HTML5 + CSS3 + DOM conectada ao backend C# (`BackendEstudoAPI`) e MySQL.
Baseado em [Exercicio-POO](https://github.com/HenriqueNunes-2008/Exercicio-POO).

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Estrutura da tela |
| `style.css` | Estilo da tela |
| `script.js` | Classes de domínio (Passos 1 a 8) e eventos da tela (Missões 9 e 10) |
| `backend.js` | Classe `ClienteBackendEstudo`, que conversa com a API em `http://localhost:5080` |

## Checklist final do Mini-Projeto

| Item | Onde está |
|---|---|
| Abstração, classes e objetos | `Disciplina`, com 3 instâncias (`disciplina1`, `disciplina2`, `disciplina3`) |
| Encapsulamento | `MetaEstudo` e `Usuario` com campos privados `#`. `MetaEstudo` valida os minutos e a meta; `Usuario` valida id, nome, e-mail e senha (e `AlterarEmail` / `AlterarSenha`) |
| Classe abstrata e herança | `Usuario` (abstrata) → `Administrador`, `Responsavel`, `Discente` |
| Polimorfismo dinâmico | `SessaoEstudo` (abstrata) → `SessaoPomodoro`, `SessaoExercicios`, `SessaoLeitura`, sobrescrevendo `CalcularXp()` e `GerarFeedback()` |
| Polimorfismo estático | `Discente.RegistrarEstudo(...)` com 3 formas: sessão pronta, disciplina + minutos, disciplina + horário + páginas |
| Interfaces | `INotificador` → `NotificadorEmail`, `NotificadorWhatsApp` (usada no botão "Notificar Responsável"). `IExportavelJson` → `MetaEstudo`, `SessaoEstudo` (usada no `POST` ao backend) |
| Associação | `Responsavel.VincularDiscente(discente)`; `TrilhaEstudo` guarda o `Administrador` |
| Agregação | `TrilhaEstudo` reúne `Disciplina`s que existem fora dela |
| Composição | `PlanoEstudo` cria e é dono dos `ItemCronograma` |
| Dependência | `ClienteBackendEstudo` usa `Discente` e `SessaoEstudo` só como parâmetros; `ServicoAlertaResponsavel` recebe o `INotificador` por parâmetro |
| Tela visual + backend C# | "Registrar Estudo" envia `POST /api/sessoes` para `http://localhost:5080` |

## Missão 9 — Interface gráfica

| Requisito | Onde está |
|---|---|
| Cabeçalho de perfil com `discente.GerarPainelResumo()` (XP sobe a cada estudo) e `responsavel.GerarPainelResumo()` | `atualizarResumos()` |
| `<select>` com as disciplinas instanciadas no Passo 1 | `preencherDisciplinas()` |
| `<select>` de modalidade: Pomodoro, Exercícios ou Leitura | `#modalidade` |
| Campos numéricos de duração e dado extra (ciclos, acertos ou páginas) | `#minutos`, `#dadoExtra` |
| Botão "Registrar Estudo": instancia a subclasse de `SessaoEstudo`, chama `discente.RegistrarEstudo(sessao)` e `meta.RegistrarAvanco(minutos)` | evento de `#registrarEstudo` |
| Barra de progresso com `meta.CalcularPercentual()` | `atualizarProgresso()` |
| Lista com o `GerarFeedback()` de cada sessão | `atualizarHistorico()` |
| Botão "Notificar Responsável" que dispara o `INotificador` e mostra um `alert` | evento de `#notificarResponsavel` |

## Missão 10 — Conexão com o backend C# + MySQL

| Requisito | Onde está |
|---|---|
| Classe `ClienteBackendEstudo` (Dependência) | `backend.js` |
| `POST /api/sessoes` com o JSON da sessão ao clicar em "Registrar Estudo" | `ClienteBackendEstudo.SalvarSessao(discente, sessao)` |
| Botão "Carregar Histórico do Servidor": `GET /api/sessoes`, exibido em tabela | `ClienteBackendEstudo.ListarSessoes()` |
| Botão "Relatório do Discente": `GET /api/relatorio/{nomeDiscente}` | `ClienteBackendEstudo.GerarRelatorio(nome)` |
| Indicador de servidor online/offline | `ClienteBackendEstudo.VerificarServidor()` |

JSON enviado no `POST /api/sessoes`:

```json
{
  "discenteNome": "Lucas",
  "disciplina": "Programação Orientada a Objetos",
  "tipoModalidade": "Pomodoro",
  "duracaoMinutos": 50,
  "xpGanho": 130,
  "resumoFeedback": "Pomodoro em Programação Orientada a Objetos (50 min) -> +130 XP - Ciclos completos: 2"
}
```

## Como rodar

1. Na pasta `Aula_09_Exercicios_Projeto_PI/Backend/`, execute `iniciar_backend.bat` (ou `BackendEstudoAPI.exe`).
2. Confira no navegador se `http://localhost:5080` está online.
3. Abra o `index.html`. O indicador na seção "Servidor (MySQL)" fica verde quando o backend responde.
4. Registre um estudo e clique em "Carregar Histórico do Servidor" para ver o que foi gravado no banco.

Sem o backend, a tela continua funcionando em memória e avisa que a sessão não foi salva no servidor.
