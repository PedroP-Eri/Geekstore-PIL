export const notFoundMiddleware = (req, res) => {
  const mensagem = `Rota não encontrada: ${req.method} ${req.originalUrl}`;

  if (req.accepts("html") && !req.accepts("json")) {
    return res.status(404).send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 - Página não encontrada</title>
        </head>
        <body>
          <h1>404 - Página não encontrada</h1>
          <p>O endereço que você tentou acessar não existe.</p>
          <a href="/">Voltar para o início</a>
        </body>
      </html>
    `);
  }

  return res.status(404).json({
    sucesso: false,
    mensagem,
  });
};

export default notFoundMiddleware;