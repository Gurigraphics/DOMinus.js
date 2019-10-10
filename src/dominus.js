/*
 * 	DOMinus.js
 *	Version 2.0.8
 * 	https://github.com/Gurigraphics/DOMinus.js
 *
 * 	Licensed under the MIT license:
 * 	http://www.opensource.org/licenses/MIT
 *  
 *	DOMinus.js is a reactive data binding library that turn HTML irrelevant.
 */  
var Dominus = function(){

  var HTML = {} 
  var DATA = {}
  var EVENTS = {}
  var DOM = {
      RENDER: [],   
      get( el ){                    
        if( UTILS.contains( el, "#" ) ){
          el = document.getElementById( UTILS.subs( el ) )
          el.addClass = ( classe ) => el.classList.add( classe )
          el.removeClass = ( classe ) => el.classList.remove( classe )
          el.hasClass = ( classe ) => el.classList.contains( classe )
          el.toogleClass = ( classe ) => el.hasClass( classe ) ? el.removeClass( classe ) : el.addClass( classe )  
          el.hide = () => el.style.display = 'none'
          el.show = () => el.style.display = 'block'
          el.val = () => el.value
          el.html = ( content ) => el.innerHTML = content
          el.append = ( content ) => el.insertAdjacentHTML('beforeend', content )
          el.prepend = ( content ) => el.insertAdjacentHTML('afterbegin', content )          
          return el
        }else{
          el = document.querySelectorAll( el )          
          el[0].addClass = ( classe ) => el.forEach(function(els){ els.classList.add( classe ) })
          el[0].removeClass = ( classe ) => el.forEach(function(els){ els.classList.remove( classe ) })
          el[0].hasClass = ( classe ) => el[0].classList.contains( classe )
          el[0].toogleClass = ( classe ) => el[0].hasClass( classe ) ? el[0].removeClass( classe ) : el[0].addClass( classe )    
          el[0].hide = () => el.forEach(function(els){ els.style.display = 'none' })
          el[0].show = () => el.forEach(function(els){ els.style.display = 'block' })
          el[0].val = () => el[0].value
          el[0].html = ( content ) => el.forEach(function(els){ els.innerHTML = content })
          el[0].append = ( content ) => el.forEach(function(els){ els.insertAdjacentHTML('beforeend', content ) })
          el[0].prepend = ( content ) => el.forEach(function(els){ els.insertAdjacentHTML('afterbegin', content ) })
          return el[0]
        }     
      },
      getParentID: ( id ) => id.split("_").slice(0, -1).join("_"),
      getValue: ( id ) => DOM.get( id ).value,              
      add: ( html, el ) => { UTILS.contains( html, "<" ) ? DOM.draw( el, html ) : DOM.render( html, el ) },
      render: ( html, el ) => { DOM.RENDER[ html ] = [ el, html ]; DOM.update( html ) },
      getRender: ( name ) => DOM.RENDER[ name ],
      update: async function( el ){ 
         var r = DOM.getRender( el ) 
         if( r ) { 
           DOM.draw( r[0], MOD.h( HTML[ r[1] ] ) )           
           UTILS.log( "updated", el ) // log
         } 
      },
      draw: ( el, content ) => {  
        !content ? DOM.none( el ) :
        !UTILS.contains( content, "<undefined>" ) ? DOM.get( el ).innerHTML = content : DOM.none( el )
      },
      none: ( el ) => DOM.get( el ).innerHTML = " "
  }

  var MOD = {      
      emptyElements: [ "area","base","br","col","embed","hr","img","input",
              "keygen","link","meta","param","source","track","wbr" 
      ],
      h: ( data ) => data && UTILS.isArray( data ) ? MOD.mountMap( data ) : 
                     data ? MOD.mount( data ) : 0,
      x( data, d="" ){       
        data.forEach(function(els){ d+=MOD.mount( HTML[ els ] ) })
        return d
      },
      mount( data ){       
        !data.tag ? data.tag = "div" : 0
        var el = "<"+data.tag  
        for( index in data ) index != "tag" && index != "html" ? el+= (" "+index+"='"+data[ index ]+"' ") : 0
        if( MOD.emptyElements.includes( data.tag ) ) { return el+"/>" }
        else if( data.html ) {   
          HTML[ data.html ] ? el+= ">" + MOD.h( HTML[ data.html ] ) : 
          UTILS.isArray( data.html ) ? el+= ">" + MOD.x( data.html ) : el+= ">" + data.html     
        }else { el+=">" }
        return el+="</"+data.tag+">"
      },     
      mountMap( childs, html = "" ) { 
        childs.map( ( data, index ) => { html+= MOD.mount( childs[ index ] ) } ) 
        return html        
      }  
  }

  var UTILS = { 
      subs: ( str ) => str.substring(1),   
      contains: ( el, value ) => ( el.indexOf( value ) !== -1 ? true : false ),   
      isArray: ( value ) => value && typeof value === 'object' && value.constructor === Array,
      isString: ( value ) => typeof value === 'string' || value instanceof String,  
      log( message, value, text = "" ) {        
         message == "deleted" ? text = "Removed:" : 
         message == "changed" ? text = "Changed path:" : text = "Updated path:"
         console.log(`${ text } ${ value }`);
      }    
  } 
  
  var PROXY = {
    keys: {},
    obj: {},
    get( target, key ) {
      return( 
        typeof target[ key ] === 'object' && target[ key ] !== null ? 
        new Proxy( target[ key ], PROXY ) : target[ key ] 
      )
    },
    set( target, key, value ) {  
      target[ key ] = value
      target.id ? this.elementChanged( target.id ) : 
      value.id  ? this.elementChanged( value.id ) :
      target[0] && target[0].id ? this.elementChanged( target[0].id.split("_")[0] ) : 0
      return true
    },
    deleteProperty( target, key ) {     
      if( key in target ) {        
        var id = target[ key ].id
        delete target[ key ]
        var parent = DOM.getParentID(id)
        parent ? HTML[ parent ].html = HTML[ parent ].html.filter(value => value !== id ) : 0   
        if( id ){
          this.elementChanged( id )
          UTILS.log( "deleted", id ) // log
        }else if( target.id ){
          this.elementChanged( target.id )
          UTILS.log( "deleted", target.id ) // log
        }else{
          this.elementChanged( key )
          UTILS.log( "deleted", key ) // log
        }
      }     
      return true
    },
    elementChanged( currentPath ) {
      UTILS.contains( currentPath, "_" ) ? DOM.update( currentPath.split("_")[0] ) : 
      DOM.update( currentPath ) 
      UTILS.log( "changed", currentPath ) // log
    }
  }

  HTML = new Proxy( DATA, PROXY )

  return{
    add: ( html, el ) => DOM.add( html, el ), 
    h: ( el ) => MOD.h.bind({}), 
    HTML: () => HTML,  
    EVENTS: () => EVENTS
  }
}
