// models/Name.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IName extends Document {
  name: string;
  type: 'boy' | 'girl';
}

const NameSchema: Schema = new Schema({
  name: { type: String, required: true, unique:true, index: true },
  type: { type: String, enum: ['boy', 'girl'], required: true },
});

const Name: Model<IName> = mongoose.models.Name || mongoose.model<IName>('Name', NameSchema);
export default Name;
