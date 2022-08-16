const Sequelize = require('sequelize');
const { database } = require('../../../../Checkpoint- Sequelize and Express Public/Checkpoint-Express-Sequelize-B/config');
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
  },
  isStudent: {
    type: Sequelize.VIRTUAL,
    get() {
      if (this.userType === 'STUDENT'){
        return true
      } else {
        return false
      }
    }
  },
  isTeacher: {
    type: Sequelize.VIRTUAL,
    get() {
      if (this.userType === 'TEACHER'){
        return true
      } else {
        return false
      }
    }
  }
});

/*User.afterUpdate(user => {
  let mentor = user.mentorId
  let teacherCheck =  User.findAll({where: {id: mentor}})
  console.log(mentor)
  console.log(teacherCheck)
  if (teacherCheck.isStudent === true) {
    if (user.mentorId !== null) {
      user.mentorId = null
      throw console.error();
    }
  }
})*/

User.findUnassignedStudents = async function() {
  let studentsWithoutMentor = await User.findAll({where: {mentorId: null, userType: 'STUDENT'}})
  return studentsWithoutMentor
}


User.findTeachersAndMentees = async function(){
  let teachers = (await User.findAll({where: {userType: 'TEACHER'}}))
  for (let i = 0; i < teachers.length; i++){
    let curTeacher = teachers[i]
    let curTeacherIdx = curTeacher.id
    let curStudents = await User.findAll({where: {mentorId: curTeacherIdx }})
    curTeacher.mentees = curStudents
  }
  return teachers
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
