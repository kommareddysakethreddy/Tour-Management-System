import { loadPage } from './login.js';
const payBtn = document.querySelector('#pay-btn');
const orderId = document.querySelector('#order-id');
const orderIdc = document.querySelector('.order-id');
const payForm = document.forms['payment-conformation'];
const price = document.querySelector('#price');
const tourName = document.querySelector('.tour-name');
const totalPrice = document.querySelector('#totalprice');
const nop = document.querySelector('.nop');
const orderPaymentId = document.querySelector('#order-payment-id');
const orderSignature = document.querySelector('#order-signature');
const checkOut = (e) => {
    e.preventDefault();
    let data;
    var options = {
        key: 'rzp_test_bAVKrjoiT2XF9U', //Enter your razorpay key
        currency: 'INR',
        name: 'Vehere',
        description: 'Razor Test Transaction',
        image: 'https://previews.123rf.com/images/subhanbaghirov/subhanbaghirov1605/subhanbaghirov160500087/56875269-vector-light-bulb-icon-with-concept-of-idea-brainstorming-idea-illustration-.jpg',
        order_id: orderId.innerHTML,
        handler: function(res) {
            try {
                data.razorpay_payment_id = res.razorpay_payment_id;
                data.razorpay_order_id = res.razorpay_order_id;
                data.razorpay_signature = res.razorpay_signature;
            } catch (e) {}
        },
        theme: {
            color: '#227254',
        },
    };
    var rzp1 = new window.Razorpay(options);
    // console.log(options);
    // setInterval(
    //     () => {
    rzp1.open();
    // },
    // () => {
    // loadPage('/', 2000);
    //     },
    //     15000
    // );
};
if (payForm) {
    const x = window.sessionStorage.nop;
    orderId.innerHTML = window.sessionStorage.order_id;
    orderIdc.innerHTML = window.sessionStorage.order_id;
    price.innerHTML = window.sessionStorage.price;
    console.log(+window.sessionStorage.price / x,
        nop,
        window.sessionStorage.price
    );
    document.querySelector('.price1').innerHTML =
        '$' + +window.sessionStorage.price / x;
    tourName.innerHTML = window.localStorage.tourName;
    nop.innerHTML = window.sessionStorage.nop;
    const val = +price.innerHTML;
    // console.log();
    totalPrice.innerHTML = `$${val}`;
}
if (payBtn) {
    console.log(payBtn);
    payBtn.addEventListener('click', checkOut);
}