'use strict';
// import 'click';
const imageDiv = document.querySelector('.logodiv');
const logoImage = document.querySelector('.logo_img');
const userDiv = document.querySelector('.userdiv');
const userImage = document.querySelector('.user_img');

const container = document.querySelector('.container');
const closeModal = document.querySelector('.close');
const sendMail = document.querySelector('.sendMail');
const next = document.querySelector('.next');
const forms = document.querySelectorAll('form');
// document.get
const openImage = function(url) {
    window.open(url);
};

/*________________________________functions_____________________________________________*/

const fetchMailData = (e) => {
    let username, email, subject, emailbody;
    username = email = subject = null;
    username = document.forms['mail']['name'].value;
    email = document.forms['mail']['email'].value;
    subject = document.forms['mail']['subject'].value;
    emailbody = document.getElementById('emailbody').value;

    console.log(username, email, subject);
    if (
        username == null ||
        email == null ||
        subject == null ||
        username == '' ||
        email == '' ||
        subject == '' ||
        emailbody == '' ||
        emailbody == null
    ) {
        alert('Please enter name,email, subject, emailbody');
    } else {
        const body = {
            username,
            email,
            subject,
            body,
        };
        console.log(body);
    }
};
if (forms) {
    console.log(forms);
    let question = 0;
    let ans = [];
    let des = ['name', 'gender', 'age', 'city', 'money'];
    const len = forms.length;
    const fetchCheckBox = (name) => {
        var checkboxes = document.getElementsByName(name);
        var result = '';
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                result += checkboxes[i].value + ' ';
            }
        }
        if (result == '' || result == null) {
            return 0;
        }
        ans.push(result);
        return 1;
    };
    const fetch = (no) => {
        const val = forms[no][des[no]].value;
        if (!val) {
            return fetchCheckBox(des[no]);
        } else {
            ans.push(val);
            return 1;
        }
    };
    const Toggle = (e) => {
        const val = fetch(question);
        if (val == 1) {
            if (question < len - 1) {
                forms[question].classList.toggle('hidden');
                question++;
                forms[question].classList.toggle('hidden');
                if (question == len - 1) {
                    next.innerHTML = 'Submit';
                }
            } else {
                next.removeEventListener('click', Toggle);
                alert('Thanks for submitting the form');
                fetch(question);
                // console.log(ans);
            }
            return 1;
        }
        alert('Value is required');
    };
    if (next) {
        next.addEventListener('click', Toggle);
    }
}
/*____________________________________Event Listners______________________________ */
if (imageDiv) {
    imageDiv.addEventListener('click', () => {
        window.open(logoImage.src);
    });
}
if (userDiv) {
    userDiv.addEventListener('click', () => {
        window.open(userImage.src);
    });
}
if (closeModal) {
    closeModal.addEventListener('click', () => {
        // console.log(prompt);
        if (confirm('confirm to exit')) {
            console.log('first');
        }
    });
}
if (sendMail) {
    sendMail.addEventListener('click', fetchMailData);
}

const slide = document.querySelector('.carousel');
if (slide) {
    const next = document.querySelector('.carousel-control-next');
    const prev = document.querySelector('.carousel-control-prev');
    const items = document.querySelectorAll('.carousel-item');
    const len = items.length;
    let i = 0;
    next.addEventListener('click', () => {
        items[i].classList.toggle('active');
        i = (i + 1) % len;
        items[i].classList.toggle('active');
    });
    prev.addEventListener('click', () => {
        items[i].classList.toggle('active');
        i = i - 1;
        if (i < 0) {
            i = len - 1;
        }
        items[i].classList.toggle('active');
    });
}