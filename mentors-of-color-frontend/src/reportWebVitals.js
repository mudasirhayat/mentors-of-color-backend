const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
try {
  getFID(onPerfEntry);
  getFCP(onPerfEntry);
  getLCP(onPerfEntry);
} catch (error) {
  console.error('Error:', error);
}
  getTTFB(onPerfEntry);
} catch (error) {
  console.error('An error occurred:', error);
}

export default reportWebVitals;
