var DOM = new Dominus()
var HTML = DOM.HTML()

HTML.view = {
  tag: "div",
  id: "view", 
  class: "view",
  html: `view_content`
}

HTML.view_content = [
 { tag:"div", id: "view_content_top",    class: "view_content_top",    html: "view_content_top" },  
 { tag:"div", id: "view_content_middle", class: "view_content_middle", html: "1" },
 { tag:"div", id: "view_content_bottom", class: "view_content_bottom", html: "2" },
] 

HTML.view_content_top = [
 { tag:"div", id: "view_content_top_left",  class: "view_content_top_left",  html: "00" },  
 { tag:"div", id: "view_content_top_center",class: "view_content_top_center",html: "11" },
 { tag:"div", id: "view_content_top_right", class: "view_content_top_right", html: "22" },
] 

DOM.add("view", "#app")

var log = ( val ) => console.log( val )
var DATA = {};

/*
HTML.palleteTest = {
  tag: "div",
  attrs: { id: "element" },
  html: `
  <div class='dark size_50_50'></div>
  <div class='white size_50_50'></div>

  <div class='blue-0 size_50_50'></div>
  <div class='blue-1 size_50_50'></div>
  <div class='blue-2 size_50_50'></div>

  <div class='grey-0 size_50_50'></div>
  <div class='grey-1 size_50_50'></div>
  `
}

DOM.add("palleteTest", "#app")
*/
