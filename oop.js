function Person(firstName) {
  this.firstname = firstName;
}

Person.prototype.sayHello = function () {
  console.log('hello,i`m ' + this.firstname)
};

var person1 = new Person('shutong');
var person2 = new Person('huangjin');
var helloFunction = person1.sayHello;


// console.log(person1.sayHello);

person1.sayHello();
person2.sayHello();
helloFunction();


//栈、堆
