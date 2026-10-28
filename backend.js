class ConectorBackend {
    #urlBase = "http://localhost:5080";

    // 1. Exemplo de GET: Buscar todos os treinos salvos no MySQL
    async listarTreinos() {
        const resposta = await fetch(`${this.#urlBase}/api/treinos`);
        return await resposta.json();
    }

    // 2. Exemplo de POST: Enviar um treino concluído
    async salvarTreinoNoBanco(nomeAluno, sessao) {
        const resposta = await fetch(`${this.#urlBase}/api/treinos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                alunoNome: nomeAluno,
                modalidade: sessao.GetModalidade().GetNome(),
                tipoTreino: sessao.ObterTipoTreino(),
                duracaoMinutos: sessao.GetDuracaoMinutos(),
                pontosGanhos: sessao.CalcularPontos(),
                resumoFeedback: sessao.GerarFeedback()
            })
        });
        return await resposta.json();
    }
}
