import mongoose from 'mongoose';
import mongooseSequence from 'mongoose-sequence';

const NoteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AutoIncrement = mongooseSequence(mongoose as any);

NoteSchema.plugin(AutoIncrement as any, {
  inc_field: 'ticket',
  start_seq: 500,
  id: 'ticketNums',
});

export default mongoose.model('Note', NoteSchema);
