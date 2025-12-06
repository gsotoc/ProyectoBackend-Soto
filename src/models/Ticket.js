import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    default: function() {
      return `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  purchaser: {
    type: String, 
    required: true
  },
  products: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    title: String,
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  }
}, {
  timestamps: true,
  versionKey: false
});


ticketSchema.index({ code: 1 });
ticketSchema.index({ purchaser: 1 });
ticketSchema.index({ purchase_datetime: -1 });


ticketSchema.virtual('formattedDate').get(function() {
  return this.purchase_datetime.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

ticketSchema.set('toJSON', { virtuals: true });
ticketSchema.set('toObject', { virtuals: true });

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;