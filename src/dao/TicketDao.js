import Ticket from "../models/Ticket.js";
import mongoose from "mongoose";

class TicketDao {
  async create(ticketData) {
    const ticket = new Ticket(ticketData);
    return ticket.save();
  }

  async findById(id) {
    return Ticket.findById(id)
      .populate('products.productId')
      .lean();
  }

  async findByCode(code) {
    return Ticket.findOne({ code })
      .populate('products.productId')
      .lean();
  }

  async findByPurchaser(email) {
    return Ticket.find({ purchaser: email })
      .sort({ purchase_datetime: -1 })
      .populate('products.productId')
      .lean();
  }

  async findAll() {
    return Ticket.find()
      .sort({ purchase_datetime: -1 })
      .populate('products.productId')
      .lean();
  }

  async updateStatus(id, status) {
    return Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
  }

  isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }
}

export default TicketDao;