// models/Submission.ts
import mongoose, { Document, Model, Schema } from 'mongoose';
import Name, { IName } from './Name'; // Import the IName interface

interface ISubmission extends Document {
  userName: string;
  selectedNames: IName[]; // Use the IName interface for selectedNames type
}

const SubmissionSchema: Schema = new Schema({
  userName: { type: String, required: true },
  selectedNames: [Name],
});

const Submission: Model<ISubmission> = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);
export default Submission;
