const router = require('express').Router();
const db = require('../db');
const {
  models: { User },
} = require('../db');

/**
 * All of the routes in this are mounted on /api/users
 * For instance:
 *
 * router.get('/hello', () => {...})
 *
 * would be accessible on the browser at http://localhost:3000/api/users/hello
 *
 * These route tests depend on the User Sequelize Model tests. However, it is
 * possible to pass the bulk of these tests after having properly configured
 * the User model's name and userType fields.
 */

// Add your routes here:

router.get('/unassigned', async (req, res) => {
  let unassignedStudents =  await User.findUnassignedStudents()
  res.send(unassignedStudents)
})

router.get('/teachers', async (req, res) => {
  let teachersAndMentees = await User.findTeachersAndMentees()
  res.send(teachersAndMentees)
})

//NOT COMPLETE!!
router.put('/users/:id', async (req,res) => {
  let findUser = User.findAll({where: {id:req.params.id}})
  if (findUser === undefined){
    res.sendStatus(404)
  } else {
    res.status(200).send(findUser)
  }
})


//NOT COMPLETE!!
router.post('/users', async (req, res) => {
  let newUser = req.body.name
  let userCheck = await User.findAll({where: {name: newUser}})
  console.log(userCheck)
  if (userCheck) {
    res.sendStatus(409)
  } else {
    res.status(201).send(newUser)
  }

})

//NOT COMPLETE!!!
router.delete('/:id', async (req, res, next) => {
  let curUser = await User.findAll({where: {id: req.params.id}})
  next()
  if (curUser === false){
    res.sendStatus(404)
  }
  if (curUser.id !== req.params.id) {
    res.sendStatus(400)
  } else {
    res.status(204).send(curUser)
  }
})

router.use((err, req, res, next) => {
  res.status(500).send(err.message)
})


module.exports = router;
