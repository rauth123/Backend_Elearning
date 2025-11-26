const { db, auth } = require('../config/firebase');
const nodemailer = require('nodemailer');

const createProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const profileData = {
            Username: username,
            Email: email,
            Role: 'Student',
            CreatedAt: new Date()
        };
        
        await db.collection('USERS').doc(req.uid).set(profileData);
        res.status(201).json({ message: 'User profile created!', id: req.uid });
    } catch (error) {
        res.status(500).json({ message: 'Error creating profile: ' + error.message });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const userDoc = await db.collection('USERS').doc(req.uid).get();
        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User profile not found.'});
        }
        res.status(200).json({ id: userDoc.id, ...userDoc.data() });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile: ' + error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const snapshot = await db.collection('USERS').get();
        const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users: ' + error.message });
    }
};

const setRole = async (req, res) => {
    const { targetUserId, newRole } = req.body;
    if (newRole !== 'Admin' && newRole !== 'Student') {
        return res.status(400).json({ message: 'Invalid role.'});
    }
    try {
        await auth.setCustomUserClaims(targetUserId, { role: newRole });
        await db.collection('USERS').doc(targetUserId).update({ Role: newRole });
        res.status(200).json({ message: `Successfully set ${targetUserId} role to ${newRole}`});
    } catch (error) {
        res.status(500).json({ message: 'Error setting user role: ' + error.message });
    }
};

const generateCode = (length = 6) => {
    let code = '';
    for (let i = 0; i < length; i++) code += Math.floor(Math.random() * 10);
    return code;
};

const sendResetEmail = async (to, code) => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!user || !pass) throw new Error('Email credentials not configured');

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM || user,
        to,
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${code}. It expires in 15 minutes.`
    };

    return transporter.sendMail(mailOptions);
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email);
        } catch (e) {
            return res.status(404).json({ message: 'User with this email not found.' });
        }

        const code = generateCode(6);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await db.collection('PASSWORD_RESETS').doc().set({
            uid: userRecord.uid,
            email,
            code,
            expiresAt: expiresAt
        });

        await sendResetEmail(email, code);

        res.status(200).json({ message: 'Reset code sent to email.' });
    } catch (error) {
        res.status(500).json({ message: 'Error in forgotPassword: ' + error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        if (!email || !code || !newPassword) return res.status(400).json({ message: 'Email, code and newPassword are required' });

        const snapshot = await db.collection('PASSWORD_RESETS')
            .where('email', '==', email)
            .where('code', '==', code)
            .get();

        if (snapshot.empty) return res.status(400).json({ message: 'Invalid code or email' });

        const doc = snapshot.docs[0];
        const data = doc.data();
        const expiresAt = data.expiresAt.toDate ? data.expiresAt.toDate() : new Date(data.expiresAt);
        if (expiresAt < new Date()) return res.status(400).json({ message: 'Code expired' });

        const uid = data.uid;
        await auth.updateUser(uid, { password: newPassword });

        const deletes = [];
        const allDocs = await db.collection('PASSWORD_RESETS').where('email', '==', email).get();
        allDocs.forEach(d => deletes.push(d.ref.delete()));
        await Promise.all(deletes);

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error in resetPassword: ' + error.message });
    }
};

module.exports = {
    createProfile,
    getMyProfile,
    getAllUsers,
    setRole,
    forgotPassword,
    resetPassword
};
