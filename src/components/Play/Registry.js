class Registry {
    constructor(parent) {
        this.parent = parent;
        this.state = {};
    }
    registerChange(props, val) {
        if (!props) return;
        if (!Array.isArray(props)) props = [props];
        let current = this.state;
        for (let i = 0; i < props.length - 1; i++) {
            let prop = props[i];
            if (!current.hasOwnProperty(prop)) {
                if (typeof prop === 'number') current[prop] = [];
                else current[prop] = {};
            }
            else current = current[prop];
        }
        current[prop] = val;
    }
    pushChanges() {
        this.parent.setState(this.state);
    }
}