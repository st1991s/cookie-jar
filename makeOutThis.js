var myObj = {
    specialFunction: function () {
        console.log('specialFunctionthis', this)
        console.log(1)
    },
    anotherSpecialFunction: function () {
        console.log(2)
    },
    getAsyncData: function (cb) {
        cb();
    },
    render: function () {
        // var that = this;
        // console.log(that);
        this.getAsyncData(function () {
            this.specialFunction();
            this.anotherSpecialFunction();
        }.bind(this))
    }
};
myObj.render();

// .bind()创建了一个函数，当这个函数在被调用的时候，他的this关键词会被设置成被传入的值（这里指调用bind()时传入的参数）


var foo = {
    x: 3
};

var bar = function () {
    console.log(this.x);
};
// bar();   undefined
var boundFunc = bar.bind(foo);
boundFunc();

// Function.prototype.bind = function (scope) {
//   var fn = this;
//   return function () {
//       return fn.apply(scope);
//   }
// };

// var myObj = {
//     specialFunction: function () {
//         console.log('specialFunctionthis', this)
//         console.log(1)
//     },
//     anotherSpecialFunction: function () {
//         console.log(2)
//     },
//     getAsyncData: function (cb) {
//         cb();
//     },
//     render: function () {
//         var that = this;
//         console.log(that);
//         this.getAsyncData(function () {
//             this.specialFunction();
//             this.anotherSpecialFunction();
//         })
//     }
// }
//
// myObj.render();