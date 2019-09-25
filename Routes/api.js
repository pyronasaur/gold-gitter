
var db = require("../models");


module.exports = function(app){
    // GET next room- When this call is made a random room will be selected and will provide the client with room information   
    app.get("/api/next", function(req, res){
        var length = rooms.length
        var random = Math.floor(Math.random() * length) 
    
        res.json({room:rooms[random]})
    })

    // GET starting room room- When this call is made the initial room will be provided to requestor  
    app.get("/api/start", function(req, res){
        db.Rooms.findOne({
            where: {
                RoomId: 1
            }
        }).then(function(dbRoom) {
            res.json(dbRoom);
        }); 
    })

    //get next room based on room id sent back, expect new roomId was calculated before ajax call from front end
    app.get("/api/next/:roomid", function(req, res){
        var newRoom = req.params.roomid;
        
        db.Rooms.findOne({
            where: {
                RoomId: newRoom
            }
        }).then(function(dbRoom) {
            res.json(dbRoom);
        });        
    });

    // GET Item - Returns information about an Item in the room if Inspectable or if picked up
    // app.get("/item/:id", function(req, res){
    //     var item_id = req.params.id
    //     var item = items.find(function(element){ 
    //         return element.id == item_id
    //     })

    //     if(item) res.json(item)
    //     else res.json({
    //         message: "Item id does not exist"
    //     })

    // })

        // GET Item - Returns information about an Item in the room if Inspectable or if picked up
        app.get("/api/item/:id", function(req, res){

            db.Items.findOne({
                where: {
                    ItemId: req.params.id
                }
            }).then(function(dbItem) {
               
                if(dbItem) {
                    res.json(dbItem);
                }
                else res.json({
                    message: "Item id does not exist"
                })
            }); 
        })

    // GET player - Returns information about the player
    // app.get("/player/:id",function(req, res){
    //     var player_id = req.params.id

    //     var player = players.find(function(element){ 
    //         return element.id == player_id
    //     })

    //     if(player) res.json(player)
    //     else res.json({
    //         message: "Player id does not exist"
    //     })
    // })

    // GET player - Returns information about the player
    app.get("/api/player/:id",function(req, res){
        var player_id = req.params.id

        db.Players.findOne({
            where: {
                PlayerId: player_id
            }
        }).then(function(dbPlayer) {
           
            if(dbPlayer) {
                res.json(dbPlayer);
            }
            else res.json({
                message: "Item id does not exist"
            })
        }); 
    })

    // // GET Options - This will return options based on the optionListId that the player received from an option-response
    // app.get("/options/:id", function(req, res){
    //     var options_id = req.params.id
    //     var options = items.find(function(element){ 
    //         return element.id == options_id
    //     })

    //     if(options) res.json(options)
    //     else res.json({
    //         message: "Option id does not exist"
    //     })
    // })

    // GET Options - This will return options based on the optionListId that the player received from an option-response
    app.get("/api/options/:id", function(req, res){
        var options_id = req.params.id;

        db.GameOptions.findAll({
            where: {
                OptionListId: options_id
            }
        }).then(function(dbGameOptions) {
           
            if(dbGameOptions) {
                res.json(dbGameOptions);
            }
            else res.json({
                message: "Options could not be found for that id"
            })
        }); 
    })


    // POST new player - POSTs information about a new player and stores in the db. Returns a teamId, PlayerId, and Live
    // app.post("/player", function(req, res){
    //     var player = req.body
    //     var player_id = players.length + 1 

    //     players.push({
    //         id: player_id,
    //         name: player.name,
    //         lives: 3
    //     })

    //     res.json(players[player_id - 1])

    // })

    //Will create a player, should only need a name, all other values can null or default at start
    app.post("/api/player", function(req, res){
        var player = req.body

        db.Players.create(player).then(function(dbPlayers) {
            console.log("The response is \n ---------- \n" + dbPlayers.get({plain: true}));
            res.json(dbPlayers);
          });
    })
    


    // GET responses - This method will return responses based on the players option selection
    // app.get("/responses/:id", function(req, res){
    //     var responses_id = req.params.id
    //     var responses = items.find(function(element){ 
    //         return element.id == responses_id
    //     })

    //     if(responses) res.json(responses)
    //     else res.json({
    //         message: "Response id does not exist"
    //     })

    // })

    app.get("/api/responses/:id", function(req, res){
        var responses_id = req.params.id;

        db.Responses.findOne({
            where: {
                ResponseId: responses_id
            }
        }).then(function(dbResponses) {
           
            if(dbResponses) {
                res.json(dbResponses);
            }
            else res.json({
                message: "No response could be found for that id"
            })
        }); 

    })



    // GET Team (MULTIPLAYER) - returns information about a team, either player or opponents if applicable
    app.get("/api/team/:id",function(req, res){
        var team_id = req.params.id

        var team = team.find(function(element){ 
            return element.id == team_id
        })

        if(team) res.json(team)
        else res.json({
            message: "Team id does not exist"
        })
    })

    // POST opposing team (MULTIPLAYER) - posts the opposing teamId based on get
    app.post("/api/multiPlayer", function(req, res){
        var multiPlayer = req.body
        var multiPlayer_id = multiPlayers.length + 1 

        players.push({
            id: multiPlayer_id,
            name: multiPlayer.name,
            lives: 3
        })

        res.json(multiPlayers[multiPlayer_id - 1])

    })



    // POST item - Sends item selection into player table
    app.post("/api/grabitem", function(req, res){
        var itemSelection = req.body

        Players.update({ ItemId: itemSelection.item }, {
            where: {
              PlayerId: itemSelection.playerid
            }
          }).then((dbRes) => {
            console.log("Updated player item to " + itemSelection.item);
            res.json(dbRes);
          });
    })

    // Changing health – three lives

    // app.post("/chaningHealth", function(req, res){
    //     var changingHealth = req.body
    //     var changingHealth_id = changingHealth.length - 1 

    //     changingHealth.push({
    //         id: changingHealth_id,
    //     })

    //     res.json(changingHealth[changingHealth_id])

    // })

    // Changing health – three lives

    app.get("/api/lowerHP/:pid/:current", function(req, res){

        var player = req.params.pid;
        var changeHP = req.params.current;

        Players.update({ Lives: changeHP - 1 }, {
            where: {
              PlayerId: player
            }
          }).then((dbRes) => {
            console.log("HP lowered by 1");
            res.json(dbRes);
          });
    })

    // Adding gold – every time player finds more gold - Store it in the db and we should and have to update it to the web page so user sees their scr

    // app.post("/gold", function(req, res){
    //     var gold = req.body
    //     var gold_id = gold.length + 1 

    //     gold.push({
    //         id: gold_id,
    //     })

    //     res.json(gold[gold_id])

    // })

    app.post("/api/gold/:pid", function(req, res){

        var gold = req.body

        Players.update({ Gold: gold.gold }, {
            where: {
              PlayerId: gold.playerId
            }
          }).then((dbRes) => {
            console.log("Updated player gold");
            res.json(dbRes);
          });
    })

    // Get high score - Select max from table. Get name and score of person
    // app.post("/highScore", function(req, res){
    //     var highScore = req.body
    //     var highScore_id = highScore.length + 1 

    //     gold.push({
    //         id: gold_id,
    //         name: highScore.name
    //     })

    //     res.json(highScore[highScore_id])

    // })

    // Get high score - Select max from table. Get name and score of person
    app.get("/api/highScore", function(req, res){
        var highScore = req.body
        var highScore_id = highScore.length + 1 

        Players.max(Gold).then(max => {
            res.json(max);
          })
    })
}