let $time = document.getElementById('time');
let $dots = document.getElementById('dots');
let $houts = document.getElementById('hours');
let $minutes = document.getElementById('minutes');
let $day = document.getElementById('day');
let $mount = document.getElementById('mount');
let $data = document.getElementById('dates');

let $weatherIcon = document.getElementById('weather-icon');

let $city = document.getElementById('city');
let $userCity = document.getElementById('userCity');

let $forcast = document.getElementById('forcast');

let $temperature = document.getElementById('temperature');
let $high = document.getElementById('high');
let $low = document.getElementById('low');
let $feels = document.getElementById('feels');

let $btnAll = document.getElementById('icon-w');

let $weatherDetal = document.getElementById('weather-detal');
let $weatherDisplay = document.getElementById('weather-display');

let days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'];
let monts = ['Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень', 'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'];
// ----Класс  для виводу календарних даних
class Time {
    constructor(todey) {
        this.day = todey.getDay()
        this.month = todey.getMonth()
        this.date = todey.getDate()
        this.hours = todey.getHours()
        this.minutes = todey.getMinutes()
        this.sec = todey.getSeconds()
    }
    nullCreate(obj) {//метод додавання 0
        if (obj < 10) { return `0${obj}` }
        else { return obj }
    }
    show() { // вивід календарних даних
        $dots.classList.toggle('dots')
        $houts.textContent = this.nullCreate(this.hours)
        $minutes.textContent = this.nullCreate(this.minutes)
        $day.textContent = days[this.day]
        $mount.textContent = monts[this.month]
        $data.textContent = this.nullCreate(this.date)
        return this.sec
    }
}
// ----Класс для виводу погоди у вінджет-----
class Weather {
    constructor(weather_data) {
        this.temp = Math.round(weather_data.main.temp) //температура
        this.temp_max = Math.round(weather_data.main.temp_max) //макс температура
        this.temp_min = Math.round(weather_data.main.temp_min) //мін температура
        this.feels = Math.round(weather_data.main.feels_like) //відчуваюча температура
        this.descript = weather_data.weather[0].description //стан погоди
        this.img_src = weather_data.weather[0].icon  //ісонка погоди
        this.time_rise = weather_data.sys.sunrise  //захід сонця
        this.time_set = weather_data.sys.sunset //схід сонця
        this.humidity = weather_data.main.humidity //влажність
        this.pressure = weather_data.main.pressure // тиск
        this.spedWind = weather_data.wind.speed // швидкість вітру
        this.degWind = weather_data.wind.deg // Направлення вітру
        this.clouds = weather_data.clouds.all // хмарність
        this.visib = weather_data.visibility // Видимість
    }
    windDirect(direct) {//метод виводимо направлення вітру в буквах 
        let val = Math.floor((direct / 45) + 0.5);
        let directWind = ['Пн', 'Пн-С', 'Схід', 'Пд-С', 'Пд', 'Пд-З', 'Зах', 'Пн-З'];
        return directWind[val % 8];
    }
    timeConvector(milisec) { // метод конвертуємо з милисек в час, хв.сек
        const hours = `0${new Date(milisec * 1000).getHours()}`.slice(-2);
        const minutes = `0${new Date(milisec * 1000).getMinutes()}`.slice(-2);
        const seconds = `0${new Date(milisec * 1000).getSeconds()}`.slice(-2);
        let time = `${hours}:${minutes}:${seconds}`
        return time;
    }
    createInfo(text, obj, icon, set) { //метод виводу додаткової інформації в список
        let li = document.createElement('LI');
        let span = document.createElement('SPAN');
        span.textContent = obj;
        li.textContent = text;
        span.append(icon);
        li.append(span);
        set.append(li);
    }
    show_Weather() { //метод виведення погоди
        $temperature.textContent = this.temp
        $high.textContent = this.temp_max
        $low.textContent = this.temp_min
        $feels.textContent = this.feels
        $forcast.textContent = this.descript
        // -----------------------------
        let div = document.createElement('DIV');
        $weatherDetal.append(div);
        let img = document.createElement('IMG')
        let img_dod = document.createElement('IMG')
        let src = `http://openweathermap.org/img/wn/${this.img_src}@2x.png`;
        img.src = src;
        img_dod.src = src;
        div.append(img_dod)
        div.style.background = "#999"
        div.style.borderRadius = "50%"
        div.style.border = "3px solid #1E90FF"
        $weatherIcon.append(img)
        // ----------------------------
        let i = document.createElement('I');
        i.classList.add('fas', 'fa-arrow-circle-down');
        i.style.transform = `rotate(${this.degWind}deg)`
        // ----------------------------
        let ul = document.createElement('UL');
        this.createInfo(`Схід сонця:  `, `${this.timeConvector(this.time_rise)}`, '', ul)
        this.createInfo(`Захід сонця:  `, ` ${this.timeConvector(this.time_set)}`, '', ul)
        this.createInfo(`Влажність:  `, `${this.humidity} % `, '', ul)
        this.createInfo(`Хмарність:  `, ` ${this.clouds} %`, '', ul)
        this.createInfo(`Тиск:  `, `${Math.round(this.pressure * 0.75)} мм.рт.ст `, '', ul)
        this.createInfo(`Швидкість вітру:  `, `${(this.spedWind).toFixed(1)} м/с`, '', ul)
        this.createInfo(`Напрям вітру:  `, ` ${this.windDirect(this.degWind)} `, i, ul)
        this.createInfo(`Видимість:  `, `${(this.visib / 1000).toFixed(1)} км`, '', ul)
        $weatherDetal.prepend(ul);
        // ----------------------------

        // ----------------------------
    }
}
// --------Взяття даних із API--------------------
async function load_weather(city_name = 'Рівне') {
    $city.textContent = city_name;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=67c0943dd192282f796a8f4803af40f9&lang=ua&units=metric`
    try {
        const response = await fetch(url)
        const data = await response.json()
        console.log(data)
        if (data.cod != 200) { alert(data.message); }
        else {
            let weather_now = new Weather(data)
            weather_now.show_Weather();
        }
    }
    catch (err) {
        console.log(err)
    }
}
// ------------------------------
function load_time() {
    setInterval(() => {
        let time = new Time(new Date())
        time.show()
    }, 1000)
}
load_time();
load_weather();
// ----Вводимо назву міста-------------------
$userCity.addEventListener('change', function () {
    let imgView = document.querySelector('#weather-icon img')
    if (imgView) {
        imgView.remove();
    }
    $weatherDetal.innerHTML = '';
    load_weather(this.value)
})
// -------Виводимо детальніше інформацію-----
$btnAll.addEventListener('click', function () {
    this.classList.toggle('tansf-icon');
    $weatherDisplay.classList.toggle('weather-display');
    $weatherDisplay.style.transition = 'higth 0.5s'
})
// ---------------------------------------

