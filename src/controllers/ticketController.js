import { asyncHandler } from '../middleware/errorMiddleware.js';
import { NotFoundError, ForbiddenError } from '../utils/CustomErrors.js';

class TicketController {
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }


  // Obtener ticket por ID
  getTicketById = asyncHandler(async (req, res) => {
    const { tid } = req.params;
    const ticket = await this.ticketRepository.getTicketById(tid);

    // Verificar que el usuario sea el comprador o admin
    if (ticket.purchaser !== req.user.email && req.user.role !== 'admin') {
      throw new ForbiddenError('No tienes permiso para ver este ticket');
    }

    res.json({
      status: 'success',
      payload: ticket
    });
  });

  // Obtener ticket por código
  getTicketByCode = asyncHandler(async (req, res) => {
    const { code } = req.params;
    const ticket = await this.ticketRepository.getTicketByCode(code);

    // Verificar permisos
    if (ticket.purchaser !== req.user.email && req.user.role !== 'admin') {
      throw new ForbiddenError('No tienes permiso para ver este ticket');
    }

    res.json({
      status: 'success',
      payload: ticket
    });
  });

  // Obtener tickets del usuario actual
  getMyTickets = asyncHandler(async (req, res) => {
    const tickets = await this.ticketRepository.getTicketsByPurchaser(req.user.email);
    
    res.json({
      status: 'success',
      payload: tickets
    });
  });


  // Renderizar vista de tickets del usuario
  renderMyTickets = asyncHandler(async (req, res) => {
    const tickets = await this.ticketRepository.getTicketsByPurchaser(req.user.email);
    
    res.render('my-tickets', {
      title: 'Mis Compras',
      tickets
    });
  });

  renderTicketDetail = asyncHandler(async (req, res) => {
    const { tid } = req.params;
    const ticket = await this.ticketRepository.getTicketById(tid);

    // Verificar permisos
    if (ticket.purchaser !== req.user.email && req.user.role !== 'admin') {
      throw new ForbiddenError('No tienes permiso para ver este ticket');
    }

    res.render('ticket-details', {
      title: `Ticket ${ticket.code}`,
      ticket
    });
  });
}

export default TicketController;
