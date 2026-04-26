const PDFDocument = require('pdfkit');
const RentLog = require('../models/RentLog');
const Tenancy = require('../models/Tenancy');
const Tenant = require('../models/Tenant');
const Landlord = require('../models/Landlord');
const Property = require('../models/Property');
const AppError = require('../utils/AppError');

const generateReceipt = async (userId, role, { tenancyId, rentLogId }) => {
  // Validate access
  const accessFilter = role === 'LANDLORD'
    ? { _id: tenancyId, landlordId: userId }
    : { _id: tenancyId, tenantId: userId };

  const tenancy = await Tenancy.findOne(accessFilter);
  if (!tenancy) throw new AppError('Tenancy not found or access denied', 404);

  const rentLog = await RentLog.findOne({ _id: rentLogId, tenancyId });
  if (!rentLog) throw new AppError('Rent log not found', 404);

  const [tenant, landlord, property] = await Promise.all([
    Tenant.findById(tenancy.tenantId).lean(),
    Landlord.findById(tenancy.landlordId).lean(),
    Property.findById(tenancy.propertyId).lean(),
  ]);

  return { tenancy, rentLog, tenant, landlord, property };
};

/**
 * Streams a PDF rent receipt to the Express response object.
 */
const streamReceiptPDF = (res, { tenancy, rentLog, tenant, landlord, property }) => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename="receipt-${rentLog.month}.pdf"`
  );
  doc.pipe(res);

  const addr = property?.address || {};
  const propertyAddr = [addr.houseNumber, addr.society, addr.locality, addr.city]
    .filter(Boolean)
    .join(', ');

  // Header
  doc
    .fontSize(22)
    .font('Helvetica-Bold')
    .text('RENT RECEIPT', { align: 'center' })
    .moveDown(0.5);

  doc
    .fontSize(10)
    .font('Helvetica')
    .text('Kirayedar — Rental Management Platform', { align: 'center' })
    .moveDown(1.5);

  // Divider
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(1);

  const row = (label, value) => {
    doc.font('Helvetica-Bold').text(`${label}:`, { continued: true, width: 200 });
    doc.font('Helvetica').text(` ${value}`);
  };

  row('Receipt For Month', rentLog.month);
  row('Amount Paid', `₹${rentLog.amount.toLocaleString('en-IN')}`);
  row('Payment Status', rentLog.status.toUpperCase());
  if (rentLog.paidAt) row('Paid On', new Date(rentLog.paidAt).toLocaleDateString('en-IN'));
  doc.moveDown(0.5);

  row('Tenant Name', tenant?.name || 'N/A');
  row('Tenant Phone', tenant?.phone || 'N/A');
  doc.moveDown(0.5);

  row('Landlord Name', landlord?.name || 'N/A');
  row('Landlord Phone', landlord?.phone || 'N/A');
  doc.moveDown(0.5);

  row('Property', property?.name || 'N/A');
  if (propertyAddr) row('Address', propertyAddr);
  row('Monthly Rent', `₹${tenancy.rentAmount.toLocaleString('en-IN')}`);
  row('Security Deposit', `₹${tenancy.depositAmount.toLocaleString('en-IN')}`);

  doc.moveDown(1);
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke().moveDown(1);

  doc
    .fontSize(9)
    .font('Helvetica')
    .fillColor('grey')
    .text('This is a computer-generated receipt. No signature required.', { align: 'center' });

  doc.end();
};

module.exports = { generateReceipt, streamReceiptPDF };
