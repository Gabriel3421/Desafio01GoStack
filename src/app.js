const express = require("express");
const cors = require("cors");
 const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function middlewareLogs(request, response, next){
  console.log(
    'Request logged:',
    'Method:',
    request.method,
    'Path:',
    request.path,
    'Query:',
    request.query,
    'Body:',
    request.body,
    'Params:',
    request.params,
  );
  return next();
}
 app.use(middlewareLogs)
const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).send(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = { 
                      id: uuid(), 
                      title, 
                      url, 
                      techs, 
                      likes: 0
                    }
  repositories.push(repository)
  return response.status(201).send(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)
  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'})
  }
  const repository = { ...repositories[repositoryIndex], title, url, techs}
  repositories[repositoryIndex] = repository
  return response.status(200).send(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)
  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'})
  }
  repositories.splice(repositoryIndex,1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)
  if (repositoryIndex < 0){
    return response.status(400).json({error: 'Repository not found.'})
  }
  const repository = { ...repositories[repositoryIndex], likes: repositories[repositoryIndex].likes + 1}
  repositories[repositoryIndex] = repository
  return response.status(200).send(repository)
});

module.exports = app;
