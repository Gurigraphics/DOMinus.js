/*
 * 	DOMinus.js
 *	Version 0.1.0
 * 	https://github.com/Gurigraphics/DOMinus.js
 *
 * 	Licensed under the MIT license:
 * 	http://www.opensource.org/licenses/MIT
 *  
 *	DOMinus.js is a reactive data binding library that turn HTML irrelevant.
 */
var HTML = {}

var DOM = {
    RENDER: [],
    TAGS: [],      
    get: function( tag ){
       if( DOM.TAGS[ tag ] ){ 
         return DOM.TAGS[ tag ]  
       }else if( UTILS.contains( tag, "." ) ) { 
         DOM.TAGS[ tag ] = document.getElementsByClassName( UTILS.subs( tag ) )[0]
       }else if( UTILS.contains( tag, "#" ) ){ 
         DOM.TAGS[ tag ] = document.getElementById( UTILS.subs( tag ) ) 
       }else { 
         DOM.TAGS[ tag ] = document.getElementsByTagName( tag )[0] 
       }    
       return DOM.TAGS[ tag ]
    },
    add: function( html, tag ){  
       DOM.RENDER[ html ] = [ tag, html ]
       DOM.update( html )
    },
    getRender: ( name ) => DOM.RENDER[ name ],
    update: async function( tag ){ 
       var r = DOM.getRender( tag ) 
       if( r ) { 
         DOM.draw( r[0], MOD.h( HTML[ r[1] ] ) )
         console.log( "Updated path: "+tag )
       }
    },
    draw: ( tag, el ) => {       
      if( !el ) DOM.none( tag )
      else if( !UTILS.contains(el, "<undefined>" ) ) DOM.get( tag ).innerHTML = el
      else DOM.none( tag )
    },
    none: ( tag ) => { 
      DOM.get( tag ).innerHTML = " "
    },
    remove: function( tag ){ 
      var el, root;     
      if( UTILS.contains( tag, "_") ){        
          el = tag.split("_")
          root = el[0]
          if( el.length == 5 ){
            el =  el[0]+"_"+el[1]+"_"+el[2]+"_"+el[3]            
            for( index in HTML[el] ){   
              if( HTML[el][index].id == tag ) delete HTML[el][index]
            }
          }else if( el.length == 4 ){
            el =  el[0]+"_"+el[1]+"_"+el[2]            
            for( index in HTML[el] ){   
              if( HTML[el][index].id == tag ) delete HTML[el][index]
            }
          }else if( el.length == 3 ){
            el =  el[0]+"_"+el[1]            
            for( index in HTML[el] ){   
              if( HTML[el][index].id == tag ) delete HTML[el][index]
            }
          }else if( el.length == 2 ){
            el =  el[0]+"_"+el[1]
            delete HTML[el] 
            HTML[root].html = ""             
          }
      }else delete HTML[ tag ]      
    }   
}

var MOD = {      
    types: [ "input", "img", "area", "source", "embed" ],
    h: function( data ){ 
      if( UTILS.isArray( data ) ) {   
        return MOD.mountMap( data )
      }else return data ? MOD.mount( data ) : 0
    },
    mount: function( data ){  
      if( !data.type ) { data.type = "div" }
      var el = "<"+data.type
      for( index in data.attrs ) { 
        if( UTILS.verify( index ) ) { el+= (" "+index+"='"+data.attrs[ index ]+"' ") } 
      }     
      if( data.html ) { 
        if( HTML[ data.html ] ){ el+= ">" + MOD.h( HTML[ data.html ] ) }
        else el+= ">" + data.html; 
      }else if( data.mount ) {  
        if( HTML[ data.mount ] ) {        
          if( UTILS.isArray( HTML[ data.mount ] ) ) {          
            el+= ">" + MOD.mountMap( HTML[ data.mount ] );           
          }else el+= ">" + MOD.mount( HTML[ data.mount ] ); 
        }else el+= ">" + MOD.mount( data.mount[0] );   
      }else if( data.mountMap ) { 
        if( HTML[ data.mountMap ] ) el+= ">" + MOD.mountMap( HTML[ data.mountMap ] )
        else el+= ">" + MOD.mountMap( data.mountMap[0] ) 
      }else if( MOD.types.includes( data.type ) ) { return el+"/>" }
      else { el+=">" }

      return el+="</"+data.type+">"
    },
    mounts: function( v0, v1, v2 ){ 
      if( UTILS.isArray( v0 ) ){ var d=v0; v0=d[0]; v1=d[1]; v2=d[2]; }
      if( HTML[v2] ){ var t=HTML[v2]; v2 = MOD.h( t ) }
      else if( UTILS.isArray( v2 ) ){ var t=""; for( item in v2 ){ t+=v2[item]} v2=t; }
      var x = {
        type: v0,
        attrs: { ...v1 },
        html: v2,
      }  
      return MOD.mount( x )
    },
    mountMap: function( us ) {
      var x = "";
      us.map(function( data, index ) {    
        if( us[ index ].mountMap ){ 
          var t = [ us[ index ].type, { ...data }, "" ]
          for( item in t[1]["mountMap"] ) t[2]+= MOD.mountMap( t[1]["mountMap"][0] ); 
          delete t[1].mountMap
          x+= MOD.mounts( t[0], t[1], t[2] ) 
        }else{
          if( us[ index ].html ) x+= MOD.mounts( us[ index ].type, us[ index ], us[ index ].html )
          else if( us[ index ].mount ){
            x+= MOD.mounts( us[ index ].type, us[ index ], MOD.mount( us[ index ].mount[0] ) )          
          } 
        } 
      })   
      return x         
    }  
}

var UTILS = {
    subs: function( str ){ return str.substring(1)  },
    contains: function( tag, value ){  
      if( tag.indexOf( value ) !== -1) return true
      else return false
    },
    removeThis: async function( html, symbol ){  
      var name = html
      if( UTILS.contains( html, symbol ) ) name = html.split( symbol )[1] 
      return name
    },
    verify: ( value ) => {  
      var array = [ "html", "mount", "mountMap", "mounts", "type" ]    
      if( array.includes( value ) ) return false
      else return true
    },
    isArray: function( value ){ return value && typeof value === 'object' && value.constructor === Array },
    isString: ( value ) => typeof value === 'string' || value instanceof String, 
    ev:( ev, mode ) => ev.target.attributes[ mode ].nodeValue
}     
 
var OBS = {} 

HTML = ObservableSlim.create( OBS, true, function( changes ) {    

  for( change in changes ){    
    var currentPath = changes[ change ].currentPath 
    if( UTILS.contains( currentPath, "_" ) ) currentPath = currentPath.split("_")[0]
    else currentPath = currentPath.split(".")[0]
    if( currentPath ) DOM.update( currentPath ) 
  }
});  

