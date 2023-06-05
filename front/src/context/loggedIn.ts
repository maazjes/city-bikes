import { createContext } from 'react';
import { LoggedInContext as LoggedInContextType } from 'src/types';

const LoggedInContext = createContext<LoggedInContextType>({} as LoggedInContextType);

export default LoggedInContext;
