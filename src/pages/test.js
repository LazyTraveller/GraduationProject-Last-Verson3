import { async } from "q";
import { func } from "prop-types";

function People() {
    this.type = 'people';
}
People.prototype.eat = function () {
    console.warn("chi dongxi");
}

function Man(name) {
    People.call(this);
}

// 寄生组合继承
Man.prototype = Object.create(People.prototype, { 
    constructor: {
        value: Man,
    }
})




function People() {
    this.type = 'people';
}

People.prototype.eat = function () {
    console.warn('chi')
}

function Man(name) {
    People.call(this);//构造函数继续
    this.color = 'red';
    this.name = name;
}

//原型继承
Man.prototype = new People();
//两者结合就是组合继承

// 寄生组合继承
Man.prototype = Object.create(People.prototype, {
    constructor: {
        value: Man
    }
})

// 基于promise的Ajax封装
function ajax(url, method = 'get', param = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const paramString = getStringParam(param);
        if (method === 'get' && paramString) {
            url.indexOf('?') > -1 ? url += paramString: url+=`?${paramString}`;
        }
        xhr.open(method, url);
        xhr.onload = function () {
            const result = {
                status: xhr.status,
                statusText: xhr.statusText,
                header: xhr.getAllResponseHeaders(),
                data: xhr.response || xhr.responseText
            }
            if ((xhr.statusText >= 200 && xhr.status < 300) || xhr.status == 304) {
                resolve(result);
            } else {
                reject(result);
            }
        }
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.withCredentials = true;
        xhr.onerror = function () {
            reject(new TypeError('请求出错'));
        }
        xhr.timeout = function () {
            reject(new TypeError('请求超时'));
        }
        xhr.onabort = function () {
            reject(new TypeError('请求终止'));
        }
        if (method === 'post') {
            xhr.send(paramString);
        } else {
            xhr.send();
        }
    })
}

function getStringParam(param) {
    let dataString = '';
    for (const key in param) {
        dataString += `${key}=${param[key]}&`
    }
    return dataString;
}


var sleep = function (time, i) {
    return new Promise(function (resolve, reject){
        setTimeout(function () {
            resolve();
        },time)
    })
};

var start  = async function () {
    for(let i = 0; i < 6; i++) {
        let result = await sleep(1000, i);
        console.warn(result);
    }
}

start();


var sleep = function (time, i) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(i)
        }, time)
    })
}

var start =async function () {
    for (let i = 0; i < 6; i++) {
        let result = await sleep(1000, i)
        console.warn(result)
    }
}

function printListFromTailToHead(head) {
    const array = [];
    while(head) {
        array.unshift(head.val);
        head = head.next;
    }
    return array;
}



function FirstNotRespeatingChar(str) {
    for (var i = i; i < str.length; i++) {
        if (str.indexOf(str[i]) == str.lastIndexOf(str[i])) {
            return i;
        }
    }
    return -1;
}

function reorderArray(array) {
    if (Array.isArray(array)) {
        let start = 0;
        let end = array.length - 1;
        while (start < end) {
            while (array[start] % 2 === 1) {
                start++;//头遍历指针
            }
            while (array[end] % 2 === 0) {
                end --;// 尾遍历指针
            }
            if (start < end) {
                [array[start], array[end]] = [array[end], array[start]]//交换
            }
        }
    }
    return array;
}



// 浅拷贝
function clone(target) {
    let cloneTarget = {};
    for (const key in target) {
        cloneTarget[key] = target[key];
    }
    return cloneTarget;
}

//深拷贝
function clone(target) {
    if (typeof target === 'object') {
        let cloneTarget = {};
        for (const key in target) {
            cloneTarget[key] = clone(target[key]);
        }
        return cloneTarget;
    } else {
        return target;
    }
}

// Object {}  NaN  '[object object]'



a == 1 && a == 3 && a ==3;
 const a = {
     value: [1, 2, 3],
     valueOf: function () {
         return this.value.pop()
     }
 }


//typeof //使用引用类型  number, string, undefined, boolean, symbol
//instanceof  //适用与应用类型  RegExp, Array, Data, Object, function

_proto_ //隐式原型
prototype //显式原型

Object.prototype.toString.call(true)//boolean
Object.prototype.toString.call(123)//number
Object.prototype.toString.call("Jerry")//string 
Object.prototype.toString.call(null) //null
Object.prototype.toString.call(undefined)// undefined
Object.prototype.toString.call(Symbol()) //symbol
Object.prototype.toString.call({}) // Object
Object.prototype.toString.call(function() {}) //function
Object.prototype.toString.call([]) //Arrar
Object.prototype.toString.call(new Error()) //Error
Object.prototype.toString.call(new RegExp()) //RegExp
Object.prototype.toString.call(Math) // Math
Object.prototype.toString.call(JSON) // JSON
Object.prototype.toString.call(new document) //RegExp
Object.prototype.toString.call(window) // Global call来改变this的指向

//深拷贝
JSON.parse(JSON.stringify());

function clone(target) {
    if (typeof target === "object") {
        let cloneTarget = Array.isArray(target) ? [] : {};
        for (const key in target) {
            cloneTarget[key] = clone(target[key]);
        }
        return cloneTarget;
    } else {
        return target;
    }
}





JSON.parse(JSON.stringify())

function clone(target) {
    if (Object.prototype.toString.call(target) === "object") {
        let cloneTarget = Array.isArray(target) ? [] : {};
        for (let key in target) {
            cloneTarget[key] = clone(target[key]);
        }
        return cloneTarget;
    } else {
        return target;
    }
}


//三种情况避免使用箭头函数
//1.使用箭头函数定义的方法
let foo = {
    value: 1,
    getValue: () => console.log(this.value)
}
foo.getValue(); //undefined

function Foo() {
    this.value = 1
}

// 2.定义原型的方法
Foo.prototype.getValue = () => console.log(this.value)
let foo = new Foo();
foo.getValue(); // undefined

// 3.作为事件的回调函数
const button = document.getElementById('myButton');
button.addEventListener('click', () => {
    console.log(this === window);
    this.innerHTML = "Clicked button";
});



const string = Symbol("demo");
console.log(string);


const TYPE_AUDIO = Symbol();
const TYPE_VIDEO = Symbol();
const TYPE_IMAGE = Symbol();

function handleFileResource(resource) {
    switch(resource.type) {
        case TYPE_AUDIO:
            playAudio(resource);
            break;
        case TYPE_IMAGE:
            playImage(resource);
            break;
        case TYPE_VIDEO:
            playVideo(resource);
            break;
        default: 
          throw new Error("Unkown type of resource")
    }
}

    

    <human salary="20000" girlfriend="null" type="developer" />