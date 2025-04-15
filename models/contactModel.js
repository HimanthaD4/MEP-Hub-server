import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  message: { type: String, required: true }
}, { timestamps: true });

contactSchema.pre('validate', function(next) {
  if (!this.email && !this.phone) {
    this.invalidate('contact', 'Either email or phone must be provided');
  }
  next();
});

export default mongoose.model('Contact', contactSchema);