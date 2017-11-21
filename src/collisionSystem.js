/**
 * A collision system simulator
 * 
 * Copyright (c) 2017 ifndefined.com - A project by Qi Zhang
 */

(function ( root, window, document, factory, undefined ) {

    if (false) {

    } else {
        // Browser globals
        window.collisionSystem = factory(window, document);
    }

} (this, window, document, function(window, document, undefined) {
    'use strict';

    var collisionSystem;

    // constants

    // globals
    var options;
    var originals;
    var canvas;
    var ctx;

    var balls;

    function initialize(element, customOptions) {

        // default options
        var defaults = {
            // parameters
            fullScreen: false,

            // ball settings
            ballCount: 10,
            ballRadius: 10,
            ballRandomRadius: false,
            dt: 5,

            // events
            afterResize: null,

        }

        options = extend(defaults, customOptions);
        originals = clone(options) // deep copy

        canvas = element;
        ctx = canvas.getContext('2d');

        init(afterDomReady);
    }

    function init(callback) {

        callback();
    }

    //Define the ball
    function Ball(rx = 0, ry = 0, vx = 0, vy = 0, r = 0) {
        this.r = (!isNumeric(r) || r <= 0) ? 10 : r;
        this.rx = (!isNumeric(rx) || rx <= 0) ? getRandomArbitrary(20, canvas.width - r) : rx;
        this.ry = (!isNumeric(ry) || ry <= 0) ? getRandomArbitrary(20, canvas.height - r) : ry;
        this.vx = (!isNumeric(vx) || vx <= 0) ? Math.random() * 5 : vx;
        this.vy = (!isNumeric(vy) || vy <= 0) ? Math.random() * 5 : vy;
        
        this.draw = function(ctx) {
            ctx.beginPath();
            ctx.arc(this.rx, this.ry, this.r, 0, Math.PI*2, true);
            ctx.fill();
        }

        this.move = function(dt) {
            if ((this.rx + this.vx * dt < this.r) || (this.rx + this.vx * dt > canvas.width - this.r)) {
                this.vx = -1 * this.vx;
            }
            if ((this.ry + this.vy * dt < this.r) || (this.ry + this.vy * dt > canvas.height - this.r)) {
                this.vy = -1 * this.vy;
            }
            this.rx += this.vx * dt;
            this.ry += this.vy * dt;
        }
    }

    function createBalls() {
        var ballsArray = [];
        for (var i = 0; i < options.ballCount; ++i) {
            ballsArray[i] = new Ball();
        }

        return ballsArray;
    }

    function bouncing() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < balls.length; ++i) {
            balls[i].draw(ctx);
            balls[i].move(options.dt);
        }
        requestAnimationFrame(bouncing);
    }
    
    // event functions
    function afterDomReady() {
        if (options.fullScreen) {
            addResizeHandler();
            resizeCanvas();
        }
        balls = createBalls();
        requestAnimationFrame(bouncing);
    }

    function addResizeHandler() {
        addHandler(window, resizeHandler, 'resize', 'onresize');
    }

    function resizeHandler() {
        resizeCanvas();
    }

    function addHandler(element, method, normal, oldIE, firefox) {
        if (element.addEventListener) {
            element.addEventListener(normal, method, false); //IE9, Chrome, Safari, Oper

            if (typeof firefox !== 'undefined') {
                element.addEventListener(firefox, method, false); //Firefox
            }
        } else {
            element.attachEvent(oldIE, method);  //IE 6/7/8
        }
    }

    // helper functions
    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function clone(obj) {
        if (null === obj || 'object' !== typeof obj){
            return obj;
        }
        var copy = obj.constructor();

        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)){
                copy[attr] = obj[attr];
            }
        }
        return copy;
    }

    function extend(defaultOptions, customOptions) {
        if ('object' !== typeof customOptions) {
            customOptions = {};
        }

        for (var key in customOptions) {
            if (defaultOptions.hasOwnProperty(key)) {
                defaultOptions[key] = customOptions[key];
            }
        }

        return defaultOptions;
    }

    function getWindowWidth(){
        return  'innerWidth' in window ? window.innerWidth : document.documentElement.offsetWidth;
    }

    function getWindowHeight(){
        return  'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
    }

    function resizeCanvas() {
        canvas.width = getWindowWidth();
            // window.innerWidth 
            // || document.documentElement.clientWidth 
            // || document.body.clientWidth;
        canvas.height = getWindowHeight();
            // window.innerHeight 
            // || document.documentElement.clientHeight 
            // || document.body.clientHeight;

        clearCanvas();
    }

    function clearCanvas() {
        var grd = ctx.createLinearGradient(0,0,0,canvas.height);
        grd.addColorStop(0,"#6666ff");
        grd.addColorStop(1,"#aaaacc");

        ctx.fillStyle = grd;
        ctx.fillRect(  0, 0, canvas.width, canvas.height );
    }

    collisionSystem = {
        init: initialize,
    };

    return collisionSystem;
}));