const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
  constructor(page) {
    this.page = page;
  };

  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function (target, property) {

        // brower.close(), page.close() 존재해서 코드가 엉킴.. 브라우저가 안꺼져요... 이럴땐 어떡함?
        // 앞으로 빼면 잘 동작하는데 page.close() 를 쓰고 싶을때는 어떻게 하라고?
        return customPage[property] || browser[property] || page[property];
      }
    })
  };

  async login() {
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);

    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]');
  };

  async getContentsOf(selector) {
    return this.page.$eval(selector, el => el.innerHTML);
  };

  get(path) {
    return this.page.evaluate((_path) => {
      return fetch(_path, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.json());
    }, path);
  };

  post(path, data) {
    return this.page.evaluate((_path, _data) => {
      return fetch(_path, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_data)
      }).then(res => res.json());
    }, path, data);
  };

  // !!! 이런게 있네?
  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  };

};

// CustomPage.build();

module.exports = CustomPage;