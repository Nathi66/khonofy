import { jsPDF } from 'jspdf';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const USERS = [
  { fullName: 'James Mokoena', email: 'james@khonofy.local', designation: 'Operations Manager', department: 'Operations' },
  { fullName: 'Chris Naidoo', email: 'chris@khonofy.local', designation: 'Project Manager', department: 'Operations' },
  { fullName: 'Mac Pillay', email: 'mac@khonofy.local', designation: 'Staff', department: 'Operations' },
  { fullName: 'Nkosinathi Radebe', email: 'nkosinathi.radebe@khonofy.local', designation: 'Senior Developer', department: 'Engineering' },
  { fullName: 'Thandiwe Khumalo', email: 'thandiwe.khumalo@khonofy.local', designation: 'UX Designer', department: 'Engineering' },
  { fullName: 'Sipho Dlamini', email: 'sipho.dlamini@khonofy.local', designation: 'DevOps Engineer', department: 'Engineering' },
  { fullName: 'Lerato Molefe', email: 'lerato.molefe@khonofy.local', designation: 'QA Engineer', department: 'Engineering' },
  { fullName: 'Ayanda Zulu', email: 'ayanda.zulu@khonofy.local', designation: 'Junior Developer', department: 'Engineering' },
  { fullName: 'Zanele Ngcobo', email: 'zanele.ngcobo@khonofy.local', designation: 'Business Analyst', department: 'Client Delivery' },
  { fullName: 'David van der Merwe', email: 'david.vandermerwe@khonofy.local', designation: 'Team Lead', department: 'Client Delivery' },
  { fullName: 'Precious Mthembu', email: 'precious.mthembu@khonofy.local', designation: 'Support Specialist', department: 'Client Delivery' },
  { fullName: 'Kagiso Modise', email: 'kagiso.modise@khonofy.local', designation: 'Account Executive', department: 'Sales & Marketing' },
  { fullName: 'Nomvula Sithole', email: 'nomvula.sithole@khonofy.local', designation: 'Marketing Coordinator', department: 'Sales & Marketing' },
  { fullName: 'Brian Botha', email: 'brian.botha@khonofy.local', designation: 'Data Analyst', department: 'Finance' },
  { fullName: 'Fatima Patel', email: 'fatima.patel@khonofy.local', designation: 'Finance Manager', department: 'Finance' },
  { fullName: 'Tshepo Mabaso', email: 'tshepo.mabaso@khonofy.local', designation: 'Staff', department: 'Finance' },
  { fullName: 'Amanda Fourie', email: 'amanda.fourie@khonofy.local', designation: 'HR Coordinator', department: 'Human Resources' },
  { fullName: 'Mandla Ndlovu', email: 'mandla.ndlovu@khonofy.local', designation: 'Recruitment Specialist', department: 'Human Resources' },
  { fullName: 'Rebecca Smith', email: 'rebecca.smith@khonofy.local', designation: 'Staff', department: 'Human Resources' },
  { fullName: 'Peter Okonkwo', email: 'peter.okonkwo@khonofy.local', designation: 'Staff', department: 'Operations' },
];

const COLUMNS = [
  { key: 'index', label: '#', width: 10 },
  { key: 'fullName', label: 'Full Name', width: 42 },
  { key: 'email', label: 'Email', width: 58 },
  { key: 'designation', label: 'Designation', width: 38 },
  { key: 'department', label: 'Department', width: 32 },
];

function truncate(text, maxChars) {
  const value = String(text || '');
  return value.length > maxChars ? `${value.slice(0, maxChars - 1)}…` : value;
}

function createUsersPdf() {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const rowHeight = 8;
  const headerHeight = 9;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Khonofy User Directory', margin, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('Full names, email addresses, designations, and departments', margin, 22);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-ZA', { dateStyle: 'long' })}`, margin, 27);
  doc.setTextColor(0, 0, 0);

  let y = 34;

  function drawHeader() {
    doc.setFillColor(30, 41, 59);
    doc.rect(margin, y, pageWidth - margin * 2, headerHeight, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);

    let x = margin + 2;
    for (const column of COLUMNS) {
      doc.text(column.label, x, y + 6);
      x += column.width;
    }

    y += headerHeight;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
  }

  drawHeader();

  USERS.forEach((user, index) => {
    if (y + rowHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeader();
    }

    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, pageWidth - margin * 2, rowHeight, 'F');
    }

    doc.setFontSize(8.5);
    let x = margin + 2;
    const values = {
      index: String(index + 1),
      fullName: user.fullName,
      email: user.email,
      designation: user.designation,
      department: user.department,
    };

    for (const column of COLUMNS) {
      const text = truncate(values[column.key], Math.floor(column.width / 1.8));
      doc.text(text, x, y + 5.5);
      x += column.width;
    }

    y += rowHeight;
  });

  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Total users: ${USERS.length}`, margin, pageHeight - 8);

  return doc.output('arraybuffer');
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = join(__dirname, '..', 'docs');
const outputPath = join(outputDir, 'khonofy-users-list.pdf');

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, Buffer.from(createUsersPdf()));

console.log(`Created ${outputPath}`);
