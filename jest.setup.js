import '@testing-library/jest-dom/extend-expect'
import fetchMock from 'jest-fetch-mock';

global.fetch = fetchMock;