function extend(subtype, supertype)
{
    subtype.prototype = Object.create(supertype.prototype);
    subtype.prototype.constructor = subtype;
}

module.exports = extend;
