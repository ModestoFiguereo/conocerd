import ascii from 'ascii-art';
import koa from 'koa';
import serve from 'koa-static';
import dotent from 'dotenv';

dotent.config({ silent: true });
const app = koa();
const PORT = process.env.PORT ||
             process.env.NODE_PORT || 3000;

app
  .use(serve(`${__dirname}/../public`))
  .listen(PORT, () => {
    ascii.font('conocerd.do', 'Doom', (text) => {
      console.log(text);
      console.log('> Make things talk!');
      console.log('----------------------------------------------------');
      console.log(`Listening at 0.0.0.0: ${PORT}`);
    });
  });
