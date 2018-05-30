class StoreService {

    static set(name, value) {
        let val;
        if (typeof value === 'object') {
            try {
                val = JSON.stringify(value);
            } catch (e) {
                throw e;
            }
        } else { val = String(value) }

        localStorage.setItem(name, val);
    }

    static remove(name) {
        localStorage.removeItem(name);
    }

    static get(name) {
        return localStorage.getItem(name);
    }

}
export default StoreService;
