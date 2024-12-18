const AWS = require('aws-sdk');
const DownloadHistory = require('../model/download');
const Expense = require('../model/expenses');
const s3 = new AWS.S3();

// AWS SDK 
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION, 
});

const downloadExpenses = async (req, res) => {
    try {
        const userId = req.user.id;
        const expenses = await Expense.findAll({ where: { userId } });

        if (!expenses.length) {
            return res.status(404).json({ message: 'No expenses found for this user.' });
        }

        const csvData = expenses.map(({ amount, description, category }) => `${amount},${description},${category}`).join('\n');
        const fileName = `expenses_${Date.now()}.csv`;

        const s3Params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName,
            Body: csvData,
            ContentType: 'text/csv',
            ACL: 'public-read',
        };

        const { Location } = await s3.upload(s3Params).promise();

        await DownloadHistory.create({
            user_id: userId,
            file_url: Location,
            file_name: fileName,
            download_date: new Date(),
        });

        res.status(200).json({ fileUrl: Location });
    } catch (error) {
        console.error('Error generating file:', error);
        res.status(500).json({ message: 'Error generating file' });
    }
};


// Function fetch download history
const getDownloadHistory = async (req, res) => {
    try {
        const history = await DownloadHistory.findAll({
            where: { user_id: req.user.id },
            order: [['download_date', 'DESC']],
        });
        res.status(200).json({ history });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch download history', error: error.message });
    }
};

module.exports = {
    downloadExpenses,
    getDownloadHistory,
};
