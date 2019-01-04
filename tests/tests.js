/* ----- VARS ----- */

var DOM, HTML;
var METHODS = {}
var VIEW = {}
var QUNIT = {}
QUNIT.tests = {}


/* ----- METHODS ----- */

METHODS.newDOM = function() {
  DOM = new Dominus();
  HTML = DOM.HTML();
}

METHODS.add = function( HTML_key ) {
   DOM.add(HTML_key,"#DOM_test")
}

METHODS.findFirstDiffPos=function (a, b) {
    var longerLength = Math.max(a.length, b.length);
    for (var i = 0; i < longerLength; i++) {
        if (a[i] !== b[i]) return i;
    }
    return -1;
};


/* ----- VIEW ----- */

VIEW.expected = function() {
  //console.log(document.getElementById("DOM_test").innerHTML);
  return document.getElementById("DOM_test").innerHTML;
}

VIEW.getMessage=function (isOk, actual, expected) {
    var pos, message;
    if (isOk) {
        message="Passed : "+actual;
    } else {
        pos=METHODS.findFirstDiffPos(actual,expected);
        message="Failed from |---| : "+actual.substr(0,pos)+"|---|"+actual.substr(pos) + " VS "+expected.substr(pos,10)+" ...";
    }
    return message;
};


/* ----- QUNIT ----- */

QUNIT.run = function() {
    for (var prop in QUNIT.tests) {
        if ( QUNIT.tests.hasOwnProperty(prop)) {
            (function (p) {
                var actual, isOk, expected, message;
                expected=QUNIT.tests[p]();
                isOk = (expected === (actual=VIEW.expected()));
                message=VIEW.getMessage(isOk, actual, expected);
                QUnit.test(prop, function (assert) {
                    assert.ok(isOk, message);
                });
            }(prop));
        }
    }
};

QUNIT.tests["empty_element"]=function () {
    METHODS.newDOM();
    HTML["a"] = {};
    METHODS.add("a");
    return '<div></div>';
};

QUNIT.tests["element"]=function () {
    METHODS.newDOM();
    HTML["a"] = {
        tag: "div",
        id: "element",
        html: "Hello World"
    };
    METHODS.add("a");
    return '<div id="element">Hello World</div>';
};

QUNIT.tests["elements_hierarchy"]=function () {
    METHODS.newDOM();
    HTML.a = {
        tag: "ul",
        id: "a",
        html: "a_b"
    };
    HTML.a_b = [
        { tag:"li", id: "a_b_1", html: "0", class: "hide" },
        { tag:"li", id: "a_b_2", html: "1", class: "hide" }
    ];
    METHODS.add("a");
    return '<ul id="a"><li id="a_b_1" class="hide">0</li><li id="a_b_2" class="hide">1</li></ul>';
};

QUNIT.run();
