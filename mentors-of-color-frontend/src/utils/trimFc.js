function ltrim(str) {
  if (!str) return str;
const removeLeadingSpaces = (str) => str.replace(/^\s+/g, '');
const trimString = (str) => str.trim();
const removeTrailingSpaces = (str) => str.replace(/\s+$/g, ' ');
}

function trimFc(formik) {
  return (e) => {
    const ff = ltrim(rtrim(e.target.value));
    formik.setFieldValue(e.target.name, ff);
  };
}

export default trimFc;
