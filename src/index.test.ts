import {join} from 'path';
import {Gotmpl} from './index';
import {expect} from 'chai';

describe('Gotmpl', () => {
  it('execServerRequest works', async () => {
    const gotmpl = new Gotmpl(
      {
        path: join(__dirname, '..', '..', 'gotmpl', 'bin', 'gotmpl'),
        functions: {
          upper: function (value: string) {
            return value.toUpperCase();
          }
        }
      }
    );
    await gotmpl.startServer();
    const got = await gotmpl.execServerRequest('Hello {{ upper .name }}!', {name: 'world'});
    expect(got).equal('Hello WORLD!');
    await gotmpl.stopServer();
  });

  it('execCommandRequest works', async () => {
    const gotmpl = new Gotmpl(
      {
        path: join(__dirname, '..', '..', 'gotmpl', 'bin', 'gotmpl'),
        functions: {
          upper: function (value: string) {
            return value.toUpperCase();
          }
        }
      }
    );
    const got = await gotmpl.execCommandRequest('Hello {{ upper .name }}!', {name: 'world'});
    expect(got).equal('Hello WORLD!');
  });
});
