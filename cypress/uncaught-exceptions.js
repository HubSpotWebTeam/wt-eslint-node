// Uncaught exceptions are logged for the Jenkins regression Slack report instead of failing the test.

const EXCEPTIONS_FILE = 'uncaught-exceptions.ndjson';
const MAX_UNIQUE_EXCEPTIONS_PER_TEST = 50;
const MAX_MESSAGE_LENGTH = 300;

let exceptionLinesThisTest = new Set();

// Cypress wraps the exception in its own text; the original message is on the "> " line.
const getExceptionMessage = exception => {
  const fullMessage = String(exception?.message || exception);
  const originalMessage = fullMessage.match(/^\s*> (.+)$/m)?.[1];
  return (originalMessage || fullMessage.split('\n')[0]).trim().slice(0, MAX_MESSAGE_LENGTH);
};

// Which script threw the exception: the first stack line that isn't Cypress code.
const getExceptionSource = exception => {
  const thrownFrom = String(exception?.stack || '')
    .split('\n')
    .map(stackLine => stackLine.trim())
    .find(stackLine => stackLine.startsWith('at ') && !stackLine.includes('/__cypress/'));
  if (!thrownFrom) return 'unknown';
  const scriptUrl = thrownFrom.match(/https?:\/\/[^\s)?#]+/)?.[0];
  return scriptUrl ? scriptUrl.replace(/^https?:\/\//, '').replace(/(:\d+)+$/, '') : 'inline script';
};

const saveException = exception => {
  const message = getExceptionMessage(exception);
  const source = getExceptionSource(exception);
  const exceptionLine = `${JSON.stringify({ message, source })}\n`;
  if (exceptionLinesThisTest.has(exceptionLine) || exceptionLinesThisTest.size >= MAX_UNIQUE_EXCEPTIONS_PER_TEST)
    return;
  exceptionLinesThisTest.add(exceptionLine);
  Cypress.log({ name: 'uncaught exception', message: `${message} (${source})` });
};

Cypress.on('uncaught:exception', exception => {
  try {
    saveException(exception);
  } catch {
    // if saving the exception breaks, still don't fail the test
  }
  return false;
});

const writeExceptionsToFile = () => {
  if (!exceptionLinesThisTest.size) return;
  const textToAdd = [...exceptionLinesThisTest].join('');
  exceptionLinesThisTest = new Set();
  cy.writeFile(EXCEPTIONS_FILE, textToAdd, { flag: 'a+', log: false });
};

afterEach(writeExceptionsToFile);
after(writeExceptionsToFile);
