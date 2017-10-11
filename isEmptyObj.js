// 不能被for in 到
function isEmptyObj(obj) {
    var name;
    for(name in obj){
        return false;
    }
    return true;
}

function Aaa() {

}
// Aaa.prototype.constructor = Aaa;
Aaa.prototype.Bbb = function () {

};

for(var attr in Aaa.prototype){
    console.log(attr);
}

var obj = new Aaa();
console.log(obj);
console.log(typeof obj);