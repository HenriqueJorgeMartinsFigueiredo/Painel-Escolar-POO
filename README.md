# Painel da Academia — POO

Exercício de Programação Orientada a Objetos em JavaScript, baseado em
[Exercicio-POO](https://github.com/HenriqueNunes-2008/Exercicio-POO), com o tema academia/treinos.

## Conceitos aplicados

| Passo | Conceito | Classes |
|---|---|---|
| 1 | Abstração | `Modalidade` |
| 2 | Encapsulamento | `MetaTreino` (campos privados `#`) |
| 3 | Herança | `Usuario` (abstrata) → `Administrador`, `Personal`, `Aluno` |
| 4 | Polimorfismo | `SessaoTreino` (abstrata) → `TreinoForca`, `TreinoCardio`, `TreinoAlongamento` |
| 5 | Polimorfismo estático (sobrecarga) | `Aluno.RegistrarTreino(...)` com 3 formas |
| 6 | Interface | `INotificador` → `NotificadorEmail`, `NotificadorWhatsApp` |
| 7 | Associação | `FichaTreino`, `Personal.VincularAluno` |
| 8 | Composição | `PlanoTreino` → `ItemCronograma`, `ServicoAlertaPersonal` |

## Como rodar

Abra o `index.html` no navegador. O `backend.js` tenta salvar os treinos em uma API em
`http://localhost:5080/api/treinos`; sem o servidor, o painel funciona normalmente e o erro aparece só no console.
