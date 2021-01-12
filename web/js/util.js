/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function numFormatter(num) {
    return Math.abs(num) > 999000 ? Math.sign(num) * ((Math.abs(num) / 1000000).toFixed(1)) + 'M' : Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
}

function formatCapitalizeAndEndWithS(word) {
    return word.charAt(0).toUpperCase() + word.substring(1) + 's';
}

function numberWithCommas(x) {
    return x ? x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";
}

// smooth scroll
$(document).ready(function () {
    $(".liButton a").on('click', function (event) {
        alert('this triggered');
        if (this.hash) {
//            event.preventDefault();
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 100
            }, 500);
        } // End if
    });
});