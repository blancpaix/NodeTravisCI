Number.prototype._called = {};
// const puppeteer = require('puppeteer');  -helper
const Page = require('./helpers/page');

// test('Add two numbers', () => {     // first argument : description
//   const sum = 1 + 2;
//   // 기대값 입력
//   expect(sum).toEqual(3);
//   // assert();
//   // should();
// });

// let browser;   -helper
let page;

// this is executed before each test runs.
beforeEach(async () => {
  // browser = await puppeteer.launch({   -helper
  //   headless: false
  // });
  // page = await browser.newPage();      -helper
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

// this is executed after each test runs.
afterEach(async () => {
  // await browser.close();
  await page.close();
});

test('The header has the correct text', async () => {
  // $('a.brand-logo').innerHTML;
  // const text = await page.$eval('a.brand-logo', el => el.innerHTML);   -helper
  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster');
});

test('Clicking login starts Oauth flow', async () => {
  // right class and a innertag
  await page.click('.right a');

  // page.url => proxy for
  const url = await page.url();
  // console.log(url);

  expect(url).toMatch(/accounts\.google\.com/);
});

test('When signed in, shows logout button', async () => {
  // const id = '62f0dd5155f5ee336c1eedfa';   // userUID
  // 아래 부분을 날리고 함수로 뺄거임, page.login() 같은 함수로?? page.js 로 넘깁니다!

  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual('Logout');
});