import * as readline from 'readline';

export function promptUser(rl: readline.Interface): Promise<string> {
  return new Promise(resolve => {
    rl.question('Please enter the content prompt: ', answer => {
      resolve(answer);
    });
  });
}
