var assert = require('assert');
var exec = require('child_process').exec;
var fs = require('fs');

const quineDB = command => new Promise(resolve => {
  exec('./wrapper ' + command, (error, stdout, stderr) => {
    fs.writeFileSync('./wrapper', stdout);
    resolve(stderr);
  });

});

describe('quine-db.js', function() {

  beforeEach(done => {
    fs.writeFileSync('./wrapper', fs.readFileSync('./quine-db.js'));
    exec('chmod +x ./wrapper', done);
  });

  afterEach(() => fs.unlinkSync('./wrapper'));

  it('sets', () => {
    return quineDB('set foo bar')
  });

  it('gets', () => {
    return quineDB('set foo bar')
      .then(() => quineDB('get foo'))
      .then(results => {
        assert.equal(results.trim(), 'bar')
      })
    ;
  });

  it('keys (also sorted)', () => {
    return quineDB('set foo bar')
      .then(() => quineDB('set oof rab'))
      .then(() => quineDB('set aaa bbb'))
      .then(() => quineDB('keys'))
      .then(results => {
        assert.equal(results.trim(), 'aaa\nfoo\noof')
      })
    ;
  });

  it('deletes', () => {
    return quineDB('set foo bar')
      .then(() => quineDB('set oof rab'))
      .then(() => quineDB('delete foo'))
      .then(() => quineDB('keys'))
      .then(results => {
        assert.equal(results.trim(), 'oof')
      })
    ;
  });

  it('overwrites existing keys', () => {
    return quineDB('set foo bar')
      .then(() => quineDB('set foo baz'))
      .then(() => quineDB('get foo'))
      .then(results => {
        assert.equal(results.trim(), 'baz')
      })
    ;
  });

  it('can add 100 keys', function() {
    this.timeout(60000);
    var promise = quineDB('set foo0 bar0');
    for (let i = 0; i < 100; i++) {
      promise = promise.then(() => quineDB('set foo' + i + ' bar' + i));
    }
    return promise
      .then(() => quineDB('keys'))
      .then(results => {
        var expected = [];
        for (var i = 0; i < 100; i++) expected.push('foo' + i);
        expected.sort()
        expected = expected.join('\n');
        assert.equal(results.trim(), expected)
      })
    ;
  })

  
});