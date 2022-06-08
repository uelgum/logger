declare module "fast-date-format" {
    export default class DateFormat {
        constructor(format: string);
        
        public format(): string;
    }
}