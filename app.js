const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

mongoose.connect("mongodb://localhost:27017/todoList",{useNewUrlParser: true, useUnifiedTopology: true});

const items = [];
const workItems = [];

const Item = mongoose.model("Item",{
    taskName: String,
});

const item1 = new Item({
    taskName: "Welcome to todo list!"
});
const item2 = new Item({
    taskName: "Hit + button to add a new item!"
});
const item3 = new Item({
    taskName: "<-- Hit to delete this item!"
});

const defaultItems = [item1, item2, item3];

defaultItems.forEach((item)=>{
    items.push(item.taskName);
});

Item.insertMany(defaultItems, (err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("Succesfully Inserted!");
    }
});

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine" , "ejs");


app.get("/", (req,res)=>{
    const day = date.getDate();
    res.render("list", {listTitle: day, newListItems: items});
});

app.get("/work", (req,res)=>{
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/", (req, res)=>{
    
    const item = req.body.newItem;
    console.log(req.body);

    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }
});

app.listen(3000, ()=>{
    console.log("server has started on port 3000!");
});