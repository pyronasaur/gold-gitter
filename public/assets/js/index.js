$( document ).ready(function() {      


    $("img").on("click", function() {
        playerAvatar = ($(this).attr("id"));
        $("img.avatarSelected").removeClass("avatarSelected").addClass("avatar");
        $(this).removeClass("avatar").addClass("avatarSelected")
      });
    
    
      function setPlayer(name) {
        $.post("/api/player/", {Name: name})
          .done(function(data){
            playerResp = data;
            console.log(playerResp);
            
            loadGamePage(data);
          });
      }
    
      //loads new game url after player has entered a name and been entered to db
      function loadGamePage(data){
            var nextU = "/game/" + data.PlayerId;
            window.location.href = nextU;
           
        };
    
    //listen for player name entry
    $("button#playGame").on("click", function() {
        event.preventDefault();
        playerName = ($("#playerName").val().replace(/ /g, "").trim());
        if (playerName !== "" && playerAvatar !== "") {
            setPlayer(playerName);
            localStorage.setItem("name", playerName);
            localStorage.setItem("avatar", playerAvatar);
            
        } else {
            event.preventDefault();
            alert("Please enter your player name and choose an Avatar");
        }
    });
    
      
    
    
    
    });