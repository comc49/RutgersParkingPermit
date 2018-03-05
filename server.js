const express = require('express');
const url = require('url');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');
const http = require('http');
const moment = require('moment');
const WebSocket = require('ws');
var cors = require('cors')
var path = require('path')
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var puppeteerRunning = false;

const result = dotenv.config()

if (result.error) {
  throw result.error
}
const app = express();
let browser = null 

app.use(cors());
app.use(serveStatic(path.join(__dirname + "/dist")));
app.use(bodyParser.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = process.env.PORT || 5000;

let webSocket = null;
wss.on('connection', function connection(ws, req) {
  webSocket = ws;
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send('something');
  });
  ws.on('error', function incoming(error) {
      console.log('webSocket Error!!',error)
  })
});

server.listen(port, function() {
    console.log('Listening on %d', server.address().port);
})
server.timeout = 120000;

const interval = setInterval(function ping() {
    wss.clients.forEach(function each(ws) {
      if (ws.isAlive === false) {
          console.log("IS GOING TO TERMINATE WS!")
          return ws.terminate();
      }
  
      ws.isAlive = false;
      ws.ping(noop);
    });
}, 120000);

const log = (logMessage, lineNumber) => {
    if (webSocket) {
        webSocket.send(logMessage);
    } else {
        console.log(logMessage,lineNumber)
    }
}

function heartbeat() {
    this.isAlive = true;
}

function noop() {}

function delay(timeout) {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
}
function resolveThen(resMsg,errMsg) {
    return [(res)=>log(`resolved ${resMsg}`),(err) => {
        log(`error ${errMsg}`);
    }];
}
process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error.message);
    if (puppeteerRunning) {
        puppeteerRunning = false;
        browser.close();
        log("error FAILED TO BUY PERMIT")
        return;
    }
});
  


app.post('/buyPermit', function(req, res) {
    if (!puppeteerRunning) {
        res.send('running puppeteer');
        buyPermit(req.body,res);
    }
});

app.post('/key', function(req, res) {
    res.send(process.env.SECRET_KEY);
});

async function buyPermit(CREDS,res) {
    puppeteerRunning = true;
    browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    log("Opening headless Chrome using Puppeteer")
    log("Chrome launched")
    /*
    const browser = await puppeteer.launch({
        headless: false
      });
      */
    const page = await browser.newPage();

    await page.goto('https://rudots.t2hosted.com/cmn/auth_guest.aspx');
    log("Navigated to the Rutgers parking website")

    const USERNAME_SELECTOR = '#ctl00_ctl01_MainContentPlaceHolder_T2Main_txtLogin';
    const PASSWORD_SELECTOR = '#ctl00_ctl01_MainContentPlaceHolder_T2Main_txtPassword';
    const LOGIN_BUTTON_SELECTOR = '#ctl00_ctl01_MainContentPlaceHolder_T2Main_cmdLogin';
    const GET_PERMIT_BUTTON_SELECTOR = 'body > div.container > div:nth-child(7) > div > div:nth-child(2) > section.col-sm-6.col-md-6.col-lg-6.widget-secondary-actions.flex-widget > div > div > a';
    const NEXT_BUTTON_SELECTOR = '#ctl00_ctl01_MainContentPlaceHolder_T2Main_cmdNext';
    const AGREE_CHECKBOX_SELECTOR = '#ctl00_ctl01_MainContentPlaceHolder_T2Main_chkAgreement_chk0';
    const NEXT_MONTH_EFFECTIVE_BUTTON_SELECTOR =  '#ctl00_ctl01_MainContentPlaceHolder_T2Main_calEffectiveDate > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(3) > a';
    const NEXT_MONTH_EXPIRATION_BUTTON_SELECTOR =  '#ctl00_ctl01_MainContentPlaceHolder_T2Main_calExpirationDate > tbody > tr:nth-child(1) > td > table > tbody > tr > td:nth-child(3) > a';
    const LOT_INPUT_SELECTOR = '#ctl00_ctl01_MainContentPlaceHolder_T2Main_selFacility';
    const LIVI_SELECTOR = '#ctl00_ctl01_MainContentPlaceHolder_T2Main_selFacility > option:nth-child(8)';
    const PAY_NOW_SELECTOR = '#ctl00_ctl01_MainContentPlaceHolder_T2Main_collectEmailForAuthenticatedUser_btnContinue';
    const CONTINUE_SELECTOR = '#ctl00_SheetContentPlaceHolder_btnContinue';
    const PAY_WITH_CARD_SELECTOR = '#ctl00_SheetContentPlaceHolder_btnAddCreditCard';
    const CARD_TYPE_DROPDOWN_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_drpCardType_drpCardNames';
    const lotList = {
        livi: '2180',
        busch: '2178',
        doug: '2179',
        cook: '2181',
    }

    // PAYMENT ADDRESS SECTION 
    // NEED TO REWRITE I FOUND SELECTORS AFTER I CLICK EDIT CC
    const FIRST_NAME_ON_CARD_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_txtFirstNameOnCard';
    const LAST_NAME_ON_CARD_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_txtLastNameOnCard';
    const CARD_NUMBER_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_txtCardNumber';
    const CONFIRM_CARD_NUMBER_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_txtConfirmCardNumber';
    const CVV2_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_txtCVV2';
    // values 1-12 for each month
    const EXPIRATION_MONTH_DROPDOWN_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_drpMonth';
    // values are 4 digit representing a year
    const EXPIRATION_YEAR_DROPDOWN_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_drpYear';

    // CARD BILLING ADDRESS SECTION
    const FIRST_NAME_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_txtBillingFirstName';
    const LAST_NAME_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_txtBillingLastName';
    const ADDRESS_LINE_1_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_txtAddLine1';
    const CITY_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_txtCity';
    const ZIPCODE_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_txtZip';

    // value set to 'NJ'
    const STATE_DROPDOWN_SELECTOR = '#ctl00_SheetContentPlaceHolder_AddCreditCard1_drpStates_drpStates';
    // DEFAULTS TO UNITED STATES
    const COUNTRY_DROPDOWN_SELECTOR = '';

    const ACCOUNT_AUTHORIZATION_CHECKBOX_SELECTOR = '#ctl00_SheetContentPlaceHolder_TxtAuthorization1_chk_agree';
    const ACCOUNT_AUTHORIZATION_EMAIL_ADDRESS_SELECTOR = '#ctl00_SheetContentPlaceHolder_txtEmail';
    const ACCOUNT_AUTHORIZATION_CONFIRM_EMAIL_ADDRESS_SELECTOR = '#ctl00_SheetContentPlaceHolder_txtEmailConfirm';
    const ACCOUNT_AUTHORIZATION_FIRST_NAME_SELECTOR = '#ctl00_SheetContentPlaceHolder_txtFirstName';
    const ACCOUNT_AUTHORIZATION_LAST_NAME_SELECTOR = '#ctl00_SheetContentPlaceHolder_txtLastName';
    const ACCOUNT_AUTHORIZATION_SUBMIT_ORDER_SELECTOR = '#ctl00_SheetContentPlaceHolder_btnPlaceOrder';
    const TIMEOUT = 3000;



    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.rutgersUsername);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.rutgersPassword);

    await page.click(LOGIN_BUTTON_SELECTOR);
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(85));
    log('Successfully Logged in')
    await page.click(GET_PERMIT_BUTTON_SELECTOR);
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(121));

    await page.click(NEXT_BUTTON_SELECTOR);
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(124));

    await page.click(NEXT_BUTTON_SELECTOR);
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(127));

    await page.click(AGREE_CHECKBOX_SELECTOR);
    await page.click(NEXT_BUTTON_SELECTOR);
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(131));

    // click next month
    let effective_date_tr = page.$('#ctl00_ctl01_MainContentPlaceHolder_T2Main_calEffectiveDate > tbody > tr');
    if (effective_date_tr.length < 0) {
        await page.click(NEXT_MONTH_EFFECTIVE_BUTTON_SELECTOR);
        await page.waitForSelector('input');
    }

    let expiration_date_tr = page.$('#ctl00_ctl01_MainContentPlaceHolder_T2Main_calExpirationDate > tbody > tr');
    if (expiration_date_tr.length < 0) {
        await page.click(NEXT_MONTH_EXPIRATION_BUTTON_SELECTOR);
        await page.waitForSelector('input');
    }

    let today = moment().format('MMMM D');

    let indexes;
    await page.evaluate(today => {
        let trs = document.querySelectorAll('#ctl00_ctl01_MainContentPlaceHolder_T2Main_calEffectiveDate > tbody > tr');
        let a;
        trs.forEach((tr,i) =>{
            if (i > 1) {
                tr.childNodes.forEach((td,i2) => {
                    if (td.firstChild.getAttribute('title') == today ) {
                        a = [i+1,i2+1];
                    }
                })
            }
        })
        return a;
    },today).then((res) => {
        indexes = res;
        log(`Picked ${today} as the permit's effective date`)
    },
    (err) => {
        log('Unable to pick today\'s date')
    });

    const EFFECTIVE_DATE_SELECTOR = `#ctl00_ctl01_MainContentPlaceHolder_T2Main_calEffectiveDate > tbody > tr:nth-child(${indexes[0]}) > td:nth-child(${indexes[1]}) > a`;
    const EXPIRATION_DATE_SELECTOR = `#ctl00_ctl01_MainContentPlaceHolder_T2Main_calExpirationDate > tbody > tr:nth-child(${indexes[0]}) > td:nth-child(${indexes[1]}) > a`;
    await page.click(EFFECTIVE_DATE_SELECTOR);
    await page.waitForSelector(NEXT_BUTTON_SELECTOR);

    // later I can add buying permits for multiple days
    /*
    let indexes2 = await page.evaluate(today => {
        let trs = document.querySelectorAll('#ctl00_ctl01_MainContentPlaceHolder_T2Main_calExpirationDate > tbody > tr');
        console.log(trs);
        let a;
        trs.forEach((tr,i) =>{
             console.log(tr);
            if (i > 1) {
                tr.childNodes.forEach((td,i2) => {
                    console.log(td.firstChild.getAttribute('title'));
                    if (td.firstChild.getAttribute('title') == today ) {
                        a = [i+1,i2+1];
                    }
                })
            }
        })
        return a;
    },today);
    */

    await page.click(EXPIRATION_DATE_SELECTOR);
    await page.waitForSelector(NEXT_BUTTON_SELECTOR);

    await page.click(NEXT_BUTTON_SELECTOR);
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(200));


    // function for picking the car with the plate number the user provided
    // fully functional, enable when in production
    await page.evaluate((CREDS) => {
        let tbody = document.querySelector('#ctl00_ctl01_MainContentPlaceHolder_T2Main_dgVehicleList > tbody');
        let i;
        tbody.childNodes.forEach((tr,index) => {
            tr.childNodes.forEach((td,tdIndex) => {
                if (td.firstElementChild) {
                    let innerText = td.firstElementChild.innerText
                    if (innerText != '' && innerText != CREDS.plateNumber.toUpperCase()) {
                        tr.firstElementChild.firstElementChild.click();
                    }
                }
            })
        })
    },CREDS).then(...resolveThen(`selected vehicle plate ${CREDS.plateNumber}`,'unable to pick your vehicle, double check plate number'));

    // unchecking extra vehicles
    // remove for production
    /*
    await page.click('#ctl00_ctl01_MainContentPlaceHolder_T2Main_dgVehicleList_ctl03_chkChooseVehicles')
        .then(...resolveThen());
    await page.click('#ctl00_ctl01_MainContentPlaceHolder_T2Main_dgVehicleList_ctl04_chkChooseVehicles')
        .then(...resolveThen());
    */

    await page.click(NEXT_BUTTON_SELECTOR);
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(223));


    log("Choose the Location")
    // livi, busch, doug, cook
    await page.select(LOT_INPUT_SELECTOR,lotList[CREDS.lot]);
    log('lot list ');
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(230));
    await page.click(NEXT_BUTTON_SELECTOR);
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(232));
    await page.waitForSelector('input').then(...resolveThen(284));
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(311));

    await page.click(PAY_NOW_SELECTOR);
    await page.waitForSelector('input');
    await page.waitForSelector('input');

    await page.click('#cmdNext');

    await page.waitForSelector('input');

    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(246));
    await page.waitForSelector(CONTINUE_SELECTOR);
    await page.focus(CONTINUE_SELECTOR);
    await page.click(CONTINUE_SELECTOR);
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(250));

    log("Check out process order details")
    await page.click(PAY_WITH_CARD_SELECTOR);
    await page.waitForSelector(CARD_TYPE_DROPDOWN_SELECTOR);
    log("payment");
    await page.select(CARD_TYPE_DROPDOWN_SELECTOR,'V');

    // add code for adding card info & billing address info
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(214));
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(215));

    // CARD INFO
    await page.click(FIRST_NAME_ON_CARD_SELECTOR);
    await page.keyboard.type(CREDS.firstName);

    await page.click(LAST_NAME_ON_CARD_SELECTOR);
    await page.keyboard.type(CREDS.lastName);

    await page.click(CARD_NUMBER_SELECTOR);
    await page.keyboard.type(CREDS.visaCC);

    await page.click(CONFIRM_CARD_NUMBER_SELECTOR);
    await page.keyboard.type(CREDS.visaCC);

    await page.click(CVV2_SELECTOR);
    await page.keyboard.type(CREDS.visaCCCVV2);

    await page.select(EXPIRATION_MONTH_DROPDOWN_SELECTOR,String(CREDS.expirationMonth));

    await page.select(EXPIRATION_YEAR_DROPDOWN_SELECTOR,String(CREDS.expirationYear));

    // BILLING ADDRESS
    await page.click(FIRST_NAME_SELECTOR);
    await page.keyboard.type(CREDS.firstName);

    await page.click(LAST_NAME_SELECTOR);
    await page.keyboard.type(CREDS.lastName);

    await page.click(ADDRESS_LINE_1_SELECTOR);
    await page.keyboard.type(CREDS.address);

    await page.click(CITY_SELECTOR);
    await page.keyboard.type(CREDS.city);

    await page.click(ZIPCODE_SELECTOR);
    await page.keyboard.type(CREDS.zipCode);

    await page.select(STATE_DROPDOWN_SELECTOR,'NJ');

    // wait to see what i typed REMOVE ON PRODUCTION
    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(256));

    await page.focus(CONTINUE_SELECTOR);
    await page.click(CONTINUE_SELECTOR);

    log('order summary');

    await page.waitForNavigation({timeout: TIMEOUT}).then(...resolveThen(263));

    await page.focus(CONTINUE_SELECTOR);
    await page.click(CONTINUE_SELECTOR);

    log('order confirmation')

    
    await page.waitForNavigation({timeout: 3000 }).then(...resolveThen(271));

    await page.focus(ACCOUNT_AUTHORIZATION_CHECKBOX_SELECTOR);
    await page.click(ACCOUNT_AUTHORIZATION_CHECKBOX_SELECTOR);

    await page.focus(ACCOUNT_AUTHORIZATION_EMAIL_ADDRESS_SELECTOR);
    await page.click(ACCOUNT_AUTHORIZATION_EMAIL_ADDRESS_SELECTOR);
    await page.keyboard.type(CREDS.email);

    await page.focus(ACCOUNT_AUTHORIZATION_CONFIRM_EMAIL_ADDRESS_SELECTOR);
    await page.click(ACCOUNT_AUTHORIZATION_CONFIRM_EMAIL_ADDRESS_SELECTOR);
    await page.keyboard.type(CREDS.email);

    await page.focus(ACCOUNT_AUTHORIZATION_FIRST_NAME_SELECTOR);
    await page.click(ACCOUNT_AUTHORIZATION_FIRST_NAME_SELECTOR);
    await page.keyboard.type(CREDS.firstName);

    await page.focus(ACCOUNT_AUTHORIZATION_LAST_NAME_SELECTOR);
    await page.click(ACCOUNT_AUTHORIZATION_LAST_NAME_SELECTOR);
    await page.keyboard.type(CREDS.lastName);

    // If I am testing
    await page.focus(ACCOUNT_AUTHORIZATION_SUBMIT_ORDER_SELECTOR);
    // enable in production
    //await page.click(ACCOUNT_AUTHORIZATION_SUBMIT_ORDER_SELECTOR);
    log('order placed')

    // wait for the loading page
    await page.waitForNavigation().then(...resolveThen(298));

    // wait for transaction to load  completely
    await page.waitForNavigation().then(...resolveThen(301));
    log("SUCCESS FULLY PURCHASED THE PERMIT")
    log("CHECK YOUR EMAIL")
    }

