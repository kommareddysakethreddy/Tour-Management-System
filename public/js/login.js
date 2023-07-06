// import Email from '../../utils/Email.js';
import { showAlert } from './alert.js';
export const loadPage = (loc, time = 1500) => {
  window.setTimeout(() => {
    location.assign(loc);
  }, time);
};
export const check = (res, loc, message) => {
  if (res.status == 'success') {
    showAlert('success', message);
    if (loc != null) loadPage(loc);
  } else {
    showAlert('error', res.message);
  }
};
export const Axios = async (method, url, data = '') => {
  let response;
  if (method == 'POST' || method == 'PATCH') {
    response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(data),
    });
  } else {
    response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
    });
  }
  const res = await response.json();
  return res;
};

//Functions for query
export const login = async (email, password) => {
  const body = { email, password };
  const res = await Axios('POST', '/api/v1/users/login', body);
  window.localStorage.id = res.data.user._id;
  window.localStorage.name = res.data.user.name;
  window.localStorage.email = res.data.user.email;
  console.log(res.data.user.photo);
  window.localStorage.photo = res.data.user.photo;
  console.log(res);
  // await new Email(res.data.user).sendWelcome();
  check(res, '/', 'Login Successful');
};
export const signup = async (name, email, password, confirmPassword) => {
  const body = {
    name,
    email,
    password,
    confirmPassword,
  };
  const res = await Axios('POST', '/api/v1/users/signup', body);
  window.localStorage.id = res.data.user._id;
  window.localStorage.name = res.data.user.name;
  window.localStorage.email = res.data.user.email;
  check(res, '/', 'SignUp Successful');
};

export const logout = async () => {
  localStorage.removeItem('id');
  localStorage.removeItem('name');
  localStorage.removeItem('email');
  const res = await Axios('GET', '/api/v1/users/logout');
  check(res, 'loginSignup.html', 'Logout Successful');
};
export const navleft = () => {
  // return `<div class="logodiv">
  //             <img src="img/VEHERE.png" height="20px" alt="Logo-Img" class="logo_img profile-bg" />
  //         </div>`;
  // <input class="form-control srch mr-sm-2 w-65" name="search" type="search" placeholder="Search" aria-label="Search" />
  return `<form class="flex-search" name="searchform">
    <select id="state"  name="search" class="srch form-control w-60">
                      <option selected="">Choose State</option>
                      <option>Andhra Pradesh</option>
                      <option>Arunachal Pradesh</option>
                      <option>Assam</option>
                      <option>Bihar</option>
                      <option>Chattisgarh</option>
                      <option>Goa</option>
                      <option>Gujarat</option>
                      <option>Haryana</option>
                      <option>Himachal Pradesh</option>
                      <option>Jammu and Kashmir</option>
                      <option>Jharkhand</option>
                      <option>Karnataka</option>
                      <option>Kerala</option>
                      <option>Madhya Pradesh</option>
                      <option>Maharashtra</option>
                      <option>Manipur</option>
                      <option>Meghalaya</option>
                      <option>Mizoram</option>
                      <option>Nagaland</option>
                      <option>Odisha</option>
                      <option>Punjab</option>
                      <option>Rajasthan</option>
                      <option>Sikkim</option>
                      <option>Tamil Nadu</option>
                      <option>Telangana</option>
                      <option>Tripura</option>
                      <option>Uttar Pradesh</option>
                      <option>Uttarakhand</option>
                      <option>West Bengal</option>
                    </select>
    <button class="btn btn-search btn-outline-success my-2 my-sm-0" type="submit">
  Search
</button>
</form>`;
};
export const navright = () => {
  return `<div class="userdiv">
    <img src="img/default.jpg" height="20px" alt="Logo-Img" class="user_img profile-bg" />
        </div>
        <button class="me btn text-white ps-4 pe-4" type="button" aria-expanded="false">
        Sam
        </button>
        <button class="btn text-white px-4 All-tours" type="button" aria-expanded="false">Tours</button>
    <button class="btn btn-logout text-white ps-4 pe-4" type="button" aria-expanded="false">
    Logout
    </button>
>`;
};
export const navright_withoutLogin = () => {
  // document.querySelector('.contactUs').classList.remove('hidden');
  return `<span>
    <button class="btn px-4 text-white All-tours">
                <a><h4>Tours</h4></a>
            </button>
            </span>
            <span
            ><button class="btn px-4 text-white">
                <a href="/loginSignup.html"><h4>Login</h4></a>
            </button></span
            >
            <span
            ><button class="btn px-4 text-white">
                <a href="signup.html"><h4>Signup</h4></a>
            </button>
            <button class="btn px-4 text-white">
                <h4 id="contactUs">Contact Us</h4>
            </button>
           </span>`;
};
export const getReviews = async () => {
  const rev = await Axios('GET', `/api/v1/reviews/getAllReviews/`);

  console.log('html');
  return rev;
};

export const getMe = async () => {
  const id = window.localStorage.id;
  const res = await Axios('GET', `/api/v1/users/${id}`);
  window.localStorage.name = res.data.data.name;
  window.localStorage.email = res.data.data.email;
};

export const changeSettings = async (body) => {
  const res = await fetch('api/v1/users/updateMe', {
    method: 'PATCH',
    body: body,
  });
  console.log(res, res.status);
  if (res.status == 200) {
    window.localStorage.name = body.get('name');
    window.localStorage.email = body.get('email');
    showAlert('success', 'Settings Updated Successfully');
    loadPage('/mysettings.html');
  }
};

export const changePassword = async (
  currentPassword,
  password,
  confirmPassword
) => {
  const body = {
    id: window.localStorage.id,
    currentPassword,
    password,
    confirmPassword,
  };
  const res = await Axios('PATCH', 'api/v1/users/updateMyPassword', body);
  console.log(res);
  check(res, '/mysettings.html', 'Password Updated Successfully');
};

export const getTours = async () => {
  return await Axios('GET', 'api/v1/tours/getAllTours');
};

export const tourTemplate = () => {
  return `<div class="card-container">
    <div class="flip-card">
        <div class="card card-front">
            <div class="card-header">
                <div class="card-picture-overlay">&nbsp;</div>
                <img src="public/img/tours/image.jpg" alt="image" class="card-img" />
                <h4 class="heading">
                    <span id="title">The Park</span>
                </h4>
            </div>
            <div class="card-body text-center">
                <p class="location">Location</p>
                <hr />
                <p class="slots">Max Available slots</p>
                <hr />
                <p class="guides">Guide 1</p>
                <hr />
            </div>
        </div>
        <div class="card card-back">
            <p class="price">$50</p>
            &nbsp;&nbsp;
            <button class="btn btn-book btn-success">Book</button>
        </div>
    </div>
</div>`;
};
export const getTour = async (id) => {
  const res = await Axios('GET', `api/v1/tours/${id}`);
  localStorage.removeItem('tourId');
  return res;
};
export const bookTour = async (tour, user, email, nop, price) => {
  //name,email,nop,price
  const body = {
    tour,
    user,
    email,
    nop,
    price,
  };
  const res = await Axios('POST', 'api/v1/booking', body);
};
export const checkOut = async () => {};

export function scroll(elementId) {
  var ele = document.querySelector(`.${elementId}`);
  // console.log(ele);
  window.scrollTo(ele.offsetLeft, ele.offsetTop);
}
