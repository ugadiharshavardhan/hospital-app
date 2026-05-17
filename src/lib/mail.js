import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html, text }) {
  const mailOptions = {
    from: `"${process.env.NEXT_PUBLIC_APP_NAME || 'MediCare'}" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
    text,
  };

  return transporter.sendMail(mailOptions);
}

export function getOTPEmailTemplate(name, otp) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px; border-radius: 12px;">
      <div style="background: #2563eb; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
        <h1 style="color: white; margin: 0; font-size: 24px;">MediCare Hospital</h1>
      </div>
      <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #1e293b; margin-top: 0;">Hello, ${name}!</h2>
        <p style="color: #64748b;">Your OTP for email verification is:</p>
        <div style="background: #eff6ff; border: 2px dashed #2563eb; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <span style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px;">${otp}</span>
        </div>
        <p style="color: #64748b;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
      </div>
      <p style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 20px;">© 2025 MediCare Hospital. All rights reserved.</p>
    </div>
  `;
}

export function getAppointmentConfirmationTemplate(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Appointment Confirmed</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <h2 style="color: #1e293b;">Hello, ${data.patientName}!</h2>
        <p style="color: #64748b;">Your appointment has been confirmed with the following details:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Doctor</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">Dr. ${data.doctorName}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Department</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">${data.department}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Date</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">${data.date}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold;">Time</td>
            <td style="padding: 12px; border: 1px solid #e2e8f0;">${data.slot}</td>
          </tr>
        </table>
        <p style="color: #64748b;">Please arrive 15 minutes early. Bring your ID and insurance card.</p>
      </div>
    </div>
  `;
}

export function getResetPasswordTemplate(name, resetUrl) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Reset Your Password</h1>
      </div>
      <div style="padding: 30px; background: white;">
        <h2>Hello, ${name}!</h2>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 20px 0;">Reset Password</a>
        <p style="color: #94a3b8; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;
}
