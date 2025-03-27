import express from "express";
import db from "../database.js";

const app = express();

//middleware: express.json()
app.use(express.json());


app.get("/",(req,res)=>{
    res.status(200).send("Home - Aula 04");
})

app.get("/cidades",(req,res) => {

    const sql = "SELECT CIDADE.ID, CIDADE.NOME, ESTADO.NOME as ESTADO FROM CIDADE INNER JOIN ESTADO ON ESTADO.ID = CIDADE.ESTADO_ID";

    db.all(sql, (erro,linhas) => {
        if(erro){
            console.error("Erro ao listar as cidades!",erro.cidade);
            return res.status(500).json({ error:"Erro ao listar as cidades."})
        }

        const jsonSaida = linhas.map( elemento => ({
          id: elemento.ID,
          nome: elemento.NOME,
          estado : elemento.ESTADO   
        }));

        res.status(200).json(jsonSaida);
    })

})


app.get("/estados",(req,res) => {

    const sql = "SELECT ID, NOME FROM ESTADO";

    db.all(sql, (erro,linhas) => {
        if(erro){
            console.error("Erro ao listar os estados!",erro.cidade);
            return res.status(500).json({ error:"Erro ao listar as cidades."})
        }

        const jsonSaida = linhas.map( elemento => ({
          id: elemento.ID,
          nome: elemento.NOME
        }));

        res.status(200).json(jsonSaida);

    })

})



app.get("/cidades/:id",(req,res) => {

    const sql = "SELECT CIDADE.ID, CIDADE.NOME, ESTADO.NOME as ESTADO FROM CIDADE INNER JOIN ESTADO ON ESTADO.ID = CIDADE.ESTADO_ID where CIDADE.ID = "+req.params.id;

    db.get(sql, (erro,linha) => {
        if(erro){
            console.error("Erro ao carregar cidade específica!",erro.message);
            return res.status(500).json({ error:"Erro ao carregar cidade específica."})
        }

        if(!linha){
            return res.status(404).json({error:"Cidade não encontrada"})
        }

        // DTO : Data Transfer Object
        const jsonSaida = {
          id: linha.ID,
          nome: linha.NOME,
          estado : linha.ESTADO   
        };

        res.status(200).json(jsonSaida);

    })
})


app.get("/estados/:id",(req,res) => {

    const sql = "SELECT ID, NOME FROM ESTADO WHERE ID="+req.params.id;

    db.get(sql, (erro,linha) => {
        if(erro){
            console.error("Erro ao carregar estado específico!",erro.message);
            return res.status(500).json({ error:"Erro ao carregar estado específico."})
        }

        if(!linha){
            return res.status(404).json({error:"Estado não encontrado"})
        }

        // DTO : Data Transfer Object
        const jsonSaida = {
          id: linha.ID,
          nome: linha.NOME,   
        };

        res.status(200).json(jsonSaida);

    })
})



app.post("/cidades", (req,res) => {

    console.log(req.body);

    const nome = req.body.nome;
    const estado = req.body.estado;

    const sql1 = "SELECT ID FROM ESTADO WHERE ESTADO.NOME = '"+estado+"';";

    db.get(sql1, function (erro, linha) {
        if (erro) {
            console.error("Estado não encontrado : ",idEstado,erro.message);
            return res.status(500).json({ error: "Estado não existe."});
        }

        const idEstado = linha.ID;

        const sql = "INSERT INTO CIDADE (NOME, ESTADO_ID) VALUES ('"+nome+"', "+idEstado+")";

        db.run(sql, function (erro) {
            if (erro) {
            console.error("Erro ao inserir cidade",erro.message);
            return res.status(500).json({ error: "Erro ao inserir cidade no banco de dados.", idEstado});
            }

            res.status(201).json({
            id: this.lastID,
            nome,
            estado
            })
        })
    })
    
    
})


app.post("/estados", (req,res) => {

    console.log(req.body);

    const nome = req.body.nome;


    // Validação
    if(!nome) {
        return res.status(400).json({ error:"O campo não pode estar vazio!"});
    }

    // SQL: INSERT INTO CIDADE (NOME) VALUES ('MANAUS') ....
    const sql = "INSERT INTO ESTADO (NOME) VALUES ('"+nome+"')";

    db.run(sql, function (erro) {
        if (erro) {
            console.error("Erro ao inserir estado",erro.message);
            return res.status(500).json({ error: "Erro ao inserir estado no banco de dados."});
        }

        res.status(201).json({
            id: this.lastID,
            nome
        })
    })
    
})

app.delete("/cidades/:id", (req,res) => {
    const sql = "DELETE FROM CIDADE WHERE id ="+ req.params.id;

    db.run(sql, (erro) => {
        if (erro) {
            console.error("Erro ao deletar cidade",erro.message);
            return res.status(500).json({ error: "Erro ao deletar cidade no banco de dados."});
        }else{
            res.status(200).send("Cidade deletada!");
        }
    })

})


app.delete("/estados/:id", (req,res) => {
    const sql = "DELETE FROM ESTADO WHERE id ="+ req.params.id;

    db.run(sql, (erro) => {
        if (erro) {
            console.error("Erro ao deletar estado",erro.message);
            return res.status(500).json({ error: "Erro ao deletar estado no banco de dados."});
        }else{
            res.status(200).send("Estado deletado!");
        }
    })

})


app.put("/cidades/:id", (req,res) => {

    const nome = req.body.nome;
    const estado = req.body.estado;

    const sql1 = "SELECT ID FROM ESTADO WHERE ESTADO.NOME = '"+estado+"';";


    db.get(sql1, function (erro, linha) {
        if (erro) {
            console.error("Estado não encontrado : ",idEstado,erro.message);
            return res.status(500).json({ error: "Estado não existe."});
        }

        const idEstado = linha.ID;

        const sql = "UPDATE CIDADE SET NOME = '"+nome+"', ESTADO_ID = "+idEstado+" where ID = "+req.params.id+";";

        db.run(sql, function (erro) {
            if (erro) {
                console.error("Erro ao atualizar cidade",erro.message);
                return res.status(500).json({ error: "Erro ao atualizar cidade no banco de dados.", idEstado});
            }

            res.status(201).json({
            id: req.params.id,
            nome,
            estado
            })
        })
    })
})

app.put("/estados/:id", (req,res) => {

    const nome = req.body.nome;
    const sql = "UPDATE ESTADO SET nome = '"+nome+"' where id ="+ req.params.id;

    db.run(sql, (erro) => {
        if (erro) {
            console.error("Erro ao atualizar cidade",erro.message);
            return res.status(500).json({ error: "Erro ao atualizar cidade no banco de dados."});
        }else{
            res.status(200).send("Cidade alterada!");
        }
    })
})

export default app;
