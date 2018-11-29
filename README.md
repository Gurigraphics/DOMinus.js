![alt tag](https://imgur.com/FO7LGTc.png)

DOMinus.js is a reactive data binding library that turn HTML irrelevant.

---

 ## What this make?
  
 Change DATA -> Change VIEW automatically
 ```Javascript
 HTML.myDiv.html = "hello world" 
 // <div id="myDiv"> hello world </div>
  
 HTML.myDiv.type = "button"
 // <button id="myDiv"> hello world </button>
 
 HTML.myDiv.onclick = "go()"
 // <button id="myDiv" onclick="go()"> hello world </button> 
  ```
  
  ---
  
 ## Principles:
  
 
 * **OBJECTivity**
 * **REACTivity**
 * **FAMILiarity**
 * **TERRITORiality**
 * **CONVENTionality**
 
 ---
 
## OBJECTivity

No have more mixture of HTML with javascript.

All "HTML codes" are represented in a javascript object called "HTML". 

The "object HTML" store all elements in a "Virtual DOM".  

The "HTML codes" now interest only for browsers.
  
 Example:
 ```Javascript
 HTML.myDiv = {
  type: "div", 
  attrs: { id: "myDiv" },
  html: "hello"  
 }
 ```
 
 This will render this: 
 
  ```Html
 <div id="myDiv"> hello </div>
 ```
 To append this element to "DOM" use:
 
  ```Javascript
 DOM.add( "myDiv", "#app" )
  ``` 
  
 The string "myDiv" of "HTML.myDiv".
 
 The tag "#app" is the div to append the element.
 
 ---
 
## REACTivity

 Now always that propertie "HTML.myDiv" change, DOM View change automatically.
 
  ```Javascript
 HTML.myDiv.html = "hello world" 
 // <div id="myDiv"> hello world </div>
  
 HTML.myDiv.type = "button"
 // <button id="myDiv"> hello world </button>
 
 HTML.myDiv.onclick = "go()"
 // <button id="myDiv" onclick="go()"> hello world </button> 
  ```
 
 ---
 
## FAMILiarity

Each element has three properties: type, attrs and html; 
 
   ```Javascript
HTML.header = {
   type: "ul", 
   attrs: { id: "header", class: "myClass", style: "color:red" },
   html: "header_content"  
}
   ```
   
 When the property "html" receives equal name of a "HTML.element"...
 
 Then this propertie will not be considered a "string", but a "child object".
 
 Example:
 ```Javascript
 HTML.header_content = [
  { type:"li", id: "header_content_1", html: "0", class: "hide" },  
  { type:"li", id: "header_content_2", html: "1", class: "hide" },
 ] 
 ```
 
 Then this:
 ```Html
 <ul id="header"> header_content </ul>
 ```
 
 Will be this:
 ```Html
 <ul id="header">  
  <li id="header_content_1" class= "hide"> 0 </li>
  <li id="header_content_2" class= "hide"> 1 </li>
 </ul>
  ```
  
 You can chain several elements inside others elements to create your "components".

### That's clean code! 
 ```Javascript
 HTML.header = {
  type: "ul", 
  attrs: { id: "header", class: "myClass", style: "color:red" },
  html: "header_content"  
 }
 
 HTML.header_content = [
  { type:"li", id: "header_content_1", html: "0",  class: "hide" },  
  { type:"ul", id: "header_content_2", html: "header_contentList",  class: "hide" },
 ] 
 
 HTML.header_contentList = [
  { type:"li", id: "header_contentList_1", html: "0",  class: "hide" },  
  { type:"li", id: "header_contentList_2", html: "1",  class: "hide" },
 ] 
 ```

 
  ### That's Spaghetti Code generate! 
```Html
<div id="app">
  <ul id="header" class="myClass" style="color:red">
      <li id="header_content_1" class="hide">0</li>
      <ul id="header_content_2" class="hide">
        <li id="header_contentList_1" class="hide">0</li>
        <li id="header_contentList_2" class="hide">1</li>
      </ul>
  </ul>
</div>
```

---
 
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
 HTML.header_contents = [
  { type:"li", id: "header_contents_child1", class: "hide", html: "11 " },  
  { type:"li", id: "header_contents_child2", class: "hide", html: "12" },
 ] 
  ```
 So, you can remove "header_contents_child2" of "header_contents" with:
  ```Javascript
 DOM.remove( "header_contents_child2" )
  ```

 Or delete by keys that also works:
  ```Javascript
 delete HTML.header_contents[1]
   ```
  
 And that is all.

 
 
 
 
 
 
 
 
 
 
 
