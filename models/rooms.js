module.exports = function(sequelize, DataTypes) {
    var Rooms = sequelize.define("Rooms", {
        RoomId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          RoomName : DataTypes.STRING,
          EnterText : DataTypes.TEXT,
          OptionListId : DataTypes.INTEGER,          
          isUnique : DataTypes.BOOLEAN,
        },
        {
            timestamps: false
        });
    return Rooms;
};