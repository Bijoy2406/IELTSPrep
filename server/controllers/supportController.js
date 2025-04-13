const { SupportTicket, TicketMessage, User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const { Op } = require('sequelize');

/**
 * @desc    Create a new support ticket
 * @route   POST /api/support/tickets
 * @access  Private
 */
const createTicket = asyncHandler(async (req, res) => {
  const { subject, description, category, priority } = req.body;

  // Create ticket
  const ticket = await SupportTicket.create({
    userId: req.user.id,
    subject,
    description,
    category: category || 'other',
    priority: priority || 'medium',
    status: 'open'
  });

  // Create initial message from the ticket description
  await TicketMessage.create({
    ticketId: ticket.id,
    userId: req.user.id,
    message: description,
    isAdminResponse: false,
    isRead: true
  });

  res.status(201).json({
    success: true,
    data: ticket
  });
});

/**
 * @desc    Get user's tickets
 * @route   GET /api/support/tickets
 * @access  Private
 */
const getUserTickets = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = { userId: req.user.id };
  if (status) filter.status = status;

  // Calculate pagination
  const offset = (page - 1) * limit;

  // Get user's tickets
  const tickets = await SupportTicket.findAndCountAll({
    where: filter,
    include: [
      {
        model: User,
        as: 'assignee',
        attributes: ['id', 'firstname', 'lastname', 'email']
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['updatedAt', 'DESC']]
  });

  // Calculate total pages
  const totalPages = Math.ceil(tickets.count / limit);

  res.json({
    success: true,
    data: tickets.rows,
    pagination: {
      total: tickets.count,
      page: parseInt(page),
      pages: totalPages,
      limit: parseInt(limit)
    }
  });
});

/**
 * @desc    Get all tickets (admin only)
 * @route   GET /api/support/all-tickets
 * @access  Private/Admin
 */
const getAllTickets = asyncHandler(async (req, res) => {
  const { status, category, priority, page = 1, limit = 10 } = req.query;

  // Build filter object
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;

  // Filter for unassigned tickets
  const unassigned = req.query.unassigned === 'true';
  if (unassigned) {
    filter.assignedTo = null;
  }

  // Filter for tickets assigned to current admin
  const myTickets = req.query.myTickets === 'true';
  if (myTickets) {
    filter.assignedTo = req.user.id;
  }

  // Calculate pagination
  const offset = (page - 1) * limit;

  // Get tickets
  const tickets = await SupportTicket.findAndCountAll({
    where: filter,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstname', 'lastname', 'email']
      },
      {
        model: User,
        as: 'assignee',
        attributes: ['id', 'firstname', 'lastname', 'email']
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [
      ['status', 'ASC'], // Open tickets first
      ['priority', 'DESC'], // High priority first
      ['updatedAt', 'DESC'] // Most recent updates
    ]
  });

  // Calculate total pages
  const totalPages = Math.ceil(tickets.count / limit);

  res.json({
    success: true,
    data: tickets.rows,
    pagination: {
      total: tickets.count,
      page: parseInt(page),
      pages: totalPages,
      limit: parseInt(limit)
    }
  });
});

/**
 * @desc    Get a ticket by ID
 * @route   GET /api/support/tickets/:id
 * @access  Private
 */
const getTicketById = asyncHandler(async (req, res) => {
  // Admin check
  const isAdmin = req.user.role === 'admin';

  // Set up filter based on user role
  const filter = { id: req.params.id };
  if (!isAdmin) {
    // If not admin, user can only see their own tickets
    filter.userId = req.user.id;
  }

  const ticket = await SupportTicket.findOne({
    where: filter,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstname', 'lastname', 'email']
      },
      {
        model: User,
        as: 'assignee',
        attributes: ['id', 'firstname', 'lastname', 'email']
      },
      {
        model: TicketMessage,
        as: 'messages',
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstname', 'lastname', 'email', 'role']
          }
        ],
        order: [['createdAt', 'ASC']]
      }
    ]
  });

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found or not authorized');
  }

  res.json({
    success: true,
    data: ticket
  });
});

/**
 * @desc    Update a ticket
 * @route   PUT /api/support/tickets/:id
 * @access  Private/Admin
 */
const updateTicket = asyncHandler(async (req, res) => {
  const { status, priority, assignedTo } = req.body;

  // Find ticket
  let ticket = await SupportTicket.findByPk(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  // Check authorization
  const isAdmin = req.user.role === 'admin';
  const isOwner = ticket.userId === req.user.id;

  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error('Not authorized to update this ticket');
  }

  // Create update object
  const updateData = {};

  // Regular users can only close their own tickets
  if (isOwner && !isAdmin && status) {
    if (status === 'closed') {
      updateData.status = status;
      updateData.closedDate = new Date();
    } else {
      res.status(403);
      throw new Error('Regular users can only close tickets, not change status otherwise');
    }
  }

  // Admins can update all fields
  if (isAdmin) {
    if (status) {
      updateData.status = status;

      // Set dates based on status
      if (status === 'resolved') {
        updateData.resolvedDate = new Date();
      } else if (status === 'closed') {
        updateData.closedDate = new Date();
      }
    }

    if (priority) updateData.priority = priority;

    if (assignedTo) {
      // Check if assignee exists and is an admin
      const assignee = await User.findOne({
        where: {
          id: assignedTo,
          role: 'admin'
        }
      });

      if (!assignee) {
        res.status(404);
        throw new Error('Assignee not found or is not an admin');
      }

      updateData.assignedTo = assignedTo;
    }
  }

  // Update ticket
  ticket = await ticket.update(updateData);

  res.json({
    success: true,
    message: 'Ticket updated successfully',
    data: ticket
  });
});

/**
 * @desc    Add a message to a ticket
 * @route   POST /api/support/tickets/:id/messages
 * @access  Private
 */
const addTicketMessage = asyncHandler(async (req, res) => {
  const { message, attachmentUrl } = req.body;

  // Find ticket
  const ticket = await SupportTicket.findByPk(req.params.id);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  // Check authorization
  const isAdmin = req.user.role === 'admin';
  const isOwner = ticket.userId === req.user.id;

  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error('Not authorized to add messages to this ticket');
  }

  // Create message
  const ticketMessage = await TicketMessage.create({
    ticketId: ticket.id,
    userId: req.user.id,
    message,
    attachmentUrl,
    isAdminResponse: isAdmin,
    isRead: false
  });

  // If ticket is closed, reopen it
  if (ticket.status === 'closed' || ticket.status === 'resolved') {
    await ticket.update({
      status: 'in-progress',
      resolvedDate: null,
      closedDate: null
    });
  }

  // If ticket is open and this is an admin response, update to in-progress
  if (ticket.status === 'open' && isAdmin) {
    await ticket.update({
      status: 'in-progress',
      // If not already assigned, assign to this admin
      assignedTo: ticket.assignedTo || req.user.id
    });
  }

  // Get message with user data
  const messageWithUser = await TicketMessage.findByPk(ticketMessage.id, {
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstname', 'lastname', 'email', 'role']
      }
    ]
  });

  res.status(201).json({
    success: true,
    data: messageWithUser
  });
});

/**
 * @desc    Mark ticket messages as read
 * @route   PUT /api/support/tickets/:id/read
 * @access  Private
 */
const markMessagesAsRead = asyncHandler(async (req, res) => {
  const ticketId = req.params.id;

  // Find ticket
  const ticket = await SupportTicket.findByPk(ticketId);

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found');
  }

  // Check authorization
  const isAdmin = req.user.role === 'admin';
  const isOwner = ticket.userId === req.user.id;

  if (!isAdmin && !isOwner) {
    res.status(403);
    throw new Error('Not authorized to access this ticket');
  }

  // Mark messages as read based on user role
  await TicketMessage.update(
    { isRead: true },
    {
      where: {
        ticketId,
        isRead: false,
        // User sees admin responses as read
        // Admin sees user messages as read
        isAdminResponse: !isAdmin
      }
    }
  );

  res.json({
    success: true,
    message: 'Messages marked as read'
  });
});

module.exports = {
  createTicket,
  getUserTickets,
  getAllTickets,
  getTicketById,
  updateTicket,
  addTicketMessage,
  markMessagesAsRead
};
