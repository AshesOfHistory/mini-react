for (let i of [1,2,3,45,56]) {
  console.log(i)
}

function createElement(tagName, attributes, ...children) {
  console.log('tagName', tagName, 'attributes', attributes);
  return document.createElement(tagName)
}

let a = <div id = 'wrapper' class='wrapper'>
    <div class='children'>1111</div>
  </div>