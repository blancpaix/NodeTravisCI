Number.prototype._called = {};
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('localhost:3000');
});

afterEach(async () => {
  await page.close();
});



// describe is a global function provided by jest
describe('When logged in, ', async () => {
  beforeEach(async () => {
    await page.login();
    await page.click('a.btn-floating');
  });


  test('can see blog create form', async () => {
    const label = await page.getContentsOf('form label');

    expect(label).toEqual('Blog Title');
  });

  describe('And using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title (sample)');
      await page.type('.content input', 'My Content (sample)');
      await page.click('form button');
    });

    test('Submitting takes user to review screen', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });
    test('Submitting then saving adds blog to index page', async () => {
      await page.click('button.green');

      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual('My Title (sample)');
      expect(content).toEqual('My Content (sample)');
    })
  });


  describe('And using invalid inputs', async () => {
    // sets up the initial condition
    beforeEach(async () => {
      await page.click('form button');
    });

    test('the form shows an error message', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      console.log('titleError : ', titleError, ' contentError : ', contentError);

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});


describe('User is not logged in', async () => {
  /*
  test('User cannot create blog posts', async () => {
    // 이것도 경량화 ㄱㄱ
    // const result = await page.evaluate(     //     result : { error: 'You must log in!' }
    //   () => {
    //     return fetch('/api/blogs', {
    //       method: 'POST',
    //       credentials: 'same-origin',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //       body: JSON.stringify({ title: 'My Other Title2', content: 'My Other Content2' })
    //     }).then(res => res.json());
    //   }
    // );
    const result = await page.post('/api/blogs', { title: 'T', content: 'C' });
    expect(result).toEqual({ error: 'You must log in!' });
  });

  test('User cannot get a list of posts', async () => {
    // 이걸 경량화 해봅시다
    // const result = await page.evaluate(
    //   () => {
    //     return fetch('/api/blogs', {
    //       method: 'GET',
    //       credentials: 'same-origin',
    //       headers: {
    //         'Content-Type': 'application/json',
    //       }
    //     }).then(res => res.json());
    //   }
    // );

    const result = await page.get('/api/blogs');
    expect(result).toEqual({ error: 'You must log in!' })
  });
  */

  const actions = [
    {
      method: 'get',
      path: '/api/blogs',
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'T',
        content: 'C',
      }
    },
    // ... you can add more testing actions in here!
  ];



  test('Blog related actions ar prohibited', async () => {
    const results = await page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' })
    }
  })
});


