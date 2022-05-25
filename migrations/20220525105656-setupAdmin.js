const bcrypt = require('bcrypt');

module.exports = {
    async up(db) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('test', salt);
        const adminRole = await db.collection('role').findOne({
            isAdmin: true,
        });
        await db.collection('user').insertOne({
            username: 'admin',
            password,
            role: adminRole._id,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    },

    async down(db) {
        await db.collection('user').deleteOne({
            username: 'admin',
        });
    },
};
