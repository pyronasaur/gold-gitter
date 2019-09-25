module.exports = function(sequelize, DataTypes) {
    var Responses = sequelize.define("Responses", {
        ResponseId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          ResponseText : DataTypes.TEXT,                
          OptionListId : DataTypes.INTEGER,
          isDoorway : DataTypes.INTEGER,
          goldMultiplier : DataTypes.INTEGER,
          isDeath : DataTypes.BOOLEAN,
          NewItemId : DataTypes.INTEGER,
        },
        {
            timestamps: false
        });
    return Responses;
};