const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Todo = require('./static/js/models/task.js')

mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/todomvc')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.use('/static', express.static('static'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/static/index.html");
})

// put routes here

//Display DB
app.get('/api/todos', function(req, res){
  Todo.find().sort('order').then(todos =>{
    res.json(todos)
  }).catch(err=>{
    res.status(404).json(err)
  })
});

//Posting to DB
app.post('/api/todos', function (req, res) {
  if (req.body._id) {
    Todo.findOne({
      '_id': req.body._id
    })
    .then(function (todo) {
      todo.title = req.body.title
      todo.order = req.body.order
      todo.completed = req.body.completed
      todo.save()
      .then(function (todo) {

        res.json(todo)
      })
      .catch(function (error) {
        res.status(404).json(error)
      })
    })
  } else {
    let todo = new Todo()
    todo.title = req.body.title
    todo.order = req.body.order
    todo.completed = req.body.completed
    todo.save()
    .then(function (todos) {
      res.json(todos)
    })
    .catch(function (error) {
      res.status(422).json(error)
    })
  }
});


//Get actions for Object
app.get('/api/todos/:id', function(req, res){
  Todo.findOne({'_id': req.params.id}).then(item=>{
    console.log(item)
    res.json(item)
  }).catch(err=>{
    res.status(422).json(err)
  })
});

//Update Object
app.put('/api/todos/:id', function(req, res){
  Todo.findOne({'_id' : req.params.id}).then(update=>{
    update.title = req.body.title,
    update.order = req.body.order,
    update.completed = req.body.completed
    update.save().then(newUpdate=>{
      res.json(newUpdate)
    })
  }).catch(err=>{
    res.status(422).json(err)
  })
})

//Partial update
app.patch('/api/todos/:id', function(req, res){
  Todo.findOne({'_id': req.params.id}).then(info=>{
    info.title = req.body.title,
    info.order = req.body.order,
    info.completed = req.body.completed
    info.save().then(newInfo=>{
      res.json(newInfo)
    })
  }).catch(err=>{
    res.status(422).json(err)
  })
})



//Delete Objects
app.delete('/api/todos/:id', function(req, res){
  Todo.deleteOne({'_id': req.params.id}).then(trash=>{
    res.json(trash)
  })
})


app.listen(3000, function () {
    console.log('Express running on http://localhost:3000/.')
});
