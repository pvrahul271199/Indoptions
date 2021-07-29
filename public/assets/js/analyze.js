// alert('hi')
let bnstrikeprice = document.querySelectorAll('.bnstrikeprice');
let niftystrikeprice = document.querySelectorAll('.niftystrikeprice');

// const changeValue = function(){
        

// }

$('.script').on('change', function () {
for(let i =0;i<4; i++){
console.log($('.script').val())
    if ($(this).val() == 'NIFTY') {
        // alert('hi')
        niftystrikeprice[i].classList.remove('hide')
        bnstrikeprice[i].classList.add('hide')
        
    } else if ($(this).val() == 'BANKNIFTY') {
        // alert('hi')
        niftystrikeprice[i].classList.add('hide')
        bnstrikeprice[i].classList.remove('hide')
    }
}
});

$(document).ready( function(){
    for(let i =0;i<4; i++){
    console.log($('.script').val())
    if ($('.script').val() == 'NIFTY') {
        // alert('hi')
        niftystrikeprice[i].classList.remove('hide')
        bnstrikeprice[i].classList.add('hide')
        
    } else if ($('.script').val() == 'BANKNIFTY') {
        // alert('hi')
        niftystrikeprice[i].classList.add('hide')
        bnstrikeprice[i].classList.remove('hide')
    }
}
})

