const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Statistic = require('../models/statistic');
const Project = require('../models/project')


function reduce(vals) {
    let x = vals[0];
    let len = vals.length;
    for (let i = 1; i < len; i++)
    {
        let y = vals[i];

        let delta = (x.sum/x.count) - (y.sum/y.count);
        let weight = (x.count * y.count)/(x.count + y.count);
        x.diff += y.diff + (delta*delta*weight);
        x.sum += y.sum;
        x.count += y.count;
        x.min = Math.min(x.min, y.min);
        x.max = Math.max(x.max, y.max);
    }

    x.average = x.sum / x.count;
    x.variance = x.diff / x.count;
    x.std_deviation = Math.sqrt(x.variance);
    return x;
}

router.post('/', (req, res, next) => {
   
    let mapped = req.body.scores.map(function(val)
    {
        return {
            sum: val,
            max: val,
            min: val,
            count: 1,
            diff: 0
        }
    });

    let final = reduce(mapped);

    console.log(final);

    

    res.status(200).json({
        result: final
    });
});


module.exports = router;