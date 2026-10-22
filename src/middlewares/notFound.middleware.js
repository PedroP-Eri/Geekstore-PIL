
export function notFoundMiddlewares(req, res, next) {
  res.status(404).json({
      mensagem: "Esta rota não existe na API!"
  });
}
