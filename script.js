// Interface IExportavelJson
// (declarada no topo porque MetaEstudo e SessaoEstudo a implementam)
class IExportavelJson {
    constructor() {
        if (new.target === IExportavelJson) {
            throw new Error("Interface não pode ser instanciada!");
        }
    }

    ParaJson() {
        throw new Error("Método ParaJson deve ser implementado!");
    }
}

// Função para verificar se um objeto implementa a interface IExportavelJson
function verificarExportavelJson(obj) {
    return obj !== null
        && typeof obj === "object"
        && typeof obj.ParaJson === "function";
}


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

// Classe MetaEstudo com campos privados (implementa IExportavelJson)
class MetaEstudo extends IExportavelJson {
    #metaMinutosSemana;
    #minutosCumpridos;

    constructor(metaMinutosSemana) {
        super();
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

    // IExportavelJson: exportação para JSON
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

        // Validações contra dados inválidos
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error("Id inválido: deve ser um inteiro maior que zero.");
        }
        if (typeof nome !== "string" || nome.trim().length < 2) {
            throw new Error("Nome inválido: informe pelo menos 2 letras.");
        }
        if (!Usuario.#EmailValido(email)) {
            throw new Error("E-mail inválido.");
        }
        if (!Usuario.#SenhaValida(senha)) {
            throw new Error("Senha inválida: mínimo de 6 caracteres.");
        }

        this.#id = id;
        this.#nome = nome.trim();
        this.#email = email.trim();
        this.#senha = senha;
    }

    static #EmailValido(email) {
        return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }

    static #SenhaValida(senha) {
        return typeof senha === "string" && senha.length >= 6;
    }

    AlterarEmail(novoEmail) {
        if (!Usuario.#EmailValido(novoEmail)) {
            return false;
        }
        this.#email = novoEmail.trim();
        return true;
    }

    AlterarSenha(senhaAtual, novaSenha) {
        if (!this.Autenticar(senhaAtual) || !Usuario.#SenhaValida(novaSenha)) {
            return false;
        }
        this.#senha = novaSenha;
        return true;
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
    // Passo 7 - ASSOCIAÇÃO: o Responsável conhece os Discentes que acompanha,
    // mas os dois existem de forma independente.
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

// Classe abstrata SessaoEstudo (implementa IExportavelJson)
class SessaoEstudo extends IExportavelJson {
    #disciplina;
    #duracaoMinutos;

    constructor(disciplina, duracaoMinutos) {
        super();
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

    // IExportavelJson: exportação para JSON (mesmo formato que o backend recebe)
    ParaJson() {
        return JSON.stringify({
            disciplina: this.GetDisciplina().GetNome(),
            tipoModalidade: this.ObterModalidade(),
            duracaoMinutos: this.GetDuracaoMinutos(),
            xpGanho: this.CalcularXp(),
            resumoFeedback: this.GerarFeedback()
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

// Uso da interface IExportavelJson
[meta, ...sessoes].forEach(objeto => {
    if (verificarExportavelJson(objeto)) {
        console.log(objeto.ParaJson());
    }
});


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


// Passo 7: Relacionamentos

// AGREGAÇÃO: a TrilhaEstudo reúne Disciplinas que já existem fora dela
// (se a trilha for apagada, as disciplinas continuam existindo).
// ASSOCIAÇÃO: a trilha guarda o Administrador que a criou.
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

// COMPOSIÇÃO: o PlanoEstudo cria e é dono dos seus ItemCronograma
// (os itens não existem fora do plano).
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


// DEPENDÊNCIA: o serviço usa Discente, MetaEstudo, Responsavel e INotificador
// apenas como parâmetros do método, sem guardar referência a eles.
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
// Missão 10: tela conectada ao backend C# + MySQL

const clienteBackend = new ClienteBackendEstudo("http://localhost:5080");

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

    // 5. Missão 10: POST /api/sessoes no backend C# (MySQL)
    const statusRegistro = document.getElementById("statusRegistro");
    statusRegistro.className = "status";
    statusRegistro.textContent = "Enviando sessão para o servidor...";

    try {
        const resultado = await clienteBackend.SalvarSessao(discente, sessao);

        console.log("Sessão salva no servidor:", resultado);
        statusRegistro.className = "status sucesso";
        statusRegistro.textContent = "Sessão registrada e salva no MySQL.";
        atualizarStatusServidor(true);

    } catch (erro) {
        console.error("Erro ao salvar no servidor:", erro);
        statusRegistro.className = "status erro";
        statusRegistro.textContent = `Sessão registrada só na tela. ${erro.message}`;
        atualizarStatusServidor(false);
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


// Missão 10: dados gravados no servidor

// Nomes amigáveis para as colunas que o backend devolve
const nomesColunas = {
    id: "Id",
    discenteNome: "Discente",
    disciplina: "Disciplina",
    tipoModalidade: "Modalidade",
    duracaoMinutos: "Minutos",
    xpGanho: "XP",
    resumoFeedback: "Feedback",
    dataRegistro: "Data",
    totalSessoes: "Total de sessões",
    totalMinutos: "Total de minutos",
    xpTotal: "XP total"
};

function nomeColuna(chave) {
    const chaveCamel = chave.charAt(0).toLowerCase() + chave.slice(1);
    return nomesColunas[chaveCamel] || chave;
}

function formatarValor(valor) {
    if (valor === null || valor === undefined) {
        return "-";
    }
    if (typeof valor === "object") {
        return JSON.stringify(valor);
    }
    return String(valor);
}

// Mostra na tela o que o servidor devolveu (lista, objeto ou texto)
function exibirDadosServidor(titulo, dados) {
    const area = document.getElementById("resultadoServidor");
    area.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.textContent = titulo;
    area.appendChild(h3);

    // Lista de registros -> tabela
    if (Array.isArray(dados)) {
        if (dados.length === 0) {
            const vazio = document.createElement("p");
            vazio.className = "vazio";
            vazio.textContent = "Nenhum registro no banco ainda.";
            area.appendChild(vazio);
            return;
        }

        const colunas = [...new Set(dados.flatMap(registro =>
            registro && typeof registro === "object" ? Object.keys(registro) : ["valor"]
        ))];

        const tabela = document.createElement("table");
        const cabecalho = tabela.createTHead().insertRow();
        colunas.forEach(coluna => {
            const th = document.createElement("th");
            th.textContent = nomeColuna(coluna);
            cabecalho.appendChild(th);
        });

        const corpo = tabela.createTBody();
        dados.forEach(registro => {
            const linha = corpo.insertRow();
            colunas.forEach(coluna => {
                const valor = registro && typeof registro === "object" ? registro[coluna] : registro;
                linha.insertCell().textContent = formatarValor(valor);
            });
        });

        const rolagem = document.createElement("div");
        rolagem.className = "tabela-rolagem";
        rolagem.appendChild(tabela);
        area.appendChild(rolagem);

        const total = document.createElement("p");
        total.className = "total-registros";
        total.textContent = `${dados.length} registro(s) no banco.`;
        area.appendChild(total);
        return;
    }

    // Objeto (ex.: relatório) -> lista de campo: valor
    if (dados && typeof dados === "object") {
        const lista = document.createElement("dl");
        Object.entries(dados).forEach(([chave, valor]) => {
            const dt = document.createElement("dt");
            dt.textContent = nomeColuna(chave);
            const dd = document.createElement("dd");
            dd.textContent = formatarValor(valor);
            lista.append(dt, dd);
        });
        area.appendChild(lista);
        return;
    }

    // Texto simples
    const p = document.createElement("p");
    p.textContent = formatarValor(dados);
    area.appendChild(p);
}

function exibirErroServidor(mensagem) {
    const area = document.getElementById("resultadoServidor");
    area.innerHTML = "";
    const p = document.createElement("p");
    p.className = "status erro";
    p.textContent = mensagem;
    area.appendChild(p);
}

function atualizarStatusServidor(online) {
    const status = document.getElementById("statusServidor");
    status.className = online ? "indicador online" : "indicador offline";
    status.textContent = online
        ? `Servidor online (${clienteBackend.GetUrlBase()})`
        : `Servidor offline (${clienteBackend.GetUrlBase()})`;
}

// Botão "Carregar Histórico do Servidor": GET /api/sessoes
document.getElementById("carregarHistorico").addEventListener("click", async () => {
    try {
        const sessoesSalvas = await clienteBackend.ListarSessoes();
        exibirDadosServidor("Sessões gravadas no MySQL", sessoesSalvas);
        atualizarStatusServidor(true);
    } catch (erro) {
        exibirErroServidor(erro.message);
        atualizarStatusServidor(false);
    }
});

// Botão "Relatório do Discente": GET /api/relatorio/{nomeDiscente}
document.getElementById("carregarRelatorio").addEventListener("click", async () => {
    try {
        const relatorio = await clienteBackend.GerarRelatorio(discente.GetNome());
        exibirDadosServidor(`Relatório de ${discente.GetNome()}`, relatorio);
        atualizarStatusServidor(true);
    } catch (erro) {
        exibirErroServidor(erro.message);
        atualizarStatusServidor(false);
    }
});

// Ao abrir a página, verifica se o backend está no ar
clienteBackend.VerificarServidor().then(atualizarStatusServidor);
