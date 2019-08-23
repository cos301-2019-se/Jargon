export class Project {
    public blacklist: string[] = [];
    public created: Date = null;
    public createdBy: string = "";
    public data: SocialData[] = [];
    public project_name: string = "";
    public runs: Run[] = [];
    public source: string = "";
    public status: boolean = false;
    public trackTime: number = 0;
    public whitelist: string[] = [];
    public _id: string = "";

    compare(object: Project) : boolean {
        return (
            // this.created === object.created &&
            // this.createdBy === object.createdBy &&
            this.project_name === object.project_name &&
            this.source === object.source &&
            this.trackTime === object.trackTime &&
            this.compareBlacklist(object.blacklist) &&
            this.compareWhitelist(object.whitelist)
        );
    }

    compareBlacklist(object: string[]) : boolean {
        if (this.blacklist.length !== object.length) {
            return false;
        }

        for (let i = 0; i < this.blacklist.length; ++i) {
            if (this.blacklist[i] !== object[i]) {
                return false;
            }
        }

        return true;
    }

    compareWhitelist(object: string[]) : boolean {
        if (this.whitelist.length !== object.length) {
            return false;
        }

        for (let i = 0; i < this.whitelist.length; ++i) {
            if (this.whitelist[i] !== object[i]) {
                return false;
            }
        }

        return true;
    }
}

export class Run {
    public averageScore: number = 0;
    public dateRun: Date = null;
    public positivePercentage: number = 0.0;
    public negativePercentage: number = 0.0;
    public bestTweet: string = "";
    public bestTweetSentiment: number = 0;
    public worstTweet: string = "";
    public worstTweetSentiment: number = 0;
}

export class SocialData {
    public tweetID: string = "";
    public tweetObject: DataObject = null;
    public tweetSentiment: number = 0.0;
}

export class DataObject {
    public created_at: Date = null;
    public text: string = "";
}

export class ProjectStatistic {
    public graphs: Graphs = null;
    public max: number = 0.0;
    public mean: number = 0.0;
    public median: number = 0.0;
    public min: number = 0.0;
    public mode: number[] = [];
    public project: string = "";
    public std_dev: number = 0.0;
    public timestamp: Date = null;
    public variance: number = 0.0;
}

export class Graphs {
    public averageOverTime: AveragePerTime = null;
    public changeOverTime: number[] = null;
    public histogram: number[] = null;
}

export class AveragePerTime {
    public averageSentiment: number = 0.0;
    public tweets: Data[] = null;
    public _id: string = "";
}

export class Data {
    public tweet: string = "";
    public sentiment: number = 0.0;
}