
export function urlParse() {
  let search = window.location.search;
  let result = {};
  const reg = /([^?&]+)=([^&]+)/g;

  if(reg.test(search)) {
    search.replace(reg, function(match, key, value) {
      result[key] = decodeURIComponent(value);
    })
  }
  return result;
}
