import api from 'src/util/api';
import { NewUser, User } from '../types.js';

const createUser = (body: NewUser): Promise<User> => api.post<User>('users', body);

export { createUser };
