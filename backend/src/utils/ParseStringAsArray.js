module.exports = (arrayAsString) =>
{
   return arrayAsString.split(',').map(obj => obj.trim());
}