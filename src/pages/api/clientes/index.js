/**
 * Nome do arquivo: index.js
 * Data de criação: 26/05/2024
 * Autor: joão pedro gomes pacheco
 * Matrícula: 01592558
 *
 * Descrição:
 * Esse código é um manipulador de requisições HTTP que interage com um banco de dados de usuários. Ele responde a diferentes métodos HTTP: GET, PUT, POST , DELETE e 
 * Caso o método da requisição não seja suportado, retorna um erro indicando o método não permitido.
 *
 * Este script é parte o curso de ADS.
 */

import { NextApiRequest, NextApiResponse} from 'next'

async function handler (req, res){
  const { query, method } = req;

  switch (method) {
    case "GET":
      // Obter dados do banco de dados
      const id = query.id

      if (id == undefined) {
        res.status(400).json({ message: "id é obrigatorio!" })
        break
      }

      const user = await db.get("SELECT * from Usuarios WHERE id = ?",[id])
        
      if (user === undefined) {
        res.status(404).json({})
        break
      }

      res.status(200).json(user)
      break;
      
    case "PUT":
      // Atualizar ou criar dados no banco de dados

      if (query.nome === undefined || query.nome === "") {
        res.status(400).json({ message: "nome é obrigatorio!" })
        break
      }

      if (query.email === undefined || query.email === "") {
        res.status(400).json({ message: "email é obrigatorio!" })
        break
      }
      

      const valid_user= await db.get("SELECT * from Usuarios WHERE id = ?", [query.id])

      if (valid_user === undefined) {
        res.status(404).json({})
        break
      }

      const updateUsuario = await db.prepare(
        "UPDATE Usuarios SET nome = ?, email = ? WHERE id = ?"
      )

      await updateUsuario.run(query.nome, query.email, query.id)

      res.status(200).json({})
      break

    case "POST":
      // Criar novos dados no banco de dados
      const comEsseId = await db.get("SELECT * from Usuarios WHERE id = ?",[query.id])

      if (query.nome == undefined || query.nome == "") {
        res.status(400).json({ message: "nome é obrigatorio!" })
        break
      }

      if (query.email == undefined || query.email == "") {
        res.status(400).json({ message: "email é obrigatorio!" })
        break
      }

      if (comEsseId != undefined) {
        res.status(409).json({ message: "usuário com id já existente!" })
        break
      }

      if (query.endereco == undefined || query.endereco == "") {
        res.status(400).json({ message: "endereço é obrigatorio!" })
        break
      }

      const novoUsuario = await db.prepare("INSERT INTO Usuarios (nome, email) VALUES (?, ?)")

      await novoUsuario.run(query.nome, query.email)

      res.status(201).json({})
      break
    
    case "DELETE":
      // Excluir dados do banco de dados
      const ID = query.id

      const valid_usuario = await db.get("SELECT * from Usuarios WHERE id = ?", [ID])
      if (valid_usuario === undefined) {
        res.status(404).json({})
        break
      }

      const deleteUsuario = await db.prepare("DELETE FROM Usuarios WHERE id = ?")
      await deleteUsuario.run(ID)

      res.status(204).json({})
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}


export default handler;