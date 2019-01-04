/*
 * 	DOMinus.js
 *	Version 2.0.1
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
      add: function( html, el ){  
         DOM.RENDER[ html ] = [ el, html ]
         DOM.update( html )
      },
      getRender: ( name ) => DOM.RENDER[ name ],
      update: async function( el ){ 
         var r = DOM.getRender( el ) 
         if( r ) { 
           DOM.draw( r[0], MOD.h( HTML[ r[1] ] ) )
           console.log( "Updated path: "+el )         
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
        var el, root;     
        if( UTILS.contains( id, "_") ){        
            el = id.split("_")
            root = el[0]
            if( el.length == 5 ){
              el =  el[0]+"_"+el[1]+"_"+el[2]+"_"+el[3]            
              for( index in HTML[el] ){   
                if( HTML[el][index].id == id ) delete HTML[el][index]
              }
            }else if( el.length == 4 ){
              el =  el[0]+"_"+el[1]+"_"+el[2]            
              for( index in HTML[el] ){   
                if( HTML[el][index].id == id ) delete HTML[el][index]
              }
            }else if( el.length == 3 ){
              el =  el[0]+"_"+el[1]            
              for( index in HTML[el] ){   
                if( HTML[el][index].id == id ) delete HTML[el][index]
              }
            }else if( el.length == 2 ){
              el =  el[0]+"_"+el[1]
              delete HTML[el] 
              HTML[root].html = ""             
            }
        }else delete HTML[ id ]      
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
        if( !data.attrs ){      
          for( index in data ) {          
            if( index != "tag" && index != "html" ) {        
              if( UTILS.verify( index ) ) { el+= (" "+index+"='"+data[ index ]+"' ") } 
            } 
          }        
        }else{
          for( index in data.attrs ) { 
            if( UTILS.verify( index ) ) { el+= (" "+index+"='"+data.attrs[ index ]+"' ") } 
          } 
        }            

        if( MOD.emptyElements.includes( data.tag ) ) { return el+"/>" }
        else if( data.html ) { 
          if( HTML[ data.html ] ){ el+= ">" + MOD.h( HTML[ data.html ] ) }
          else el+= ">" + data.html; 
        }else { el+=">" }

        return el+="</"+data.tag+">"
      },
      mounts: function( v0, v1, v2 ){ 
        if( UTILS.isArray( v0 ) ){ var d=v0; v0=d[0]; v1=d[1]; v2=d[2]; }
        if( HTML[v2] ){ var t=HTML[v2]; v2 = MOD.h( t ) }
        else if( UTILS.isArray( v2 ) ){ var t=""; for( item in v2 ){ t+=v2[item]} v2=t; }
        var x = {
          tag: v0,
          attrs: { ...v1 },
          html: v2,
        }  
        return MOD.mount( x )
      },
      mountMap: function( us ) {
        var x = "";
        us.map(function( data, index ) {    
          if( us[ index ].mountMap ){ 
            var t = [ us[ index ].tag, { ...data }, "" ]
            for( item in t[1]["mountMap"] ) t[2]+= MOD.mountMap( t[1]["mountMap"][0] ); 
            delete t[1].mountMap
            x+= MOD.mounts( t[0], t[1], t[2] ) 
          }else{
            if( us[ index ].html ) x+= MOD.mounts( us[ index ].tag, us[ index ], us[ index ].html )
            else if( us[ index ].mount ){
              x+= MOD.mounts( us[ index ].tag, us[ index ], MOD.mount( us[ index ].mount[0] ) )          
            } 
          } 
        })   
        return x         
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
      verify: ( value ) => {  
        var array = [ "html", "mount", "mountMap", "mounts", "tag" ]    
        if( array.includes( value ) ) return false
        else return true
      },
      isArray: function( value ){ return value && typeof value === 'object' && value.constructor === Array },
      isString: ( value ) => typeof value === 'string' || value instanceof String, 
      ev:( ev, mode ) => ev.target.attributes[ mode ].nodeValue
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
      this.keys = {};
      target[ key ] = value    
      this.update()
      return true;
    },
    deleteProperty: function( target, key ) {
      if( key in target ) {
        delete target[ key ];
        console.log(`Removed key: ${ key }`);
        this.update() 
      }
    },
    update() {
      for( index in DATA ) this.keys[ index ] = index    
      for( index in this.keys ){            
        var string = JSON.stringify( DATA[ index ] );      
        if( this.obj[ index ] != string ){        
          this.obj[ index ] = string
          this.elementChanged( index )        
        }
      }  
    },
    elementChanged( key ) {
      console.log( "Changed path: " + key )    
      var currentPath = key
      if( UTILS.contains( currentPath, "_" ) ) currentPath = currentPath.split("_")[0]
      if( currentPath ) DOM.update( currentPath )     
    }
  }

  HTML = new Proxy( DATA, PROXY )

  return{
    add: ( html, el ) => {
      DOM.add( html, el )     
    },
    remove: ( id ) => {
      DOM.remove( id )      
    },
    get: ( id ) => {
      return DOM.get( id )      
    },    
    class: {
      add: ( el, classe ) => {
        DOM.class.add( el, classe )     
      },
      remove: ( el, classe ) => {
        DOM.class.remove( el, classe )      
      }
    },
    HTML: () => HTML    
  }
}
