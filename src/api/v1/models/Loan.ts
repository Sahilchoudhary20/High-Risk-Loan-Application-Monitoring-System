export interface Loan {
  id: string;
  applicantName: string;
  amount: number;
  riskScore: number;
  status: 'pending' | 'review' | 'approved' | 'rejected';
  createdAt: string;
}
