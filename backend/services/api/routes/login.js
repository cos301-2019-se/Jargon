const express = require('express');
const router = express.Router();

router.post('/', (req, res, next) => {
    const user = {
        username: req.body.username,
        email: req.body.email,
        pass: req.body.password
    }

    res.status(200).json({
        message: "Handled post request to /login",
        user: user
    });
});


module.exports = router;