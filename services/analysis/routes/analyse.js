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
const Project = require('../models/project');
const User = require('../models/user');

const INTERVAL = 0.05;
const TOTAL = 1;

const HOURS = 24;
const HOUR = 60;


/***
     * reduce(array) : array
     * 
     *      The reduce function takes an array of objects that it iterates over in order
     *      to calculate various aspects of statistical data. It will return an object containing the total sum, average, mode, mean, median,
     *      variance, standard deviation
     *      
*/

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

/***
     * generateHistogramData(array) : array
     * 
     *      The generateHistogramData function takes an array of numbers that it iterates over in order
     *      to convert each number to its nearest multiple of ten. It will return an array containing the converted numbers.
*/

function generateHistogramData(data)
{
    let histogram = [];

    let len = data.length;
    console.log("HISTOGRAM ===========");
    console.log(data);
    for (let i = 0; i < len; i++)
    {
        if (data[i] > 0)
        {
            let num = Math.floor((data[i] * 100)/10) *10;
            histogram.push(num);
        }
        
    }
    console.log(histogram);
    return histogram;
}

/***
     * generateAverageSentimentOverTime(array) : array
     * 
     *      The generateHistogramData function takes an array of objects (where each object has a tweet ID, twitter object and sentiment) that it iterates over in order
     *      to calculate the average sentiment per hour of the day. It will return an array containing the calculated average and list of tweets for that period.
*/


function generateAverageSentimentOverTime(data)
{
    let sum = [];
    let count = [];
    for (let i = 0; i < HOURS; i++)
    {
        sum[i] = 0;
        count[i] = 0;
    }
    let arr = data.map(mapToTime);
    let len = arr.length;
    
    for (let i = 0; i < len; i++)
    {
        if (arr[i].tweetSentiment != -2)
        {
            let ind = Number(arr[i].hour);
            sum[ind] += arr[i].sentiment;
            count[ind] += 1;
        }
        
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
                if (Number(arr[j].hour) == i && arr[j].sentiment != -2)
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
        else
        {
            res.push({
                averageSentiment: -2,
                tweets : []
            });
        }
    }

    return res;
}

/***
     * getRateOfChange(array) : array
     * 
     *      The getRateOfChange function takes an array of objects (where each object has a averageSentiment and list of tweets) that it iterates over in order
     *      to calculate the change in average sentiment per hour of the day. It will return an array containing the calculated change in average for that period.
*/

function getRateOfChange(data)
{
    let len = data.length;
    console.log(data);
    let change = [];
    for (let i = 0; i < HOURS; i++)
        change[i] = 0;
    let prev = undefined;

    let index = 0;
    for (; index < len; index++)
    {
        if (data[index].averageSentiment != -2) {
            prev = data[index];
            break;
        }
    }
    let count = 1;
    change[0] = 0;
    if (index == 0)
        index = 1;
    for (let i = index; i < len; i++)
    {

        if (data[i].averageSentiment != -2) {
            if (data[i-1].averageSentiment == -2) {
                change[i] = ((data[i].averageSentiment - prev.averageSentiment) / (HOUR * count));
                prev = data[i];
                count++;
            }
            else {
                change[i] = ((data[i].averageSentiment - data[i-1].averageSentiment) / HOUR);
                count = 0;
            }
                
        }
        else
        {
            count++;
        }
        
    }
    console.log(change);
    return change;
}

/***
     * mapToTime(element) : array
     * 
     *      The getRateOfChange function takes an element of an object from the Project data array. 
     *      It will return a new object with the hour, tweet and sentiment
*/

function mapToTime(elem)
{
    let stamp = Number(elem.tweetObject.timestamp_ms);
    let d = new Date(stamp);
    return {
        hour : d.getUTCHours(),
        tweet : elem.tweetObject,
        sentiment : elem.tweetSentiment
    };

}
/***
    * request for root (/) page (string id, Number[] scores)
    * 
    * this function receives project id and does statistical analysis on the data
    * the data is then stored in the Database inside the Statistic model
    */

router.post('/', (req, res, next) => {

    

    Project.find({_id : req.body.id})
    .exec()
    .then(proj => {
        // console.log(proj);
        let projectData = proj[0].data.filter(function(elem){
            return elem.tweetSentiment > 0;
        });
        let initial = projectData.map(function(elem) {
            return elem.tweetSentiment;
        });

        let hist = generateHistogramData(initial);

        let avg = generateAverageSentimentOverTime(projectData)

        let change = getRateOfChange(avg);
    
        let mapped = initial.map(function(val)
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


        const graph = {
            histogram : hist,
            averageOverTime : avg,
            changeOverTime : change
        };



        const stat = new Statistic({
            _id: new mongoose.Types.ObjectId(),
            min : final.min,
            max : final.max,
            std_dev : final.std_deviation, 
            variance : final.variance,
            mean : final.average,
            mode : final.mode,
            median : final.median,
            graphs : graph,
            project : req.body.id
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
    * request for compare (analyse/compare) route (string first, string second)
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
        Statistic.find({project: idTwo})
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

/***
    * request for getStatistics (analyse/getStatistics) route (string id)
    * 
    * this function receives an id for a project and returns its statistics
    * the data is read from the Database inside the Statistic model
*/

router.post('/getStatistics', (req, res, next) => {
    let id = req.body.id;

    Statistic.find({project: id})
    .exec()
    .then(res1 => {
        res.status(200).json({
            status : true,
            result : res1
        });
    })
    .catch(err1 => {
        res.status(200).json({
            status: false,
            result : "Error finding first project"
        });
    });
});

router.post('/getUserStatistics', (req, res, next) => {
    let userNum = 0;
    User.find()
    .exec()
    .then(res => {
        userNum = res.length;
    })
    .catch(err => {
        res.status(200).json({
            status: false,
            result : "Error finding users"
        });
    });
});

module.exports = router;