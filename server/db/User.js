const Sequelize = require('sequelize');
const db = require('./db');

 // Add your Sequelize fields here
const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  userType: {
    type: Sequelize.STRING,
    defaultValue: 'STUDENT',
    allowNull: false,
    validate: {
      isIn: [['STUDENT', 'TEACHER']]
    }
  },
  mentorId: {
    type: Sequelize.INTEGER
  }


});

User.findUnassignedStudents = async function() {
  let studentsWithoutMentor = await User.findAll({where: {mentorId: null, userType: 'STUDENT'}})
  return studentsWithoutMentor
}


/**
 * We've created the association for you!
 *
 * A user can be related to another user as a mentor:
 *       SALLY (mentor)
 *         |
 *       /   \
 *     MOE   WANDA
 * (mentee)  (mentee)
 *
 * You can find the mentor of a user by the mentorId field
 * In Sequelize, you can also use the magic method getMentor()
 * You can find a user's mentees with the magic method getMentees()
 */

User.belongsTo(User, { as: 'mentor' });
User.hasMany(User, { as: 'mentees', foreignKey: 'mentorId' });

module.exports = User;
