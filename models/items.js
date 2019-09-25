module.exports = function(sequelize, DataTypes) {
    var Items = sequelize.define("Items", {
        ItemId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          ItemName : DataTypes.STRING,
          ItemAction : DataTypes.STRING,
          ItemText : DataTypes.STRING,
          OptionListId : DataTypes.INTEGER,
        },
        {
            timestamps: false
        });
    return Items;
};