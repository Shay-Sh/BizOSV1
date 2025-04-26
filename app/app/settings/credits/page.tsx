import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credits | Settings | BizOS',
  description: 'Manage your BizOS credits and subscription',
};

export default function CreditsPage() {
  const currentBalance = 750;
  const transactions = [
    {
      id: 'txn-1',
      date: '2023-06-15',
      description: 'Monthly subscription credits',
      amount: 1000,
      type: 'credit'
    },
    {
      id: 'txn-2',
      date: '2023-06-18',
      description: 'Agent execution: Data Processor',
      amount: 150,
      type: 'debit'
    },
    {
      id: 'txn-3',
      date: '2023-06-20',
      description: 'Agent execution: Customer Support Assistant',
      amount: 75,
      type: 'debit'
    },
    {
      id: 'txn-4',
      date: '2023-06-25',
      description: 'Credit purchase',
      amount: 500,
      type: 'credit'
    },
    {
      id: 'txn-5',
      date: '2023-06-28',
      description: 'Agent execution: Invoice Generator',
      amount: 525,
      type: 'debit'
    },
  ];

  return (
    <div className="p-6 space-y-8">
      <header>
        <h1 className="text-3xl font-bold mb-2">Credits</h1>
        <p className="text-muted-foreground">Manage your BizOS credits and view transaction history</p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Credit Balance</h2>
          <div className="flex items-end mb-6">
            <span className="text-4xl font-bold">{currentBalance}</span>
            <span className="text-muted-foreground ml-2 mb-1">credits remaining</span>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90">
              Purchase Credits
            </button>
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/90">
              View Subscription Plan
            </button>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Overview</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">This Month</span>
                <span className="text-sm">750 / 1500 credits</span>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <div className="h-2 bg-primary rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-background rounded-md p-4 border">
                <div className="text-lg font-semibold">250</div>
                <div className="text-xs text-muted-foreground">Credits used today</div>
              </div>
              <div className="bg-background rounded-md p-4 border">
                <div className="text-lg font-semibold">1,250</div>
                <div className="text-xs text-muted-foreground">Credits used this month</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">Date</th>
                <th className="text-left py-3 px-4 font-medium">Description</th>
                <th className="text-right py-3 px-4 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b">
                  <td className="py-3 px-4">{transaction.date}</td>
                  <td className="py-3 px-4">{transaction.description}</td>
                  <td className={`py-3 px-4 text-right ${
                    transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-right">
          <button className="text-primary hover:underline text-sm">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
} 