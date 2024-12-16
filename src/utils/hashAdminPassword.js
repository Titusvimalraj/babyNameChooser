import bcrypt from 'bcryptjs';
const hashedPassword = await bcrypt.hash(process.env.PASSWORD!, 10);
console.log(hashedPassword);