import express from "express"

const app = express 

//Permitir dados de Json

app.use(express.json())

//Permitir dados de formulário

app.use(express.urlencoded({ extended: true }));

//Arquivos estaticos

app.use(express.static("public"));

//Rota inicial

app.get("/", (req, res) => {
    res.send("Geek Store API funcionando")
});

export default app