export const transformImg = (url, width) => {
  const urlConfig = url.split('/upload');
  if (urlConfig.length === 0) return url;
  return urlConfig[0] + `/upload/w_${width}` + urlConfig[1];
};
