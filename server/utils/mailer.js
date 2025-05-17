import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'fyoorr@gmail.com',
    pass: 'brtxurtytzbsabpx', // ⚠️ mot de passe d'application Gmail
  },
});

export async function envoyerEmail(destinataire, sujet, contenuHtml) {
  await transporter.sendMail({
    from: `"L'Oasis Spa" <fyoorr@gmail.com>`,
    to: destinataire,
    subject: sujet,
    html: contenuHtml,
  });
}