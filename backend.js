// Missão 10: ClienteBackendEstudo
// Conversa com o BackendEstudoAPI (C# + MySQL) em http://localhost:5080
//
// DEPENDÊNCIA: o cliente usa Discente e SessaoEstudo só como parâmetros
// dos métodos, sem guardar referência a eles.
class ClienteBackendEstudo {
    #urlBase;

    constructor(urlBase = "http://localhost:5080") {
        this.#urlBase = urlBase;
    }

    GetUrlBase() {
        return this.#urlBase;
    }

    // Faz a requisição e devolve o JSON (ou o texto) da resposta
    async #requisitar(caminho, opcoes = {}) {
        let resposta;

        try {
            resposta = await fetch(`${this.#urlBase}${caminho}`, opcoes);
        } catch (erro) {
            throw new Error(`Servidor offline em ${this.#urlBase}. Rode o iniciar_backend.bat.`);
        }

        const texto = await resposta.text();

        if (!resposta.ok) {
            throw new Error(`O servidor respondeu ${resposta.status}${texto ? `: ${texto}` : ""}`);
        }

        if (!texto) {
            return null;
        }

        try {
            return JSON.parse(texto);
        } catch {
            return texto;
        }
    }

    // GET: verifica se o backend está online
    async VerificarServidor() {
        try {
            await this.#requisitar("/api/sessoes");
            return true;
        } catch {
            return false;
        }
    }

    // POST /api/sessoes: envia a sessão concluída para o MySQL
    async SalvarSessao(discente, sessao) {
        if (!verificarExportavelJson(sessao)) {
            throw new Error("A sessão precisa implementar IExportavelJson.");
        }

        const corpo = {
            discenteNome: discente.GetNome(),
            ...JSON.parse(sessao.ParaJson())
        };

        return await this.#requisitar("/api/sessoes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(corpo)
        });
    }

    // GET /api/sessoes: histórico gravado no banco
    async ListarSessoes() {
        return await this.#requisitar("/api/sessoes");
    }

    // GET /api/relatorio/{nomeDiscente}: relatório do discente
    async GerarRelatorio(nomeDiscente) {
        return await this.#requisitar(`/api/relatorio/${encodeURIComponent(nomeDiscente)}`);
    }
}
