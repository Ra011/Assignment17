const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });


mongoose
  .connect(
    "mongodb+srv://raphaelattfield:U4ZivtKn7i6x-iY@cluster0.3umc0ij.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect ot mongodb...", err));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


const teamSchema = new mongoose.Schema({
    name: String,
    img: String,
    position: String,
    country: String,
    nickname: String,
    kitcolour: String,
    players: [String],
  });

  const Team = mongoose.model("Team", teamSchema);

  app.get("/api/recipes", (req, res) => {
    getTeams(res);
  });

  const getTeams = async (res) => {
    const teams = await Team.find();
    res.send(teams);
  };




app.post("/api/teams", upload.single("img"), (req, res) => {
    const result = validateTeam(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message); //changed information to details
        return;
    }

    const team = {
        _id: teams.length + 1,
        name: req.body.name,
        position: req.body.position,
        country: req.body.county,
        nickname: req.body.nickname,
        kitcolour: req.body.kitcolour,
        players: req.body.players.split(",")
    }

    if (req.file) {
        team.img = "images/" + req.file.filename;
    }
    teams.push(team);
    res.send(teams);
});






app.put("/api/teams/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const team = teams.find((r) => r._id === id);;
    const result = validateTeam(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    team.name = req.body.name;
    team.position = req.body.position;
    team.country = req.body.county;
    team.nickname = req.body.nickname;
    team.kitcolour = req.body.kitcolour;
    team.players = req.body.players.split(",");

    if (req.file) {
        team.img = "images/" + req.file.filename;
    }

    res.send(team);
});


app.delete("/api/teams/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const teamIndex = teams.findIndex((team) => team._id === id);

    if (teamIndex === -1) {
        res.status(404).send("The team was not found");
        return;
    }

    teams.splice(teamIndex, 1);
    res.send(teams);
    //const team = teams.find((r) => r._id === id);
    // if (!team) {
    //     res.status(404).send("The team was not found");
    //     return;
    // }
    // const index = teams.indexOf(team);
    // if (index === -1) {
    //     res.status(404).send("The team was not found");
    //     return;
    // }
    // team.splice(index, 1);
    // res.send(team);

});







const validateTeam = (team) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        position: Joi.string().max(4).required(),
        country: Joi.string().min(4).required(),
        nickname: Joi.string().min(3).required(),
        kitcolour: Joi.string().min(3).required(),
        players: Joi.allow(""),
    });

    return schema.validate(team);
};

app.listen(3000, () => {
    console.log("Listening");
});

