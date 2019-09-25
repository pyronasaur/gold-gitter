module.exports = function(sequelize, DataTypes) {
    var GameOptions = sequelize.define("GameOptions", {
        OptionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          OptionText : DataTypes.TEXT,
          OptionListId : DataTypes.INTEGER,
          ResponseId : DataTypes.INTEGER,
          ReqItemId : DataTypes.INTEGER          
    },
    {
        timestamps: false
    });
    
    return GameOptions;
};