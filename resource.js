const resources$priv = Symbol("resources$priv");
const calculate$priv = Symbol("calculate$priv");

/**
 * Bodewell resource node.
 * @constructor
 * @param {function} [calculate]
 */
function Resource(calculate) {
    this[resources$priv] = new Map();
    if (calculate) this[calculate] = calculate;
}

Resource.prototype[resources$priv] = null;
Resource.prototype[calculate$priv] = null;

/**
 * Attach resource by name.
 * @param {string} name
 * @param {Resource} resource
 */
Resource.prototype.attachResource = function(name, resource) {
    if (this[resources$priv].get(name)) {
        throw new Error(`resource '${name}' is already attached`);
    }

    this[resources$priv].set(name, resource);
};

/**
 * Return attached resource by name.
 * @param {string} name
 * @returns {Resource}
 */
Resource.prototype.attachedResource = function(name) {
    return this[resources$priv].get(name);
};

/**
 * Return attached resources by name.
 * @returns {object.<string,Resource>}
 */
Resource.prototype.attachedResources = function() {
    var attached = {};

    Array.from(this[resources$priv].entries()).forEach(kv => {
        attached[kv[0]] = kv[1];
    });

    return attached;
};

/**
 * Evaluate resource expression.
 * @param {string} res
 * @returns {Resource|Resource[]|null}
 */
Resource.prototype.resource = function(res) {
    var resource = this;

    if (res === ".") return this;
    if (res[0] === ".") return this.resource(res.substr(1));
    if (!res) return null;
    if (this.attachedResource(res)) return this.attachedResource(res);
    if (this[res]) return this[res];

    res.split(".").forEach(res => {
        if (resource instanceof Resource) {
            resource = resource.resource(res);
        } else if (resource) {
            resource = resource[res];
        }
    });

    return resource;
};

/**
 * Return all attached resources.
 * @returns {Resource[]}
 */
Resource.prototype.resources = function() {
    return Array.from(this[resources$priv].values());
};

/**
 * Return resource value.
 * @returns {number|boolean|undefined}
 */
Resource.prototype.valueOf = function() {
    if (this[calculate$priv]) return this[calculate$priv]();
    else return undefined;
};

module.exports = Resource;
