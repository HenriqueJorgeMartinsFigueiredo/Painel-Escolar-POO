# Painel Escolar — POO

Exercício de Programação Orientada a Objetos em JavaScript (Oficina PBL), baseado em
[Exercicio-POO](https://github.com/HenriqueNunes-2008/Exercicio-POO).

## Conceitos aplicados

| Passo | Conceito | Classes |
|---|---|---|
| 1 | Abstração | `Disciplina` |
| 2 | Encapsulamento | `MetaEstudo` (campos privados `#`) |
| 3 | Herança | `Usuario` (abstrata) → `Administrador`, `Responsavel`, `Discente` |
| 4 | Polimorfismo | `SessaoEstudo` (abstrata) → `SessaoPomodoro`, `SessaoExercicios`, `SessaoLeitura` |
| 5 | Polimorfismo estático (sobrecarga) | `Discente.RegistrarEstudo(...)` com 3 formas |
| 6 | Interface | `INotificador` → `NotificadorEmail`, `NotificadorWhatsApp` |
| 7 | Associação | `TrilhaEstudo`, `Responsavel.VincularDiscente` |
| 8 | Composição | `PlanoEstudo` → `ItemCronograma`, `ServicoAlertaResponsavel` |

## Missão 9 — Interface gráfica (HTML5 + CSS3 + DOM)

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

## Como rodar

Abra o `index.html` no navegador. O `backend.js` tenta salvar as sessões em uma API em
`http://localhost:5080/api/sessoes`; sem o servidor, o painel funciona normalmente e o erro aparece só no console.
