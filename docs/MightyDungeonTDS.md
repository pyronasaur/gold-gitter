# Mighty Dungeon Gold Getter

---

### Overview

This is a text based rpg game where the purpose is to venture into the dark dungeon and collect as much gold as you can.  The game has a one or two player mode, and has teams of one or two players.  Each team competes against each other to collect gold, one team at a time.  The team that is not in play has a limited view of their opponents progress.

---

### Features

A list of features of the game.

- Games of 1 v 1 or 2 v 2 teams
- Team based chat messages
- Text based challenges per dungeon room

---

### Game Play

###### New Game --

1. A new player starts by creating a character and giving their character a name. 
2. The new player selects a one player solo, 1 v 1 or 2 v 2 game modes
   1. If one player solo, we move to the opening dungeon room and begin the game
   2. If 1 v 1, the player waits for an opponent list and selects an opponent
      1. If player is chosen by a different player as the opponent, a dialog will pop-up telling them they are challenged and asking if they are ready.
   3. If 2 v 2, the player selects a teammate, and then waits for an opposing team list.
      1. If the player's team is chosen by a different team as the opponent, a dialog will pop-up telling them they are challenged and asking if they are ready.
3. After teams and opponents are chosen we move to the dungeon start with one team selected to go first (challenging team goes first)

---

###### Running the Dungeon --

1. The player walks into the first dungeon room.  There will be text telling them a description of the room, and all available exits.
2. The player will have the option to proceed through any exit, search the room, and any action specific to the room.  
   1. If any items that can be picked up are in view before or after the search room action, then picking up the item will become an option.
      1. A player can only carry one item.  If they are carrying an item they will have the option to - 
         1. Drop their item and take the new one
         2. Keep their current item
         3. Pass to team mate (if applicable)
3. If the player enters a new room the process begins anew.
4. Each dungeon room can contain some amount of gold.  Gold can be collected by solving puzzles, completing challenges, or defeating enemies.  Gold is the point system for the game.
5. Players can be killed or maimed by many different mechanics in the dungeon.  If a player has an encounter that kills them, they are returned to the dungeon start without any item they were holding (single player), or it is the other teams turn to run (multiplayer).
6. A game is complete when a solo player or both teams have died three times, or a solo player or team has completed the __*Ultimate Challenge*__.  Completing the __*Ultimate Challenge*__  is an automatic win in any game.
   1. When the game is complete and no player has defeated the __*Ultimate Challenge*__, the team with the highest score is declared the winner.

---

### User Interface

The user interface will have a medieval/fantasy theme with a display of useful information for the player.

1. A health bar with a number starting at 3/3 to denote the number of tries a character has left.
2. An indicator of any item that the character is carrying.
3. A display showing how much gold a player has collected

*Multiplayer additional display items*

1. Display showing team mate
2. Display showing opponent(s)
3. Team chat window

---

### Database

The database will contain tables that define the player attributes, team attributes, the room information, the options text, and item information

###### Player table

1. PlayerId - int, auto, PK, NOT NULL
2. Name - varchar, NOT NULL
3. TeamId - int, fk, NOT NULL
4. ItemId - int, fk
5. Lives - int, default 3, NOT NULL
6. OpposingTeamId - int

###### Team table

1. teamId - int, auto, PK, NOT NULL
2. Gold - int, NOT NULL
3. MessageText - varchar (Last message from team chat)
4. IsActive - bool, NOT NULL (Determines if a team is active and available.  Deactivate team after game has begun, only used for matching in vs. mode)

###### Item table

1. ItemId - int, auto, PK, NOT NULL
2. ItemName - varchar, NOT NULL
3. ItemAction - varchar, NOT NULL (action that this item can make when it is use able in a situation)
4. ItemText - varchar, (Text information about the item)
5. OptionListId - int, NOT NULL

###### Room table

1. RoomId - int, auto, PK, NOT NULL
2. RoomName - varchar, NOT NULL
3. EnterText - varchar, NOT NULL (Text for entering a new room)
4. OptionListId - int, FK, NOT NULL
5. IsUnique - bool, NOT NULL

###### Options Table(Table with option selections and responses )

1. OptionId - int, auto, PK, NOT NULL
2. OptionText - varchar, NOT NULL
3. OptionListId - int, FK, NOT NULL
4. ResponseId - int, NOT NULL
5. ReqItemId- int,

###### OptionList Table(Table to identify all options in option table that should be grouped for an interaction)

1. OptionListId - int, auto, PK, NOT NULL
2. OptionListName - varchar (description of option list)

###### Response Table (Table for responses, OptionListId is NULL if there is not player action required (like you are dead)

1. ResponseId - int, auto, PK, NOT NULL
2. ResponseText - varchar, NOT NULL
3. OptionListId - int 

---

### API Layer

In order to get the game change information from the client to the server to track player decisions, and to send information to the client to update their game an API will provide an interface between the front and back-ends of the game.

A list of api calls that will be used by the game.

- GET next room
  - When this call is made a random room will be selected and will provide the client with room information
- GET Options
  - This will return options based on the room that the player is in
- GET responses
  - This method will return responses based on the players option selection
- GET player
  - Returns information about the player
- GET Item
  - Returns information about an Item in the room if *Inspectable* or if picked up
- GET Team
  - returns information about a team, either player or opponents if applicable
- POST new player
  - POSTs information about a new player and stores in the db. Returns a teamId, PlayerId, and Lives
- POST  opposing team (MULTIPLAYER)
  - posts the opposing teamId based on get
- POST item
  - Sends item selection into player table

---

### Objects

###### The five rooms are:  

1. great hall
2. guard chamber
3. library
4. solar
5. chapel

###### Items list:  

1. apple, 
2. compass, 
3. crossbow, 
4. lantern, 
5. mace, 
6. medicine
7. shield, 
8. sleeping bag, 
9. sword, 
10. toaster

###### Characters/enemies: 

1. demon, 
2. dragon, 
3. giant spider, 
4. griffin, 
5. knight, 
6. ogre, 
7. queen, 
8. siren

---

### Room Stories

###### Initial entrance text - 

​	Since tales of a mighty castle full of gold and treasure reached your ears, you have been on a quest across the realm to seek glory and riches.  Now before you stands the foreboding gates of the long forgotten citadel for which you have searched.  Who knows what secrets lie within...

(button to begin)

1. great hall

   {

   Entrance Text: " You enter the time-worn gates of the old castle.  Almost immediately ornate sconces along the wall spring to life with bright blue flames.  The fire light adds an eerie luminescence to the chamber.  While the outside was decrepit and old looking, the Great Hall before you is beautiful and enchanting."

   There is a door at the far end of the hall.

   What do you do?

   1. Search the room
      1. response - You are surprised to see that everything around the grand room is in impeccable condition.  You would suspect that someone lives here still, but the ghostly light from the torches make you hesitant to settle on that thought.  You find xxxxx gold coins
      2. You see an item gleaming near the corner by the door
         1. response - You found a toaster!
            1. pick it up?
               1. response - you pick it up and move on through the door sensing there is nothing left for you here.  --->
            2. leave it behind
               1. response - Though you hope not to regret it later, but you move on through the door feeling there is nothing left for you here.  --->
   2. Move to the next room 
      1. response: You cross the room towards the door hoping to find some great treasure.  There is no turning back now.  ---->

   }

2. library

   {

   Entrance Text: " As you leave the Great Hall feeling surprising optimism about your journey and expect to find many treasures.  You travel a short way down the hall and turn to the door of an altogether different chamber.  A musty odor greets you before you have a chance to let go of the handle.  As you walk in the most remarkable thing about the room is rows and rows of books and tattered scrolls lining the walls.  All surfaces are covered in thick webbing that clings to you."

   There is a door at the far end of the hall.

   What do you do?

   1. Search the room
      1. response - The dust in the air makes your breath wheezy.  No appreciation for knowledge here you think to yourself, staring at the long forgotten books.  You push over a stack of books on a rickety old table and find some coins.  You find xxx gold coins.
      2. You see something leaning against the wall.  Inspect it?
         1. Response - You found a crossbow!  It is totally loaded with one bolt too.
            1. Pick up the crossbow?
               1. The crossbow is sturdy and makes you feel safe.  You head for the door.
            2. Leave it behind.
               1. Crossbow?  You don't even know how to use it!  What use could that be anyway!  Off you go without a second thought.
            3. (if toaster) Put the toaster down and pick up the crossbow?
               1. You pick up the crossbow and move to the next room. -->
            4. (if toaster) Ignore the crossbow and keep your beloved new toaster?
               1. You keep your toaster and move to the next room. -->
         2. Move to the next room (same as below)
      3. Ignore it and move on -->
   2. Move to the next room
      1. response: The door is covered in webbing.  What do you do?
         1. Clear it with my hand
            1. Response - EWW Your hand is sticky!  A giant spider screeches and climbs down the wall at you!  You sense its irritation as you may have destroyed its favorite hammock.
               1. Judo Chop!
                  1. You totally missed, but impressed by your sticky handed karate skillz the spider gives you a bow and walks off.  You continue on and receive xxxxx gold.
               2. (if toaster) Bash it with a toaster!
                  1. Response - Your toaster has a dent in it! The spider isn't amused and webs you up to eat for lunch.  You dead.  --> dead and return to start, -1 life
               3. (if crossbow) Shoot one of its eight eyes out!
                  1. Response - One eye down!  That should level the playing field!  The spider skitters away to nurse its wound, and you continue onward.  You receive xxxxx gold.
         2. (if toaster) Wave my toaster around in the webs
            1. Response - The web is thick, and there is no lightly toasted bread going into this gross kitchen appliance now.  However, it did the job and you even noticed a shiny coin in your toaster!  You carry on you lucky dog!  You receive xx gold.  ---->
         3. (if crossbow) Wave my crossbow around in the webs
            1. Response - You wave the stock of your crossbow around in the webs at the door, careful not to get the firing mechanism sticky.  A shadow moves above you and drops down behind you.
               1. Dropkick it!
                  1. You land feet first squarely into the face of a giant spider!  It rolls over and you race through the door and slam it shut!  You receive xx gold.
               3. (if crossbow) Shoot it!
                  1. Response - One eye down!  That should level the playing field!  The spider skitters away to nurse its wound, and you continue onward.  You receive xxxxx gold. -->

   }

3. guard chamber

   {

   Entrance Text: You continue down a corridor that begins to look less grand, and more drab, less decorative.  You enter a long room where the walls are lined with simple cots, each with a chest at the foot of the bed.  The room looks like it curves off to the left farther down.  In between each cot on the wall hangs a tattered banner with an old crest.  This appears to have been a dusty Guard Chamber.

   What do you do?

   1. Open a chest.

      1. Response: You walk down the room and pick a chest a little ways in.  You don't want to be tacky and loot the first chest you see do you?  You are an expert looter.  You crack a chest open and as the chest is opened you see a gleam make it's way through,    covering your clothes in a shimmering golden light.  Your eyes go wide as you take in the sight before you.  A chest brimming with gold coins and gems!  You are captivated by the riches before you!  As you gawk at your new-found wealth you are grabbed roughly by your arms and dragged away.. Screaming..

         - --> room +1, go to the chapel

   2. Look for a way out

      1. You travel down the corridor and as it curves you see a door, but before it stands a great armored knight, ready to do battle!  He stands still and regards you with a stare so cold you feel a shiver run up your spine.  Prepare yourself!  What do you do?

         1. Karate time!

            1. Response: You approach the knight without fear and strike him with fury!  He cuts you down without mercy.  You dead.  --> lives -1, back to start

         2. (if toaster)  Throw your toaster at his head!

            1. Response: The toaster clangs off his head and he stumbles!  You waste no time and rush past through the door, bolting it on the other side.  Resourceful! However, no toast.  Receive xx gold.

               --> next room

         3. (if crossbow) Fire your crossbow!

            1. Response: You take a shot at the knight and hit him right in the heart.  Turns out it was just an empty suit of armor, and it clangs to the floor.  Looks like your only ammo broke, and you are glad no one saw how stupid you looked just now.  You grab the bolt from the ground and reload your empty crossbow, ready to move on.  --> next room

         4. (if sword) Cross swords with this fiend!

            1. Response: The knight comes at you and slashes down at you viciously!  You bring the power from your mighty adventurer thighs and raise your blade to block your foe!  The swords connect in a shower of sparks and throw your opponent off balance.  You waste no time and drive your sword straight through his black heart!  You recover your sword from his chest and walk through the door, wiping black blood from the blade as you go.

   3. Search for loot

      1. You take some time to walk through the room a bit and observe your surroundings a bit more.  As you walk down the hall and peek around the corner you notice a burly figure standing in front of a door.  He doesn't seem to notice you.  Against the wall there leans a sword.  What do you do?
      1. Take the sword
            1. Response - The sword is large, but well balanced.  The blade is dull, but strong and the hilt is covered in ornate dragon-like designs.  You hook it to your belt and walk to the figure by the door.
      2. (if toaster) Leave your beloved toaster behind for an arguably better weapon?
            1. Response - You drop your toaster in lieu of a better weapon.  Perhaps this will be the tool that keeps you safe from any other spider encounters.  The sword is large, but well balanced.  The blade is dull, but strong and the hilt is covered in ornate dragon-like designs.  You hook it to your belt and walk to the figure by the door.
         3. (if crossbow)  Give up your ranged fire power for a knight's weapon?
            1. Response - You set your crossbow down.  You didn't have it long, and it has served you well, but you decide that if you face another foe it will be up close and personal.  You pick up the sword, and it is large but well balanced.  The blade is dull, but strong and the hilt is covered in ornate dragon-like designs.  You hook it to your belt and walk to the figure by the door.
         4. Approach the figure
            1. You ignore the sword and head down towards the door, and the ominous black armored figure.--> look for a way out stuff

   }

4. solar

   {

   ​	Entrance Text: Through the door you have gone, and you begin to climb a set of dusty stone steps that spiral around in a tight spiral.  Clearly you are headed up to some tower.  As you walk through a set of heavy wooden doors you come into a room with decor that matches that of the Great Hall.  There sits a cauldron in the center of the room, a door to the left, and a bed in the far corner.  You sense there is no danger here.  What do you do?

   1. Inspect the bed
      1. Response: You walk over to the bed and have a look.  The bed is very ornate, fit for royalty.  You poke around the covers and find some gems. receive xxx gold
   2. Inspect the cauldron
      1. You approach the cauldron.  It is a large object made of a glimmering black metal, with two large rings at the sides hanging from well sculpted mouths of gargoyles.  When you take your eyes off them you feel a red glow from their sockets on the edge of your vision and feel a sense of unease.  As you draw closer you look inside and see a golden glowing translucent liquid.  What do you do?
         1. Dip your hand in the cauldron
            1. Response - As your hand touches the liquid it feels cool and refreshing like a cool breeze teasing through your hair that heralds the coming of Autumn.  You close your eyes and embrace the sensation.  You open them a second later and try to pull your hand out.  You look down and see that you cannot - the liquid is climbing up your arm and turning it to solid gold!  You struggle but to no avail, the magic has gripped you and your whole body is engulfed and turned to solid gold.  You turn your head to the sky and release a silent scream as the spell finishes its work and as your remaining eye is turned to gold everything goes black, and you know no more.  --> you dead.
         2. (if toaster) Dip your toaster
            1. Response - You dip your toaster into the liquid and from end to end it is turned into solid gold!  It is really heavy now, but worth a fortune!  You take your toaster and feel ready to carry on through the door with your now beaming smile. -->  receive xxxxx gold
         3. (if crossbow) Dip your crossbow
            1. Response - You dip the tip of your crossbow into the golden liquid, getting just the bolt wet.  The golden liquid surges up over the bolt and it turns solid gold!  It makes the crossbow heavier, but certainly is worth some money now!  You are ready to move on through the door.  -->  receive xxxx gold
         4. (if sword) Dip your sword
            1. Response - You brandish your sword in a flourish, trying to be dramatic before dipping the tip of the sword into the liquid to see what will happen.  As soon as you do there is a golden explosion of light as the sword is engulfed in the shimmery substance.  After the light dies down the sword blade has turned to gold, and the once dull dusty features have become like new!  You sense that some magical potential of this blade was unlocked and you are ready to move onward ready for whatever challenge awaits.  receive xxxx gold
   3. Head through the door
      1. Response - You open the door of the room and continue your quest.  As you step through the doorway your vision ripples as though reality is a pond and you are a stone.  You feel yourself falling, and then you hit something hard and everything goes dark.

   }

5. chapel

   {

   ​	Entrance Text:  You awaken from your last ordeal on a cold stone floor.  Raising your head with a groan you look around.  Through your pounding headache your vision begins to clear and you see a terrifying sight.  The room is covered in a sickly red light and what you can clearly see was once a beautiful soaring chapel is now invaded by a dark presence.  In the middle of the chapel is a great and terrifying dragon with row upon row of jagged teeth and scales as black as the night!  It leers down at you with a cold ruthless hunger.  You are seconds from being consumed!  What do you do?

   1. Run away!
      1. Response: You clamor to your feet and dart away as quickly as you can!  You take one step and the dragon snaps down!  Only one of your legs remains on the ground and the dragon slathers your remains across its greedy maw in a bloody mess.  --> you dead
   2. (if toaster) Draw your toaster
      1. Response: You reach for your weapon and realize you only have a toaster.  How silly.  The dragon flashes down and devours you.  There is nothing left.  --> you dead
   3. (if upgraded toaster) Draw your golden toaster
      1. Response: You hold up your golden toaster in a desperate defense against the terrible creature before you, and as it snaps down at you it stops suddenly and seems to admire its own reflection in your toaster.  Not one to waste an opportunity you slowly set the toaster down and leave.  You lose a golden toaster, but escape with your life.  --> return to start no lives lost. - xxxxxx gold
   4. (if crossbow) Draw your crossbow
      1. Response: From your back as the dragon moves to attack you whip out your crossbow and fire.  Luck is with you this day, and your bolt catches the back of the dragons throat.  It hacks and coughs at the bolt lodged in its throat.  Not a death blow, but you don't argue with your good fortune and race from the chapel with your life.  --> you dead
   5. (if upgraded crossbow)  Draw your golden crossbow
      1. Response: Remembering that you now have a magical crossbow you stand defiantly and face your gargantuan foe.  As the dragon rushes to the kill you level the crossbow to your eye and take aim.  You smirk defiantly at the beast and pull the trigger.  In an instant, the golden bolt clatters straight to the floor without so much as a bounce due to its weight, and you never even knew what happened before the dragon ended your journey. --> return to start  receive xx gold
   6. (if sword) Draw your sword
      1. Response: You jump to your feet and brandish your sword ready to die like a hero if that is what it comes to.  The dragon chomps down and you dive to the left rolling to a crouch and spring back at the dragon to slash at its exposed belly.  You strike and the sword clangs against the dragons hide ineffectively.  Blood splashes from your mouth as you feel claws the size of your sword punch into your back.  --> you dead.
   7. (if upgraded sword) Draw your golden sword
      1. Response: You lie on the ground, gripped with fear at the sight before you.  As the dragon bears down on you, slowly approaching and drooling rank, steaming globs of saliva onto the stone chapel floor you feel a swell of courage.  The courage you feel is coming from.. your sword?  Your golden sword seems now to be as hungry for the dragons blood as the dragon is for yours.  With more a feeling than a thought you bring the blade to bear.  Like a shining golden beacon in dark sea of despair you walk forward to do battle.  In two it is done, the dragon snaps its long neck down at you and you swing across knocking its massive jaws wide in a swing to the teeth.  You cross your sword back in the same instant and the dragons head falls to the floor.  The sword evaporates in your hand and light streams into the chapel.  The dragons neck erupts not with blood but with coins.  --> victory, receive xxxxxxx gold

   }

##### 