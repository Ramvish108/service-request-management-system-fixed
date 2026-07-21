import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ServiceRequest } from '../models/ServiceRequest';
import mongoose from 'mongoose';

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, priority } = req.body;

    // ✅ Enhanced validation
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    if (title.length < 3) {
      return res.status(400).json({ error: 'Title must be at least 3 characters' });
    }

    if (description.length < 10) {
      return res.status(400).json({ error: 'Description must be at least 10 characters' });
    }

    // ✅ Validate priority enum
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
    const validCategories = ['SOFTWARE', 'HARDWARE', 'NETWORK', 'ACCESS', 'OTHER'];

    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority value' });
    }

    if (category && !validCategories.includes(category)) {
      return res.status(400).json({ error: 'Invalid category value' });
    }

    const newRequest = new ServiceRequest({
      title: title.trim(),
      description: description.trim(),
      category: category || 'OTHER',
      priority: priority || 'MEDIUM',
      status: 'OPEN',
      createdBy: req.user?.id,
      statusHistory: [
        {
          status: 'OPEN',
          changedBy: new mongoose.Types.ObjectId(req.user?.id),
          comment: 'Request created',
          changedAt: new Date(),
        },
      ],
    });

    const savedRequest = await newRequest.save();
    return res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Create request error:', error);
    return res.status(500).json({ 
      error: 'Failed to create request', 
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
    });
  }
};

// ✅ FIXED: Users see only their own requests
export const getRequests = async (req: AuthRequest, res: Response) => {
  try {
    const filter: { createdBy?: string } = {};
    
    if (req.user?.role !== 'ADMIN') {
      filter.createdBy = req.user?.id;
    }
    
    const requests = await ServiceRequest.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    return res.status(500).json({ error: 'Failed to fetch requests' });
  }
};

// ✅ FIXED: Ownership check added
export const getRequestById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name email');

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const createdById = request.createdBy?._id?.toString() || request.createdBy?.toString();
    if (createdById !== req.user?.id && req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden - You can only view your own requests' });
    }

    return res.status(200).json(request);
  } catch (error) {
    console.error('Get request by id error:', error);
    return res.status(500).json({ 
      error: 'Error fetching request details', 
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
    });
  }
};

// ✅ FIXED: Admin only + status history
export const updateRequestStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden - Only admins can update status' });
    }

    // ✅ Validate status
    const validStatuses = ['OPEN', 'IN_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // ✅ Prevent invalid transitions
    if (request.status === 'RESOLVED' && status !== 'RESOLVED') {
      return res.status(400).json({ error: 'Resolved requests cannot be changed' });
    }

    if (request.status === 'CANCELLED' && status !== 'CANCELLED') {
      return res.status(400).json({ error: 'Cancelled requests cannot be changed' });
    }

    request.statusHistory.push({
      status: status,
      changedBy: new mongoose.Types.ObjectId(req.user?.id),
      comment: note || `Status changed to ${status}`,
      changedAt: new Date(),
    });

    request.status = status;
    await request.save();
    
    const updatedRequest = await ServiceRequest.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name email');

    return res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(500).json({ 
      error: 'Failed to update status', 
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
    });
  }
};

// ✅ FIXED: Admin only
export const assignRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;
    
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden - Only admins can assign requests' });
    }

    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // ✅ Update assignment
    if (assignedTo) {
      request.assignedTo = new mongoose.Types.ObjectId(assignedTo);
      request.statusHistory.push({
        status: request.status,
        changedBy: new mongoose.Types.ObjectId(req.user?.id),
        comment: `Assigned to ${assignedTo}`,
        changedAt: new Date(),
      });
      await request.save();
    }
    
    return res.status(200).json({
      message: 'Request assigned successfully',
      request,
    });
  } catch (error) {
    console.error('Assign request error:', error);
    return res.status(500).json({ 
      error: 'Failed to assign request',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
    });
  }
};

// ✅ FIXED: Ownership check + status check
export const cancelRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const request = await ServiceRequest.findById(id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    const createdById = request.createdBy?.toString();
    if (createdById !== req.user?.id) {
      return res.status(403).json({ error: 'Forbidden - You can only cancel your own requests' });
    }

    if (request.status === 'RESOLVED' || request.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Cannot cancel resolved or already cancelled requests' });
    }

    request.status = 'CANCELLED';
    request.statusHistory.push({
      status: 'CANCELLED',
      changedBy: new mongoose.Types.ObjectId(req.user?.id),
      comment: 'Cancelled by user',
      changedAt: new Date(),
    });

    await request.save();
    
    const cancelledRequest = await ServiceRequest.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    return res.status(200).json(cancelledRequest);
  } catch (error) {
    console.error('Cancel request error:', error);
    return res.status(500).json({ 
      error: 'Failed to cancel request', 
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
    });
  }
};