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

const INTERVAL = 0.05;
const TOTAL = 1;

const HOURS = 24;
const HOUR = 60;


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

function generateHistogramData(data)
{
    let histogram = [];

    let len = data.length;
    for (let i = 0; i < len; i++)
    {
        let num = ((Math.trunc(data[i] / INTERVAL)) - 1) * 100;
        histogram.push(num);
    }
    return histogram;
}

function generateAverageSentimentOverTime(data)
{
    let sum = [];
    let count = [];
    for (let i = 0; i < HOURS; i++)
    {
        sum[i] = 0;
        count[i] = 0;
    }
    let arr = mapToTime(data);
    let len = arr.length;
    
    for (let i = 0; i < len; i++)
    {
        let ind = Number(arr[i].hour);
        sum[ind] += arr[i].sentiment;
        count[ind] += 1;
    }
    let avg = [];
    for (let i = 0; i < HOURS; i++)
    {
        avg[i] = 0;
        if (count[i] != 0)
            avg[i] = sum[i] / count[i];
    }
    let res = [];
    for (let i = 0; i < HOURS; i++)
    {
        if (avg[i] != 0)
        {
            let tweetsList = [];
            for (let j = 0; j < len; j++)
            {
                if (Number(arr[j].hour) == i)
                    tweetsList.push({
                        tweet : arr[j].tweet,
                        sentiment : arr[j].sentiment
                    });
            }
            res[i] = {
                averageSentiment : avg[i],
                tweets : tweetsList

            };
        }
    }

    return res;
}

function getRateOfChange(data)
{
    let len = data.length;
    let change = [];
    change[0] = 0;
    for (let i = 1; i < len; i++)
    {
        change[i] = ((data[i].averageSentiment - data[i-1].averageSentiment) / HOUR);
    }

    return change;
}

function mapToTime(elem)
{
    let stamp = elem.tweetObject.timestamp_ms;
    let d = new Date(stamp * 1000);
    return {
        hour : d.getHours(),
        tweet : elem.tweetObject,
        sentiment : elem.tweetSentiment
    };

}
/***
    * request for root (/) page (string id, Number[] scores)
    * 
    * this function receives id and array of scores and does statistical analysis on the data
    * the data is then stored in the Database inside the Statistic model
    */

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

/***
    * request for compare (/compare) route (string first, string second)
    * 
    * this function receives an id for two different projects and returns their statistics
    * the data is read from the Database inside the Statistic model
*/

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