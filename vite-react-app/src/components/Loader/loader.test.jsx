import { describe, it, expect, test } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

// https://testing-library.com/docs/queries/about/#priority
// test file needs .jsx, not just .js with vitest.
// Vitest comes with test suites(describe), test cases(it), and assertions(expect().toEqual) just like Jest
// snapshots, mocks, coverage
// toHaveBeenCalled, expect
//@testing-library/jest-dom     @testing-library/react     @testing-library/user-event
// React Testing Library aims to test the components how users use them.
// Users see buttons, headings, forms and other elements by their role, not by their id, class, or element tag name
// Use @testing-library/user-event over fireEvent where possible.
// within(messages).getByText('hello')
describe('A truthy statement', () => {
  it('renders the App component with no given props', () => {
    render(<Loader />);
    // better to use screen than container.
    expect(screen.getByText('Gathering your medias')).toBeInTheDocument();
    // screen.debug(); // prints out the jsx in the App component unto the command line
    // can await screen.findBy
  });
  it('renders the Loader component with message prop', () => {
    render(<Loader message="pixies gathering dust" />);
    expect(screen.getByText('pixies gathering dust')).toBeInTheDocument();
  });
  it('renders the Loader dots with message prop', () => {
    render(<Loader message="pixies gathering dust" />);
    expect().toBeInTheDocument();

  });
})
/*
toBeDisabled
toBeEnabled
toBeEmptyDOMElement
toBeInTheDocument
toBeInvalid
toBeRequired
toBeValid
toBeVisible
toContainElement
toContainHTML
toHaveAccessibleDescription
toHaveAccessibleErrorMessage
toHaveAccessibleName
toHaveAttribute
toHaveClass
toHaveFocus
toHaveFormValues
toHaveStyle
toHaveTextContent
toHaveValue
toHaveDisplayValue
toBeChecked
toBePartiallyChecked
toHaveRole
toHaveErrorMessage
*/