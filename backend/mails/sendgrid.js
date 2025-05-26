import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
    try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(to)) {
            throw new Error(`Invalid recipient email format: ${to}`);
        }

        const msg = {
            to,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject,
            html,
        };
        
        console.log('Attempting to send email with config:', {
            to,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject,
            apiKeyLength: process.env.SENDGRID_API_KEY?.length || 0
        });

        const response = await sgMail.send(msg);
        console.log('Email sent successfully:', response[0].statusCode);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        if (error.response) {
            console.error('SendGrid API Error Details:', {
                statusCode: error.response.statusCode,
                body: error.response.body,
                headers: error.response.headers
            });
        }
        throw new Error(`Failed to send email: ${error.message}`);
    }
}; 