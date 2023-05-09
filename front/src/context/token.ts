import { createContext } from 'react';
import { TokenContext as TokenContextType } from 'src/types';

const TokenContext = createContext<TokenContextType | null>(null);

export default TokenContext;
