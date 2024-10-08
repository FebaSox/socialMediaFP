/*
module.exports = (sequelize, DataTypes) => {
    
    const Posts = sequelize.define('Posts', {
        title: {
            type: DataTypes.STRING,
                 allowNull: false,
        },

            postText: {
                type: DataTypes.STRING,
                     allowNull: false,
        },
        
                username: {
                    type: DataTypes.STRING,
                         allowNull: false,
        },
    });

    Posts.associate = (models) => {
        Posts.hasMany(models.Comments, {
            onDelete: "cascade"
        });

        Posts.hasMany(models.Likes, {
            onDelete: 'cascade',
        });
    };

    return Posts
};
*/

/*
module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Define associations
  Posts.associate = (models) => {
    // A post belongs to a user (Posts -> Users)
    Posts.belongsTo(models.Users, {
      foreignKey: "UserId",  // This is the column in Posts that references Users
      onDelete: "CASCADE",   // If a user is deleted, their posts will also be deleted
    });

    // A post can have many likes (Posts -> Likes)
    Posts.hasMany(models.Likes, {
      foreignKey: "PostId",  // This is the column in Likes that references Posts
      onDelete: "CASCADE",   // If a post is deleted, its likes will also be deleted
    });
  };

  return Posts;
};
*/
module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postText: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  // Define associations
  Posts.associate = (models) => {
    // A post belongs to a user (Posts -> Users)
    Posts.belongsTo(models.Users, {
      foreignKey: "UserId",  // This is the column in Posts that references Users
      onDelete: "CASCADE",   // If a user is deleted, their posts will also be deleted
    });

    // A post can have many comments (Posts -> Comments)
    Posts.hasMany(models.Comments, {
      foreignKey: "PostId",  // This is the column in Comments that references Posts
      onDelete: "CASCADE",   // If a post is deleted, its comments will also be deleted
    });

    // A post can have many likes (Posts -> Likes)
    Posts.hasMany(models.Likes, {
      foreignKey: "PostId",  // This is the column in Likes that references Posts
      onDelete: "CASCADE",   // If a post is deleted, its likes will also be deleted
    });
  };

  return Posts;
};


