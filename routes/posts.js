const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/' , verify ,(req , res) => {
    // res.json({posts: {
    //     title: 'my first post',
    //     description: 'random data you shouldnt access'
    // }});
    res.send(req.user.id);
    console.log('it works..');
});

module.exports = router;