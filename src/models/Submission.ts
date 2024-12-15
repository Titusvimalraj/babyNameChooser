// models/Submission.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface ISubmission extends Document {
  userName: string;
  selectedNames: mongoose.Types.ObjectId[]; // Use ObjectId array for selectedNames type
  token: string; // Add token field
}

const SubmissionSchema: Schema = new Schema({
  userName: { type: String, required: true },
  selectedNames: [{ type: Schema.Types.ObjectId, ref: 'Name', required: true }], // Use ObjectId and reference 'Name'
  token: { type: String, required: true, unique: true }, // Ensure token is unique
});

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
export default Submission;
