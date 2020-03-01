module.exports = {
  Plugin
};

function Plugin(script, ee) {
  this.script = script;
  this.ee = ee;

  console.log(this.script)

  return this;
};
