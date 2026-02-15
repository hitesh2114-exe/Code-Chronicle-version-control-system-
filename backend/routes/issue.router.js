const express = require('express');
const issueRouter = express.Router();
const issueController = require('../controllers/issueController');

issueRouter.post('/issue/create/:id', issueController.createIssue);
issueRouter.put('/issue/update/:id', issueController.updateIssueById);
issueRouter.delete('/issue/delete/:id', issueController.deleteIssueById);
issueRouter.get('/issue/all', issueController.getAllIssue);
issueRouter.get('/issue/:id', issueController.getIssueById);
issueRouter.post('/issue/togglestatus/:id', issueController.togglestatus);

module.exports = issueRouter;