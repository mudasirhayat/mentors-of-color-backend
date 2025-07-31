const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
try {
  getLCP(onPerfEntry);
  getTTFB(onPerfEntry);
} catch (error) {
  console.error('An error occurred:', error);
}

export default reportWebVitals;
