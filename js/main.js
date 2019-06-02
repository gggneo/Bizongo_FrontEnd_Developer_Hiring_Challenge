var nameArr = [];
var sorted = false;
var sortedData = [];
jQuery(document).ready(function( $ ) {

  // Back to top button
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function(){
    $('html, body').animate({scrollTop : 0},1500, 'easeInOutExpo');
    return false;
  });

  // Header fixed on scroll
  $(window).scroll(function() {
    if ($(this).scrollTop() > 100) {
      $('#header').addClass('header-scrolled');
    } else {
      $('#header').removeClass('header-scrolled');
    }
  });

  if ($(window).scrollTop() > 100) {
    $('#header').addClass('header-scrolled');
  }

  // Real view height for mobile devices
  if (window.matchMedia("(max-width: 767px)").matches) {
    $('#intro').css({ height: $(window).height() });
  }

  // Initiate the wowjs animation library
  new WOW().init();

  // Initialize Venobox
  $('.venobox').venobox({
    bgcolor: '',
    overlayColor: 'rgba(6, 12, 34, 0.85)',
    closeBackground: '',
    closeColor: '#fff'
  });

  // Initiate superfish on nav menu
  $('.nav-menu').superfish({
    animation: {
      opacity: 'show'
    },
    speed: 400
  });

  // Mobile Navigation
  if ($('#nav-menu-container').length) {
    var $mobile_nav = $('#nav-menu-container').clone().prop({
      id: 'mobile-nav'
    });
    $mobile_nav.find('> ul').attr({
      'class': '',
      'id': ''
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="fa fa-bars"></i></button>');
    $('body').append('<div id="mobile-body-overly"></div>');
    $('#mobile-nav').find('.menu-has-children').prepend('<i class="fa fa-chevron-down"></i>');

    $(document).on('click', '.menu-has-children i', function(e) {
      $(this).next().toggleClass('menu-item-active');
      $(this).nextAll('ul').eq(0).slideToggle();
      $(this).toggleClass("fa-chevron-up fa-chevron-down");
    });

    $(document).on('click', '#mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
      $('#mobile-body-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $("#mobile-nav, #mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
      }
    });
  } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
    $("#mobile-nav, #mobile-nav-toggle").hide();
  }

  // Smooth scroll for the menu and links with .scrollto classes
  $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      if (target.length) {
        var top_space = 0;

        if ($('#header').length) {
          top_space = $('#header').outerHeight();

          if( ! $('#header').hasClass('header-fixed') ) {
            top_space = top_space - 20;
          }
        }

        $('html, body').animate({
          scrollTop: target.offset().top - top_space
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu').length) {
          $('.nav-menu .menu-active').removeClass('menu-active');
          $(this).closest('li').addClass('menu-active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('#mobile-nav-toggle i').toggleClass('fa-times fa-bars');
          $('#mobile-body-overly').fadeOut();
        }
        return false;
      }
    }
    });
singleAJAXCall(processData,1);
singleAJAXCall(loadCSVOnVariable);

$(".pagination a").click(function(){
  page = 0;
  var id = $(this).attr('id');
  if(id == "left"){
  page = $('.active').prop('id');
  page = parseInt(page) - 1;
  if (page != 0){
  $(this).parent().find('a').removeClass('active');
  $("#"+page).addClass("active");
  $("#gamesList").empty();
  if(sorted == false){
  singleAJAXCall(processData,page);
  }
  else{
  processDataByYear(sortedData,page);
  }
  }
  }
  else if(id == "right"){
  page = $('.active').prop('id');
  page = parseInt(page) + 1;
  if (page != 10){
  $(this).parent().find('a').removeClass('active');
  $("#"+page).addClass("active");
  $("#gamesList").empty();
  if(sorted == false){
  singleAJAXCall(processData,page);
  }
  else{
  processDataByYear(sortedData,page);
  }
  }
  }
  else{
  page = id;
  $(this).parent().find('a').removeClass('active');
  $(this).addClass("active");
  $("#gamesList").empty();
  if(sorted == false){
  singleAJAXCall(processData,page);
  }
  else{
  processDataByYear(sortedData,page);
  }
  }
});

$("#searchGames").click(function(){
var game = $("#myInput").val();
singleAJAXCall(loadResultsBasedOnInput,game);
});

$("#sortGames").click(function(){
myAlertBottom();
sorted = true;
singleAJAXCall(sortByYear);
});

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      count = 0;
      for (i = 0; i < (arr.length)-1; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase() && (count<5)) {
          count++;
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}
/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), nameArr);

});

//LOAD DATA VIA PAGINATION
function addNewGame(rank,name,platform,year,genre,publisher,sales){
// Adding image
localStorage.setItem(rank,name);
var gameImage = document.createElement("div");
gameImage.className = "game-img";
var img = document.createElement("img");
img.src = getImageFromGenre(genre);
img.className = "img-fluid";
gameImage.appendChild(img);

// Adding Title with rank
var spanRank = document.createElement("span");
spanRank.id= "rank";
spanRank.innerHTML = "#" + rank;
var spanName = document.createElement("span");
spanName.id= "gameName";
spanName.innerHTML = " " + name;
var anchor = document.createElement("a");
anchor.href = "#";
anchor.appendChild(spanRank);
anchor.appendChild(spanName);
var heading3 = document.createElement("h3");
heading3.appendChild(anchor);

// Adding publisher details
var boldPublisher = document.createElement("bold");
boldPublisher.innerHTML = "Publisher: ";
var spanPublisher = document.createElement("span");
spanPublisher.id = "publisher"
spanPublisher.innerHTML = publisher + " " + year;
var pPublisher = document.createElement("p");
pPublisher.appendChild(boldPublisher);
pPublisher.appendChild(spanPublisher);

// Adding genre details
var boldGenre = document.createElement("bold");
boldGenre.innerHTML = "Genre: ";
var spanGenre = document.createElement("span");
spanGenre.id = "genre"
spanGenre.innerHTML = genre;
var pGenre = document.createElement("p");
pGenre.appendChild(boldGenre);
pGenre.appendChild(spanGenre);

// Adding platform details
var boldPlatform = document.createElement("bold");
boldPlatform.innerHTML = "Platform: ";
var spanPlatform = document.createElement("span");
spanPlatform.id = "platform"
spanPlatform.innerHTML = platform;
var pPlatform = document.createElement("p");
pPlatform.appendChild(boldPlatform);
pPlatform.appendChild(spanPlatform);

// Adding sales details
var boldSales = document.createElement("bold");
boldSales.innerHTML = "Global Sales: ";
var spanSales = document.createElement("span");
spanSales.id = "sales"
spanSales.innerHTML = sales;
var pSales = document.createElement("p");
pSales.appendChild(boldSales);
pSales.appendChild(spanSales);

//Adding all elements to main div
var gameMain = document.createElement("div");
gameMain.className = "game";
gameMain.appendChild(gameImage);
gameMain.appendChild(heading3);
gameMain.appendChild(pPublisher);
gameMain.appendChild(pGenre);
gameMain.appendChild(pPlatform);
gameMain.appendChild(pSales);

//Adding game card to a separate column
var gameCol = document.createElement("div");
gameCol.className = "col-lg-4 col-md-6";
gameCol.appendChild(gameMain);

//Adding column to the row div
$('#gamesList').append(gameCol);
}
function processData(allText,page) {
var allTextLines = allText.split(/\r\n|\n/);
if(page == 1){
start = 1;
len = 1999;
}
else if(page == 2){
start = 2000;
len = 3999;
}
else if(page == 3){
start = 4000;
len = 5999;
}
else if(page == 4){
start = 6000;
len = 7999;
}
else if(page == 5){
start = 8000;
len = 9999;
}
else if(page == 6){
start = 10000;
len = 11999;
}
else if(page == 7){
start = 12000;
len = 13999;
}
else if(page == 8){
start = 14000;
len = 15999;
}
else if(page == 9){
start = 16000;
len = 16598;
}
for (var i=start; i<=len; i++) {
var data = allTextLines[i].split(',');
addNewGame(data[0],data[1],data[2],data[3],data[4],data[5],data[6]);
}
}
function getImageFromGenre(genre){
var path = ""
var imageArray = ["adventure.jpg","misc.jpg","platform.png","puzzle.jpg","strategy.jpg","race.jpg","sports.jpg","roleplay.png","shoot.jpg","fight.jpg","action.jpg","simulation.jpg"];
switch(genre.toUpperCase()){
  case "ADVENTURE":
       path = "img/"+ imageArray[0];
       break;
  case "MISC":
        path = "img/"+ imageArray[1];
        break;
  case "PLATFORM":
         path = "img/"+ imageArray[2];
         break;
  case "PUZZLE":
         path = "img/"+ imageArray[3];
         break;
  case "STRATEGY":
         path = "img/"+ imageArray[4];
         break;
  case "RACING":
         path = "img/"+ imageArray[5];
         break;
  case "SPORTS":
         path = "img/"+ imageArray[6];
         break;
  case "ROLE-PLAYING":
         path = "img/"+ imageArray[7];
         break;
  case "SHOOTER":
         path = "img/"+ imageArray[8];
         break;
  case "FIGHTING":
         path = "img/"+ imageArray[9];
         break;
  case "ACTION":
         path = "img/"+ imageArray[10];
         break;
  case "SIMULATION":
         path = "img/"+ imageArray[11];
         break;
  default:
         path = "img/"+ imageArray[1];
         break;
}
return path;
}

//STORING game names IN A LOCAL VARIABLE FOR SEARCH BY NAME OPERATION
function loadCSVOnVariable(allText) {
var allTextLines = allText.split(/\r\n|\n/);
var headers = allTextLines[0].split(',');
var lines = [];
for (var i=1; i<=(allTextLines.length)-1; i++) {
var data = allTextLines[i].split(',');
nameArr.push(data[1]);
if (data.length == headers.length) {
var tarr = [];
for (var j=0; j<headers.length; j++) {
tarr.push(headers[j]+":"+data[j]);
}

lines.push(tarr);

}

}
console.log(nameArr);
}

//LOAD RESULTS ON PAGE BASED ON SEARCH INPUT
function loadResultsBasedOnInput(allText,game){
var allTextLines = allText.split(/\r\n|\n/);
var headers = allTextLines[0].split(',');
var lines = [];
for (var i=1; i<=(allTextLines.length)-1; i++) {
var data = allTextLines[i].split(',');
if(data[1]==game){
$("#gamesList").empty();
$("#myInput").val("");
addNewGame(data[0],data[1],data[2],data[3],data[4],data[5],data[6]);
}
}
}

function singleAJAXCall(callBackfucntionName,param1){
$.ajax({
type: "GET",
url: "data.csv",
dataType: "text",
success: function(data)
{
(param1!="")?callBackfucntionName(data,param1):callBackfucntionName(data);
}
});
}

function sortByYear(allText){
var allTextLines = allText.split(/\r\n|\n/);
var headers = allTextLines[0].split(',');
var max = 2020;

while(max >= 1980){
for (var i=1; i<=(allTextLines.length)-1; i++) {
var data = allTextLines[i].split(',');
if(data[3]== max){
sortedData.push(data[0]+","+data[1]+","+data[2]+","+data[3]+","+data[4]+","+data[5]+","+data[6]);
}
else
{
continue;
}
}
max = max - 1;
}
page = $('.active').prop('id');
processDataByYear(sortedData,page);
}
function processDataByYear(allText,page) {
$("#gamesList").empty();
if(page == 1){
start = 0;
len = 2000;
}
else if(page == 2){
start = 2001;
len = 4000;
}
else if(page == 3){
start = 4001;
len = 6000;
}
else if(page == 4){
start = 6001;
len = 8000;
}
else if(page == 5){
start = 8001;
len = 10000;
}
else if(page == 6){
start = 10001;
len = 12000;
}
else if(page == 7){
start = 12001;
len = 14000;
}
else if(page == 8){
start = 14001;
len = 16000;
}
else if(page == 9){
start = 16001;
len = 16193;
}
for (var i=start; i<=len; i++) {
var data = allText[i].split(',');
addNewGame(data[0],data[1],data[2],data[3],data[4],data[5],data[6]);
}
}
function myAlertBottom(){
  $(".myAlert-bottom").show();
  setTimeout(function(){
    $(".myAlert-bottom").hide();
    myAlertBottom1();
  }, 3000);
}

