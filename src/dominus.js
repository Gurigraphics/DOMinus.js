/*
 * 	DOMinus.js
 *	Version 2.0.5
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
      newID: function(){
        this.ID+=1
        return this.ID
      },
      class: {
        add: function( el, classe ){        
          HTML[ el ].class = HTML[ el ].class + " " + classe
        },
        remove: function( el, classe ){
          var oldClasses = HTML[ el ].class.split(" ")
          var newClasses = "";
          for( index in oldClasses ){
            if( oldClasses[ index ] != classe && oldClasses[ index ] ){
              newClasses = newClasses + " " + oldClasses[ index ]
            } 
          }     
          HTML[ el ].class = newClasses.substring(1)
        }      
      },
      get: function( el ){
         if( UTILS.contains( el, "." ) ) { 
           return document.getElementsByClassName( UTILS.subs( el ) )[0]
         }else if( UTILS.contains( el, "#" ) ){ 
           return document.getElementById( UTILS.subs( el ) ) 
         }else { 
           return document.getElementsByTagName( el )[0] 
         }
      },
      getParentID: ( id ) => id.split("_").slice(0, -1).join("_"),
      getValue: ( id ) => DOM.get( id ).value,              
      add: function( html, el ){  
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
        if( !content ) DOM.none( el )
        else if( !UTILS.contains( content, "<undefined>" ) ) DOM.get( el ).innerHTML = content
        else DOM.none( el )
      },
      none: ( el ) => { 
        DOM.get( el ).innerHTML = " "
      },
      remove: function( id ){ 
        
        if( HTML[ id ] ) delete HTML[ id ] 
        else{          
          var parentID = DOM.getParentID( id )
          
          if( HTML[ parentID ] ){
             for( index in HTML[ parentID ] ){

                if( HTML[ parentID ][ index ].id == id  ){

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
      h: function( data ){       
        if( UTILS.isArray( data ) ) {   
          return MOD.mountMap( data )
        }else return data ? MOD.mount( data ) : 0
      },
      mount: function( data ){  
        if( !data.tag ) { data.tag = "div" }
        var el = "<"+data.tag  
        for( index in data ) {          
          if( index != "tag" && index != "html" ) {        
              el+= (" "+index+"='"+data[ index ]+"' ")  
          } 
        }
        
        if( MOD.emptyElements.includes( data.tag ) ) { return el+"/>" }
        else if( data.html ) { 
          if( HTML[ data.html ] ){ el+= ">" + MOD.h( HTML[ data.html ] ) }
          else el+= ">" + data.html; 
        }else { el+=">" }

        return el+="</"+data.tag+">"
      },     
      mountMap: function( childs ) {         
        var html = "";
        childs.map(function( data, index ) { html+= MOD.mount( childs[ index ] ) })   
        return html        
      }  
  }

  var UTILS = { 
      subs: function( str ){ return str.substring(1)  },
      contains: function( el, value ){  
        if( el.indexOf( value ) !== -1) return true
        else return false
      },
      removeThis: async function( html, symbol ){  
        var name = html
        if( UTILS.contains( html, symbol ) ) name = html.split( symbol )[1] 
        return name
      },
      isArray: function( value ){ return value && typeof value === 'object' && value.constructor === Array },
      isString: ( value ) => typeof value === 'string' || value instanceof String, 
      getEventAttr:( ev, mode ) => ev.target.attributes[ mode ].nodeValue,   
      log( message, value ) { 
             if( message == "deleted" ) console.log(`Removed: ${ value }`);
        else if( message == "changed" ) console.log(`Changed path: ${ value }`);
        else if( message == "updated" ) console.log(`Updated path: ${ value }`);
      }          
  }  
  
  var PROXY = {
    keys: {},
    obj: {},
    get( target, key ) {
      if( typeof target[key] === 'object' && target[key] !== null ){
        return new Proxy(target[key], PROXY)
      }else return target[key];
    },
    set( target, key, value ) {    
      target[ key ] = value
      if( target.id ) this.elementChanged( target.id ) 
      else if( value.id ) this.elementChanged( value.id )
      return true
    },
    deleteProperty: function( target, key ) { 
      
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
      if( UTILS.contains( currentPath, "_" ) ) DOM.update( currentPath.split("_")[0] ) 
      else DOM.update( currentPath ) 
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
 
