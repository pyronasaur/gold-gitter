module.exports = function(sequelize, DataTypes) {
    var OptionLists = sequelize.define("OptionLists", {
        OptionListId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          OptionListName : DataTypes.STRING,
        },
        {
            timestamps: false
        });
    return OptionLists;
};