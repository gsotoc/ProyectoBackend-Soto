import { NotFoundError, ValidationError } from '../utils/CustomErrors.js';
import TicketDTO from '../dto/TicketDTO.js';

class TicketRepository {
  constructor(ticketDao) {
    this.ticketDao = ticketDao;
  }

  validateId(id, name = "ID") {
    if (!this.ticketDao.isValidId(id)) {
      throw new ValidationError(`${name} inválido`);
    }
  }

  async createTicket(ticketData) {
    // Validar datos requeridos
    if (!ticketData.purchaser) {
      throw new ValidationError('El email del comprador es obligatorio');
    }

    if (!ticketData.products || ticketData.products.length === 0) {
      throw new ValidationError('El ticket debe tener al menos un producto');
    }

    if (!ticketData.amount || ticketData.amount <= 0) {
      throw new ValidationError('El monto debe ser mayor a 0');
    }

    const ticket = await this.ticketDao.create(ticketData);
    return TicketDTO.fromTicket(ticket);
  }

  async getTicketById(id) {
    this.validateId(id, "ID de ticket");

    const ticket = await this.ticketDao.findById(id);
    if (!ticket) {
      throw new NotFoundError("Ticket no encontrado");
    }

    return TicketDTO.fromTicket(ticket);
  }

  async getTicketByCode(code) {
    if (!code) {
      throw new ValidationError("El código del ticket es obligatorio");
    }

    const ticket = await this.ticketDao.findByCode(code);
    if (!ticket) {
      throw new NotFoundError("Ticket no encontrado");
    }

    return TicketDTO.fromTicket(ticket);
  }

  async getTicketsByPurchaser(email) {
    if (!email) {
      throw new ValidationError("El email es obligatorio");
    }

    const tickets = await this.ticketDao.findByPurchaser(email);
    return tickets.map(ticket => TicketDTO.toListDTO(ticket));
  }

  async getAllTickets() {
    const tickets = await this.ticketDao.findAll();
    return tickets.map(ticket => TicketDTO.toListDTO(ticket));
  }

  async updateTicketStatus(id, status) {
    this.validateId(id, "ID de ticket");

    const validStatuses = ['pending', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError(`Estado inválido. Debe ser: ${validStatuses.join(', ')}`);
    }

    const ticket = await this.ticketDao.updateStatus(id, status);
    if (!ticket) {
      throw new NotFoundError("Ticket no encontrado");
    }

    return TicketDTO.fromTicket(ticket);
  }
}

export default TicketRepository;