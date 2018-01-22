// var element = {
//   tagName: 'ul',
//   props: {
//     id: 'list'
//   },
//   children:[
//     {tagName: 'li', props:{class: 'item'}, children:["item1"]},
//     {tagName: 'li', props:{class: 'item'}, children:["item2"]},
//     {tagName: 'li', props:{class: 'item'}, children:["item3"]}
//   ]
// };

var el = require('./element');

var ul = el('ul', {id: 'list'}, [
  el('li', {class: 'item'}, ['item1']),
  el('li', {class: 'item'}, ['item2']),
  el('li', {class: 'item'}, ['item3'])
]);

var ulRoot = ul.render();

document.body.appendChild(ulRoot);