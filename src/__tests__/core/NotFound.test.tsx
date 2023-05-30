import userEvent from '@testing-library/user-event';
import NotFound from 'core/pages/NotFound';
import * as router from 'react-router';
import { render, screen } from 'test-utils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (value: string) => value,
    i18n: {
      language: 'en',
    },
  }),
}));

const mockedNavigate = jest.fn();
beforeEach(() => {
  jest.spyOn(router, 'useNavigate').mockImplementation(() => mockedNavigate);
});

describe('Not found page', () => {
  it('contains a title and a message', () => {
    render(<NotFound />);

    expect(
      screen.getByRole('heading', {
        name: 'common.errors.notFound.title',
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText('common.errors.notFound.subTitle')
    ).toBeInTheDocument();
  });

  it('contains a back-home link, which navigates to the landing page', async () => {
    render(<NotFound />);

    const backHomeLink = screen.getByRole('link', {
      name: /common.backHome/i,
    });
    expect(backHomeLink).toBeInTheDocument();

    await userEvent.click(backHomeLink);
    expect(mockedNavigate).toBeCalledWith('/', expect.anything());
  });
});
