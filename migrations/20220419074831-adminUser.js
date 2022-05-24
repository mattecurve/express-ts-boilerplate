const bcrypt = require('bcrypt');

module.exports = {
    async up(db) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('test', salt);
        await db.collection('users').insertOne({
            username: 'admin',
            password,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    },

    async down(db) {
        await db.collection('users').deleteOne({
            username: 'admin',
        });
    },
};
