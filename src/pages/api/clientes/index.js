import { NextApiRequest, NextApiResponse} from 'next'

const handler = (req, res) => {
  const { query, method } = req;
  const id = query.id ? parseInt(query.id, 10) : null;
  const name = query.name;

  switch (method) {
    case "GET":
      // Obter dados do banco de dados
      if (id !== null) {
        res.status(200).json({ id, name: `User ${id}` });
      } else {
        res.status(400).json({ error: "ID is required" });
      }
      break;
    case "PUT":
      // Atualizar ou criar dados no banco de dados
      if (id !== null) {
        res.status(200).json({ id, name: name || `User ${id}` });
      } else {
        res.status(400).json({ error: "ID is required" });
      }
      break;
    case "POST":
      // Criar novos dados no banco de dados
      if (name) {
        const newId = Math.floor(Math.random() * 10000); // Gera um ID fictício
        res.status(201).json({ id: newId, name });
      } else {
        res.status(400).json({ error: "Name is required" });
      }
      break;
    case "DELETE":
      // Excluir dados do banco de dados
      if (id !== null) {
        res.status(200).json({ message: `User ${id} deleted` });
      } else {
        res.status(400).json({ error: "ID is required" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}


export default handler;