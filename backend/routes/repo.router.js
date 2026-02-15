const express = require('express');
const repoRouter = express.Router();
const repoController = require("../controllers/repoController");

repoRouter.post('/repo/create', repoController.createRepository);
repoRouter.get('/repo/all', repoController.getAllRepository);
repoRouter.get('/repo/id/:id', repoController.fetchRepositoryByID);
repoRouter.get('/repo/name/:name', repoController.fetchRepositoryByName);
repoRouter.get('/repo/:userID', repoController.fetchRepositoriesForCurrentUser);
repoRouter.put('/repo/upate/:id', repoController.fetchRepositoryByName);
repoRouter.delete('/repo/delete/:id', repoController.deleteRepositoryByID);
repoRouter.patch('/repo/toggle/:id', repoController.toggleVisiblityById);
repoRouter.put('/repo/addIssueId/:id', repoController.addIssueId);
repoRouter.put('/repo/deleteIssueFromRepo/:id', repoController.deleteIssueFromRepo);

module.exports = repoRouter;