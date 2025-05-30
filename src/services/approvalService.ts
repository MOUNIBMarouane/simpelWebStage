import api from './api/core';
import { 
  ApprovalGroup, 
  CreateApprovalGroupRequest, 
  ApproverInfo,
  PendingApproval,
  ApprovalResponse,
  ApprovalResponsePayload,
  ApprovalHistory,
  DocumentToApprove,
  ApprovalRuleType
} from '@/models/approval';

// Approvator (individual approver) interface
interface Approvator {
  id: number;
  userId: number;
  username: string;
  comment?: string;
  stepId?: number;
  stepTitle?: string;
}

// Create approvator request interface
interface CreateApprovatorRequest {
  userId: number;
  stepId?: number;
  comment?: string;
}

// Step approval configuration interface
interface StepApprovalConfigDto {
  requiresApproval: boolean;
  approvalType?: string;
  singleApproverId?: number;
  groupApproverIds?: number[];
  groupName?: string;
  ruleType?: string;
  comment?: string;
}

const approvalService = {
  // Get all approval groups
  getAllApprovalGroups: async (): Promise<ApprovalGroup[]> => {
    try {
      const response = await api.get('/Approval/groups');
      return response.data;
    } catch (error) {
      console.error('Error fetching approval groups:', error);
      throw error;
    }
  },

  // Get approval group by ID
  getApprovalGroupById: async (id: number): Promise<ApprovalGroup> => {
    try {
      const response = await api.get(`/Approval/groups/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching approval group with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new approval group
  createApprovalGroup: async (group: CreateApprovalGroupRequest): Promise<void> => {
    try {
      await api.post('/Approval/groups', group);
    } catch (error) {
      console.error('Error creating approval group:', error);
      throw error;
    }
  },

  // Delete approval group
  deleteApprovalGroup: async (id: number): Promise<void> => {
    try {
      await api.delete(`/Approval/groups/${id}`);
    } catch (error) {
      console.error(`Error deleting approval group with ID ${id}:`, error);
      throw error;
    }
  },

  // Get all eligible approvers (users who can be added to groups)
  getEligibleApprovers: async (): Promise<ApproverInfo[]> => {
    try {
      const response = await api.get('/Approval/eligible-approvers');
      return response.data;
    } catch (error) {
      console.error('Error fetching eligible approvers:', error);
      throw error;
    }
  },

  // Get members of a specific group
  getGroupMembers: async (groupId: number): Promise<ApproverInfo[]> => {
    try {
      const response = await api.get(`/Approval/groups/${groupId}/users`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching members for group ID ${groupId}:`, error);
      throw error;
    }
  },

  // Add user to group
  addUserToGroup: async (groupId: number, userId: number, orderIndex?: number): Promise<void> => {
    try {
      await api.post(`/Approval/groups/${groupId}/users`, { userId, orderIndex });
    } catch (error) {
      console.error(`Error adding user ${userId} to group ${groupId}:`, error);
      throw error;
    }
  },

  // Remove user from group
  removeUserFromGroup: async (groupId: number, userId: number): Promise<void> => {
    try {
      await api.delete(`/Approval/groups/${groupId}/users/${userId}`);
    } catch (error) {
      console.error(`Error removing user ${userId} from group ${groupId}:`, error);
      throw error;
    }
  },

  // Get all approvators (individual approvers)
  getAllApprovators: async (): Promise<Approvator[]> => {
    try {
      const response = await api.get('/Approval/approvators');
      return response.data;
    } catch (error) {
      console.error('Error fetching approvators:', error);
      throw error;
    }
  },

  // Get approvator by ID
  getApprovatorById: async (id: number): Promise<Approvator> => {
    try {
      const response = await api.get(`/Approval/approvators/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching approvator with ID ${id}:`, error);
      throw error;
    }
  },

  // Create new approvator
  createApprovator: async (approvator: CreateApprovatorRequest): Promise<Approvator> => {
    try {
      const response = await api.post('/Approval/approvators', approvator);
      return response.data;
    } catch (error) {
      console.error('Error creating approvator:', error);
      throw error;
    }
  },

  // Update existing approvator
  updateApprovator: async (id: number, approvator: CreateApprovatorRequest): Promise<void> => {
    try {
      await api.put(`/Approval/approvators/${id}`, approvator);
    } catch (error) {
      console.error(`Error updating approvator with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete approvator
  deleteApprovator: async (id: number): Promise<void> => {
    try {
      await api.delete(`/Approval/approvators/${id}`);
    } catch (error) {
      console.error(`Error deleting approvator with ID ${id}:`, error);
      throw error;
    }
  },

  // Get pending approvals for the current user
  getPendingApprovals: async (): Promise<PendingApproval[]> => {
    try {
      const response = await api.get('/Approval/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw error;
    }
  },

  // Get pending approvals for a specific user
  getPendingApprovalsForUser: async (userId: number): Promise<PendingApproval[]> => {
    try {
      const response = await api.get(`/Approval/pending/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pending approvals for user ${userId}:`, error);
      throw error;
    }
  },

  // Respond to an approval request
  respondToApproval: async (
    approvalId: number,
    response: ApprovalResponse
  ): Promise<void> => {
    try {
      // Convert to the API expected format
      const requestData: ApprovalResponsePayload = {
        isApproved: response.approved,
        result: response.approved,
        comments: response.comments || ""
      };
      
      await api.post(`/Approval/${approvalId}/respond`, requestData);
    } catch (error) {
      console.error(`Error responding to approval ${approvalId}:`, error);
      throw error;
    }
  },

  // Get approval history for a user
  getApprovalHistory: async (userId?: number): Promise<ApprovalHistory[]> => {
    try {
      // If userId is provided, use the user-specific endpoint
      const url = userId ? `/Approval/pending/user/${userId}` : '/Approval/pending';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching approval data${userId ? ` for user ${userId}` : ''}:`, error);
      throw error;
    }
  },

  // Get documents waiting for approval
  getDocumentsToApprove: async (): Promise<DocumentToApprove[]> => {
    try {
      const response = await api.get('/Approval/documents-to-approve');
      return response.data;
    } catch (error) {
      console.error('Error fetching documents to approve:', error);
      throw error;
    }
  },

  // Get steps with approval configuration
  getStepsWithApproval: async (): Promise<any[]> => {
    try {
      const response = await api.get('/Approval/configure/steps');
      return response.data;
    } catch (error) {
      console.error('Error fetching steps with approval configuration:', error);
      throw error;
    }
  },
  
  // Get step approval configuration
  getStepApprovalConfig: async (stepId: number): Promise<any> => {
    try {
      const response = await api.get(`/Approval/configure/step/${stepId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching approval configuration for step ${stepId}:`, error);
      throw error;
    }
  },
  
  // Configure step approval
  configureStepApproval: async (stepId: number, config: {
    requiresApproval: boolean;
    approvalType?: string;
    singleApproverId?: number;
    approverName?: string;
    approvatorsGroupId?: number;
    groupName?: string;
    ruleType?: string;
    comment?: string;
  }): Promise<void> => {
    try {
      await api.post(`/Approval/configure/step/${stepId}`, config);
    } catch (error) {
      console.error(`Error configuring approval for step ${stepId}:`, error);
      throw error;
    }
  },

  // Get pending approvals for a specific document
  getDocumentApprovals: async (documentId: number): Promise<PendingApproval[]> => {
    try {
      const response = await api.get(`/Approval/document/${documentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching approvals for document ${documentId}:`, error);
      // Return empty array if API endpoint doesn't exist yet
      return [];
    }
  },

  // Get approval history for a specific document
  getDocumentApprovalHistory: async (documentId: number): Promise<ApprovalHistory[]> => {
    try {
      const response = await api.get(`/Approval/document/${documentId}/history`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching approval history for document ${documentId}:`, error);
      // Return empty array if API endpoint doesn't exist yet
      return [];
    }
  }
};

export default approvalService; 