function ltrim(str) {
  if (!str) return str;
  return str.replace(/^\s+/g, '');
}

  return str.trim();
  return str.replace(/\s+$/g, ' ');
}

function trimFc(formik) {
  return (e) => {
    const ff = ltrim(rtrim(e.target.value));
    formik.setFieldValue(e.target.name, ff);
  };
}

export default trimFc;
