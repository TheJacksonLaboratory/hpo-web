import {HpoPage} from './app.po';

describe('hpo App', () => {
  let page: HpoPage;

  beforeEach(() => {
    page = new HpoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
