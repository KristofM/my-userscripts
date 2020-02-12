// ==UserScript==
// @name        Disable Facebook friend button for x seconds
// @namespace   Violentmonkey Scripts
// @match       https://*.facebook.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @require     http://code.jquery.com/jquery-latest.js
// @version     1.0
// @author      -
// @description 1/28/2020, 7:14:23 PM
// ==/UserScript==

(function() {
    'use strict';
    var fbFriendButtonSelector= ".addButton";
    var waitInterval = 10000; // how long to wait between friend requests, in milliseconds

    var $ = window.jQuery;
    var lastFriendButtonClick;
    var friendButtonState = 'disabled'; // we start out with a disabled button

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

    /**
    * Collection of progress bar functions
    *
    */
    function initProgressBar(){
        // add CSS for progress bar
        addGlobalStyle(`
                       #progressBar {
                       height: 10px;
                       background-color: #e9ebee;
                       }

                       #progressBar div {
                       height: 100%;
                       text-align: right;
                       padding: 0;
                       line-height: 10px; /* same as #progressBar height if we want text middle aligned */
                       width: 0;
                       background-color: #4267b2;
                       box-sizing: border-box;
                       }
               `);
       $('.fbTimelineTopSectionBase').append('<div id="progressBar"><div></div></div>');

        hideProgressBar();
    }
    function updateProgressBar(timeleft, timetotal, $element) {
        var progressBarWidth = timeleft * $element.width() / timetotal;
        //$element.find('div').animate({ width: progressBarWidth }, 500).html(timeleft + " seconds to go");
        $element.find('div').animate({ width: progressBarWidth }, 1000);
        if(timeleft > 0) {
            setTimeout(function() {
                updateProgressBar(timeleft - 1, timetotal, $element);
            }, 1000);
        }
    }
    function showProgressBar(){
        $('#progressBar').show();
    }
    function hideProgressBar(){
        $('#progressBar').hide();
    }
    /* END of progressbar code */

    function init(){
        console.log('Tampermonkey script started: Disable facebook friend button');

        initProgressBar();

        lastFriendButtonClick = GM_getValue('lastFriendButtonClick');

        // is lastFriendButtonClick set to a number? If yes, a friend button has been clicked in the past
        if(lastFriendButtonClick > 99){
            // check if we should enable or disable the friend button in this window
            check_friend_status();
        } else {
            console.log('friend button click not found, waiting for first click');
        }

    }

    function setFriendButtonState(state){
        // only execute on state change
        if(friendButtonState !== state){
            if(state === 'disabled'){ // state change from enabled to disabled
                console.log('Add Friend button was clicked, disabling for a few seconds');
                disableFriendButton(fbFriendButtonSelector);
                showProgressBar();
                updateProgressBar((waitInterval/1000)-1, waitInterval/1000, $('#progressBar'));
                friendButtonState = state;
            }else if(state === 'enabled'){ // state change from disabled to enabled
                console.log('grace period has timed out, enabling buttons again');
                enableFriendButton(fbFriendButtonSelector);
                hideProgressBar();
                friendButtonState = state;
            }
        }
    }

    function disableFriendButton(selector){
        $(selector).attr("disabled", true);
        $(selector).css("background-color", "black");
    }
    function enableFriendButton(selector){
        $(selector).attr("disabled", false);
        $(selector).css("background-color", "#f5f6f7");
        $(selector).css("color", "#4b4f56");
    }

    function check_friend_status(){
        // check if friend button may be enabled
        lastFriendButtonClick = GM_getValue('lastFriendButtonClick');
        const now = Date.now();
        if(lastFriendButtonClick > now - waitInterval){
            setFriendButtonState('disabled');
        }else{
            // we're in the safe window
            setFriendButtonState('enabled');
        }
    }

    function handleAddButtonClick(){
        //alert('caught click');
        console.log("Clicked the friend button");
        setFriendButtonState('disabled');
        GM_setValue('lastFriendButtonClick', Date.now());
    }

    // Check status of friend button every second
    window.setInterval(function(){
      check_friend_status();
    }, 1000);

    $(document).ready(function(){
        init();

        // Triggered when Facebook "friend" button is clicked
        $(fbFriendButtonSelector).click(function(){
            handleAddButtonClick();
        });

    });


})();
