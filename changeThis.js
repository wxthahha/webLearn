function myApply(thisArg, args = Symbol.for('args')) {
    if (typeof thisArg !== 'function') {
        throw new TypeError('input is not a function');
    }
    let fn = Symbol('fn');
    thisArg[fn] = this || window ;
    args === Symbol.for('args') ? thisArg[fn]() : thisArg[fn](...args);
    delete thisArg[fn];
}

function myCall(thisArg,arguments) {
    if(typeof thisArg !== 'function'){
        throw new TypeError('input is not a function');
    }
    let fn = Symbol('fn');
    thisArg[fn] = this || window ;
    let args = Array.from(arguments).slice(1);
    args.length ? thisArg[fn](...args):thisArg[fn]();
    delete thisArg[fn];
}

function myBind(thisArg) {
    if(typeof thisArg !== 'function'){
        throw new TypeError('input is not a function');
    }
    let fn = Symbol('fn');
    thisArg[fn] = this || window ;
    const f = thisArg[fn];
    delete thisArg[fn];
    const args = Array.from(arguments).slice(1);
    return function(){
        const args = args.concat(...arguments)
        f(...args);
    }
}