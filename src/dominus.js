/*
 * 	DOMinus.js
 *	Version 2.0.6
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
  var DOM = {
      RENDER: [],
      ID: 100,
      newID(){
        this.ID+=1
        return this.ID
      },
      class: {
        add( el, classe ){ HTML[ el ].class = HTML[ el ].class + " " + classe },
        remove( el, classe, newClasses = "" ){
          var oldClasses = HTML[ el ].class.split(" ")  
          for( index in oldClasses ){
            if( oldClasses[ index ] != classe && oldClasses[ index ] ){
              newClasses = newClasses + " " + oldClasses[ index ]
            } 
          }     
          HTML[ el ].class = newClasses.substring(1)
        }      
      },
      get( el ){
        return(
          UTILS.contains( el, "." ) ? document.getElementsByClassName( UTILS.subs( el ) )[0] :
          UTILS.contains( el, "#" ) ? document.getElementById( UTILS.subs( el ) ) :
          document.getElementsByTagName( el )[0]          
        )
      },
      getParentID: ( id ) => id.split("_").slice(0, -1).join("_"),
      getValue: ( id ) => DOM.get( id ).value,              
      add( html, el ){  
         DOM.RENDER[ html ] = [ el, html ]
         DOM.update( html )
      },
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
      none: ( el ) => DOM.get( el ).innerHTML = " ",
      remove( id ){        
        if( HTML[ id ] ) delete HTML[ id ] 
        else{          
          var parentID = DOM.getParentID( id )          
          if( HTML[ parentID ] ){
            for( index in HTML[ parentID ] ){
              if( HTML[ parentID ][ index ].id == id ){
                var html = HTML[ parentID ][ index ].html
                if( HTML[ html ] ){
                  delete HTML[ parentID ][ index ]
                  delete HTML[ html ]       
                }else delete HTML[ parentID ][ index ] 
              } 
            }
          }                 
        }
      }   
  }

  var MOD = {      
      emptyElements: [ "area","base","br","col","embed","hr","img","input",
              "keygen","link","meta","param","source","track","wbr" 
      ],
      h: ( data ) => ( UTILS.isArray( data ) ) ? MOD.mountMap( data ) : data ? MOD.mount( data ) : 0,     
      mount( data ){  
        !data.tag ? data.tag = "div" : 0
        var el = "<"+data.tag  
        for( index in data ) index != "tag" && index != "html" ? el+= (" "+index+"='"+data[ index ]+"' ") : 0 
        
        if( MOD.emptyElements.includes( data.tag ) ) { return el+"/>" }
        else if( data.html ) { 
          if( HTML[ data.html ] ){ el+= ">" + MOD.h( HTML[ data.html ] ) }
          else el+= ">" + data.html; 
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
      getEventAttr:( ev, mode ) => ev.target.attributes[ mode ].nodeValue,   
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
        new Proxy( target[ key ], PROXY ) : 
        target[ key ] 
      )
    },
    set( target, key, value ) {    
      target[ key ] = value
      target.id ? this.elementChanged( target.id ) : 
      value.id  ? this.elementChanged( value.id ) : 0 
      return true
    },
    deleteProperty( target, key ) { 
    
      if( key in target ) {
        
        var id = target[ key ].id
        delete target[ key ];
        
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
      }else DOM.remove( key )
     
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
    newID: () => DOM.newID(),
    add: ( html, el ) => DOM.add( html, el ), 
    remove: ( id ) => DOM.remove( id ),
    get: ( id ) => DOM.get( id ),
    getEventAttr: ( ev, mode ) => UTILS.getEventAttr( ev, mode ),
    getValue: ( id ) => DOM.getValue( id ),
    getParentID: ( id ) => DOM.getParentID( id ), 
    class: {
      add:    ( el, classe ) => DOM.class.add( el, classe ),
      remove: ( el, classe ) => DOM.class.remove( el, classe )
    },
    HTML: () => HTML    
  }
}
 
