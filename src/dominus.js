/*
 * 	DOMinus.js
 *	Version 2.0.11
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
      add: ( html, el ) => {   
        for( index in HTML ){          
          if( HTML[ index ] && HTML[ index ].html ){
            if( UTILS.isArray( HTML[ index ].html ) ){
              for( items in HTML[ index ].html ){          
                if( !HTML[ HTML[ index ].html[items ] ].parent ) HTML[ HTML[ index ].html[items ] ].parent = index 
              }
            }else if( HTML[ HTML[ index ].html ] ) HTML[ HTML[ index ].html ].parent = index 
          }
        }    
        UTILS.contains( html, "<" ) ? DOM.draw( el, html ) : DOM.render( html, el ) 
      },
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
      removeArray: ( change, id ) => { HTML[ change ].html = HTML[ change ].html.filter(value => value !== id ) },  
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
      PROXY.changed = key    
      return( 
        typeof target[ key ] === 'object' && target[ key ] !== null ? 
        new Proxy( target[ key ], PROXY ) : target[ key ] 
      )
    },
    set( target, key, value, receiver, change ){  
      change = PROXY.changed
      target[ key ] = value   
      if( change ) PROXY.change( change ) 
    },
    change( change ){      
      if( HTML[ change ] && HTML[ change ].parent ){ 
        PROXY.elementChanged( HTML[ change ].parent ) 
      }else PROXY.elementChanged( change )
    },
    deleteProperty( target, key, change ) {       
      if( key in target ){
        if( HTML[ key ] && HTML[ key ].parent ) change = HTML[ key ].parent 
        delete target[ key ]
        PROXY.remove( key ) 
        if( change ) PROXY.elementChanged( change )  
        else PROXY.elementChanged( key ) 
        UTILS.log( "deleted", key )
      }           
    },
    remove( currentPath ){    
      for( index in HTML ){
        if( UTILS.isArray( HTML[ index ].html ) && HTML[ index ].html.includes( currentPath ) ){          
          UTILS.removeArray( index, currentPath )
        }else if( HTML[ index ].html == currentPath ) HTML[ index ].html = ""
      }
    },
    elementChanged( currentPath ){ 
      DOM.update( currentPath )
      UTILS.log( "changed", currentPath )
    }
  }

  HTML = new Proxy( DATA, PROXY )

  return{
    add: ( html, el ) => DOM.add( html, el ), 
    get: ( el ) => DOM.get( el ), 
    h: ( el ) => MOD.h.bind({}),
    HTML: () => HTML,   
    EVENTS: () => EVENTS
  }
}

module.exports = Dominus 
