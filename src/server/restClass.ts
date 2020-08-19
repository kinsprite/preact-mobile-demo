/* eslint-disable @typescript-eslint/no-var-requires, import/no-dynamic-require, import/no-extraneous-dependencies */
import { IncomingMessage, NextFunction } from 'connect';
import { ServerResponse } from 'http';

type Opts = {
  context: string;
};

type HandleFunction = (req: IncomingMessage, res: ServerResponse, next?: NextFunction) => any

class Rest {
  methods: {
    [key: string]: {
      [key: string]: HandleFunction
    }
  };

  opts: Opts;

  constructor(opts: Opts) {
    this.methods = {
      GET: {},
      PUT: {},
      POST: {},
      DELETE: {},
    };

    this.opts = opts;
  }

  get(url: string, fn: HandleFunction) {
    this.methods.GET[this.opts.context + url] = fn;
  }

  processRequest() {
    return (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
      const handler = this.methods[req.method] && this.methods[req.method][req.url];

      if (handler) {
        const p = handler(req, res, next);

        if (!p) {
          return;
        }

        const end = (x) => {
          if (typeof x === 'string') {
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.write(x);
          } else if (x !== undefined) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.write(JSON.stringify(x));
          }

          res.end();
        };

        if (p.then && (typeof p.then === 'function')) {
          p.then((v) => {
            end(v);
          }, (e) => {
            res.statusCode = 503;
            res.statusMessage = e.toString();
            res.end();
          });
        } else {
          end(p);
        }
      } else {
        next();
      }
    };
  }

  static create(opts: Opts) {
    return new Rest(opts);
  }
}

export default Rest;
