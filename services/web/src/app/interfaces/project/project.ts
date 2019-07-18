export class Project {
    public blacklist: string[] = [];
    public created: Date = null;
    public createdBy: string = "";
    public project_name: string = "";
    public source: string = "";
    public trackTime: number = 0;
    public whitelist: string[] = [];
    public _id: string = "";

    public data: string = "";
    public dataSentiment: number = 0;

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
