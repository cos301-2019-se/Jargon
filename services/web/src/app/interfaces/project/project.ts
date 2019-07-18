export class Project {
    public blacklist: string[] = [];
    public created: Date = null;
    public createdBy: string = "";
    public data: any = [];
    public dataSentiment: number[] = [];
    public project_name: string = "";
    public runs: any[] = [];
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
