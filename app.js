//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose= require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

//for public folder
app.use(express.static("public"));

//connecting database
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});



const itemsSchema= {
  name : String
}

const Item =  mongoose.model("Item", itemsSchema);
const BFood = new Item({
  name: "Buy Food"
});
const CFood = new Item({
  name: "Cook Food"
});

const EFood = new Item({
  name: "Eat Food"
});

//Default items
const defaultItems= [BFood, CFood, EFood];



app.get("/", function(req, res){



  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0)
    {
      Item.insertMany(defaultItems, function(err){
        if(err)
        {
          console.log(err);
        }else{
          console.log("Successfully inserted");
        }
      });
    }

    res.render("list", {listTitle: "Today", newListItems: foundItems });
  });


});



app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");


});

app.post("/delete", function(req, res){
  const checkedItem= req.body.checkbox;
  Item.findByIdAndRemove(checkedItem, function(err){
    if(err){
      console.log(err);
    }
    else {
      {
        console.log("Successfully deleted");
        res.redirect("/");
      }
    }
  });
});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
