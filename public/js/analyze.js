// alert('hi')
let bnstrikeprice = document.querySelectorAll('.bnstrikeprice');
let niftystrikeprice = document.querySelectorAll('.niftystrikeprice');

$('.script').on('click', function () {
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

