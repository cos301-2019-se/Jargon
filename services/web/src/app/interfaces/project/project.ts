export class Project {
    public id: string = "";
    public whitelist: string[] = [];
    public blacklist: string[] = [];
    public projectName: string = "";
    public source: string = "";
    public trackTime: number = 0;
    public data: string = "";
    public createdBy: string = "";
    public created: Date = null;
    public dataSentiment: number = 0;
}
