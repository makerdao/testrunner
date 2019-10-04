function alerter(level, report) {
  switch (level) {
    case 'info':
      console.log(report);
      break;
    case 'error':
      if (!report.success) console.log(report);
      break;
  }
}

// setting up the factory function pattern here even though it's not yet
// necessary
export default function() {
  return alerter;
}
