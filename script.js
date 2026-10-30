// Passo 1: Conceito de Abstração

// classe Disciplina
class Disciplina {
    constructor(codigo, nome, categoria, cargaHorariaSemanalHoras) {
        this.codigo = codigo;
        this.nome = nome;
        this.categoria = categoria;

        if (cargaHorariaSemanalHoras <= 0) {
            this.cargaHorariaSemanalHoras = 2;
        } else {
            this.cargaHorariaSemanalHoras = cargaHorariaSemanalHoras;
        }
    }

    GetNome() {
        return this.nome;
    }

    CalcularCargaEmMinutos() {
        return this.cargaHorariaSemanalHoras * 60;
    }

    ExibirResumo() {
        return `[${this.codigo}] ${this.nome} (${this.categoria}) — ${this.cargaHorariaSemanalHoras}h/semana (${this.CalcularCargaEmMinutos()} min)`;
    }
}


// Como utilizar a classe:

// Criando três instâncias
const disciplina1 = new Disciplina(
    "ADS101",
    "Programação Orientada a Objetos",
    "Programação",
    4
);
console.log(disciplina1.ExibirResumo());

const disciplina2 = new Disciplina(
    "ADS102",
    "Banco de Dados",
    "Dados",
    3
);
console.log(disciplina2.ExibirResumo());

const disciplina3 = new Disciplina(
    "ADS103",
    "Matemática Discreta",
    "Exatas",
    2
);
console.log(disciplina3.ExibirResumo());

// Usado pelo <select> de disciplinas da tela
const disciplinas = {
    disciplina1: disciplina1,
    disciplina2: disciplina2,
    disciplina3: disciplina3
};


// Passo 2: Encapsulamento

// Classe MetaEstudo com campos privados
class MetaEstudo {
    #metaMinutosSemana;
    #minutosCumpridos;

    constructor(metaMinutosSemana) {
        this.#minutosCumpridos = 0;
        this.RedefinirMeta(metaMinutosSemana);
    }

    RegistrarAvanco(minutos) {
        if (minutos <= 0 || minutos > 300) {
            return false;
        } else {
            this.#minutosCumpridos += minutos;
            return true;
        }
    }

    RedefinirMeta(novaMeta) {
        if (novaMeta < 30) {
            novaMeta = 30;
        } else if (novaMeta > 2000) {
            novaMeta = 2000;
        }
        this.#metaMinutosSemana = novaMeta;
    }

    CalcularPercentual() {
        let percentual = (this.#minutosCumpridos / this.#metaMinutosSemana) * 100;
        if (percentual > 100) {
            return 100.0;
        } else {
            return percentual;
        }
    }

    EstaCumprida() {
        return this.#minutosCumpridos >= this.#metaMinutosSemana;
    }

    GetMinutosCumpridos() {
        return this.#minutosCumpridos;
    }

    GetMetaMinutosSemana() {
        return this.#metaMinutosSemana;
    }

    // Passo 6: exportação para JSON
    ParaJson() {
        return JSON.stringify({
            metaMinutosSemana: this.#metaMinutosSemana,
            minutosCumpridos: this.#minutosCumpridos,
            percentual: this.CalcularPercentual(),
            cumprida: this.EstaCumprida()
        });
    }
}

// Teste de mesa
const meta = new MetaEstudo(300);

console.log(meta.RegistrarAvanco(-20));      // false: valor inválido
console.log(meta.GetMinutosCumpridos());     // 0

console.log(meta.RegistrarAvanco(900));      // false: acima de 300
console.log(meta.GetMinutosCumpridos());     // 0

console.log(meta.CalcularPercentual() + "%");


// Passo 3: Herança

// Classe Abstrata Usuario
class Usuario {
    #id;
    #nome;
    #email;
    #senha;

    constructor(id, nome, email, senha) {
        if (new.target === Usuario) {
            throw new Error("Classe abstrata!");
        }

        this.#id = id;
        this.#nome = nome;
        this.#email = email;
        this.#senha = senha;
    }

    GetId() {
        return this.#id;
    }

    GetNome() {
        return this.#nome;
    }

    GetEmail() {
        return this.#email;
    }

    Autenticar(senhaDigitada) {
        return senhaDigitada === this.#senha;
    }

    ObterTipoPerfil() {
        throw new Error("Método abstrato!");
    }

    GerarPainelResumo() {
        throw new Error("Método abstrato!");
    }
}


// Três subclasses concretas de Usuario
class Administrador extends Usuario {
    constructor(id, nome, email, cargo, senha) {
        super(id, nome, email, senha);
        this.cargo = cargo;
    }
    // sobrescrever ObterTipoPerfil
    ObterTipoPerfil() {
        return "Administrador";
    }
    // sobrescrever GerarPainelResumo
    GerarPainelResumo() {
        return `Administrador: ${this.GetNome()} - Cargo: ${this.cargo}`;
    }
}

class Responsavel extends Usuario {
    // Passo 7: lista de discentes acompanhados
    #discentesAcompanhados = [];

    constructor(id, nome, email, parentesco, senha) {
        super(id, nome, email, senha);
        this.parentesco = parentesco;
    }
    // sobrescrever ObterTipoPerfil
    ObterTipoPerfil() {
        return "Responsável";
    }
    // sobrescrever GerarPainelResumo
    GerarPainelResumo() {
        return `Responsável: ${this.GetNome()} - Parentesco: ${this.parentesco} - Discentes acompanhados: ${this.#discentesAcompanhados.length}`;
    }

    // Método VincularDiscente
    VincularDiscente(discente) {
        if (!(discente instanceof Discente)) {
            return false;
        }

        if (this.#discentesAcompanhados.includes(discente)) {
            return false;
        }

        this.#discentesAcompanhados.push(discente);
        return true;
    }
}

class Discente extends Usuario {
    // Lista privada com o histórico de sessões de estudo
    #historicoSessoes = [];

    constructor(id, nome, email, ra, senha) {
        super(id, nome, email, senha);
        this.ra = ra;
        this.xpTotal = 0;
    }
    // sobrescrever ObterTipoPerfil
    ObterTipoPerfil() {
        return "Discente";
    }
    // sobrescrever GerarPainelResumo
    GerarPainelResumo() {
        return `Discente: ${this.GetNome()} - RA: ${this.ra} - XP: ${this.xpTotal}`;
    }

    // Passo 5: Polimorfismo estático (sobrecarga simulada)
    RegistrarEstudo(arg1, arg2, arg3, arg4) {
        if (arg1 instanceof SessaoEstudo) {
            // Forma 1: com a sessão pronta
            const sessao = arg1;

            this.#historicoSessoes.push(sessao);
            this.xpTotal += sessao.CalcularXp();

        } else if (arg1 instanceof Disciplina && arg3 === undefined && arg4 === undefined) {
            // Forma 2: cria SessaoPomodoro estimando os ciclos (1 ciclo a cada 25 min)
            const disciplina = arg1;
            const minutos = arg2;

            const ciclos = Math.max(1, Math.floor(minutos / 25));

            this.RegistrarEstudo(new SessaoPomodoro(disciplina, minutos, ciclos));

        } else if (arg1 instanceof Disciplina && arg3 !== undefined && arg4 !== undefined) {
            // Forma 3: por horário, cria SessaoLeitura
            const disciplina = arg1;
            const horaInicio = arg2;
            const horaFim = arg3;
            const paginasLidas = arg4;

            const minutos = (horaFim - horaInicio) * 60;

            this.RegistrarEstudo(new SessaoLeitura(disciplina, minutos, paginasLidas, false));

        } else {
            throw new Error("Argumentos inválidos!");
        }
    }

    GetHistoricoSessoes() {
        return [...this.#historicoSessoes];
    }
}

const discente = new Discente(
    1,
    "Lucas",
    "lucas@email.com",
    "RA001",
    "123456"
);

const responsavel = new Responsavel(
    2,
    "Carla",
    "carla@email.com",
    "Mãe",
    "123456"
);

const administrador = new Administrador(
    3,
    "Roberto",
    "roberto@email.com",
    "Coordenador",
    "123456"
);

responsavel.VincularDiscente(discente);


// Passo 4: Polimorfismo

// Classe abstrata SessaoEstudo
class SessaoEstudo {
    #disciplina;
    #duracaoMinutos;

    constructor(disciplina, duracaoMinutos) {
        if (new.target === SessaoEstudo) {
            throw new Error("Classe abstrata!");
        }
        this.#disciplina = disciplina;
        this.#duracaoMinutos = duracaoMinutos;
    }

    GetDisciplina() {
        return this.#disciplina;
    }

    GetDuracaoMinutos() {
        return this.#duracaoMinutos;
    }

    ObterModalidade() {
        throw new Error("Método abstrato!");
    }

    CalcularXp() {
        throw new Error("Método abstrato!");
    }

    // Método virtual
    GerarFeedback() {
        return `${this.ObterModalidade()} em ${this.#disciplina.GetNome()} (${this.#duracaoMinutos} min) -> +${this.CalcularXp()} XP`;
    }

    // Passo 6: exportação para JSON
    ParaJson() {
        return JSON.stringify({
            disciplina: this.GetDisciplina().GetNome(),
            modalidade: this.ObterModalidade(),
            duracaoMinutos: this.GetDuracaoMinutos(),
            xp: this.CalcularXp()
        });
    }
}

// Três subclasses concretas de SessaoEstudo
class SessaoPomodoro extends SessaoEstudo {
    constructor(disciplina, duracaoMinutos, ciclosCompletos) {
        super(disciplina, duracaoMinutos);
        this.ciclosCompletos = ciclosCompletos;
    }

    ObterModalidade() {
        return "Pomodoro";
    }

    CalcularXp() {
        return this.GetDuracaoMinutos() * 2 + (this.ciclosCompletos * 15);
    }

    GerarFeedback() {
        return `${super.GerarFeedback()} - Ciclos completos: ${this.ciclosCompletos}`;
    }
}

class SessaoExercicios extends SessaoEstudo {
    constructor(disciplina, duracaoMinutos, acertos, totalQuestoes) {
        super(disciplina, duracaoMinutos);
        this.acertos = acertos;
        this.totalQuestoes = totalQuestoes;
    }

    ObterModalidade() {
        return "Exercícios";
    }

    CalcularXp() {
        return this.GetDuracaoMinutos() + (this.acertos * 10);
    }

    // Feedback com o aproveitamento em porcentagem
    GerarFeedback() {
        const aproveitamento = this.totalQuestoes > 0
            ? (this.acertos / this.totalQuestoes) * 100
            : 0;
        // O toFixed(1) limita a uma casa decimal
        return `${super.GerarFeedback()} - Acertos: ${this.acertos}/${this.totalQuestoes} (${aproveitamento.toFixed(1)}%)`;
    }
}

class SessaoLeitura extends SessaoEstudo {
    constructor(disciplina, duracaoMinutos, paginasLidas, fezResumo) {
        super(disciplina, duracaoMinutos);
        this.paginasLidas = paginasLidas;
        this.fezResumo = fezResumo;
    }

    ObterModalidade() {
        return "Leitura";
    }

    CalcularXp() {
        return this.GetDuracaoMinutos() + (this.paginasLidas * 3) + (this.fezResumo ? 25 : 0);
    }

    GerarFeedback() {
        return `${super.GerarFeedback()} - Páginas lidas: ${this.paginasLidas} - Resumo feito: ${this.fezResumo ? "Sim" : "Não"}`;
    }
}

// Array de sessões de estudo
const sessoes = [
    new SessaoPomodoro(disciplina1, 50, 2),
    new SessaoExercicios(disciplina2, 40, 18, 20),
    new SessaoLeitura(disciplina3, 30, 15, true)
];

let xpTotal = 0;
// Percorrer o array com um único forEach, com feedback de XP
sessoes.forEach(sessao => {
    console.log(sessao.GerarFeedback());
    xpTotal += sessao.CalcularXp();
});

console.log(`XP Total: ${xpTotal}`);


// Passo 6

// Criação de interface
class INotificador {
    ObterCanal() {
        throw new Error("Método ObterCanal deve ser implementado!");
    }
    EnviarAlerta(destinatario, mensagem) {
        throw new Error("Método EnviarAlerta deve ser implementado!");
    }
}

// Mostra o alerta na tela (no navegador) e no console
function exibirAlertaNaTela(texto) {
    console.log(texto);
    if (typeof alert === "function") {
        alert(texto);
    }
}

// Classes que assinam a interface
class NotificadorEmail extends INotificador {
    ObterCanal() {
        return "E-mail";
    }
    EnviarAlerta(destinatario, mensagem) {
        exibirAlertaNaTela(`📧 E-mail enviado para ${destinatario}:\n\n${mensagem}`);
        return true;
    }
}

class NotificadorWhatsApp extends INotificador {
    ObterCanal() {
        return "WhatsApp";
    }
    EnviarAlerta(destinatario, mensagem) {
        exibirAlertaNaTela(`💬 WhatsApp enviado para ${destinatario}:\n\n${mensagem}`);
        return true;
    }
}

// Função para verificar se um objeto implementa a interface INotificador
function verificarNotificador(obj) {
    return typeof obj.ObterCanal === "function"
        && typeof obj.EnviarAlerta === "function";
}

const notificadores = {
    email: new NotificadorEmail(),
    whatsapp: new NotificadorWhatsApp()
};


// Passo 7: Associação
class TrilhaEstudo {
    #disciplinas = [];

    constructor(titulo, administrador) {
        this.titulo = titulo;
        this.administrador = administrador;
    }

    AdicionarDisciplina(disciplina) {
        if (disciplina instanceof Disciplina) {
            this.#disciplinas.push(disciplina);
            return true;
        }

        return false;
    }

    CalcularCargaHorariaTotal() {
        let totalHoras = 0;

        for (const disciplina of this.#disciplinas) {
            totalHoras += disciplina.CalcularCargaEmMinutos() / 60;
        }

        return totalHoras;
    }
}

const trilha = new TrilhaEstudo("Trilha ADS - 1º semestre", administrador);
trilha.AdicionarDisciplina(disciplina1);
trilha.AdicionarDisciplina(disciplina2);
trilha.AdicionarDisciplina(disciplina3);
console.log(`${trilha.titulo}: ${trilha.CalcularCargaHorariaTotal()}h/semana`);


// Passo 8: Composição

class ItemCronograma {
    constructor(diaSemana, minutosPlanejados) {
        this.diaSemana = diaSemana;
        this.minutosPlanejados = minutosPlanejados;
    }
}

class PlanoEstudo {
    #itensCronograma = [];

    AdicionarItem(diaSemana, minutosPlanejados) {
        const item = new ItemCronograma(diaSemana, minutosPlanejados);
        this.#itensCronograma.push(item);
    }

    CalcularMinutosPlanejados() {
        return this.#itensCronograma.reduce((total, item) => total + item.minutosPlanejados, 0);
    }
}

const plano = new PlanoEstudo();
plano.AdicionarItem("Segunda", 60);
plano.AdicionarItem("Quarta", 60);
plano.AdicionarItem("Sexta", 60);
console.log(`Plano semanal: ${plano.CalcularMinutosPlanejados()} min`);


class ServicoAlertaResponsavel {
    AvaliarDiscente(discente, meta, responsavel, notificador) {
        if (!verificarNotificador(notificador)) {
            throw new Error("Notificador inválido!");
        }

        const percentual = meta.CalcularPercentual();

        let mensagem;

        if (percentual >= 100) {
            mensagem = `Parabéns! ${discente.GetNome()} atingiu 100% da meta de estudos da semana (XP: ${discente.xpTotal}).`;
        } else {
            mensagem = `${discente.GetNome()} cumpriu ${percentual.toFixed(1)}% da meta de estudos da semana (XP: ${discente.xpTotal}).`;
        }

        return notificador.EnviarAlerta(
            responsavel.GetEmail(),
            mensagem
        );
    }
}

const servicoAlerta = new ServicoAlertaResponsavel();


// Missão 9: Interface gráfica (HTML + CSS + DOM)

const conectorBackend = new ConectorBackend();

// 1. Cabeçalho de perfil: resultado polimórfico de GerarPainelResumo()
function atualizarResumos() {
    document.getElementById("resumoDiscente").textContent =
        discente.GerarPainelResumo();

    document.getElementById("resumoResponsavel").textContent =
        responsavel.GerarPainelResumo();
}

// 3. Barra de progresso: reflete meta.CalcularPercentual()
function atualizarProgresso() {
    const percentual = meta.CalcularPercentual();

    document.getElementById("progressoPreenchido").style.width = `${percentual}%`;
    document.getElementById("barraMeta").setAttribute("aria-valuenow", percentual.toFixed(0));

    document.getElementById("percentualMeta").textContent =
        `${percentual.toFixed(1)}% concluído — ${meta.GetMinutosCumpridos()} de ${meta.GetMetaMinutosSemana()} min`;
}

// 3. Histórico: GerarFeedback() de cada sessão concluída
function atualizarHistorico() {
    const lista = document.getElementById("listaFeedback");
    lista.innerHTML = "";

    const historico = discente.GetHistoricoSessoes();

    if (historico.length === 0) {
        const vazio = document.createElement("li");
        vazio.className = "vazio";
        vazio.textContent = "Nenhuma sessão registrada ainda.";
        lista.appendChild(vazio);
        return;
    }

    historico.forEach(sessao => {
        const item = document.createElement("li");
        item.textContent = sessao.GerarFeedback();
        lista.appendChild(item);
    });
}

// 2. Seletor de disciplinas montado a partir das instâncias do Passo 1
function preencherDisciplinas() {
    const select = document.getElementById("disciplina");

    Object.entries(disciplinas).forEach(([chave, disciplina]) => {
        const opcao = document.createElement("option");
        opcao.value = chave;
        opcao.textContent = `${disciplina.codigo} — ${disciplina.GetNome()}`;
        select.appendChild(opcao);
    });
}

// Ajusta os campos extras conforme a modalidade escolhida
const configCamposExtras = {
    pomodoro: { label: "Ciclos completos:", totalQuestoes: false, resumo: false },
    exercicios: { label: "Acertos:", totalQuestoes: true, resumo: false },
    leitura: { label: "Páginas lidas:", totalQuestoes: false, resumo: true }
};

function atualizarCamposExtras() {
    const modalidade = document.getElementById("modalidade").value;
    const config = configCamposExtras[modalidade] || configCamposExtras.pomodoro;

    document.getElementById("labelDadoExtra").textContent = config.label;
    document.getElementById("campoTotalQuestoes").hidden = !config.totalQuestoes;
    document.getElementById("campoResumo").hidden = !config.resumo;
}

function limparFormulario() {
    document.getElementById("minutos").value = "";
    document.getElementById("dadoExtra").value = "";
    document.getElementById("totalQuestoes").value = "";
    document.getElementById("fezResumo").checked = false;
}

preencherDisciplinas();
atualizarResumos();
atualizarProgresso();
atualizarHistorico();

document.getElementById("modalidade").addEventListener("change", atualizarCamposExtras);
atualizarCamposExtras();

// Botão "Registrar Estudo": instancia a subclasse correta de SessaoEstudo
document.getElementById("registrarEstudo").addEventListener("click", async () => {

    // 1. Ler os dados do formulário
    const disciplinaSelecionada = document.getElementById("disciplina").value;
    const modalidade = document.getElementById("modalidade").value;
    const minutos = Number(document.getElementById("minutos").value);
    const dadoExtra = Number(document.getElementById("dadoExtra").value);
    const totalQuestoes = Number(document.getElementById("totalQuestoes").value);
    const fezResumo = document.getElementById("fezResumo").checked;

    // 2. Recuperar o objeto Disciplina
    const disciplina = disciplinas[disciplinaSelecionada];

    if (!disciplina) {
        alert("Selecione uma disciplina.");
        return;
    }

    if (!Number.isInteger(minutos) || minutos <= 0 || minutos > 300) {
        alert("Informe uma duração entre 1 e 300 minutos.");
        return;
    }

    if (!Number.isInteger(dadoExtra) || dadoExtra < 0) {
        alert("Informe um número inteiro (0 ou mais) no dado extra da modalidade.");
        return;
    }

    // 3. Criar a sessão de estudo (subclasse correta)
    let sessao;

    if (modalidade === "pomodoro") {

        sessao = new SessaoPomodoro(disciplina, minutos, dadoExtra);

    } else if (modalidade === "exercicios") {

        if (!Number.isInteger(totalQuestoes) || totalQuestoes <= 0 || dadoExtra > totalQuestoes) {
            alert("Informe o total de questões (maior que zero e maior ou igual aos acertos).");
            return;
        }

        sessao = new SessaoExercicios(disciplina, minutos, dadoExtra, totalQuestoes);

    } else if (modalidade === "leitura") {

        sessao = new SessaoLeitura(disciplina, minutos, dadoExtra, fezResumo);

    } else {
        alert("Selecione uma modalidade válida.");
        return;
    }

    // 4. Registrar no discente e na meta
    discente.RegistrarEstudo(sessao);
    meta.RegistrarAvanco(minutos);

    atualizarResumos();
    atualizarProgresso();
    atualizarHistorico();
    limparFormulario();

    // 5. Salvar no backend C# (opcional: sem o servidor, só aparece erro no console)
    try {
        const resultado = await conectorBackend.salvarSessaoNoBanco(
            discente.GetNome(),
            sessao
        );

        console.log("Sessão salva no servidor:", resultado);

    } catch (erro) {
        console.error("Erro ao salvar no servidor:", erro);
    }
});

// Botão "Notificar Responsável": dispara o INotificador escolhido
document.getElementById("notificarResponsavel").addEventListener("click", () => {
    const canal = document.getElementById("canal").value;
    const notificador = notificadores[canal];

    const enviado = servicoAlerta.AvaliarDiscente(discente, meta, responsavel, notificador);

    document.getElementById("statusNotificacao").textContent = enviado
        ? `Alerta enviado para ${responsavel.GetNome()} via ${notificador.ObterCanal()}.`
        : "Não foi possível enviar o alerta.";
});
