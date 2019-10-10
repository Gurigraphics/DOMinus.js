![alt tag](https://imgur.com/a8IlQGU.png)

DOMinus.js is a reactive data binding library that turn HTML irrelevant.
 
### Version: 2.0.8
 
---

 ## What this make?
  
 Change "**data**" -> Change "**view**" automagically

DIV:
 ```HTML
<div id="element"></div>
```
Code:
 ```Javascript
HTML.element.html = "hello world" 
```
Result:
 ```Javascript
<div id="element"> hello world </div>
```
Code:
 ```Javascript
HTML.element.tag = "button"
```
Result:
 ```Javascript
<button id="element"> hello world </button>
```
Code:
 ```Javascript
HTML.element.onclick = "go()"
```
Result:
 ```Javascript
<button id="element" onclick="go()"> hello world </button> 
```
 
  
  ---
  
## How use this

```Html
<script src="dominus.min.js"></script>

<script>
 
var DOM = new Dominus()
var HTML = DOM.HTML()
 
HTML.element = {
  tag: "div",
  id: "element",
  html: "Hello World"
}
DOM.add("element", "#app")

</script>

Result: <div id="element" > Hello World </div>
```

## How create elements without reactivity
```
var DOM = new Dominus()
var HTML = DOM.HTML()
var h = DOM.h();

var div = h({ 
  tag: "button", 
  id: "name",
  class: "class1 class2",  
  html: "content"
})

console.log( div )

Result: 
<button id="name" class="class1 class2"> content </button>
```
 
 ## Sandbox

https://playcode.io/180373/v2

  ---
  
 ## Principles:
  
 
 * **OBJECTivity**
 * **REACTivity**
 * **FAMILiarity**
 * **TERRITORiality**
 * **CONVENTionality**
 
 ---
 
## OBJECTivity

No more mixture of HTML with javascript.

All "HTML codes" are represented in a javascript object called "HTML". 

The "object HTML" store all elements in a "Virtual DOM".  

The "HTML codes" now interest only for browsers.
  
 Example:
 ```Javascript
 HTML.element = {
  tag: "div", 
  id: "element",  
  html: "hello"  
 }
 ```
 
 This will render this: 
 
  ```Html
 <div id="element"> hello </div>
 ```
 To append this element to "DOM" use:
 
  ```Javascript
 DOM.add( "element", "#app" )
  ``` 
  
 The string "element" of "HTML.element".
 
 The tag "#app" is the div to append the element.
 
 ---
 
## REACTivity

 Now always that propertie "HTML.myDiv" change, DOM View change automagically.
 
  ```Javascript
 HTML.element.html = "hello world" 
 // <div id="element"> hello world </div>
  
 HTML.element.tag = "button"
 // <button id="element"> hello world </button>
 
 HTML.element.onclick = "go()"
 // <button id="element" onclick="go()"> hello world </button> 
  ```
 
 ---
 
## FAMILiarity

Each element can have properties: tag, id, class, style, type, html, etc; 
 
   ```Javascript
HTML.header = {
     tag: "ul", 
     id: "header",
     class: "myClass",
     style: "color:red",   
     html: "header_content"  
}
   ```
   
 When the property "html" receives equal name of a "HTML.element"...
 
 Then this propertie will not be considered a "string", but a "child object".
 
 Example:
 ```Javascript
 HTML.header = {
   tag: "ul",
   id: "header",
   html: "header_content"  
 }

 HTML.header_content = { tag:"li", html: "0", class: "show" }
 ```
 
 Then this:
 ```Html
 <ul id="header"> header_content </ul>
 ```
 
 Will be this:
 ```Html
 <ul id="header">  
  <li id="header_content_1" class= "hide"> 0 </li>
 </ul>
  ```
  
 You can chain several elements inside others elements to create your "components".

### That's Clean Code! 
 ```Javascript

HTML.header_content_1 = { tag:"li", id: "header_content_1", class: "hide", html: "0"},  
HTML.header_content_2 = { tag:"ul", id: "header_content_2", html: "header_contentList" } 
HTML.header_contentList = { tag:"li", html: "1" }

HTML.header = {
  tag: "ul", 
  id: "header",
  class: "myClass",
  style: "color:red",
  html: [ "header_content_1", "header_content_2" ]
 }
  
 DOM.add( "header", "#app" )
 ```
Result:
```Html
<div id="app">
  <ul id="header" class="myClass" style="color:red">
      <li id="header_content_1" class="hide">0</li>
      <ul id="header_content_2">
        <li>1</li>       
      </ul>
  </ul>
</div>
```
 
## TERRITORiality

 For updates occur only in this "territory" or "region" or "group of elements", create different elements inside "HTML".
 
 Example:
 ```Javascript
 HTML.header = {} 
 HTML.footer = {}
 HTML.other = {}
 ```
 
 Thus, changes in "HTML.other and its children" update only "HTML.other and its children" in DOM. 
 
 As a result, you control which "territories" are updated with what object modifications.
 
 ---
 
## CONVENTionality
 
 To define that an object is "parent" or "child" of other uses the convention: parent_child.
 
 Example: 
  ```Javascript
  HTML.footer
  HTML.footer_content
  HTML.footer_content_tab 
  ```
  
 This "footer_" indicates that "HTML.footer" is the "start point" to update DOM. 
 
 So, modifications made in an object with this "initial name" will affect only this group.
 
 Use the same convention to IDs
 ```Javascript
 HTML.header_contents
 HTML.header_contents_child1"
 HTML.header_contents_child2"

  ```
 So, you can remove "header_contents_child2" of "header_contents" with:

  ```Javascript
 delete HTML.header_contents_child2
   ```

## Methods
```javascript

DOM.add( "element", "#app" )
DOM.get( "#app" )

```

## Methods like Jquery - without reactivity
```javascript
    
var $ = DOM.get

$("#id").removeClass("foo") 
$(".class").addClass("foo")   
$("body").hasClass("foo") 
$("#id").toogleClass("foo") 
$("#id").hide() 
$("#id").show() 
$("#id").val() 
$("#id").html("text") 
$("#id").append("<div>after</div>") 
$("#id").prepend("<div>before</div>") 
```
## Methods js native
```javascript
$("#input").id
$("#input").name
$("#input").classList
$("#input").children
$("#input").childNodes
$("#input").parentNode
$("#input").parentElement
$("#input").nextElementSibling
$("#input").previousElementSibling
Etc
```

 And that is all.
 
 ---

 ## Size
 
**DOMinus**: 4Kb
 
## License

 [MIT](http://opensource.org/licenses/MIT)

Copyright (c) Gurigraphics, 2018 - 2019.
  
