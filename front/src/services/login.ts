import api from 'src/util/api';
import { NewUser, Token } from '../types.js';

const login = (body: NewUser): Promise<Token> => api.post<Token>('login', body);

export { login };
