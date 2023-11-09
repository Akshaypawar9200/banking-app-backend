const preloadAssociations = (associations) => {
  if (!associations) {
    return;
  }
  let include = [];
  if (!Array.isArray(associations)) {
    associations = [associations];
  }
  for (let assoc of associations) {
    include.push(assoc);
  }
  console.log("include::::::>>>>", include);
  return { include };
};

module.exports = { preloadAssociations };
