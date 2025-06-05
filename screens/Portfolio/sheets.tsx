import { SheetDefinition, registerSheet } from 'react-native-actions-sheet';
import TickerDetail from './TickerDetail';

registerSheet('TickerDetail', TickerDetail);

declare module 'react-native-actions-sheet' {
  export interface Sheets {
    TickerDetail: SheetDefinition;
  }
}

export { };