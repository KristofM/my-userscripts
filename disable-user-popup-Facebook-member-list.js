// ==UserScript==
// @name        Disable user pop-up on Facebook Member list
// @namespace   Violentmonkey Scripts
// @match       https://www.facebook.com/groups/*/members/
// @match       https://www.facebook.com/groups/*/members_with_things_in_common/
// @grant       none
// @version     1.0
// @author      -
// @description 1/28/2020, 7:15:25 PM
// ==/UserScript==

(function() {
    'use strict';

    // user variables
    var classToHide='uiContextualLayer';

    // start script

    /**
    * Function to add CSS to the current page
    *
    * Usage: addGlobalStyle('.selector { display: none; }');
    */
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('.uiContextualLayer { display: none; }');
})();
