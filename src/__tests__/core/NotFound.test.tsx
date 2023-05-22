import NotFound from 'core/pages/NotFound';
import { render, screen } from 'test-utils';

describe('Not found page', () => {
  it('renders a title and a subtitle', () => {
    render(<NotFound />);

    const errorTitle = screen.getByRole('heading', {
      name: 'common.errors.notFound.title',
    });
    expect(errorTitle).toBeInTheDocument();

    const errorSubtitle = screen.getByText('common.errors.notFound.subTitle');
    expect(errorSubtitle).toBeInTheDocument();
  });

  it('renders a back-home link', () => {
    render(<NotFound />);

    const backHomeLink = screen.getByRole('link', {
      name: 'common.backHome',
    });
    expect(backHomeLink).toBeInTheDocument();
    expect(backHomeLink).toHaveAttribute('href', '/');
  });
});
