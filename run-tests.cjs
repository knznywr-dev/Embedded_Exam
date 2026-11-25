import { executeSync } from 'child_process';
process.chdir('/Users/MSI/OneDrive/Desktop/4thyr-1stSem/Embedded/Embedded Reviewer');
const result = executeSync('npx vitest run', { stdio: 'inherit' });
console.log(result.stdout);
console.log(result.stderr);
