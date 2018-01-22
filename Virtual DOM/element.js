// var element = {
//   tagName: 'ul',
//   props: {
//     id: 'test'
//   },
//   children:[
//     {tagName: 'li', props:{class: 'item'}, children:["item1"]},
//     {tagName: 'li', props:{class: 'item'}, children:["item2"]},
//     {tagName: 'li', props:{class: 'item'}, children:["item3"]}
//   ]
// };


function Element(tagName, props, children) {
  this.tagName = tagName;
  this.props = props;
  this.children = children
}

Element.prototype.render = function () {
  var el = document.createElement(this.tagName);
  var props = this.props;

  for (var propName in props){
    var propValue = props[propName];
    el.setAttribute(propName, propValue)
  }

  var children = this.children || [];
  children.forEach(function (child){
    var childEl;
    if(child instanceof Element){
      childEl = child.render()
    } else {
      childEl = document.createTextNode(child);
    }
    el.appendChild(childEl);
  });

  return el;

};

module.exports = function (tagName, props, children) {
  return new Element(tagName, props, children)
};