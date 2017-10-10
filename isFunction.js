function isFunction(fn) {
    if(!fn){
        return false;
    }
    var s = 'toString',
        v = 'valueOf',
        t = typeof fn[s] === "function" && fn[s],
        o = typeof fn[v] === "function" && fn[v],
        r;
    if(t){
        delete fn[s];
    }
    if(o){
        delete fn[v];
    }
    r = typeof fn !== "string" && !(fn instanceof String) && !fn.nodeName && fn.constructor !== Array && /^[\s[]?function/.test(fn + "");
    if(t){
        fn[s] = t;
    }
    if(o){
        fn[v] = o;
    }
    return r;

}