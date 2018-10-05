const environment = process.env.ENVIRONMENT || 'development';

export const devLogger = (message) => {
  if (environment !== 'production') {
    console.log(message);
  }
};
