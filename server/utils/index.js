class Utils {
    isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
    isEmpty(obj) {
        if (obj === null || obj === undefined) return true;
        if (typeof obj === 'string' && obj.trim() === '') return true;
        if (Array.isArray(obj) && obj.length === 0) return true;
        if (this.isObject(obj) && Object.keys(obj).length === 0) return true;
        return false;
    }
    requestSuccess(res, data, args = {}) {

        res.status(200).json({
            success: true,
            status: 200,
            data,
            message: 'successfully',
            ...args
        });
    }
    requestFail(res, status, message) {
        res.status(status).json({
            success: false,
            status,
            message: message
        });
    }
}


module.exports = new Utils();