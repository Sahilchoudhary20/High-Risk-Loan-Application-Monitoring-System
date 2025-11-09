import { Request, Response } from 'express';
import { Loan } from '../models/Loan';
import { v4 as uuidv4 } from 'uuid';

const now = () => new Date().toISOString();


const DB: Record<string, Loan> = {};


const allowedStatuses: Loan['status'][] = ['pending', 'review', 'approved', 'rejected'];


function isValidStatus(s: unknown): s is Loan['status'] {
  return typeof s === 'string' && (allowedStatuses as string[]).includes(s);
}


type CreateLoanBody = {
  applicantName: string;
  amount: number | string;
  riskScore: number | string;
  status: unknown; // validate at runtime
};

type UpdateLoanBody = Partial<{
  applicantName: string;
  amount: number | string;
  riskScore: number | string;
  status: unknown; // validate at runtime
}>;


export const createLoan = (req: Request<unknown, unknown, CreateLoanBody>, res: Response) => {
  const { applicantName, amount, riskScore, status } = req.body ?? ({} as CreateLoanBody);


  if (!applicantName || amount === undefined || amount === null || riskScore === undefined || riskScore === null || status === undefined) {
    return res.status(400).json({
      message: 'applicantName, amount, riskScore and status are required in request body'
    });
  }


  const amt = Number(amount);
  const rs = Number(riskScore);
  if (Number.isNaN(amt) || Number.isNaN(rs)) {
    return res.status(400).json({ message: 'amount and riskScore must be numeric' });
  }


  if (!isValidStatus(status)) {
    return res.status(400).json({ message: `status must be one of: ${allowedStatuses.join(', ')}` });
  }

  const id = uuidv4();
  const newLoan: Loan = {
    id,
    applicantName,
    amount: amt,
    riskScore: rs,
    status, 
    createdAt: now()
  };

  DB[id] = newLoan;

  return res.status(201).json({ message: 'loan created', loan: newLoan });
};


export const getAllLoans = (_req: Request, res: Response) => {
  const loans = Object.values(DB);
  return res.json(loans);
};


export const getLoanById = (req: Request, res: Response) => {
  const { id } = req.params;
  const loan = DB[id];
  if (!loan) return res.status(404).json({ message: 'loan not found' });
  return res.json(loan);
};


export const updateLoan = (req: Request<{ id: string }, unknown, UpdateLoanBody>, res: Response) => {
  const { id } = req.params;
  const loan = DB[id];
  if (!loan) return res.status(404).json({ message: 'loan not found' });

  const { applicantName, amount, riskScore, status } = req.body ?? {};

  if (applicantName !== undefined) loan.applicantName = applicantName;

  if (amount !== undefined) {
    const a = Number(amount);
    if (Number.isNaN(a)) return res.status(400).json({ message: 'amount must be numeric' });
    loan.amount = a;
  }

  if (riskScore !== undefined) {
    const r = Number(riskScore);
    if (Number.isNaN(r)) return res.status(400).json({ message: 'riskScore must be numeric' });
    loan.riskScore = r;
  }

  if (status !== undefined) {
    if (!isValidStatus(status)) {
      return res.status(400).json({ message: `status must be one of: ${allowedStatuses.join(', ')}` });
    }

    loan.status = status;
  }

  DB[id] = loan;
  return res.json({ message: 'loan updated', loan });
};


export const deleteLoan = (req: Request, res: Response) => {
  const { id } = req.params;
  if (!DB[id]) return res.status(404).json({ message: 'loan not found' });
  delete DB[id];
  return res.status(204).send();
};
