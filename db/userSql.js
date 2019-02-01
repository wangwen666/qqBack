const UserSQL = {
    insert: 'INSERT INTO user(uid, userName, password) VALUES(0, ?, ?)',
    drop: 'DROP TABLE user',
    queryAll: 'SELECT * FROM user',
    getUserById: 'SELECT * FROM user WHERE uid=?'
}

module.exports = UserSQL;
