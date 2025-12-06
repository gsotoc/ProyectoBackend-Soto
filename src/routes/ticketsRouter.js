import { Router } from 'express';
import TicketDao from '../dao/TicketDao.js';
import TicketRepository from '../repositories/TicketRepository.js';
import TicketController from '../controllers/TicketController.js';
import { requireAuth, requireRole } from '../middleware/authenticationMiddleware.js';

const router = Router();

const ticketDao = new TicketDao();
const ticketRepository = new TicketRepository(ticketDao);
const controller = new TicketController(ticketRepository);


router.use(requireAuth);


router.get('/my-tickets', controller.renderMyTickets); 
router.get('/my-tickets/api', controller.getMyTickets); 

router.get('/:tid/ticket-details', controller.renderTicketDetail);
router.get('/:tid', controller.getTicketById); 
router.get('/code/:code', controller.getTicketByCode); 


export default router;