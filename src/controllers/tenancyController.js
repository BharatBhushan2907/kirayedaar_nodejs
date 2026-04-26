const asyncHandler = require('../utils/asyncHandler');
const { success } = require('../utils/response');
const tenancyService = require('../services/tenancyService');

const requestLink = asyncHandler(async (req, res) => {
  const tenancy = await tenancyService.requestLink(req.user.userId, req.body);
  success(res, tenancy, 'Tenancy request sent to tenant', 201);
});

const respondLink = asyncHandler(async (req, res) => {
  const tenancy = await tenancyService.respondLink(req.user.userId, req.body);
  const msg = req.body.action === 'approve' ? 'Tenancy approved' : 'Tenancy request rejected';
  success(res, tenancy, msg);
});

const listTenancies = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;
  const tenancies = await tenancyService.listTenancies(userId, role);
  success(res, tenancies);
});

const endTenancy = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;
  const tenancy = await tenancyService.endTenancy(userId, role, req.body.tenancyId);
  success(res, tenancy, 'Tenancy ended successfully');
});

module.exports = { requestLink, respondLink, listTenancies, endTenancy };
