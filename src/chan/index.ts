import booksChan from './booksChan';
import { ChanDefine } from '../redux/chanMiddleware';

const chanArr: ChanDefine[] = [];

chanArr.push(...booksChan);

export default chanArr;
