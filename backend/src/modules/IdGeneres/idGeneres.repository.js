const IdGeneres = require("../models/IdGeneres");

module.exports = {
    findByCode: async (code) => {
        return await IdGeneres.findOne({ where: { code } });
    },

    save: async (type, code) => {
        return await IdGeneres.create({ type, code });
    }
};
