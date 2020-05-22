class Resize {

    constructor() {
        window.onresize = (e:any) => {
            for (const name in this.events) {
                this.events[name](e);
            }
        }
    }

    events: { [key: string]: (...args: any[]) => void } = {};

    listen(name: string, e: (...args: any[]) => void): string {
        this.events[name] = e;
        return name;
    }

    remove(name: string) {
        delete this.events[name];
    }

}

export default new Resize();
