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
    "mongodb+srv://raphaelattfield:U4ZivtKn7i6x-iY@cluster0.3umc0ij.mongodb.net/"
  )
  .then(() => console.log("Connected to mongodb..."))
  .catch((err) => console.error("could not connect to mongodb...", err));

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
  /*  _id: mongoose.SchemaTypes.ObjectId*/
});

const Team = mongoose.model("Team", teamSchema);

app.get("/api/teams", (req, res) => {
  getTeams(res);
});

const getTeams = async (res) => {
  const teams = await Team.find();
  res.send(teams);
};

app.post("/api/teams", upload.single("img"), (req, res) => {
  const result = validateTeam(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const team = new Team({
        name: req.body.name,
        position: req.body.position,
        country: req.body.country,
        nickname: req.body.nickname,
        kitcolour: req.body.kitcolour,
        players: req.body.players.split(","),
  });

  if (req.file) {
    team.img = "images/" + req.file.filename;
  }

  createTeam(team, res);
});

const createTeam = async (team, res) => {
  const result = await team.save();
  res.send(team);
};

app.put("/api/teams/:id", upload.single("img"), (req, res) => {
  const result = validateTeam(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  updateTeam(req, res);
});

const updateTeam = async (req, res) => {
  let fieldsToUpdate = {
    name: req.body.name,
    position: req.body.position,
    country: req.body.country,
    nickname: req.body.nickname,
    kitcolour: req.body.kitcolour,
    players: req.body.players.split(","),
  };

  if (req.file) {
    fieldsToUpdate.img = "images/" + req.file.filename;
  }

  const result = await Team.updateOne({ _id: req.params.id }, fieldsToUpdate);
  const team = await Team.findById(req.params.id);
  res.send(team);
};

app.delete("/api/teams/:id", upload.single("img"), (req, res) => {
  removeTeam(res, req.params.id);
});

const removeTeam = async (res, id) => {
  const team = await Team.findByIdAndDelete(id);
  res.send(team);
};

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
  console.log("I'm listening");
});