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
}
