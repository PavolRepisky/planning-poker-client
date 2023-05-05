import NotFound from 'core/pages/NotFound';
import { render, screen } from 'test-utils';

describe('NotFound Page', () => {
  it('contains a error title and a subtitle', () => {
    render(<NotFound />);

    const errorTitle = screen.getByRole('heading', {
      name: 'common.errors.notFound.title',
    });
    expect(errorTitle).toBeInTheDocument();

    const errorSubtitle = screen.getByText('common.errors.notFound.subTitle');
    expect(errorSubtitle).toBeInTheDocument();
  });

  it('contains a button, which navigates user to homepage', () => {
    render(<NotFound />);

    const backHomeButton = screen.getByRole('link', {
      name: 'common.backHome',
    });
    expect(backHomeButton).toBeInTheDocument();
    expect(backHomeButton).toHaveAttribute('href', '/');
  });
});
