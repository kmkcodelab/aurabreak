const { withGradleProperties } = require('@expo/config-plugins');

const withKotlinFix = (config) => {
  return withGradleProperties(config, (config) => {
    // আগের ভুল প্রপার্টি থাকলে মুছে ফেলবে
    config.modResults = config.modResults.filter(
      (item) => item.key !== 'kotlinVersion' && item.key !== 'react.composeCompiler.suppressKotlinVersionCompatibilityCheck'
    );

    // জোর করে সঠিক ভার্সন এবং সাপ্রেশন ফ্ল্যাগ বসিয়ে দেবে
    config.modResults.push({
      type: 'property',
      key: 'kotlinVersion',
      value: '1.9.24',
    });
    config.modResults.push({
      type: 'property',
      key: 'react.composeCompiler.suppressKotlinVersionCompatibilityCheck',
      value: 'true',
    });

    return config;
  });
};

module.exports = withKotlinFix;
