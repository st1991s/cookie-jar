
// console.log(typeof NaN)  // number

// 当超出计算机范围的数字时，会返回false

// console.log(isFinite(Number.MAX_VALUE + Number.MAX_VALUE));    // false

function isNumber(obj) {
    return !isNaN(parseFloat(obj)) && isFinite(obj)
}