class ConectorBackend {
    #urlBase = "http://localhost:5080";

    // 1. Exemplo de GET: Buscar todas as sessões de estudo salvas no MySQL
    async listarSessoes() {
        const resposta = await fetch(`${this.#urlBase}/api/sessoes`);
        return await resposta.json();
    }

    // 2. Exemplo de POST: Enviar uma sessão de estudo concluída
    async salvarSessaoNoBanco(nomeDiscente, sessao) {
        const resposta = await fetch(`${this.#urlBase}/api/sessoes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                discenteNome: nomeDiscente,
                disciplina: sessao.GetDisciplina().GetNome(),
                modalidade: sessao.ObterModalidade(),
                duracaoMinutos: sessao.GetDuracaoMinutos(),
                xpGanho: sessao.CalcularXp(),
                resumoFeedback: sessao.GerarFeedback()
            })
        });
        return await resposta.json();
    }
}
