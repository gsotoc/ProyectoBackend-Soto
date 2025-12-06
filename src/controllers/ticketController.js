import { asyncHandler } from '../middleware/errorMiddleware.js';
import { NotFoundError, ForbiddenError } from '../utils/CustomErrors.js';

class TicketController {
  constructor(ticketRepository) {
    this.ticketRepository = ticketRepository;
  }

  // Obtener todos los tickets (solo admin)
  getAllTickets = asyncHandler(async (req, res) => {
    const tickets = await this.ticketRepository.getAllTickets();
    
    res.json({
      status: 'success',
      payload: tickets
    });
  });

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

  // Obtener tickets de un usuario específico (solo admin)
  getTicketsByUser = asyncHandler(async (req, res) => {
    const { email } = req.params;
    const tickets = await this.ticketRepository.getTicketsByPurchaser(email);
    
    res.json({
      status: 'success',
      payload: tickets
    });
  });

  // Actualizar estado de ticket (solo admin)
  updateTicketStatus = asyncHandler(async (req, res) => {
    const { tid } = req.params;
    const { status } = req.body;

    const ticket = await this.ticketRepository.updateTicketStatus(tid, status);
    
    res.json({
      status: 'success',
      message: 'Estado del ticket actualizado',
      payload: ticket
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

  // ✅ CORREGIDO: Renderizar detalle de un ticket
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