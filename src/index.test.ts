/* eslint-disable @typescript-eslint/no-explicit-any */

import {join} from 'path';
import {gotmplExec, gotmplServer} from './index';
import {expect} from 'chai'; // eslint-disable-line node/no-unpublished-import

describe('gotmplExec', () => {
  it('works', async () => {
    const got = await gotmplExec('Hello {{ upper .name }}!', {
      gotmplBin: join(__dirname, '..', '..', 'gotmpl', 'bin', 'gotmpl'),
      data: {name: 'world'},
      functions: {
        upper: function (value: string) {
          return value.toUpperCase();
        },
      },
    });
    expect(got).equal('Hello WORLD!');
  });
});

describe('gotmplServer', () => {
  it('works', async () => {
    const server = await gotmplServer({
      gotmplBin: join(__dirname, '..', '..', 'gotmpl', 'bin', 'gotmpl'),
      functions: {
        upper: function (value: string) {
          return value.toUpperCase();
        },
      },
    });
    const got = await server.execute('Hello {{ upper .name }}!', {
      data: {name: 'world'},
    });
    expect(got).equal('Hello WORLD!');
    await server.stop();
  });

  it('throws after stop', async () => {
    const server = await gotmplServer({
      gotmplBin: join(__dirname, '..', '..', 'gotmpl', 'bin', 'gotmpl'),
      functions: {
        upper: function (value: string) {
          return value.toUpperCase();
        },
      },
    });
    const got = await server.execute('Hello {{ upper .name }}!', {
      data: {name: 'world'},
    });
    expect(got).equal('Hello WORLD!');
    await server.stop();
    try {
      await server.execute('Hello {{ upper .name }}!', {data: {name: 'world'}});
      expect.fail('Expected error');
    } catch (e: any) {
      expect(e.message).equal('Channel has been shut down');
    }
  });
});
