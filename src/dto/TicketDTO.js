class TicketDTO {
  constructor(ticket) {
    this.id = ticket._id || ticket.id;
    this.code = ticket.code;
    this.purchase_datetime = ticket.purchase_datetime;
    this.amount = ticket.amount;
    this.purchaser = ticket.purchaser;
    this.products = this.formatProducts(ticket.products || []);
    this.status = ticket.status;
    this.createdAt = ticket.createdAt;
  }

  formatProducts(products) {
    return products.map(item => ({
      productId: item.productId?._id || item.productId,
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal
    }));
  }

  static fromTicket(ticket) {
    if (!ticket) return null;
    return new TicketDTO(ticket);
  }

  static toListDTO(ticket) {
    return {
      id: ticket._id || ticket.id,
      code: ticket.code,
      amount: ticket.amount,
      purchaser: ticket.purchaser,
      purchase_datetime: ticket.purchase_datetime,
      status: ticket.status,
      totalItems: ticket.products?.length || 0
    };
  }

  static toDetailDTO(ticket) {
    return new TicketDTO(ticket);
  }
}

export default TicketDTO;