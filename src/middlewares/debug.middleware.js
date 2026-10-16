export const debugMiddleware = (req, res, next) => {
  const inicio = Date.now();

  console.log(
    `[REQUISIÇÃO] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
  );

  res.on("finish", () => {
    const duracao = Date.now() - inicio;

    console.log(
      `[RESPOSTA] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duracao}ms`
    );
  });

  next();
};

export default debugMiddleware;