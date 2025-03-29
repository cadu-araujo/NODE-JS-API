import sqlite3 from "sqlite3";

sqlite3.verbose();

const db = new sqlite3.Database("./database.sqlite", (erro) => {
    if (erro){
        console.error("Erro ao conectar no banco de dados!",erro.message);
    } else {
        console.log("Conectado ao banco de dados!");
    }    
});

db.serialize( () => {
    db.exec(
           "CREATE TABLE IF NOT EXISTS ESTADO ("+
           "ID INTEGER PRIMARY KEY AUTOINCREMENT,"+
           "NOME TEXT NOT NULL);"+
           "CREATE TABLE IF NOT EXISTS CIDADE ("+
            "ID INTEGER PRIMARY KEY AUTOINCREMENT,"+
            "NOME TEXT NOT NULL,"+
            "ESTADO_ID INTEGER,"+
            "FOREIGN KEY (ESTADO_ID) REFERENCES ESTADO(ID));"
        , (erro) => {
          if(erro){
                console.error("Erro ao criar a tabela:",erro.message);
            } else {
                console.log("Tabela criada com sucesso ou já existe!")
        }    
        });

});

export default db;
