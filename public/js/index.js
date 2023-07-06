import {
  signup,
  login,
  logout,
  navleft,
  navright,
  navright_withoutLogin,
  getMe,
  changeSettings,
  changePassword,
  loadPage,
  check,
  getTours,
  getTour,
  getReviews,
  bookTour,
  scroll,
  Axios,
} from './login.js';
import { showAlert } from './alert.js';
const loginReg = document.querySelector('#login_reg');
const signupReg = document.querySelector('#signup_reg');
const loginBtn = document.querySelector('.btn-login');
const forgotLink = document.forms['forgot-password'];
const resetForm = document.forms['reset-password'];
const forgotBtn = document.querySelector('.btn-forgot');
const resetBtn = document.querySelector('.btn-reset');
const signupBtn = document.querySelector('.btn-signup');
const detailsBtn = document.querySelector('.btn-details');
const passwordBtn = document.querySelector('.btn-password');
const nav_left = document.querySelector('.nav_left');
const nav_right = document.querySelector('.nav_right');
let me, logoutBtn, bookBtn, tour;
const bookingForm = document.forms['book-form'];
const book = document.querySelector('.book');
const toursSection = document.querySelector('.cardss');
const allBookings = document.querySelector('#all-bookings');
const bookingCard = document.querySelector('.booking-card');
const loginForm = document.forms['login'];
const signupForm = document.forms['signup'];
const detailsForm = document.forms['details'];
const passwordForm = document.forms['password-form'];
const noPeople = document.querySelector('#no-people');
const totalPrice = document.querySelector('.total-price');
const forms = document.querySelector('.form_cont');
const reviews = document.querySelector('.reviews');
let tours, allTours, btnSearch;
/* ____________________________________Page Loading____________________________ */
const ul = window.location.pathname;
console.log(ul);
if (ul != '/') {
  // document.querySelector('.nav').classList.add('hidden');
}
if (signupReg) {
  const login = document.querySelector('.login');
  const signup = document.querySelector('.signup');
  if (ul.endsWith('loginSignup.html')) {
    signupReg.classList.add('background');
  } else {
    loginReg.classList.add('background');
  }
  let val = 1;
  signupReg.addEventListener('click', async (e) => {
    e.preventDefault();
    if (val == 0) {
      signupReg.classList.toggle('background');
      loginReg.classList.toggle('background');
      forms.classList.toggle('form_rot');
      await setTimeout(() => {
        login.classList.toggle('d-none');
        signup.classList.toggle('d-none');
      }, 500);
      val = 1;
    }
  });
  loginReg.addEventListener('click', async (e) => {
    e.preventDefault();
    if (val == 1) {
      signupReg.classList.toggle('background');
      loginReg.classList.toggle('background');
      forms.classList.toggle('form_rot');
      await setTimeout(() => {
        signup.classList.toggle('d-none');
        login.classList.toggle('d-none');
      }, 500);
      val = 0;
    }
  });
}
async function data() {
  return await getTours();
}
const loadNav = () => {
  nav_left.innerHTML = navleft();
  if (window.localStorage.id) {
    nav_right.innerHTML = navright();
    me = document.querySelector('.me');
    me.innerHTML = window.localStorage.name;
    const photo = window.localStorage.photo;
    let source = `img/user/${photo}`;
    if (photo == 'default') {
      source = 'img/default.jpg';
    }
    document.querySelector('.user_img').src = source;
    logoutBtn = document.querySelector('.btn-logout');
  } else {
    nav_right.innerHTML = navright_withoutLogin();
  }
  btnSearch = document.querySelector('.btn-search');
  const searchBar = document.forms['searchform']['search'];
  btnSearch.addEventListener('click', (e) => {
    e.preventDefault();
    const search = searchBar.value;
    const data = tours.filter((tour) => tour.state == search);
    console.log(data.length);
    const html = data.map((data) => {
      let img, pic;
      if (data.image) {
        img = data.image.toLowerCase();
        pic = `img/tours/${img}.jpg`;
      } else {
        img = 'default';
        pic = `img/tours/${img}.webp`;
      }
      return `<div class="card-container">
            <div class="flip-card">
                <div class="card card-front">
                    <div class="card-header">
                        <div class="card-picture-overlay">&nbsp;</div>
                        <img src="${pic}" alt="image" class="card-img" />
                        <h4 class="heading">
                            <span id="title">${data.name}</span>
                        </h4>
                    </div>
                    <div class="card-body text-center">
    
                        <p class="location">${data.state}</p>
                        <hr />
                        <p >${data.duration} days trip</p>
                        <hr />
                        <p class="slots">${data.maxGroupSize} slots Available</p>
                        <hr />
                        <p class="guides">2 Guides</p>
                        <hr />
                    </div>
                </div>
    
                <div class="card card-back">
                    <p class="price">$${data.price}</p>
                    <span>
                    <span>Inclusive of</span>
                    <ul><li> Food</li>
                    <li> Stay</li>
                    </ul>
                    </span>
                    &nbsp;&nbsp;
                    <button id="tour-${data._id}"class="btn btn-book btn-success">Book</button>
                </div>
            </div>
        </div>`;
    });
    toursSection.innerHTML = html;
    searchBar.value = 'Choose State';
  });
  allTours = document.querySelector('.All-tours');
  allTours.addEventListener('click', () => {
    if (ul != '/') {
      loadPage('/');
    }
  });
};

async function imageExists(url) {
  return await new Promise((resolve) => {
    var img = new Image();
    img.addEventListener('load', () => resolve(true));
    img.addEventListener('error', () => resolve(false));
    img.src = url;
  });
}
const fun = (pic) => {
  if (imageExists(pic + '.jpg')) {
    console.log('first');
    pic = pic + '.jpg';
  } else if (imageExists(pic + '.webp')) {
    console.log('second');
    pic = pic + '.webp';
  } else {
    pic = 'img/default.webp';
  }
  console.log(pic);
};
//pre-loading
if (toursSection) {
  if (!tours) {
    tours = await data();
    tours = tours.data.tour;
    // console.log(tours);
  }
  const html = tours.map((data) => {
    let img, pic;
    if (data.image) {
      img = data.image.toLowerCase();
      pic = `img/tours/${img}.jpg`;
    } else {
      img = 'default';
      pic = `img/tours/${img}.webp`;
    }
    return `<div class="card-container">
        <div class="flip-card">
            <div class="card card-front">
                <div class="card-header">
                    <div class="card-picture-overlay">&nbsp;</div>
                    <img src="${pic}" alt="image" class="card-img" />
                    <h4 class="heading">
                        <span id="title">${data.name}</span>
                    </h4>
                </div>
                <div class="card-body text-center">

                    <p class="location">${data.state}</p>
                    <hr />
                    <p >${data.duration} days trip</p>
                    <hr />
                    <p class="slots">${data.maxGroupSize} slots Available</p>
                    <hr />
                    <p class="guides">2 Guides</p>
                    <hr />
                </div>
            </div>

            <div class="card card-back">
                <p class="price">$${data.price}</p>
                <span>
                <span>Inclusive of</span>
                <ul><li> Food</li>
                <li> Stay</li>
                </ul>
                </span>
                &nbsp;&nbsp;
                <button id="tour-${data._id}"class="btn btn-book btn-success">Book</button>
            </div>
        </div>
    </div>`;
  });
  // console.log(html);
  toursSection.innerHTML = html;
}

if (detailsForm) {
  const detailsForm = document.forms['details'];
  detailsForm['email'].value = window.localStorage.email;
  detailsForm['name'].value = window.localStorage.name;
}
/* ______________________________________Functions_______________________________ */

const submitLogin = (e) => {
  e.preventDefault();
  const email = loginForm['email'].value;
  const password = loginForm['password'].value;
  // console.log(email, password);
  if (email == null || password == null || email == '' || password == '') {
    showAlert('error', 'Please enter valid credentials');
    return;
  }
  login(email, password);
};
const submitSignup = (e) => {
  e.preventDefault();
  const name = signupForm['name'].value;
  const email = signupForm['email'].value;
  const password = signupForm['password'].value;
  const confirmPassword = signupForm['confirmPassword'].value;
  console.log(name, email, password, confirmPassword);
  if (email == null || password == null || email == '' || password == '') {
    showAlert('error', 'Please enter valid credentials');
    return;
  }
  signup(name, email, password, confirmPassword);
};

const submitSettings = (e) => {
  e.preventDefault();
  const form = new FormData();
  form.append('id', window.localStorage.id);
  form.append('name', detailsForm['name'].value);
  form.append('email', detailsForm['email'].value);
  form.append('photo', detailsForm['photo'].files[0]);
  // console.log(form.values());
  // const phoneNumber=signupForm['phoneNumber'].value;

  changeSettings(form);
};
const submitPassword = (e) => {
  e.preventDefault();
  const currentPassword = passwordForm['oldPassword'].value;
  const password = passwordForm['password'].value;
  const confirmPassword = passwordForm['confirmPassword'].value;

  console.log(currentPassword, password, confirmPassword);
  // // const phoneNumber=signupForm['phoneNumber'].value;
  // if (email == null || name == null || email == '' || name == '') {
  //     showAlert('error', 'Please enter valid credentials');
  //     return;
  // }
  changePassword(currentPassword, password, confirmPassword);
};
const processBooking = (e) => {
  e.preventDefault();
  const num = noPeople.value;
  totalPrice.innerHTML = num * tour.price;
  // const price=tours[tour].price
  // totalPrice.value=num*price;
};
const bookingDetails = async (e) => {
  e.preventDefault();
  const name = bookingForm['name'].value;
  const email = bookingForm['email'].value;
  const nop = noPeople.value;
  const price = +totalPrice.innerHTML * 100;

  if (
    name == null ||
    email == null ||
    nop == null ||
    name == '' ||
    email == '' ||
    nop == ''
  ) {
    alert('please enter name,email or number of people');
    return;
  }
  window.sessionStorage.nop = +noPeople.value;
  const body = {
    price,
    nop,
    user: window.localStorage.id,
    tour: window.sessionStorage.tourId,
  };
  console.log(body);
  const order = await Axios('POST', '/api/v1/booking/', body);
  console.log('order:', order, order.orderId);

  window.sessionStorage.order_id = order.paymentDetail.orderId;
  window.sessionStorage.price = price / 100;

  loadPage('/checkout.html', order);
};
const renderBookings = async (e) => {
  return await Axios('GET', `/api/v1/booking/${window.localStorage.id}`);
};
const renderReviews = async (e) => {
  return await Axios(
    'GET',
    `/api/v1/reviews/getAllReviewsById/${window.localStorage.id}`
  );
};
/* _____________________________________Event Listners______________________________ */
if (nav_right) {
  loadNav();
}
if (signupBtn) {
  signupBtn.addEventListener('click', submitSignup);
}
if (loginBtn) {
  loginBtn.addEventListener('click', submitLogin);
}
if (forgotLink) {
  console.log(forgotLink);
  forgotBtn.addEventListener('click', async () => {
    console.log('clicked');
    const res = await Axios('POST', `/api/v1/users/forgotPassword`, {
      email: forgotLink['email'].value,
    });
    console.log(res);
    check(res, '/loginSignup.html', res.message);
    // document.querySelector('.form_cont').classList.toggle('d-none');
    // document.querySelector('.forgot').classList.toggle('d-none');
  });
}
if (resetForm) {
  console.log(resetForm, resetBtn);
  resetBtn.addEventListener('click', async () => {
    console.log('clicked');
    const body = {
      token: resetForm['token'].value,
      password: resetForm['password'].value,
      confirmPassword: resetForm['confirmPassword'].value,
    };
    const res = await Axios('PATCH', `/api/v1/users/resetPassword`, body);
    console.log(res, 'reply');
    check(res, '/loginSignup.html', res.message);
    // document.querySelector('.form_cont').classList.toggle('d-none');
    // document.querySelector('.forgot').classList.toggle('d-none');
  });
}
if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}
if (me) {
  me.addEventListener('click', async () => {
    await getMe();
    loadPage('/mysettings.html', 0);
  });
}
if (allBookings) {
  allBookings.addEventListener('click', () => [loadPage('/bookings.html')]);
}
const display = (bookedtours) => {
  if (bookedtours.length != 0) {
    const html = bookedtours.map((data) => {
      return `<div class="flex-card">
            <div>
                <img src="img/tours/kolkata.jpg" class="city_img" alt="Hyderabad" />
            </div>
            <div class="col-lg-6 px-2">
                <h3>${data.tour.name}</h3>
                <h3>Kolkata</h3>
                <p>
                    ${data.tour.summary}
                </p>
            </div>
            <div class="flex-column">
                <button id="cancel-${data._id}"class="btn btn-danger my-4">Cancel</button>
                <button id="${data.tour._id}"class="btn btn-success my-4">See overview</button>
            </div>
        </div>`;
    });
    bookingCard.innerHTML = html;
  } else {
    bookingCard.innerHTML = '<h3> No Tours Available</h3>';
    document.querySelector('.footer').style.position = 'absolute';
  }
};
const quickFacts = (bookedtour) => {
  return `<div class="container-body text-center">
    <h3 class="body-title text-success mb-3 mt-5">Quick Facts</h3>
    <div class="flex">
        <span class="col-lg-3"><b>Next date</b></span>
        <span class="col-lg-3">28 July 2022</span>
    </div>
    <div class="flex">
        <span class="col-lg-3"><b>Difficulty</b></span>
        <span class="col-lg-3">Easy</span>
    </div>
    <div class="flex">
        <span class="col-lg-3"><b>Participants</b></span>
        <span class="col-lg-3">10 people</span>
    </div>
    <div class="flex">
        <span class="col-lg-3"><b>Rating</b></span>
        <span class="col-lg-3">5.0/5.0</span>
    </div>
    <h3 class="body-title text-success mb-3 mt-5">Tour guides</h3>
    <div class="flex">
        <i class="fab fa-facebook-f"></i>
        <span class="col-lg-3"><b>Participants</b></span>
        <span class="col-lg-3">10 people</span>
    </div>
</div>`;
};
const overviewSection = (tour) => {
  const name = tour.name;
  // console.log(name);
  // const title = name.map((data) => {
  //     return `<p class="title1">${data}</p>`;
  // });

  return ` <div class="overview_logo">
                <img src="img/tours/${tour.image.toLowerCase()}.jpg" alt=" " class="header-logo" />
            </div>
            <div class="title-div">
                <div id="title" class="mt-0 p-5">
                <p class="title1">${name}</p>
                </div>
            </div>`;
};
const tourOverview = (tour) => {
  window.localStorage.tourName = tour.name;
  return `
        <h3 class="body-title text-success mb-3">
            About ${tour.name}
        </h3>
        <p>
            ${tour.description}
        </p>
        <p>
            ${tour.summary}
        </p>`;
};
const cancelBooking = async (id) => {
  const res = await Axios('DELETE', `/api/v1/booking/${id}`);
  console.log(res);
  if (res.status == 'success') {
    const bookedtours = await renderBookings();
    display(bookedtours);
  }
};
let action;
if (bookingCard) {
  let bookedtours = await renderBookings();
  bookedtours = bookedtours.data;
  console.log(bookedtours);
  display(bookedtours);
  // console.log(bookedtours);
  bookingCard.addEventListener('click', (e) => {
    let id = e.target.id;
    if (id) {
      id = e.target.id.split('-');
      if (id[0] == 'cancel') {
        cancelBooking(id[1]);
        loadPage('/bookings.html');
      } else {
        window.sessionStorage.tourId = id[0];
        loadPage('/overview.html');
      }
      console.log(id);
    }
  });
}
if (detailsBtn) {
  detailsBtn.addEventListener('click', submitSettings);
}

if (passwordBtn) {
  const user = window.localStorage.photo;
  let photo = `img/user/${user}`;
  if (user == 'default' || user == 'undefined') {
    photo = 'img/default.jpg';
  }
  document.querySelector('.profile-img').src = photo;
  passwordBtn.addEventListener('click', submitPassword);
}

if (toursSection) {
  toursSection.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-book')) {
      const tourId = e.target.id.split('-')[1];
      window.sessionStorage.tourId = tourId;
      console.log(e.target);
      location.assign('/overview.html');
    }
    // const price = +e.target.parentNode.children[0].innerHTML.split('$')[1];
  });
}
if (bookingForm) {
  tour = await getTour(window.sessionStorage.tourId);
  tour = tour.data.data;
  console.log(tour);
  document.querySelector('.overview-section').innerHTML = overviewSection(tour);
  document.querySelector('.quick-facts').innerHTML = quickFacts(tour);
  document.querySelector('.tour-details').innerHTML = tourOverview(tour);
  document.querySelector('.booking-section').classList.remove('hidden');
  if (window.localStorage.name) {
    bookingForm['name'].value = window.localStorage.name;
    bookingForm['email'].value = window.localStorage.email;
  } else {
    bookingForm.innerHTML =
      '<h1 class="text"> Please login to book the tour</h1>';
  }
  noPeople.addEventListener('keyup', processBooking);
  book.addEventListener('click', bookingDetails);
}
const filter = (state) => {
  const dis = tours.filter((data) => {
    let st = data.state;
    if (st == state) {
      return true;
    }
    return false;
  });
  return dis;
};
if (tours) {
  console.log(filter('Tamil Nadu'));
}
if (reviews) {
  let reviewed = await renderReviews();
  console.log('reviews', reviewed);
  if (reviewed.length != 0) {
    console.log(reviewed);
    reviewed = reviewed.data.reviews;
    console.log(reviewed);
    const html = reviewed.map((data) => {
      const name = data.tourId.name;
      return `<div class="flex-card">
            <div class="flex flex-start">
                <img src="img/tours/${name}.jpg" class="city_img" height="200px"  width="200px" alt="${name}" />
            </div>
            <div class="col-lg-6 px-2">
                <h3>${name}, ${data.tourId.state}</h3>
                <p>
                    ${data.review}
                </p>
            </div>
        </div>`;
    });
    reviewed.innerHTML = html;
  } else {
    // reviews.innerHTML = '<h3> No Reviews Available</h3>';
    // document.querySelector('.footer').style.position = 'absolute';
  }
}
const contact = document.querySelector('#contactUs');

if (contact) {
  contact.addEventListener('click', () => {
    scroll(contact.id);
  });
}

//scroll button
let mybutton = document.getElementById('btn-back-to-top');

if (mybutton) {
  window.onscroll = function () {
    scrollFunction();
  };

  function scrollFunction() {
    if (
      document.body.scrollTop > 20 ||
      document.documentElement.scrollTop > 20
    ) {
      mybutton.style.display = 'block';
    } else {
      mybutton.style.display = 'none';
    }
  }
  mybutton.addEventListener('click', backToTop);

  function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }
}
