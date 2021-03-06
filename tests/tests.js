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

VIEW.actual = function() {
  //console.log(document.getElementById("DOM_test").innerHTML);
  return document.getElementById("DOM_test").innerHTML;
}


/* ----- QUNIT ----- */

QUNIT.run = function() {
    for (var prop in QUNIT.tests) {
        if ( QUNIT.tests.hasOwnProperty(prop)) {
            (function (p) {
                var actual, isOk, expected;
                expected=QUNIT.tests[p]();
                isOk = (expected === (actual=VIEW.actual()));
                QUnit.test(prop, function (assert) {
                    if (isOk) {
                        assert.ok(true,"Passed : "+actual);
                    } else {
                        assert.ok(true, "Actual : "+actual);
                        assert.ok(true, "Expect : "+expected);
                        assert.ok(false,"Failed : "+actual.substr(0,METHODS.findFirstDiffPos(actual,expected)));
                    }
                });
            }(prop));
        }
    }
}

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
