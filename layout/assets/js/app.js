'use strict'
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

let searchBtn, searchInner;
let burger, navLinks;
let home, services, about, gotquestion, portfolio, portfolio_mob, development, allActivelinks;
let loader;

let mainPrice = 0;
let days = 0;
let choices = [];
getPrice(choices);

let steps = 0;
let multipleSteps = [0, 1, 2];
let cardActive;

let nextBTn;
let form;
let questForm;
let smtpForm;

let errors = 1;
window.onload = () => {
    loader = document.querySelector('.loader');
    load(loader)

    cardActive = document.querySelectorAll('.calc-card');
    cardActive.forEach((element, id) => {
        element.setAttribute('data-id', id)
    });

    home = document.querySelector('#home');
    services = document.querySelector('#services');
    about = document.querySelector('#about');
    portfolio = document.querySelector('#portfolio-web');
    portfolio_mob = document.querySelector('#portfolio-mobile');
    development = document.querySelector('#development');

    burger = document.querySelector('.burger');
    burger.addEventListener('click', function () {
        navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('show');
        this.classList.toggle('burger-click');
        this.classList.toggle('burger-unclick');

    });

    let mySlider = document.querySelector('#slider');
    let slider_mini = document.querySelector('#slider-mini');
    slider(mySlider);
    slider(slider_mini)
    nextBTn = document.querySelector('.next-btn');

    nextBTn ?.addEventListener('click', activateSteps);
    chooseTech();

    form = document.querySelector('#mainform');
    const focusedElements = [...form.elements]
    formValidation(focusedElements)
    saveFormData(form);

    questForm = document.querySelector('#quest');
    const questElements = [...questForm.elements]
    formValidation(questElements)
    saveFormData(questForm);

    smtpForm = document.querySelector('#stQuest');
    const smtpElements = [...questForm.elements]
    formValidation(smtpElements)
    saveFormData(smtpForm);
}

window.addEventListener('scroll', function () {
    let id;
    allActivelinks = document.querySelectorAll('header .active');
    allActivelinks.forEach(function (el) {
        el.classList.remove('active');
    });
    if (development?.offsetTop <= window.pageYOffset) {
        id = development?.getAttribute('id');
        document.querySelector(`[href="#${id}"]`).classList.add('active');
    } else if (portfolio_mob?.offsetTop <= window.pageYOffset) {
        id = portfolio_mob?.getAttribute('id');
        document.querySelector(`[href="#${id}"]`).classList.add('active');
    } else if (portfolio?.offsetTop <= window.pageYOffset) {
        id = portfolio?.getAttribute('id');
        document.querySelector(`[href="#${id}"]`).classList.add('active');
    } else if (about?.offsetTop <= window.pageYOffset) {
        id = about?.getAttribute('id');
        document.querySelector(`[href="#${id}"]`).classList.add('active');
    } else if (home?.offsetTop <= window.pageYOffset) {
        id = home?.getAttribute('id');
        document.querySelector(`[href="#${id}"]`).classList.add('active');
    }

});


function slider(mySlider) {

    if (mySlider == null)
        return;

    let slides = [...mySlider.children];

    let slideWrapper = document.createElement('div');
    slideWrapper.classList.add('slider-wrapper');
    mySlider.appendChild(slideWrapper);

    slideWrapper.style.left = `0px`;

    let thumbnail = document.createElement('ul');
    thumbnail.classList.add('thumbnail');
    mySlider.appendChild(thumbnail);



    slides.forEach((e, i) => {
        let slide = e.cloneNode(true);
        slideWrapper.appendChild(slide)
        e.parentElement.removeChild(e)
        let thumbnailItem = document.createElement('li');
        thumbnail.appendChild(thumbnailItem);

        thumbnailItem.addEventListener('click', function (e) {
            slideWrapper.style.left = `-${100 * i}%`;

        });
    });
}

function chooseTech() {

    cardActive.forEach((element) => {

        element.addEventListener('click', function () {

            if (multipleSteps.includes(steps)) {
                document.querySelector('.step .active') ?.classList.remove('active');
            }
            element.classList.toggle('active');
            nextBTn.removeAttribute('disabled')
        })
    });

}

function activateSteps(e) {
    steps++;
    console.log(steps)
    let active_step = document.querySelector('.active-step');
    if (active_step === null) {
        return;
    }
    if (active_step.nextElementSibling.classList.contains('step')) {
        active_step.querySelectorAll('.active').forEach(element => {
            choices.filter(s => s.id == element.getAttribute('data-id')).forEach(element => {
                mainPrice += element.price;
                days+= element.time;
                console.log(days)
            })

        });
        active_step.classList.remove('active-step');
        active_step.nextElementSibling.classList.add('active-step');


    } else {
        active_step.classList.remove('active-step')
        document.querySelector('.cost-reveal').classList.add('active-step');

        document.querySelector('.cost-t').innerHTML = mainPrice;
        document.querySelector('.time-t').innerHTML = days;
        e.currentTarget.style.display = 'none';

    }

    e.currentTarget.setAttribute('disabled', true)


}

function getPrice(choices) {
    fetch('db.json')
        .then(res => res.json())
        .then(function (res) {
            res.forEach(element => {
                choices.push(element);
            });
        })
}

function load(loader) {
    setTimeout(() => {
        loader.classList.add('fade');
        loader.querySelector('span').style.animationPlayState = 'paused';

    }, 1000);
    setTimeout(() => {
        loader.style.display = "none";
    }, 2000);
}

function formValidation(focusedElements) {

    for (let elm of focusedElements) {
        elm.addEventListener("focus", function () {
            this.classList.add("focused")
        })

        elm.addEventListener("blur", function () {
            this.classList.remove("focused")

        })

        if (elm.tagName === "INPUT") {

            elm.addEventListener("input", function () {
                if (elm.name === "name") {

                    if (elm.value.length <= 3) {
                        elm.classList.add('error')
                        errors++
                        console.log(errors)
                    } else {
                        elm.classList.remove('error')
                        errors = 0;
                        console.log(errors)
                    }
                }
                if (elm.name === "email") {
                    console.log()
                    if (elm.value.length <= 0 || !EMAIL_REGEX.test(elm.value)) {
                        elm.classList.add('error');
                        errors++
                        console.log(errors)
                    } else {
                        elm.classList.remove('error')
                        errors = 0;
                        console.log(errors)
                    }
                }
            })
        }

    }


}

function saveFormData(form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const data = new FormData(e.target);
        if (errors === 0) {
            let b = JSON.stringify(Object.fromEntries(data))
            localStorage.setItem('formdata', b)
        }
    })
}

function nullable(param){
    if (param==null) {
        return;
    }
}