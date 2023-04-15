const mongoose = require("mongoose");
const express = require("express");
const Schema = mongoose.Schema;
const app = express();
const jsonParser = express.json();

const {
    MONGO_DB_HOSTNAME,
    MONGO_DB_PORT,
    MONGO_DB
} = process.env;

const url = `mongodb://${MONGO_DB_HOSTNAME}:${MONGO_DB_PORT}/${MONGO_DB}`;

const carScheme = new Schema({company: String, model: String, enginePower: Number}, {versionKey: false});
const Car = mongoose.model("Car", carScheme);
 
app.use(express.static(__dirname + "/public"));
 
mongoose.connect(url)
.then(() => {
    app.listen(3000, function(){
        console.log("Server is waiting for connection...");
    });
}).catch((err) => console.log(err));
  
app.get("/api/cars", function(req, res){
    Car.find({}).then(function(cars){
        res.send(cars)
    }).catch((err) => console.log(err));
});
 
app.get("/api/cars/:id", function(req, res){
    const id = req.params.id;
    Car.findOne({_id: id}).then(function(car){
        res.send(car);
    }).catch((err) => console.log(err));
});
    
app.post("/api/cars", jsonParser, function (req, res) {
        
    if(!req.body) return res.sendStatus(400);
        
    const carCompany = req.body.company;
    const carModel = req.body.model;
    const carEnginePower = req.body.enginePower;

    const newCar = new Car({company: carCompany, model: carModel, enginePower: carEnginePower});
        
    newCar.save().then(function(){
        res.send(newCar);
    }).catch((err) => console.log(err));
});
     
app.delete("/api/cars/:id", function(req, res){
    const id = req.params.id;
    Car.findByIdAndDelete(id).then(function(car){
        res.send(car);
    }).catch((err) => console.log(err));
});
    
app.put("/api/cars", jsonParser, function(req, res){
         
    if(!req.body) return res.sendStatus(400);
    const id = req.body.id;
    const carCompany = req.body.company;
    const carModel = req.body.model;
    const carEnginePower = req.body.enginePower;
    const newCar = {company: carCompany, model: carModel, enginePower: carEnginePower};
     
    Car.findOneAndUpdate({_id: id}, newCar, {new: true}).then(function(car){
        res.send(car);
    }).catch((err) => console.log(err));
});