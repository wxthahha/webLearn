class Promise {
    constructor(executor){
        this.state='pending';
        this.value = undefined; // fulfilled必有一个不可改变的值
        this.reason = undefined;//rejected必有一个不可改变的理由
        this.onResolvedCallbacks = [];
        this.onRejectedCallbacks = [];
        let resolve = value =>{
            if(this.state==='pending'){
                this.state='fulfilled';
                this.value=value;
                this.onResolvedCallbacks.forEach(fn=>fn());
            }
        };
        let reject = reason => {
            if(this.state==='pending'){
                this.state='rejected';
                this.reason = resson;
                this.onRejectedCallbacks.forEach(fn=>fn());
            }
        }
        try {
            executor(resolve,reject);
        } catch (error) {
            reject(error);
        }
    }
    then(onFulfilled,onRejected){
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled :value=>value;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {reject(err)};
        let promise2 = new Promise((resolve,reject)=>{
            if (this.state === 'fulfilled') {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }
            if (this.state === 'rejected') {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            }
            if (this.state === 'pending') {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            resolvePromise(promise2, x, resolve, reject);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                })
            }
        })
        return promise2;
    }
    catch(fn){
        return this.then(null,fn);
    }
}

function resolvePromise(promise2,x,resolve,reject) {
    if(x===promise2){
        return reject(new TypeError('chaining cycle detected for promise'));
    }
    let called ;
    if(x !== null && (typeof x === 'object' || typeof x === 'function')){
        try {
            let then = x.then;
            if(typeof then === 'function'){
                then.call(x,y=>{
                    if(called) return ;
                    called = true;
                    resolvePromise(promise2,y,resolve,reject)
                },err=>{
                    if(called) return;
                    called = true;
                    reject(err);
                })
            }else{
                resolve(x);
            }
        } catch (error) {
            reject(error);
        }
    }else{
        resolve(x)
    }
}

Promise.resolve = val => {
    return new Promise((resolve,reject)=>{
        resolve(val);
    })
}

Promise.reject = val => {
    return new Promise((resolve,reject)=>{
        reject(val);
    })
}

Promise.race = promises => {
    return new Promise((resolve,reject)=>{
        for(let i=0;i<promises.length;i++){
            promises[i].then(resolve,reject);
        }
    })
}

Promise.all = promises => {
    let result = [],i=0;
    return new Promise((resolve,reject)=>{
        for(let j=0;j<promises.length;j++){
            promises[j].then( data => {
                processData(j,data,resolve);
            },reject)
        }
    })
    function processData(index,data,resolve){
        result[index] = data;
        i++;
        if(i===promises.length){
            resolve(result);
        }
    }
}