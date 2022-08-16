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
/*router.put('/users/:id', async (req,res,next) => {
  try {
    let findUser = User.findOne({where: {id:req.params.id}})
  console.log(findUser)
  //res.send(findUser)
  } catch(error) {
    next(error)
  }
})*/


//NOT COMPLETE!!
router.post('/', async (req, res) => {
  let newUser = req.body
  let userCheck = await User.findAll({where: {name: newUser.name}})
  if (userCheck.name === newUser.name) {
    res.sendStatus(409)
  } else {
    User.add
    res.sendStatus(201)
  }

})

//NOT COMPLETE!!!
router.delete('/:id', async (req, res, next) => {
  try{
    let curUser = await User.findAll({where: {id: req.params.id}})
  console.log(curUser)
  res.status(204).send(curUser)
}
  catch (err){
    next(err)
  }
})

router.use((err, req, res, next) => {
  res.status(500).send(err.message)
})


module.exports = router;
