import request from 'sync-request';

import { SERVER_URL } from './config';

test('success root', () => {
  const res = request(
    'GET',
    SERVER_URL + '/',

    // Not necessary, since it's empty, though reminder that
    // GET/DELETE is `qs`, PUT/POST is `json`
    { qs: {} }
  );
  expect(res.statusCode).toEqual(200);
  const data = JSON.parse(res.getBody() as string);
  expect(data).toStrictEqual({ message: expect.any(String) });
});
