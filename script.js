// Passo 1: Conceito de Abstração

// classe Modalidade
class Modalidade {
    constructor(codigo, nome, categoria, frequenciaSemanalHoras) {
        this.codigo = codigo;
        this.nome = nome;
        this.categoria = categoria;

        if (frequenciaSemanalHoras <= 0) {
            this.frequenciaSemanalHoras = 2;
        } else {
            this.frequenciaSemanalHoras = frequenciaSemanalHoras;
        }
    }

    GetNome() {
        return this.nome;
    }

    CalcularFrequenciaEmMinutos() {
        return this.frequenciaSemanalHoras * 60;
    }

    ExibirResumo() {
        return `[${this.codigo}] ${this.nome} (${this.categoria}) — ${this.frequenciaSemanalHoras}h/semana (${this.CalcularFrequenciaEmMinutos()} min)`;
    }
}


// Como utilizar a classe:

// Criando três instâncias
const modalidade1 = new Modalidade(
    "ACD101",
    "Musculação",
    "Força",
    4
);
console.log(modalidade1.ExibirResumo());

const modalidade2 = new Modalidade(
    "ACD102",
    "Corrida",
    "Cardio",
    3
);
console.log(modalidade2.ExibirResumo());

const modalidade3 = new Modalidade(
    "ACD103",
    "Yoga",
    "Flexibilidade",
    2
);
console.log(modalidade3.ExibirResumo());

const modalidades = {
    modalidade1: modalidade1,
    modalidade2: modalidade2,
    modalidade3: modalidade3
};


// Passo 2: Encapsulamento

// Classe MetaTreino privada
class MetaTreino {
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
const meta = new MetaTreino(300);

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

class Personal extends Usuario {
    constructor(id, nome, email, cref, senha) {
        super(id, nome, email, senha);
        this.cref = cref;
    }
    // sobrescrever ObterTipoPerfil
    ObterTipoPerfil() {
        return "Personal";
    }
    // sobrescrever GerarPainelResumo
    GerarPainelResumo() {
        return `Personal: ${this.GetNome()} - CREF: ${this.cref} - Alunos: ${this.#alunosAcompanhados.length}`;
    }

    // Passo 7

    #alunosAcompanhados = [];
    // Método VincularAluno
    VincularAluno(aluno) {
        if (!(aluno instanceof Aluno)) {
            return false;
        }

        if (this.#alunosAcompanhados.includes(aluno)) {
            return false;
        }

        this.#alunosAcompanhados.push(aluno);
        return true;
    }
}

class Aluno extends Usuario {
    constructor(id, nome, email, matricula, senha) {
        super(id, nome, email, senha);
        this.matricula = matricula;
        this.pontosTotal = 0;
    }
    // sobrescrever ObterTipoPerfil
    ObterTipoPerfil() {
        return "Aluno";
    }
    // sobrescrever GerarPainelResumo
    GerarPainelResumo() {
        return `Aluno: ${this.GetNome()} - Matrícula: ${this.matricula} - Pontos: ${this.pontosTotal}`;
    }

    // Passo 5: Polimorfismo estático

    // Lista privada histórico de treinos
    #historicoTreinos = [];

    RegistrarTreino(arg1, arg2, arg3, arg4) {
        if (arg1 instanceof SessaoTreino) {
            // Forma 1: com a sessão pronta
            const sessao = arg1;

            this.#historicoTreinos.push(sessao);
            this.pontosTotal += sessao.CalcularPontos();

        } else if (arg1 instanceof Modalidade && arg3 === undefined && arg4 === undefined) {
            // Forma 2: cria TreinoForca estimando séries (1 série a cada 5 min)
            const modalidade = arg1;
            const minutos = arg2;

            const series = Math.max(1, Math.floor(minutos / 5));

            this.RegistrarTreino(new TreinoForca(modalidade, minutos, series, 0));

        } else if (arg1 instanceof Modalidade && arg3 !== undefined && arg4 !== undefined) {
            // Forma 3: por horário, cria TreinoCardio
            const modalidade = arg1;
            const horaInicio = arg2;
            const horaFim = arg3;
            const distanciaKm = arg4;

            const minutos = (horaFim - horaInicio) * 60;

            this.RegistrarTreino(new TreinoCardio(modalidade, minutos, distanciaKm));

        } else {
            throw new Error("Argumentos inválidos!");
        }
    }

    GetHistoricoTreinos() {
        return [...this.#historicoTreinos];
    }
}

const aluno = new Aluno(
    1,
    "Lucas",
    "lucas@email.com",
    "MAT001",
    "123456"
);

const personal = new Personal(
    2,
    "Carla",
    "carla@email.com",
    "123456-G/SP",
    "123456"
);

const administrador = new Administrador(
    3,
    "Roberto",
    "roberto@email.com",
    "Gerente",
    "123456"
);

personal.VincularAluno(aluno);


// Passo 4: Polimorfismo

// Classe SessaoTreino
class SessaoTreino {
    #modalidade;
    #duracaoMinutos;

    constructor(modalidade, duracaoMinutos) {
        if (new.target === SessaoTreino) {
            throw new Error("Classe abstrata!");
        }
        this.#modalidade = modalidade;
        this.#duracaoMinutos = duracaoMinutos;
    }

    GetModalidade() {
        return this.#modalidade;
    }

    GetDuracaoMinutos() {
        return this.#duracaoMinutos;
    }

    ObterTipoTreino() {
        throw new Error("Método abstrato!");
    }

    CalcularPontos() {
        throw new Error("Método abstrato!");
    }

    // Método virtual
    GerarFeedback() {
        return `${this.ObterTipoTreino()} em ${this.#modalidade.GetNome()} (${this.#duracaoMinutos} min) -> +${this.CalcularPontos()} pontos`;
    }

    // Passo 6: exportação para JSON
    ParaJson() {
        return JSON.stringify({
            modalidade: this.GetModalidade().GetNome(),
            tipoTreino: this.ObterTipoTreino(),
            duracaoMinutos: this.GetDuracaoMinutos(),
            pontos: this.CalcularPontos()
        });
    }
}

// Três subclasses concretas de SessaoTreino
class TreinoForca extends SessaoTreino {
    constructor(modalidade, duracaoMinutos, seriesCompletas, cargaTotalKg) {
        super(modalidade, duracaoMinutos);
        this.seriesCompletas = seriesCompletas;
        this.cargaTotalKg = cargaTotalKg;
    }

    ObterTipoTreino() {
        return "Força";
    }

    CalcularPontos() {
        return this.GetDuracaoMinutos() * 2 + (this.seriesCompletas * 5) + Math.floor(this.cargaTotalKg / 100);
    }

    GerarFeedback() {
        return `${super.GerarFeedback()} - Séries: ${this.seriesCompletas} - Carga total: ${this.cargaTotalKg} kg`;
    }
}

class TreinoCardio extends SessaoTreino {
    constructor(modalidade, duracaoMinutos, distanciaKm) {
        super(modalidade, duracaoMinutos);
        this.distanciaKm = distanciaKm;
    }

    ObterTipoTreino() {
        return "Cardio";
    }

    CalcularPontos() {
        return this.GetDuracaoMinutos() + Math.round(this.distanciaKm * 20);
    }

    // Feedback com ritmo médio
    GerarFeedback() {
        const ritmo = this.distanciaKm > 0
            ? this.GetDuracaoMinutos() / this.distanciaKm
            : 0;
        // O toFixed(1) limita a uma casa decimal
        return `${super.GerarFeedback()} - Distância: ${this.distanciaKm} km - Ritmo: ${ritmo.toFixed(1)} min/km`;
    }
}

class TreinoAlongamento extends SessaoTreino {
    constructor(modalidade, duracaoMinutos, posturas, fezRelaxamento) {
        super(modalidade, duracaoMinutos);
        this.posturas = posturas;
        this.fezRelaxamento = fezRelaxamento;
    }

    ObterTipoTreino() {
        return "Alongamento";
    }

    CalcularPontos() {
        return this.GetDuracaoMinutos() + (this.posturas * 3) + (this.fezRelaxamento ? 20 : 0);
    }

    GerarFeedback() {
        return `${super.GerarFeedback()} - Posturas: ${this.posturas} - Relaxamento: ${this.fezRelaxamento ? "Sim" : "Não"}`;
    }
}

// Array de sessões de treino
const sessoes = [
    new TreinoForca(modalidade1, 60, 12, 3500),
    new TreinoCardio(modalidade2, 30, 5),
    new TreinoAlongamento(modalidade3, 45, 15, true)
];

let pontosTotal = 0;
// Percorrer o array com um único forEach, com feedback de pontos
sessoes.forEach(sessao => {
    console.log(sessao.GerarFeedback());
    pontosTotal += sessao.CalcularPontos();
});

console.log(`Pontos Total: ${pontosTotal}`);


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

// Classes que assinam a interface
class NotificadorEmail extends INotificador {
    ObterCanal() {
        return "E-mail";
    }
    EnviarAlerta(destinatario, mensagem) {
        console.log(`Enviando alerta por e-mail para ${destinatario}: ${mensagem}`);
        return true;
    }
}

class NotificadorWhatsApp extends INotificador {
    ObterCanal() {
        return "WhatsApp";
    }
    EnviarAlerta(destinatario, mensagem) {
        console.log(`Enviando alerta por WhatsApp para ${destinatario}: ${mensagem}`);
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
class FichaTreino {
    #modalidades = [];

    constructor(titulo, administrador) {
        this.titulo = titulo;
        this.administrador = administrador;
    }

    AdicionarModalidade(modalidade) {
        if (modalidade instanceof Modalidade) {
            this.#modalidades.push(modalidade);
            return true;
        }

        return false;
    }

    CalcularFrequenciaTotal() {
        let totalHoras = 0;

        for (const modalidade of this.#modalidades) {
            totalHoras += modalidade.CalcularFrequenciaEmMinutos() / 60;
        }

        return totalHoras;
    }
}

const ficha = new FichaTreino("Ficha A - Iniciante", administrador);
ficha.AdicionarModalidade(modalidade1);
ficha.AdicionarModalidade(modalidade2);
ficha.AdicionarModalidade(modalidade3);
console.log(`${ficha.titulo}: ${ficha.CalcularFrequenciaTotal()}h/semana`);


// Passo 8: Composição

class ItemCronograma {
    constructor(diaSemana, minutosPlanejados) {
        this.diaSemana = diaSemana;
        this.minutosPlanejados = minutosPlanejados;
    }
}

class PlanoTreino {
    #itensCronograma = [];

    AdicionarItem(diaSemana, minutosPlanejados) {
        const item = new ItemCronograma(diaSemana, minutosPlanejados);
        this.#itensCronograma.push(item);
    }

    CalcularMinutosPlanejados() {
        return this.#itensCronograma.reduce((total, item) => total + item.minutosPlanejados, 0);
    }
}

const plano = new PlanoTreino();
plano.AdicionarItem("Segunda", 60);
plano.AdicionarItem("Quarta", 60);
plano.AdicionarItem("Sexta", 60);
console.log(`Plano semanal: ${plano.CalcularMinutosPlanejados()} min`);


class ServicoAlertaPersonal {
    AvaliarAluno(aluno, meta, personal, notificador) {
        if (!verificarNotificador(notificador)) {
            throw new Error("Notificador inválido!");
        }

        const percentual = meta.CalcularPercentual();

        let mensagem;

        if (percentual >= 100) {
            mensagem = `Parabéns! ${aluno.GetNome()} atingiu 100% da meta de treino!`;
        } else {
            mensagem = `${aluno.GetNome()} cumpriu ${percentual.toFixed(1)}% da meta de treino.`;
        }

        return notificador.EnviarAlerta(
            personal.GetEmail(),
            mensagem
        );
    }
}

const servicoAlerta = new ServicoAlertaPersonal();


// Conexão backend

const conectorBackend = new ConectorBackend();

// Exibir os resumos ao carregar a página
function atualizarResumos() {
    document.getElementById("resumoAluno").textContent =
        aluno.GerarPainelResumo();

    document.getElementById("resumoPersonal").textContent =
        personal.GerarPainelResumo();
}

atualizarResumos();

// Ajusta os campos extras conforme o tipo de treino
const configCamposExtras = {
    forca: { label1: "Séries completas:", label2: "Carga total levantada (kg):" },
    cardio: { label1: "Distância percorrida (km):", label2: null },
    alongamento: { label1: "Posturas realizadas:", label2: "Fez relaxamento? (1 = sim, 0 = não):" }
};

function atualizarCamposExtras() {
    const tipo = document.getElementById("tipoTreino").value;
    const config = configCamposExtras[tipo] || configCamposExtras.forca;

    document.getElementById("labelDadoExtra").textContent = config.label1;
    document.getElementById("dadoExtra").step = tipo === "cardio" ? "0.1" : "1";

    const campoExtra2 = document.getElementById("campoExtra2");
    campoExtra2.style.display = config.label2 ? "block" : "none";
    if (config.label2) {
        document.getElementById("labelDadoExtra2").textContent = config.label2;
    }
}

document.getElementById("tipoTreino").addEventListener("change", atualizarCamposExtras);
atualizarCamposExtras();

document.getElementById("registrarTreino").addEventListener("click", async () => {

    // 1. Ler os dados do formulário
    const modalidadeSelecionada = document.getElementById("modalidade").value;
    const tipoTreino = document.getElementById("tipoTreino").value;
    const minutos = Number(document.getElementById("minutos").value);
    const dadoExtra = Number(document.getElementById("dadoExtra").value);
    const dadoExtra2 = Number(document.getElementById("dadoExtra2").value);

    // 2. Recuperar o objeto Modalidade
    const modalidade = modalidades[modalidadeSelecionada];

    if (
        !modalidade ||
        !Number.isInteger(minutos) ||
        minutos <= 0 ||
        minutos > 300
    ) {
        alert("Selecione uma modalidade e informe uma duração entre 1 e 300 minutos.");
        return;
    }

    // 3. Criar a sessão de treino
    let sessao;

    if (tipoTreino === "forca") {

        if (!Number.isInteger(dadoExtra) || dadoExtra < 0 || dadoExtra2 < 0) {
            alert("Informe a quantidade de séries (número inteiro) e a carga total.");
            return;
        }

        sessao = new TreinoForca(modalidade, minutos, dadoExtra, dadoExtra2);

    } else if (tipoTreino === "cardio") {

        if (dadoExtra <= 0) {
            alert("Informe a distância percorrida em km.");
            return;
        }

        sessao = new TreinoCardio(modalidade, minutos, dadoExtra);

    } else if (tipoTreino === "alongamento") {

        if (!Number.isInteger(dadoExtra) || dadoExtra < 0 || (dadoExtra2 !== 0 && dadoExtra2 !== 1)) {
            alert("Informe o número de posturas e 1 ou 0 para o relaxamento.");
            return;
        }

        sessao = new TreinoAlongamento(modalidade, minutos, dadoExtra, dadoExtra2 === 1);

    }

    // Impede o registro se a sessão não foi criada
    if (!sessao) {
        alert("Selecione um tipo de treino válido.");
        return;
    }

    // 4. Registrar localmente
    aluno.RegistrarTreino(sessao);
    meta.RegistrarAvanco(minutos);

    atualizarResumos();

    const percentual = meta.CalcularPercentual();

    document.getElementById("progressoPreenchido").style.width =
        `${percentual}%`;

    document.getElementById("percentualMeta").textContent =
        `${percentual.toFixed(1)}% concluído`;

    const item = document.createElement("li");
    item.textContent = sessao.GerarFeedback();

    document.getElementById("listaFeedback").appendChild(item);

    // 5. Salvar no backend C#
    try {
        const resultado = await conectorBackend.salvarTreinoNoBanco(
            aluno.GetNome(),
            sessao
        );

        console.log("Treino salvo no servidor:", resultado);

    } catch (erro) {
        console.error("Erro ao salvar no servidor:", erro);
    }
});

// Botão Notificar Personal: usa o INotificador escolhido
document.getElementById("notificarPersonal").addEventListener("click", () => {
    const canal = document.getElementById("canal").value;
    const notificador = notificadores[canal];

    const enviado = servicoAlerta.AvaliarAluno(aluno, meta, personal, notificador);

    document.getElementById("statusNotificacao").textContent = enviado
        ? `Alerta enviado para ${personal.GetNome()} via ${notificador.ObterCanal()}.`
        : "Não foi possível enviar o alerta.";
});
