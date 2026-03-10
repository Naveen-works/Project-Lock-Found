import api from './api';

export const getAllItems = async () => {
  const response = await api.get('/items/all');
  return response.data;
};

export const reportLostItem = async (data, username) => {
  const response = await api.post(`/items/report-lost?username=${encodeURIComponent(username)}`, data);
  return response.data;
};

export const getUserItems = async (username) => {
  const response = await api.get(`/items/user/${encodeURIComponent(username)}`);
  return response.data;
};

// Admin-only: mark a LOST item as FOUND (admin becomes the finder)
export const reportFoundItem = async (itemId, adminUsername) => {
  const response = await api.post(`/items/${itemId}/report-found?username=${encodeURIComponent(adminUsername)}`);
  return response.data;
};

// Admin-only: mark a FOUND item as CLAIMED
export const claimItem = async (itemId, adminUsername) => {
  const response = await api.post(`/items/${itemId}/claim?username=${encodeURIComponent(adminUsername)}`);
  return response.data;
};

// Admin-only: dispatch a FOUND or CLAIMED item (sets is_dispatched = true, status = DISPATCHED)
export const dispatchItem = async (itemId, adminUsername) => {
  const response = await api.post(`/items/${itemId}/dispatch?username=${encodeURIComponent(adminUsername)}`);
  return response.data;
};
