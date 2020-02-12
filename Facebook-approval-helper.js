// ==UserScript==
// @name        Facebook approval helper
// @namespace   Violentmonkey Scripts
// @match       https://www.facebook.com/groups/TimeManagementSecrets/requests/*
// @match       https://facebook.com/groups/TimeManagementSecrets/requests/*
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://code.jquery.com/jquery-latest.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js
// @grant       none
// @version     1.0
// @author      -
// @description 2/1/2020, 9:38:39 AM
// ==/UserScript==


(function() {
  'use strict';
  var $ = window.jQuery;

  // CHANGE THESE
  var q1 = "What is your #1 question regarding productivity?";
  var q2 = "If you had 5 extra hours per week, how would you spend them?";
  var q3 = "(optional) Enter your email if you'd like free access to my";
  
  // NO CHANGES BELOW THIS POINT
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  $(document).ready(function(){
    main();
  });
  
  async function main(){// the sleep needs to be in an async function
    await sleep(1000);
    markNewAccounts();
    addCopyButton();
  }
  
  function markNewAccounts(){

    // mark new accounts as suspicious
    $("li._-tv:contains('Joined Facebook on ')").children().each(function( index ){

      var dateJoined = $(this).text();
      var strYear = dateJoined.split(/[, ]+/).pop().trim();
      if(strYear=="2019" || strYear=="2020"){
        console.log("found suspicious account");
        $(this).parent().css("color", "white").css("font-weight","bold").css("background-color","red");
      }

    });     
  }
  
  function addCopyButton(){
    var i=0;
    
    $("#member_requests_pagelet .uiList > li:has('.clearfix')").each(function( index ){
      // only show copy button if any of the questions has been answered
      if($(this).find('div:contains("Waiting for response")').length == 0){
        // create a table and move it out of view
        $(' \
          <table id="tblHelper'+ i +'" style="width:100%; margin-top: 15px;font-size:18px;position:absolute;left:-1000px;top:-1000px;"> \
            <!-- <tr><th>Name</th><th>Question 1</th><th>Question 2</th><th>Question 3</th></tr> --> \
            <!-- <tr></tr> --> \
            <div><tr id="copyRow'+ i +'"> <td class="tblDate"></td> <td class="tblName"></td> <td class="tblQ1"></td> <td class="tblQ2"></td> <td class="tblQ3"></td> </tr> </div>\
          </table>'
        ).appendTo($(this));

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '/' + mm + '/' + yyyy;
        $(this).find(".tblDate").text(today);

        $(this).find('a[data-hovercard]').clone().appendTo($(this).find(".tblName"));
        // remove thumbnail image
        $(this).find('.tblName > a > img').remove();

        // add the replies to the questions
        $(this).find('li div:contains('+q1+')').next().clone().appendTo($(this).find(".tblQ1"));
        $(this).find('li div:contains('+q2+')').next().clone().appendTo($(this).find(".tblQ2"));
        $(this).find('li div:contains('+q3+')').next().clone().appendTo($(this).find(".tblQ3"));
        
        // add the copy button
        $('<button name="Copy" id="btnCopy'+ i +'" class="btn _4jy0 _4jy3 _517h" type="submit" data-clipboard-target="#tblHelper'+ i +'">Copy</button>').prependTo($(this).find('button[name|="approve"]').parent());

        // thank you ClipboardJS for coming in my life
        let clipboard = new ClipboardJS('.btn');
        
        $('.btn').on('click', function() {
          //get a reference to the JQUERY object of the current button
          let theButton = $(this);
          clipboard.on('success', function(e) {
            theButton.text('Copied');
          });
        });

        // optional, for debugging purposes
        clipboard.on('success', function(e) {
          console.info('Action:', e.action);
          console.info('Text:', e.text);
          console.info('Trigger:', e.trigger);

          e.clearSelection();
        });

        // optional, for debugging purposes
        clipboard.on('error', function(e) {
          console.error('Action:', e.action);
          console.error('Trigger:', e.trigger);
        });   

        i++;
        
      } // end if questions answered
    }); // end loop
  }

})();
