/**
 * Filename: analyse.js
 * Author: Ethan Lindeman
 * 
 *      This file contains all the endpoints for the API that handles
 *      all analysis of projects.
 */

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

    vals.sort(function(a,b){
        return a - b;
    });
    if (len % 2 == 0)
    {
        x.median = (vals[len/2 - 1].sum + vals[len/2].sum) / 2;
    }
    else
    {
        x.median = (vals[(len-1) / 2].sum);
    }

    let mode = [];
    let count = [];
    let max = 0;

    for (let i = 0; i < len; i++)
    {
        let num = vals[i].sum;

        count[num] = (count[num] || 0) + 1;
        if (count[num] > max)
        {
            max = count[num];
        }
    }

    for (c in count)
    {
        if (count.hasOwnProperty(c))
        {
            if (count[c] === max)
            {
                mode.push(Number(c));
            }
        }
    }
    x.mode = mode;
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

    Project.find({_id : req.body.id})
    .exec()
    .then(data => {
        const stat = new Statistic({
            _id: new mongoose.Types.ObjectId(),
            min : final.min,
            max : final.max,
            std_dev : final.std_deviation,
            variance : final.variance,
            mean : final.average,
            mode : final.mode,
            median : final.median,
            project : data._id
        });

        stat.save()
        .then(result => {
            res.status(200).json({
                status: true,
                result : "Statistics calculated and added"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(200).json({
                status: false,
                result: "Failed to add stats"
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(200).json({
            status: false,
            result: "Error finding project"
        });
    });
    

    
});

router.post('/compare', (req, res, next) => {
    let idOne = req.body.first;
    let idTwo = req.body.second;

    Statistic.find({project: idOne})
    .exec()
    .then(res1 => {
        Statistic.find(project: idTwo)
        .exec()
        .then(res2 => {

            const obj = {
                firstProject : res1,
                secondProject : res2
            }
            res.send(200).json({
                status: true,
                result: obj
            })
            
        })
        .catch(err2 => {
            res.status(200).json({
                status: false,
                result : "Error finding second project"
            })
        });
    })
    .catch(err1 => {
        res.status(200).json({
            status: false,
            result : "Error finding first project"
        });
    });
});

module.exports = router;