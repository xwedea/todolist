const express = require("express");
const bodyParser = require("body-parser");
const { static } = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine" , "ejs");

mongoose.connect("mongodb+srv://admin-jiyan:test123@cluster0.xhhzk.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });


const items = [];

const itemsSchema = {taskName: String};
const Item = mongoose.model("Item",itemsSchema);

const List = mongoose.model("List",{
    name: String,
    items: [itemsSchema]
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


app.get("/", (req,res)=>{
    const welcome = "Today";

    Item.find({}, (err, foundItems)=>{
        if(!foundItems){
            Item.insertMany(defaultItems, (err)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log("Succesfully Inserted!");
                }
            });
            res.redirect("/");
        }else{ 
            res.render("list", {listTitle: welcome, newListItems: foundItems});
        }
    });

});

app.get("/:customListName", (req,res)=>{
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, (err, foundList)=>{
        if(!err){
            if(!foundList){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
            }else{
                res.render("list", {listTitle: customListName, newListItems: foundList.items});
            }
        }else{
            console.log(err);
        }
    });
    
});

app.post("/", (req, res)=>{
    
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({taskName: itemName});

    if(listName === "Today"){
        item.save();
        console.log(listName);
        res.redirect("/")
    }else{
        List.findOne({name: listName}, (err, foundList)=>{
            if(!err){
                foundList.items.push(item);
                foundList.save();
                res.redirect("/"+listName);
            }else{
                console.log(err);
            }
        });
    }
});

app.post("/delete", (req,res)=>{
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItemId, (err)=>{
            if(err){
                console.log(err);
            }else{
                console.log("Succesfully Removed!");
            }
            res.redirect("/");
        });
    }else{
        List.findOneAndUpdate({name: listName},{$pull:{items:{_id: checkedItemId}}},(err)=>{
            if(!err){
                console.log("update!!!");
                res.redirect("/"+listName);
            }else{
                console.log(err);
            }
        });
    }

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, ()=>{
    console.log("server has started!");
});