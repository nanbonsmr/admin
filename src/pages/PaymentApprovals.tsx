import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { 
  CreditCard, 
  Check, 
  X, 
  Eye, 
  Clock, 
  Users, 
  DollarSign,
  FileImage,
  Calendar,
  Filter
} from 'lucide-react';

const PaymentApprovals = () => {
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const pendingReceipts = useQuery(api.payments.getPendingPaymentReceipts);
  const allReceipts = useQuery(api.payments.getAllPaymentReceipts, {
    status: selectedStatus === 'all' ? undefined : selectedStatus as any,
    limit: 100,
  });
  const paymentStats = useQuery(api.payments.getPaymentStatistics);
  const adminUser = useQuery(api.users.getAdminUser);
  
  // Get image URL when a receipt is selected
  const receiptImageUrl = useQuery(
    api.fileStorage.getDownloadUrl, 
    selectedReceipt && selectedReceipt.receiptImage ? { storageId: selectedReceipt.receiptImage } : 'skip'
  );

  const approveReceipt = useMutation(api.payments.approvePaymentReceipt);
  const rejectReceipt = useMutation(api.payments.rejectPaymentReceipt);

  const handleApprove = async (receiptId: string) => {
    try {
      // Use a fallback admin ID if adminUser is not available
      const adminId = adminUser?._id || 'kh7b9x6qx8n5m2p4r1s7t9v3w8y2z5a1'; // fallback admin ID
      
      await approveReceipt({
        receiptId: receiptId as any,
        reviewerId: adminId as any,
        notes: reviewNotes,
      });
      setSelectedReceipt(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error approving receipt:', error);
      alert('Failed to approve receipt: ' + (error.message || 'Unknown error'));
    }
  };

  const handleReject = async (receiptId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      // Use a fallback admin ID if adminUser is not available
      const adminId = adminUser?._id || 'kh7b9x6qx8n5m2p4r1s7t9v3w8y2z5a1'; // fallback admin ID
      
      await rejectReceipt({
        receiptId: receiptId as any,
        reviewerId: adminId as any,
        rejectionReason,
        notes: reviewNotes,
      });
      setSelectedReceipt(null);
      setRejectionReason('');
      setReviewNotes('');
    } catch (error) {
      console.error('Error rejecting receipt:', error);
      alert('Failed to reject receipt: ' + (error.message || 'Unknown error'));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const receiptsToShow = selectedStatus === 'pending' ? pendingReceipts : allReceipts;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Payment Approvals</h1>
        <div className="flex items-center space-x-4">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Pending Only</option>
            <option value="all">All Receipts</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      {paymentStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">{paymentStats.receipts.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Users</p>
                <p className="text-2xl font-bold text-green-600">{paymentStats.users.approved}</p>
              </div>
              <Check className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receipts</p>
                <p className="text-2xl font-bold text-blue-600">{paymentStats.receipts.total}</p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-purple-600">{paymentStats.users.total}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </div>
      )}

      {/* Receipts Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedStatus === 'pending' ? 'Pending Payment Receipts' : 'Payment Receipts'}
          </h2>
        </div>

        {receiptsToShow && receiptsToShow.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {receiptsToShow.map((receipt) => (
                  <tr key={receipt._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{receipt.userName}</div>
                        <div className="text-sm text-gray-500">{receipt.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(receipt.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {receipt.paymentAmount ? `$${receipt.paymentAmount}` : 'Not specified'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                        {receipt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedReceipt(receipt)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {receipt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(receipt._id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedReceipt(receipt);
                                setRejectionReason('');
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500">
            <CreditCard className="mx-auto mb-4 text-gray-300" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedStatus === 'pending' ? 'No pending receipts' : 'No receipts found'}
            </h3>
            <p>
              {selectedStatus === 'pending' 
                ? 'All payment receipts have been reviewed' 
                : 'No payment receipts match the selected filter'}
            </p>
          </div>
        )}
      </div>

      {/* Receipt Review Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Review Payment Receipt</h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">User Name</label>
                  <p className="text-sm text-gray-900">{selectedReceipt.userName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedReceipt.userEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted Date</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedReceipt.submittedAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-sm text-gray-900">
                    {selectedReceipt.paymentAmount ? `$${selectedReceipt.paymentAmount}` : 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Payment Method */}
              {selectedReceipt.paymentMethod && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <p className="text-sm text-gray-900">{selectedReceipt.paymentMethod}</p>
                </div>
              )}

              {/* User Notes */}
              {selectedReceipt.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">User Notes</label>
                  <p className="text-sm text-gray-900">{selectedReceipt.notes}</p>
                </div>
              )}

              {/* Receipt Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Receipt Image</label>
                <div className="border rounded-lg p-4 bg-gray-50">
                  {selectedReceipt.receiptImage === 'temp-storage-id' ? (
                    <div className="flex items-center justify-center h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <FileImage className="mx-auto h-12 w-12 text-red-400" />
                        <p className="mt-2 text-sm text-red-500">Image Not Available</p>
                        <p className="text-xs text-red-400">This receipt was uploaded with a placeholder ID</p>
                        <p className="text-xs text-gray-400">Storage ID: {selectedReceipt.receiptImage}</p>
                      </div>
                    </div>
                  ) : receiptImageUrl ? (
                    <div className="flex flex-col items-center">
                      <img 
                        src={receiptImageUrl} 
                        alt="Payment Receipt" 
                        className="max-w-full max-h-96 object-contain rounded-lg shadow-sm border"
                        onError={(e) => {
                          console.error('Failed to load image:', e);
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling.style.display = 'block';
                        }}
                      />
                      <div style={{ display: 'none' }} className="text-center py-8">
                        <FileImage className="mx-auto h-12 w-12 text-red-400" />
                        <p className="mt-2 text-sm text-red-500">Failed to Load Image</p>
                        <p className="text-xs text-gray-400">Storage ID: {selectedReceipt.receiptImage}</p>
                      </div>
                      <p className="mt-2 text-xs text-gray-400">Storage ID: {selectedReceipt.receiptImage}</p>
                      <button
                        onClick={() => window.open(receiptImageUrl, '_blank')}
                        className="mt-2 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Open in New Tab
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-500">Loading Receipt Image...</p>
                        <p className="text-xs text-gray-400">Storage ID: {selectedReceipt.receiptImage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Review Notes (Optional)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any notes about this review..."
                />
              </div>

              {/* Rejection Reason (if rejecting) */}
              {selectedReceipt.status === 'pending' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason (Required for rejection)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Explain why this receipt is being rejected..."
                  />
                </div>
              )}

              {/* Previous Review Info */}
              {selectedReceipt.status !== 'pending' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Review Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getStatusColor(selectedReceipt.status)}`}>
                        {selectedReceipt.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Reviewed by:</span>
                      <span className="ml-2 text-gray-900">{selectedReceipt.reviewerName || 'Unknown'}</span>
                    </div>
                    {selectedReceipt.reviewedAt && (
                      <div>
                        <span className="text-gray-600">Reviewed at:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(selectedReceipt.reviewedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {selectedReceipt.rejectionReason && (
                      <div className="col-span-2">
                        <span className="text-gray-600">Rejection reason:</span>
                        <p className="mt-1 text-gray-900">{selectedReceipt.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedReceipt(null);
                  setRejectionReason('');
                  setReviewNotes('');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              
              {selectedReceipt.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReject(selectedReceipt._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(selectedReceipt._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <Check className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentApprovals;