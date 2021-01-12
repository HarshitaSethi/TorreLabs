/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    $(".menu-icon").on("click", function () {
        $("nav ul").toggleClass("showing");
    });


    signInOut();
    
    $('#logout').on('click', function () {
        localStorage.removeItem('userID');
        signInOut();
    });
});

// Scrolling Effect

$(window).on("scroll", function () {
    if ($(window).scrollTop()) {
        $('nav').addClass('black');
    } else {
        $('nav').removeClass('black');
    }
})

function saveUserID(form) {
    localStorage.setItem('userID', form.userID.value);
    location.reload();
    return false;
}

function signInOut() {
    var userID = localStorage.getItem('userID');
    if (userID) {
        $('#signIn').hide();
        $.getJSON('GetPeople?userID=' + userID, function (data) {
            console.log("data", data);

            $("#userImage").attr('src', data.person.picture);
            $("#userImage").attr('title', data.person.name);
        });

    } else {
        $('#logout').hide();
    }
}