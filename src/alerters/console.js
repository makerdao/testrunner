import omit from 'lodash/omit';

function print(report) {
  if (report.success) {
    console.log(report);
    return;
  }

  console.log(omit(report, 'error'));
  try {
    console.error(
      report.error.stack
        .split('\n')
        .slice(0, 5)
        .join('\n')
    );
  } catch (err) {
    console.error(report.error);
  }
}

function alerter(level, report) {
  switch (level) {
    case 'info':
      print(report);
      break;
    case 'error':
      if (!report.success) print(report);
      break;
  }
}

// setting up the factory function pattern here even though it's not yet
// necessary
export default function() {
  return alerter;
}
