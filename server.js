const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let teams = [{
    _id: 1,
    name: "Arsenal",
    img: "images/arsenal.png",
    position: "2nd",
    country: "England",
    nickname: "The Gunners",
    kitcolour: "Red",
    players: [
        "Sake",
        "Odegaard",
        "Saliba",
    ],
},
{
    _id: 2,
    name: "Juventus",
    img: "images/juventus.png",
    position: "7th",
    country: "Italy",
    nickname: "The Old Lady",
    kitcolour: "Black and White",
    players: [
        "Vlahovic",
        "Chiesa",
        "Locatelli",
    ],
},
{
    _id: 3,
    name: "Barcelona",
    img: "images/barcelona.png",
    position: "2nd",
    country: "Spain",
    nickname: "Barca",
    kitcolour: "Red and Blue",
    players: [
        "Lewandowski",
        "De jong",
        "Pedri",
    ],
},
{
    _id: 4,
    name: "Real Madrid",
    img: "images/madrid.png",
    position: "1st",
    country: "Spain",
    nickname: "	Los Blancos",
    kitcolour: "White",
    players: [
        "Vinicious Jr",
        "Modric",
        "Kroos",
    ],
},
{
    _id: 5,
    name: "PSG",
    img: "images/psg.png",
    position: "1st",
    country: "France",
    nickname: "Les Parisiens",
    kitcolour: "Red, Blue and White",
    players: [
        "Mbappe",
        "Dembele",
        "Hakimi",
    ],
},
{
    _id: 6,
    name: "Bayern Munich",
    img: "images/bayern.png",
    position: "1st",
    country: "Germany",
    nickname: "	Die Bayern (The Bavarians)",
    kitcolour: "Red",
    players: [
        "Kane",
        "Kimmich",
        "Muller",
    ],
},
];

app.get("/api/teams", (req, res) => {
    res.send(teams);
});



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

