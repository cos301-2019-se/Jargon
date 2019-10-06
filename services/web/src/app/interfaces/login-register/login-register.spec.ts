import { LoginDetails, RegisterDetails } from './login-register';

describe('LoginRegister', () => {
  it('should create an instance', () => {
    expect(new LoginDetails()).toBeTruthy();
    expect(new RegisterDetails()).toBeTruthy();
  });
});
