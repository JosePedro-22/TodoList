const express = require("express");// criando instancia do servidor 
const response  = require("express");

const todosRoutes = express.Router(); // todos routes é uma variavel a qual posso acessar as rotas do servidor...
const { PrismaClient } = require("@prisma/client"); // faciliata a manipulaçao ao banco de dados é um constructor...
const prisma = new PrismaClient(); // criando instanciando o prisma pela variavel...


// C 
todosRoutes.post("/todos", async (request, response) => { // funçao que retornara uma promise, por debaixo dos panos ocorrer tudo certo
  // retornara um valor, caso contrario sera lançado uma exceçao...

  const { name } = request.body;
  const todo = await prisma.todo.create({ // criando uma tarefa dentro do BD... passando name
    // await faz a execuçao da funçao pausar para aguardar o valor da promise...
    data: {
      name,
    },
  });

  return response.status(201).json(todo);
});


// R
todosRoutes.get("/todos", async (request, response) => {
  const todos = await prisma.todo.findMany();//Busca todas as todos salvas no BD...
  return response.status(200).json(todos);
});

// U
todosRoutes.put("/todos", async (request, response) => {
  const { name, id, status } = request.body;

  if (!id) {// se o id nao existir, retorn a rota Id é obrigatorio...
    return response.status(400).json("Id é Obrigatorio...");
  }

  const todoAlreadyExist = await prisma.todo.findUnique({ where: { id } });

  if (!todoAlreadyExist) {// TodoExiste?, caso nao! Retorne a rota todo not exist
    return response.status(404).json("Todo não existe...");
  }

  const todo = await prisma.todo.update({ //busca o id, quando encontrado atualiza name...
    where: {
      id,
    },
    data: {
      name,
      status,
    },
  });

  return response.status(200).json(todo);
});

// D
todosRoutes.delete("/todos/:id", async (request, response) => {// busca o id, caso encontrado deleta e retorna a nova lista do BD...
  const { id } = request.params;

  const intId = parseInt(id);

  if (!intId) {// se o id nao existir, retorn a rota Id é obrigatorio...
    return response.status(400).json("Id é Obrigatorio...");
  }

  const todoAlreadyExist = await prisma.todo.findUnique(
    { 
      where: 
      { id: intId } 
    });

  if (!todoAlreadyExist) {// TodoExiste?, caso nao! Retorne a rota todo not exist
    return response.status(404).json("Todo não existe...");
  }

  await prisma.todo.delete({ where: { id: intId } });

  return response.status(200).send();
});

module.exports = todosRoutes; // exportando routas 