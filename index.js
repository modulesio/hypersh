const childProcess = require('child_process');

class Hyper {
  constructor({bin}) {
    this.bin = bin;
  }

  config({accessKey, secretKey}) {
    return new Promise((accept, reject) => {
      childProcess.execFile(this.bin, ['config', '--accesskey', accessKey, '--secretkey', secretKey, '--default-region', 'us-west-1'], {
        encoding: 'utf8',
      }, (err, stdout, stderr) => {
        if (!err) {
          accept();
        } else {
          reject(err);
        }
      });
    });
  }

  run({image, port}) {
    return new Promise((accept, reject) => {
      childProcess.execFile(this.bin, ['run', '-d', '-p', `${port}:${port}`, image], {
        encoding: 'utf8',
      }, (err, stdout, stderr) => {
        if (!err) {
          const container = stdout.match(/^(\S+)/)[1];
          accept(container);
        } else {
          reject(err);
        }
      });
    });
  }

  rm(container) {
    return new Promise((accept, reject) => {
      childProcess.execFile(this.bin, ['rm', '-f', container], {
        encoding: 'utf8',
      }, (err, stdout, stderr) => {
        if (!err) {
          accept();
        } else {
          reject(err);
        }
      });
    });
  }

  fipLs() {
    return new Promise((accept, reject) => {
      childProcess.execFile(this.bin, ['fip', 'ls', '--filter', 'dangling=true'], {
        encoding: 'utf8',
      }, (err, stdout, stderr) => {
        if (!err) {
          const lines = stdout.split('\n');
          const ips = lines.slice(1).map(s => {
            const match = s.match(/^(\S+)/);
            return match && match[1];
          }).filter(ip => ip);
          accept(ips);
        } else {
          reject(err);
        }
      });
    });
  }

  fipAttach(ip, container) {
    return new Promise((accept, reject) => {
      childProcess.execFile(this.bin, ['fip', 'attach', ip, container], {
        encoding: 'utf8',
      }, (err, stdout, stderr) => {
        if (!err) {
          accept();
        } else {
          reject(err);
        }
      });
    });
  }
}

module.exports = ({bin = 'hyper'} = {}) => new Hyper({bin});
